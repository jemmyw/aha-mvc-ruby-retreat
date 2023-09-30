import { useEffect } from "react";
import "./App.css";
import TodoMvc from "./TodoMvc";
import TodoRecoil from "./TodoRecoil";
import PresentationController from "./controllers/PresentationController";
import { ApplicationView, useController } from "./lib/mvc";

function TodoApp() {
  const controller = useController(PresentationController);

  useEffect(() => {
    controller.actionDisableShortcuts();
    return () => controller.actionEnableShortcuts();
  });

  return (
    <div className="flex justify-around w-full h-full">
      <div className="w-[40%] h-full py-10">
        <TodoMvc />
      </div>
      <div className="w-[40%] h-full py-10">
        <TodoRecoil />
      </div>
    </div>
  );
}

export default ApplicationView(TodoApp);
