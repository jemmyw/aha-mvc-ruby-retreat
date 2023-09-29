import { nanoid } from "nanoid";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { createTodoItem, updateTodoItem } from "../TodoApi";
import {
  doWithSaving,
  isSavingState,
  todoListItemsState,
  todoListState,
  updateTodoListItemState,
} from "./store/todo";

export const AddItemButton = () => {
  const todoList = useRecoilValue(todoListState);
  const [todoListItems, setTodoList] = useRecoilState(todoListItemsState);
  const [savingClassName, setSavingClassName] = useState("opacity-0");
  const [saving, setSaving] = useRecoilState(isSavingState);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (saving) {
      setSavingClassName("opacity-100");
    } else {
      timeout = setTimeout(() => {
        setSavingClassName("opacity-0");
      }, 500);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [saving]);

  const handleClick = useCallback(() => {
    if (!todoList) return;

    setCreating(true);
    const id = nanoid();
    setTodoList((old) => [...old, { id: id, name: "", completed: false }]);

    doWithSaving(setSaving, async () => {
      const response = await createTodoItem(todoList.id);
      updateTodoListItemState(setTodoList)(id)({
        id: response,
      });
      updateTodoItem(response, { index: todoListItems.length });
    }).finally(() => {
      setCreating(false);
    });
  }, [todoList]);

  return (
    <div className="flex items-center justify-between">
      <button
        className={`px-2 py-1 border rounded border-slate-400 ${
          creating
            ? "bg-slate-400 text-slate-600"
            : "bg-slate-200 text-slate-800"
        }`}
        onClick={handleClick}
      >
        Add item
      </button>
      <div className={`text-green-500 transition-opacity ${savingClassName}`}>
        Saving
      </div>
    </div>
  );
};
