import { atom, selector, noWait, DefaultValue } from "recoil";
import {
  createTodoItem,
  createTodoList,
  deleteTodoItem,
  getTodoItems,
  listAllTodoLists,
  updateTodoItem,
} from "../../api";

export interface TodoList {
  id: string;
}

export interface TodoItem {
  id: string;
  name: string;
  completed: boolean;
}

export const savingState = atom({
  key: "Saving",
  default: false,
});

export const todoListsState = selector({
  key: "TodoLists",
  get: async () => {
    return await listAllTodoLists();
  },
});

export const todoListState = selector<TodoList>({
  key: "TodoList",
  get: async ({ get }) => {
    const todoLists = get(todoListsState);

    if (todoLists.length === 0) {
      const id = await createTodoList("My list");
      return { id };
    } else {
      return todoLists[0];
    }
  },
});

export const todoListCacheState = atom<Record<string, TodoItem[]>>({
  key: "TodoListCache",
  default: {},
});

export const todoListItemsFromRemote = selector<TodoItem[]>({
  key: "TodoListItemsFromRemote",
  get: async ({ get }) => {
    const todoList = get(todoListState);

    const items = (await getTodoItems(todoList.id)).toSorted(
      (a, b) => a.index - b.index
    );

    return items;
  },
});

export const todoListItems = selector<TodoItem[]>({
  key: "TodoListItems",
  get: async ({ get }) => {
    const todoList = get(todoListState);
    const cache = get(todoListCacheState);

    if (cache[todoList.id]) {
      return cache[todoList.id];
    }
    return get(todoListItemsFromRemote);
  },
  set: ({ get, set }, newValue) => {
    if (newValue instanceof DefaultValue) return;

    const todoList = get(todoListState);
    const items = get(todoListItems);

    const deletedItems = items.filter(
      (item) => !newValue.find((newItem) => newItem.id === item.id)
    );

    set(todoListCacheState, (old) => {
      return { ...old, [todoList.id]: newValue };
    });

    Promise.all(deletedItems.map((item) => deleteTodoItem(item.id))).then(
      () => {
        return Promise.all(
          newValue.map(async (item, index) => {
            let id = item.id;
            if (!id) {
              id = await createTodoItem(todoList.id);
            }

            await updateTodoItem(id, {
              ...item,
              index,
              listId: todoList.id,
            });

            return { ...item, id };
          })
        ).then((items) => {
          set(todoListCacheState, (old) => {
            return { ...old, [todoList.id]: items };
          });
        });
      }
    );
  },
});

export const isLoadedState = selector<boolean>({
  key: "isLoaded",
  get: ({ get }) => {
    const items = get(noWait(todoListItems));
    return items.state === "hasValue";
  },
});

export function findById(list: TodoItem[], id: string) {
  return list.find((item) => item.id === id);
}

export function findIndexById(list: TodoItem[], id: string) {
  return list.findIndex((item) => item.id === id);
}

export function replaceItemAtIndex(
  arr: TodoItem[],
  index: number,
  newValue: TodoItem
) {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

export function removeItemAtIndex(arr: TodoItem[], index: number) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}
