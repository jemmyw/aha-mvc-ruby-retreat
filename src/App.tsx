import "./App.css";
import PresentationController from "./controllers/PresentationController";
import { ApplicationView, useController } from "./lib/mvc";

function App() {
  const controller = useController(PresentationController);
  const { SlideComponent, canGoBack, canGoForward } = controller;

  return (
    <div className="flex flex-col justify-between w-screen h-screen overflow-hidden">
      <div className="flex-grow w-full">
        <SlideComponent />
      </div>
      <div className="flex justify-between">
        <button
          className="font-bold disabled:text-gray-500"
          disabled={!canGoBack}
          onClick={() => controller.actionPrevSlide()}
        >
          &lt;&lt;
        </button>
        <button
          className="font-bold disabled:text-gray-500"
          disabled={!canGoForward}
          onClick={() => controller.actionNextSlide()}
        >
          &gt;&gt;
        </button>
      </div>
    </div>
  );
}

export default PresentationController.scope(ApplicationView(App));
