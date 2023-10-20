import Slide from "./Slide";
import flow from "../assets/flow.png";

export default Slide(() => {
  return (
    <div
      className="relative flex flex-col items-center justify-start w-full h-full prose-2xl"
      style={{
        backgroundColor: "rgb(29 39 59)",
      }}
    >
      <h2 className="z-10 mt-5 text-center">
        Where do things happen, where do they start?
      </h2>
      <img className="w-screen" src={flow} />
    </div>
  );
});

/**
 * We necessarily have to set the flow of our application off from the view,
 * because React is views, but it's not views of a larger framework.
 * 
 * This creates a problem of code separation and re-use. Tracing the flow of
 * react apps can sometimes get difficult too.
 */

