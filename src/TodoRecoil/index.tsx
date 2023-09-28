import { RecoilRoot } from "recoil";
import TodoList from "./TodoList";
import { Suspense } from "react";

const TodoRecoil = () => {
  return (
    <RecoilRoot>
      <h1>Todo Recoil</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <TodoList />
      </Suspense>
    </RecoilRoot>
  );
};

export default TodoRecoil;
