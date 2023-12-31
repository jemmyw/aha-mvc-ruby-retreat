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
import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import {
  createTodoList,
  getTodoListWithItems,
  listAllTodoLists,
} from "../TodoApi";
import { AddItemButton } from "./AddItemButton";
import SortableTodoItem from "./SortableTodoItem";
import TodoItem from "./TodoItem";
import {
  doWithSaving,
  findById,
  isSavingState,
  loadingState,
  todoListItemsState,
  todoListState,
  updateAllTodoListItems,
} from "./store/todo";

const TodoList = () => {
  const [loading, setLoading] = useRecoilState(loadingState);
  const [todoList, setTodoList] = useRecoilState(todoListState);
  const [todoListItems, setTodoListItems] = useRecoilState(todoListItemsState);
  const setSaving = useSetRecoilState(isSavingState);

  const [dragItemId, setDragItem] = useState<string | null>(null);
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const getTodoList = useCallback(async (id: string) => {
    const response = await getTodoListWithItems(id);
    setTodoList(response.list);
    setTodoListItems(response.items.toSorted((a, b) => a.index - b.index));
  }, []);

  const getOrCreateTodoList = useCallback(async () => {
    const todoLists = await listAllTodoLists();
    if (todoLists.length > 0) {
      await getTodoList(todoLists[0].id);
    } else {
      const id = await createTodoList("My todo list");
      setTodoList({ id });
      setTodoListItems([]);
    }
  }, []);

  useEffect(() => {
    if (loading === "not_loaded") {
      setLoading("loading");
      getOrCreateTodoList().then(() => {
        setLoading("loaded");
      });
    }
  }, [loading]);

  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      console.log(event.data)
      if (
        todoList &&
        event.data.type === "todo-list-updated" &&
        event.data.id === todoList.id &&
        event.data.source !== "recoil"
      ) {
        // Reload the todo list
        getTodoList(todoList.id);
      }
    };

    window.addEventListener("message", messageHandler);
    return () => {
      window.removeEventListener("message", messageHandler);
    };
  }, [loading, todoList.id]);

  const handleDragStart = (event: DragStartEvent) => {
    setDragItem(event.active.id as string);
  };
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = todoListItems.findIndex((item) => item.id === active.id);
      const newIndex = todoListItems.findIndex((item) => item.id === over?.id);
      const list = arrayMove(todoListItems, oldIndex, newIndex);
      setTodoListItems(list);
      doWithSaving(setSaving, () => updateAllTodoListItems(todoList.id, list));
    }

    setDragItem(null);
  };

  const dragItem = dragItemId ? findById(todoListItems, dragItemId) : null;

  if (loading === "loading") return <div>Loading...</div>;
  if (loading === "error") return <div>error</div>;

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
            items={todoListItems.map((item) => item.id)}
            strategy={verticalListSortingStrategy}
          >
            {todoListItems.map((item, index) => (
              <SortableTodoItem
                key={item.id || `unsaved-${index}`}
                item={item}
                index={index}
              />
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
