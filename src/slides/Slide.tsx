import { useEffect, useRef } from "react";
import SlideController from "../controllers/SlideController";
import { ApplicationView, useController } from "../lib/mvc";

function Slide(Component: React.FC) {
  const ActiveComponent = ApplicationView(Component);

  const ActiveSlide = () => {
    const ref = useRef<HTMLDivElement>(null);
    const controller = useController(SlideController);

    useEffect(() => {
      controller.registerSlide(ref.current);
    });

    return (
      <div ref={ref} className="flex flex-col justify-between flex-grow w-full h-full overflow-hidden">
        <ActiveComponent />
      </div>
    );
  };

  return SlideController.scope(ApplicationView(ActiveSlide));
}

export default Slide;
