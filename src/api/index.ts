import { nanoid } from "nanoid";

let db: IDBDatabase;

export interface TodoList {
  id: string;
  name: string;
}
export interface TodoItem {
  id: string;
  listId: string;
  name: string;
  completed: boolean;
  index: number;
}
type WithId = { id: string };

let dbInitPromise: Promise<void> | null = null;

async function initializeDB() {
  if (db) return;
  if (dbInitPromise) return dbInitPromise;

  dbInitPromise = new Promise<void>((resolve, reject) => {
    const request = indexedDB.open("TodoDB", 1);
    request.onupgradeneeded = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore("todoLists", { keyPath: "id" });
      db.createObjectStore("todoItems", { keyPath: "id" }).createIndex(
        "listId",
        "listId",
        { unique: false }
      );
    };
    request.onsuccess = (event) => {
      db = (event.target as IDBOpenDBRequest).result;
      resolve();
    };
    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
    };
  });

  return dbInitPromise;
}

function idbPromise<T>(request: IDBRequest): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result as T);
    request.onerror = () => reject(request.error);
  });
}

async function readWriteTx(storeName: string) {
  if (!db) await initializeDB();
  return db.transaction(storeName, "readwrite").objectStore(storeName);
}

function createUpdateFunction<T extends WithId>(
  storeName: string
): (id: string, data: Partial<Omit<T, "id">>) => Promise<void> {
  return async function (id: string, data: Partial<Omit<T, "id">>) {
    const store = await readWriteTx(storeName);
    const item = await idbPromise<T | null>(store.get(id));

    if (!item) {
      throw new Error(`${storeName} item not found`);
    }

    await idbPromise(store.put({ ...item, ...data, id }));
  };
}

function createDeleteFunction(
  storeName: string
): (id: string) => Promise<void> {
  return async function (id: string) {
    const store = await readWriteTx(storeName);
    await idbPromise(store.delete(id));
  };
}

export async function createTodoList(name: string) {
  const store = await readWriteTx("todoLists");
  const id = nanoid();
  await idbPromise(store.add({ id, name }));
  return id;
}

export const updateTodoList = createUpdateFunction<TodoList>("todoLists");
export const updateTodoItem = createUpdateFunction<TodoItem>("todoItems");

export const deleteTodoList = createDeleteFunction("todoLists");
export const deleteTodoItem = createDeleteFunction("todoItems");

export async function createTodoItem(listId: string) {
  const store = await readWriteTx("todoItems");
  const id = nanoid();
  await idbPromise<TodoItem>(
    store.add({ id, listId, name: "", completed: false })
  );
  return id;
}

export async function getTodoItems(listId: string) {
  if (!db) await initializeDB();
  const store = db
    .transaction("todoItems", "readonly")
    .objectStore("todoItems")
    .index("listId");
  return idbPromise<TodoItem[]>(store.getAll(listId));
}

export async function getTodoListWithItems(listId: string) {
  if (!db) await initializeDB();
  return new Promise<{ list: TodoList; items: TodoItem[] }>(
    (resolve, reject) => {
      const getList = db
        .transaction("todoLists")
        .objectStore("todoLists")
        .get(listId);
      getList.onerror = () => reject("Error getting list");
      getList.onsuccess = () => {
        const getItems = db
          .transaction("todoItems")
          .objectStore("todoItems")
          .index("listId")
          .getAll(listId);
        getItems.onsuccess = () =>
          resolve({ list: getList.result, items: getItems.result });
        getItems.onerror = () => resolve({ list: getList.result, items: [] });
      };
    }
  );
}

export async function listAllTodoLists(): Promise<TodoList[]> {
  if (!db) await initializeDB();
  const store = db
    .transaction("todoLists", "readonly")
    .objectStore("todoLists");
  return idbPromise<TodoList[]>(store.getAll());
}

// Initialize DB when the script loads
initializeDB().catch(console.error);
