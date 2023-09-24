import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { nanoid } from "nanoid";
import { useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import SortableTodoItem from "./SortableTodoItem";
import TodoItem from "./TodoItem";
import { findById, todoListState } from "./store/todo";

const AddItemButton = () => {
  const setTodoList = useSetRecoilState(todoListState);

  const handleClick = () => {
    setTodoList((old) => [
      ...old,
      { id: nanoid(), name: "", completed: false },
    ]);
  };

  return (
    <div>
      <button
        className="px-2 py-1 border rounded bg-slate-200 border-slate-400 text-slate-800"
        onClick={handleClick}
      >
        Add item
      </button>
    </div>
  );
};

const TodoList = () => {
  const [todoList, setTodoList] = useRecoilState(todoListState);

  const [dragItemId, setDragItem] = useState<string | null>(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleDragStart = (event: DragStartEvent) => {
    setDragItem(event.active.id as string);
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = todoList.findIndex((item) => item.id === active.id);
      const newIndex = todoList.findIndex((item) => item.id === over?.id);
      setTodoList((list) => arrayMove(list, oldIndex, newIndex));
    }

    setDragItem(null);
  };

  const dragItem = dragItemId ? findById(todoList, dragItemId) : null;

  return (
    <div className="flex flex-col gap-4">
      <AddItemButton />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <ul className="flex flex-col gap-2">
          <SortableContext
            items={todoList.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {todoList.map((item, index) => (
              <SortableTodoItem key={item.id} item={item} index={index} />
            ))}
          </SortableContext>
        </ul>
        <DragOverlay>
          {dragItem && <TodoItem item={dragItem} index={0} />}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default TodoList;
