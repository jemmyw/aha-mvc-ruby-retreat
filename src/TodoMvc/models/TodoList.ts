import TodoItem from "./TodoItem";

export default class TodoList {
  public id: number;
  public title: string;
  public items: TodoItem[] = [];

  constructor(id: number, title: string) {
    this.id = id;
    this.title = title;
  }

  addItem(item: TodoItem) {
    this.items.push(item);
  }

  removeItem(item: TodoItem) {
    this.items.splice(this.items.indexOf(item), 1);
  }

  indexById(id: string) {
    return this.items.findIndex((item) => item.id === id);
  }

  findById(id: string) {
    return this.items.find((item) => item.id === id);
  }

  moveItemTo(moveId: string, toId: string) {
    const fromIndex = this.indexById(moveId);
    const toIndex = this.indexById(toId);
    this.items.splice(
      toIndex < 0 ? this.items.length + toIndex : toIndex,
      0,
      this.items.splice(fromIndex, 1)[0]
    );
  }
}
