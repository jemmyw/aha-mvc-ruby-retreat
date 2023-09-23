import "./App.css";
import TodoMvc from "./TodoMvc";
import TodoRecoil from "./TodoRecoil";

function App() {
  return (
    <div className="flex justify-around w-screen h-screen">
      <div className="w-[40%] h-full py-10">
        <TodoMvc />
      </div>
      <div className="w-[40%] h-full py-10">
        <TodoRecoil />
      </div>
    </div>
  );
}

export default App;
