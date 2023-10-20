import ApplicationController, { ApplicationView } from "../lib/mvc";
import Slide from "./Slide";

interface State {
  items: number[];
}

class UpdateController extends ApplicationController<State> {
  timer?: number;

  get initialState() {
    return { items: new Array(50).fill(0) };
  }

  initialize(props: unknown) {
    setInterval(() => this.update(), 750);
    this.addDependency(() => clearInterval(this.timer));
    this.update();
  }

  update() {
    // Ensure that currentCount is within the bounds [1, 100]
    const currentCount = Math.max(1, Math.min(100, this.state.items.length));

    // Define the minimum and maximum range for random count
    let minCount = Math.max(1, currentCount - 10);
    let maxCount = Math.min(100, currentCount + 10);

    // Return a random count in the range [minCount, maxCount]
    const count = minCount + Math.round(Math.random() * (maxCount - minCount));

    // const count = 1 + Math.round(Math.random() * 100);
    this.setState({ items: new Array(count).fill(0) });
  }
}

const UpdatesComponent = UpdateController.scope(
  ApplicationView(() => {
    const controller = UpdateController.use();
    const { items } = controller.state;
    const elements = items.map((_, index) => (
      <div
        key={Math.random()}
        className="w-[40px] h-[40px] border-4 rounded bg-gray-700 border-pink-200 animate-fade-out-border"
      />
    ));

    return (
      <div className="flex flex-wrap items-center justify-center gap-5 p-20">
        {elements}
      </div>
    );
  })
);

export default Slide(() => {
  return (
    <div className="relative flex flex-col items-center justify-start w-full h-full prose-2xl">
      <h2 className="mt-5">Immutable updates can be slow</h2>

      <UpdatesComponent />
    </div>
  );
});

/**
 * These things can all lead to problems though. Immutable modifications can be
 * slow, and care needs to be taken to make sure that the components are updated
 * correctly. If you update the state in the wrong place, then you can end up
 * with a lot of unnecessary re-renders.
 */
