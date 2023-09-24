import { nanoid } from "nanoid";
import {
  createTodoItem,
  createTodoList,
  deleteTodoItem,
  getTodoListWithItems,
  updateTodoItem,
  updateTodoList,
} from "../../api";
import TodoItem from "./TodoItem";

export default class TodoList {
  public items: TodoItem[] = [];
  public id: string = nanoid();
  public title: string = "";
  private persisted: boolean = false;
  private deletedItems: string[] = [];

  constructor() {}

  static async find(id: string) {
    const { list, items } = await getTodoListWithItems(id);
    const todoList = new TodoList();
    todoList.id = list.id;
    todoList.title = list.name;
    todoList.persisted = true;
    todoList.items = items
      .toSorted((a, b) => a.index - b.index)
      .map((item) => {
        const todoItem = new TodoItem();
        todoItem.id = item.id;
        todoItem.name = item.name;
        todoItem.completed = item.completed;
        todoItem.persisted = true;
        return todoItem;
      });
    return todoList;
  }

  async save() {
    if (!this.persisted) {
      this.id = await createTodoList(this.title);
      this.persisted = true;
    } else {
      await updateTodoList(this.id, { name: this.title });
    }

    await Promise.all(this.deletedItems.map((id) => deleteTodoItem(id)));
    this.deletedItems = [];

    await Promise.all(
      this.items.map(async (item, index) => {
        if (!item.persisted) {
          item.id = await createTodoItem(this.id);
          item.persisted = true;
        }

        await updateTodoItem(item.id, {
          completed: item.completed,
          name: item.name,
          index,
          listId: this.id,
        });
      })
    );

    await new Promise((r) => setTimeout(r, 250));
  }

  addItem(item: TodoItem) {
    this.items.push(item);
  }

  removeItem(item: TodoItem) {
    this.deletedItems.push(
      ...this.items.splice(this.items.indexOf(item), 1).map((item) => item.id)
    );
  }

  indexById(id: string) {
    return this.items.findIndex((item) => item.id === id);
  }

  findById(id: string) {
    return this.items.find((item) => item.id === id);
  }

  moveItemTo(moveId: string, toId?: string) {
    const fromIndex = this.indexById(moveId);
    const toIndex = toId ? this.indexById(toId) : -1;
    this.items.splice(
      toIndex < 0 ? this.items.length + toIndex : toIndex,
      0,
      this.items.splice(fromIndex, 1)[0]
    );
  }
}
