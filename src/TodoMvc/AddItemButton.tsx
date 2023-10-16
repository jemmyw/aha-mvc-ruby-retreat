import { ApplicationView, useController } from "../lib/mvc";
import TodoListController from "./controllers/TodoListController";
import { useEffect, useState } from "react";

const AddItemButton = () => {
  const controller = useController(TodoListController);
  const { saving, creating } = controller.state;
  const [savingClassName, setSavingClassName] = useState("opacity-0");

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (saving) {
      setSavingClassName("opacity-100");
    } else {
      timeout = setTimeout(() => {
        setSavingClassName("opacity-0");
      }, 500);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [saving]);

  const handleClick = () => {
    controller.actionAddTodoItem();
  };

  return (
    <div className="flex items-center justify-between">
      <button
        className={`px-2 py-1 border rounded border-slate-400 ${
          creating
            ? "bg-slate-400 text-slate-600"
            : "bg-slate-200 text-slate-800"
        }`}
        onClick={handleClick}
      >
        Add item
      </button>
      <div className={`text-green-500 transition-opacity ${savingClassName}`}>
        Saving
      </div>
    </div>
  );
};

export default ApplicationView(AddItemButton);
