import ApplicationController from "../../lib/mvc";
import { immediate } from "../../lib/mvc/ApplicationView";
import TodoItem from "../models/TodoItem";
import TodoList from "../models/TodoList";

interface State {
  todoList: TodoList;
  dragItemId: string | null;
}

export default class TodoListController extends ApplicationController<State> {
  get initialState(): State {
    return {
      todoList: new TodoList(1, "My todo list"),
      dragItemId: null,
    };
  }

  actionAddTodoItem() {
    this.state.todoList.addItem(new TodoItem());
  }

  actionSetDragItemId(id: string | null) {
    this.state.dragItemId = id;
  }

  actionSortAtDragEnd(overId?: string) {
    immediate(() => {
      if (this.state.dragItemId && overId !== this.state.dragItemId) {
        this.state.todoList.moveItemTo(this.state.dragItemId, overId);
      }

      this.actionSetDragItemId(null);
    });
  }
}
