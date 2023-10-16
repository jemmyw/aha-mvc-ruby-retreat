import "./App.css";
import PresentationController from "./controllers/PresentationController";
import { ApplicationView, useController } from "./lib/mvc";

function App() {
  const controller = useController(PresentationController);
  const { SlideComponent, canGoBack, canGoForward } = controller;

  return (
    <div className="relative flex flex-col justify-between w-screen h-screen overflow-hidden">
      <div className="flex-grow w-full">
        <SlideComponent />
      </div>
      <div className="fixed bottom-0 flex justify-between w-screen">
        <button
          className="px-4 py-2 font-semibold text-white border border-blue-700 rounded-bl-lg shadow g-blue-600 hover:bg-blue-700 disabled:text-gray-500"
          disabled={!canGoBack}
          onClick={() => controller.actionPrevSlide()}
        >
          &lt;
        </button>
        <button
          className="px-4 py-2 font-semibold text-white border border-blue-700 rounded-br-lg shadow g-blue-600 hover:bg-blue-700 disabled:text-gray-500"
          disabled={!canGoForward}
          onClick={() => controller.actionNextSlide()}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}

export default PresentationController.scope(ApplicationView(App));
