import Slide from "./Slide";
import fatreact from "../assets/fatreact.png";
import { Highlighter } from "../components/Highlighter";

const code = `
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
`;

export default Slide(() => {
  return (
    <div
      className="flex flex-col items-center w-full h-full pt-10 prose-2xl"
      style={{
        backgroundColor: "rgb(62, 64, 77)",
      }}
    >
      <h2>React has a fat views problem</h2>
      <img
        src={fatreact}
        className="w-[66%]"
        data-hide={1}
        data-hide-class="hidden"
      />

      <div data-show={1} data-hide-class="hidden" className="text-xs">
        <Highlighter code={code} />
      </div>
    </div>
  );
});

/**
 * Since moving to functional components and hooks, we lost some lifecycle
 * management. Personally, I appreciate hooks, but it's hard to ignore the
 * persistent "fat views" dilemma cropping up in React projects.
 */
