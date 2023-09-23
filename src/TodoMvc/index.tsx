import { ApplicationView } from "../lib/mvc";
import TodoList from "./TodoList";
import TodoListController from "./controllers/TodoListController";

const TodoMvc = () => {
  return (
    <div>
      <h1>Todo MVC</h1>
      <TodoList />
    </div>
  );
};

export default TodoListController.scope(ApplicationView(TodoMvc));
