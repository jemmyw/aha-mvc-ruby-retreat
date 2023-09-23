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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useState } from "react";
import { ApplicationView, useController } from "../lib/mvc";
import SortableTodoItem from "./SortableTodoItem";
import TodoItem from "./TodoItem";
import TodoListController from "./controllers/TodoListController";

const TodoList = () => {
  const controller = useController(TodoListController);
  const { todoList } = controller.state;

  const [dragItemId, setDragItem] = useState<string | null>(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleClick = () => {
    controller.actionAddTodoItem();
  };

  const handleDragStart = (event: DragStartEvent) => {
    setDragItem(event.active.id as string);
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      todoList.moveItemTo(active.id as string, over?.id as string);
    }

    setDragItem(null);
  };

  const dragItem = dragItemId ? todoList.findById(dragItemId) : null;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <button
          className="px-2 py-1 border rounded bg-slate-200 border-slate-400 text-slate-800"
          onClick={handleClick}
        >
          Add item
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <ul className="flex flex-col gap-2">
          <SortableContext
            items={todoList.items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {todoList.items.map((item, index) => (
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

export default ApplicationView(TodoList);
