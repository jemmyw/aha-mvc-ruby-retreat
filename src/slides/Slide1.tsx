import Slide from "./Slide";
import logo from "../assets/react.svg";

export default Slide(() => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full prose-2xl">
      <h1>React</h1>
      <img src={logo} width={"15%"} />
    </div>
  );
});

/**
 * React. I really like React. I've been using it for a long time.  There are
 * plenty of other JavaScript frameworks out there, but if you want to build a
 * web app, React is a solid choice.
 */
