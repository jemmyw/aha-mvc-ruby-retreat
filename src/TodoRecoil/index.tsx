import { RecoilRoot } from "recoil";
import TodoList from "./TodoList";

const TodoRecoil = () => {
  return (
    <RecoilRoot>
      <h1>Todo Recoil</h1>
      <TodoList />
    </RecoilRoot>
  );
};

export default TodoRecoil;
