import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TodoItem from "./TodoItem";

interface Props {
  item: import("./store/todo").TodoItem;
  index: number;
}

const SortableTodoItem: React.FC<Props> = ({ item, index }) => {
  const {
    attributes,
    transform,
    transition,
    setNodeRef,
    setActivatorNodeRef,
    listeners,
    isDragging,
  } = useSortable({
    id: item.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <TodoItem
      handleRef={setActivatorNodeRef}
      itemRef={setNodeRef}
      item={item}
      index={index}
      attributes={attributes}
      listeners={listeners}
      style={style}
      tag="li"
      key={item.id}
    />
  );
};

export default SortableTodoItem;
