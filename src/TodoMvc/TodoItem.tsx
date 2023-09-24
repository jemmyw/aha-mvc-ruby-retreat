import { RefCallback } from "react";
import { twMerge } from "tailwind-merge";
import { ApplicationView, useController } from "../lib/mvc";
import TodoItemController from "./controllers/TodoItemController";

interface Props {
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
  itemRef,
  handleRef,
  attributes,
  listeners,
  tag,
  style,
  className,
}) => {
  const controller = useController(TodoItemController);
  const { item } = controller.state;

  const handleCompleted = () => {
    controller.actionUpdate({ completed: !item.completed });
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    controller.actionUpdate({ name: event.target.value });
  };

  const handleClickDelete = () => {
    controller.actionDelete();
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
        <button onClick={handleClickDelete}>x</button>
      </div>
    </Tag>
  );
};

export default TodoItemController.scope(ApplicationView(TodoItem));
