import "./App.css";
import TodoMvc from "./TodoMvc";
import TodoRecoil from "./TodoRecoil";
import { ApplicationView } from "./lib/mvc";

function TodoApp() {
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
