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
import { ApplicationView, useController } from "../lib/mvc";
import { AddItemButton } from "./AddItemButton";
import SortableTodoItem from "./SortableTodoItem";
import TodoItem from "./TodoItem";
import TodoListController from "./controllers/TodoListController";

const TodoList = ApplicationView(() => {
  const controller = useController(TodoListController);
  const { todoList, dragItemId } = controller.state;
  const items = todoList.items;

  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const handleDragStart = (event: DragStartEvent) => {
    controller.actionSetDragItemId(event.active.id as string);
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { over } = event;
    controller.actionSortAtDragEnd(over?.id as string);
  };

  const dragItem = dragItemId ? todoList.findById(dragItemId) : null;

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
            items={items.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item, index) => (
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
});

export default TodoList;
