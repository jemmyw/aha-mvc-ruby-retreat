import SlideController, { Options } from "../controllers/SlideController";
import { ApplicationView, useController } from "../lib/mvc";

function Slide(ComponentOrOptions: React.FC | Options, Component?: React.FC) {
  const options = Component ? (ComponentOrOptions as Options) : {};
  Component = Component || (ComponentOrOptions as React.FC);
  const ActiveComponent = ApplicationView(Component);

  const ActiveSlide = () => {
    const controller = useController(SlideController);
    controller.setOptions(options);

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
