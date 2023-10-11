import TodoItem from "./TodoItem";

export default class TodoList {
  public items: TodoItem[] = [];
  constructor(public id: number, public title: string) {}

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
