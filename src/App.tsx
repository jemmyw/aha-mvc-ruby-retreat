import "./App.css";
import PresentationController from "./PresentationController";
import { ApplicationView, useController } from "./lib/mvc";

function App() {
  const controller = useController(PresentationController);
  const SlideComponent = controller.SlideComponent;

  return (
    <div className="flex justify-around w-screen h-screen">
      <SlideComponent />
      <button onClick={() => controller.actionPrevSlide()}>Prev</button>
      <button onClick={() => controller.actionNextSlide()}>Next</button>
    </div>
  );
}

export default PresentationController.scope(ApplicationView(App));
