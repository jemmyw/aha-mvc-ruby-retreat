import ApplicationController from "../../lib/mvc";
import TodoItem from "../models/TodoItem";
import TodoList from "../models/TodoList";

interface State {
  todoList: TodoList;
}

export default class TodoListController extends ApplicationController<State> {
  async initialize() {
    this.state.todoList = new TodoList(1, "My Todo List");
  }

  actionAddTodoItem() {
    const item = new TodoItem();
    this.state.todoList.addItem(item);
  }
}
