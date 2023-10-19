import TodoMvcBasic from "../TodoMvcBasic";
import { Highlighter } from "../components/Highlighter";
import Slide from "./Slide";

const modelCode = `
class TodoList {
  public items: TodoItem[] = [];
  constructor(public id: number, public title: string) {}

  addItem(item: TodoItem) {
    this.items.push(item);
  }
}

class TodoItem {
  public id: string;
  public name: string = "";
  public completed?: boolean = false;
}
`;

const controllerCode = `
class TodoListController extends ApplicationController {
  get initialState(): State {
    return {
      todoList: new TodoList(1, "My todo list"),
      dragItemId: null,
    };
  }

  actionAddTodoItem() {
    this.state.todoList.addItem(new TodoItem());
  }
}`;

const viewCode1 = `
const TodoList = ApplicationView(() => {
  const controller = useController(TodoListController);
  const { todoList } = controller.state;
  const items = todoList.items;

  return (
    <div>
      <AddItemButton />

      <ul>
        {items.map((item) => (
          <TodoItem key={item.id} item={item} />
        ))}
      </ul>
    </div>
  );
});
`;
const viewCode2 = `
const AddItemButton = ApplicationView(() => {
  const controller = useController(TodoListController);

  const handleClick = () => {
    controller.actionAddTodoItem();
  };

  return (
    <div>
      <button onClick={handleClick} >
        Add item
      </button>
    </div>
  );
});
`;
const viewCode3 = `
const TodoItem = ApplicationView(({
  item,
}) => {
  const handleCompleted = () => {
    item.completed = !item.completed;
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    item.name = event.target.value;
  };

  return (
    <li>
      <input
        type="checkbox"
        checked={item.completed}
        onChange={handleCompleted}
      />
      <input
        type="text"
        value={item.name}
        onChange={handleNameChange}
      />
    </li>
  );
});
`;

const codes = [modelCode, controllerCode, viewCode1, viewCode2, viewCode3];

export default Slide({ advanceKeys: ["ArrowRight"] }, () => {
  return (
    <div className="flex items-center justify-center w-full h-full gap-10 px-10">
      <div className="w-[33%] text-2xl">
        <TodoMvcBasic />
      </div>

      <div className="w-[66%]">
        {codes.map((code, i) => (
          <div
            key={i}
            data-hide-class="hidden"
            data-show={i + 1}
            data-hide={i + 2}
          >
            <Highlighter className="px-5 pb-5" code={code} />
          </div>
        ))}
      </div>
    </div>
  );
});

/**
 * Here we have our MVC todo list app. This is very basic, no storage, just what
 * you see.
 *
 * We have plain old classes for our models. We have a controller with a state
 * and some actions for updating the state.
 *
 * And then we have the views. We can see a hook to get the controller, we can
 * get state from the controller and we can call methods on the controller. By
 * convention we've named the methods actionSomething, but that's not required.
 */
