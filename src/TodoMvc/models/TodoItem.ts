import { nanoid } from "nanoid";

export default class TodoItem {
  public id!: string;
  public name: string = "";
  public completed?: boolean = false;
  public persisted: boolean = false;

  static fromData(data: import("../../TodoApi").TodoItem) {
    const todoItem = new TodoItem();
    todoItem.id = data.id;
    todoItem.name = data.name;
    todoItem.completed = data.completed;
    todoItem.persisted = true;
    return todoItem;
  }

  constructor() {}
}
