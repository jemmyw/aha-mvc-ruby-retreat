import {
  DefaultValue,
  SetterOrUpdater,
  atom,
  selector,
  selectorFamily,
} from "recoil";
import {
  deleteTodoItem,
  getTodoItems,
  listAllTodoLists,
  updateTodoItem,
} from "../../TodoApi";

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

export const todoListState = atom<TodoList>({
  key: "TodoList",
  default: { id: "" },
});

export const todoListItemsState = atom<TodoItem[]>({
  key: "TodoListItems",
  default: [],
});

export const todoListItemState = selectorFamily({
  key: "TodoListItem",
  get:
    (id: string) =>
    ({ get }) => {
      return findById(get(todoListItemsState), id)!;
    },
  set:
    (id: string) =>
    ({ set }, newValue) => {
      if (newValue instanceof DefaultValue || !newValue) {
        return;
      }
      updateTodoListItemState((v) => set(todoListItemsState, v))(id)(newValue);
    },
});

export type LoadingState = "not_loaded" | "loading" | "loaded" | "error";

export const loadingState = atom<LoadingState>({
  key: "Loading",
  default: "not_loaded",
});

export const isSavingState = atom({
  key: "IsSaving",
  default: false,
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

export const updateTodoListItemState =
  (setter: SetterOrUpdater<TodoItem[]>) =>
  (id: string) =>
  (item: Partial<TodoItem>) => {
    setter((list) => {
      const index = findIndexById(list, id);
      if (index === -1) {
        return list;
      }
      return replaceItemAtIndex(list, index, { ...list[index], ...item });
    });
  };

export const doWithSaving = async (
  setter: SetterOrUpdater<boolean>,
  callback: () => Promise<void>
) => {
  setter(true);
  try {
    return await callback();
  } finally {
    return setter(false);
  }
};

export const updateAllTodoListItems = async (
  listId: string,
  items: TodoItem[]
) => {
  const existing = await getTodoItems(listId);

  const toUpdate = items.filter((item) => item.id);
  const toDelete = existing.filter(
    (item) => !items.find((i) => i.id === item.id)
  );

  const updatePromises = toUpdate.map((item, index) =>
    updateTodoItem(item.id, {
      name: item.name,
      completed: item.completed,
      index,
    })
  );

  const deletePromises = toDelete.map((item) => deleteTodoItem(item.id));

  await Promise.all([...updatePromises, ...deletePromises]);
};
