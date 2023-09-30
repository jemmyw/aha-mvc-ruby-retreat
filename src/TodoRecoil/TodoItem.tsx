import { RefCallback, useCallback, useRef } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { twMerge } from "tailwind-merge";
import {
  doWithSaving,
  isSavingState,
  todoListItemState,
  todoListState,
  updateTodoItemWithMessage,
} from "./store/todo";

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
  const todoList = useRecoilValue(todoListState);
  const [todoItem, setTodoItem] = useRecoilState(todoListItemState(item.id));
  const setIsSaving = useSetRecoilState(isSavingState);
  const savingTimeout = useRef<NodeJS.Timeout | null>(null);

  const save = useCallback((todoItem: Props["item"]) => {
    if (savingTimeout.current) return;
    savingTimeout.current = setTimeout(() => {
      doWithSaving(setIsSaving, async () => {
        await updateTodoItemWithMessage(todoList.id, todoItem.id, todoItem);
        savingTimeout.current = null;
      });
    }, 250);
  }, []);

  const handleCompleted = useCallback(() => {
    const completed = !todoItem.completed;
    setTodoItem({ ...todoItem, completed });
    save({ ...todoItem, completed });
  }, [save, todoItem]);

  const handleNameChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setTodoItem({ ...todoItem, name: event.target.value });
      save({ ...todoItem, name: event.target.value });
    },
    [save, todoItem]
  );

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
