import { atom } from "recoil";

export interface TodoItem {
  id: string;
  name: string;
  completed: boolean;
}

export const todoListState = atom<TodoItem[]>({
  key: "TodoList",
  default: [],
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
