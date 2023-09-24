import ApplicationController from "../../lib/mvc";
import { immediate } from "../../lib/mvc/ApplicationView";
import TodoItem from "../models/TodoItem";
import TodoListController from "./TodoListController";

interface State {
  item: TodoItem;
  deleting?: boolean;
}
interface Props {
  item: TodoItem;
}

export default class TodoItemController extends ApplicationController<
  State,
  Props
> {
  async initialize(props: Props) {
    this.state.item = props.item;
  }

  async changeProps(props: Props) {
    this.state.item = props.item;
  }

  async actionUpdate(updates: Partial<TodoItem>) {
    immediate(() => {
      Object.entries(updates).forEach(([key, value]) => {
        (this.state.item as any)[key] = value;
      });
    });

    await this.get(TodoListController).actionSave();
  }

  async actionDelete() {
    this.state.deleting = true;
    await this.get(TodoListController).actionDeleteItem(this.state.item);
  }
}
