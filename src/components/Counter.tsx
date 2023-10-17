import ApplicationController, {
  ApplicationView,
  StartControllerScope,
  useController,
} from "../lib/mvc";

interface CounterState {
  count: number;
}

class CounterController extends ApplicationController<CounterState> {
  get initialState() {
    return { count: 0 };
  }

  actionIncrement() {
    this.state.count += 1;
  }

  actionDecrement() {
    this.state.count -= 1;
  }
}

const Counter = () => {
  const controller = useController(CounterController);
  const { count } = controller.state;

  return (
    <div>
      <div>{count}</div>
      <div>
        <button onClick={() => controller.actionIncrement()}>+</button>
        <button onClick={() => controller.actionDecrement()}>-</button>
      </div>
    </div>
  );
};

export default StartControllerScope(
  CounterController,
  ApplicationView(Counter)
);
