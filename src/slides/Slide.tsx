import SlideController from "../controllers/SlideController";
import { ApplicationView, useController } from "../lib/mvc";

function Slide(Component: React.FC) {
  const ActiveComponent = ApplicationView(Component);

  const ActiveSlide = () => {
    const controller = useController(SlideController);

    return (
      <div
        ref={(el) => controller.registerSlide(el)}
        className="flex flex-col justify-between flex-grow w-full h-full overflow-hidden"
      >
        <ActiveComponent />
      </div>
    );
  };

  return SlideController.scope(ApplicationView(ActiveSlide));
}

export default Slide;
