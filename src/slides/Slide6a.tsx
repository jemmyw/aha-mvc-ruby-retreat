import Slide from "./Slide";
import immutable from "../assets/immutable.png";

export default Slide(() => {
  return (
    <div
      className="relative flex flex-col items-center justify-start w-full h-full prose-2xl"
      style={{ backgroundColor: "#15111e" }}
    >
      <h2 className="mt-5">Immutable updates can be slow</h2>
      <img src={immutable} className="w-[66%]" />
      <h3 className="mt-0" data-show={1}>
        Care needed to update the components
      </h3>
    </div>
  );
});

/**
 * These things can all lead to problems though. Immutable modifications can be
 * slow, and care needs to be taken to make sure that the components are
 * updated. If you update the state in the wrong place, then you can end up
 * with a lot of unnecessary re-renders.
 */
