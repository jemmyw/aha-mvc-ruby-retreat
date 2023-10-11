import { ApplicationView, useController } from "../lib/mvc";
import TodoListController from "./controllers/TodoListController";

export const AddItemButton = ApplicationView(() => {
  const controller = useController(TodoListController);

  const handleClick = () => {
    controller.actionAddTodoItem();
  };

  return (
    <div>
      <button
        className="px-2 py-1 border rounded bg-slate-200 border-slate-400 text-slate-800"
        onClick={handleClick}
      >
        Add item
      </button>
    </div>
  );
});
