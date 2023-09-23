import { RefCallback } from "react";
import { useSetRecoilState } from "recoil";
import { twMerge } from "tailwind-merge";
import { findIndexById, replaceItemAtIndex, todoListState } from "./store/todo";

interface Props {
  item: import("./store/todo").TodoItem;
  index: number;
  itemRef?: RefCallback<HTMLElement>;
  handleRef?: RefCallback<HTMLElement>;
  attributes?: any;
  listeners?: any;
  tag?: string;
  style?: React.CSSProperties;
  className?: string;
}

const TodoItem: React.FC<Props> = ({
  item,
  itemRef,
  handleRef,
  attributes,
  listeners,
  tag,
  style,
  className,
}) => {
  const setTodoList = useSetRecoilState(todoListState);

  const handleCompleted = () => {
    setTodoList((old) => {
      const index = findIndexById(old, item.id);
      return replaceItemAtIndex(old, index, {
        ...item,
        completed: !item.completed,
      });
    });
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoList((old) => {
      const index = findIndexById(old, item.id);

      return replaceItemAtIndex(old, index, {
        ...item,
        name: event.target.value,
      });
    });
  };

  const Tag = tag || "li";

  return (
    <Tag
      className={twMerge(
        "flex items-center w-full bg-gray-700 rounded focus-within:outline focus-within:outline-gray-400 outline-1",
        className
      )}
      style={style}
      ref={itemRef}
      {...attributes}
    >
      <div
        className="flex items-center h-full px-4 py-2"
        ref={handleRef}
        {...listeners}
      >
        <span>::</span>
      </div>
      <div className="flex items-center w-full gap-2 py-1 pr-2">
        <input
          type="checkbox"
          checked={item.completed}
          onChange={handleCompleted}
        />
        <input
          type="text"
          value={item.name}
          className="w-full p-1 text-gray-100 bg-gray-700 rounded-none focus:outline-none active:border-gray-700 "
          onChange={handleNameChange}
        />
      </div>
    </Tag>
  );
};

export default TodoItem;
