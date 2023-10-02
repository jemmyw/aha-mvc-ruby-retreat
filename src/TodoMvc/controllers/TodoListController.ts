import { listAllTodoLists } from "../../TodoApi";
import ApplicationController from "../../lib/mvc";
import { immediate } from "../../lib/mvc/ApplicationView";
import TodoItem from "../models/TodoItem";
import TodoList from "../models/TodoList";

interface State {
  todoList?: TodoList;
  dragItemId: string | null;
  loading: boolean;
  creating: boolean;
  saving: boolean;
}

export default class TodoListController extends ApplicationController<State> {
  get initialState(): State {
    return {
      dragItemId: null,
      loading: true,
      creating: false,
      saving: false,
    };
  }

  async initialize() {
    const allLists = await listAllTodoLists();

    if (allLists.length > 0) {
      this.state.todoList = await TodoList.find(allLists[0].id);
    } else {
      this.state.todoList = new TodoList();
      this.state.todoList.title = "My list";
      await this.state.todoList.save();
    }

    window.addEventListener("message", this.handleMessage);
    this.addDependency(() =>
      window.removeEventListener("message", this.handleMessage)
    );

    this.state.loading = false;
  }

  handleMessage = (event: MessageEvent) => {
    if (
      event.data.type === "todo-list-updated" &&
      event.data.source !== "mvc" &&
      event.data.id === this.state.todoList!.id
    ) {
      this.state.todoList!.reload();
    }
  };

  async actionAddTodoItem() {
    this.state.creating = true;
    this.state.todoList!.addItem(new TodoItem());
    await this.actionSave();
    this.state.creating = false;
  }

  actionSetDragItemId(id: string | null) {
    this.state.dragItemId = id;
  }

  actionSortAtDragEnd(overId?: string) {
    immediate(() => {
      if (this.state.dragItemId && overId !== this.state.dragItemId) {
        this.state.todoList!.moveItemTo(this.state.dragItemId, overId);
      }

      this.actionSetDragItemId(null);
    });
  }

  async actionSave() {
    this.state.saving = true;
    await this.state.todoList!.save();

    window.postMessage(
      { type: "todo-list-updated", source: "mvc", id: this.state.todoList!.id },
      "*"
    );

    this.state.saving = false;
  }

  async actionDeleteItem(item: TodoItem) {
    this.state.todoList!.removeItem(item);
    await this.actionSave();
  }
}
