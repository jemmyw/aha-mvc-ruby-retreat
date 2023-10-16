import { ApplicationView } from "../lib/mvc";
import logo from "../assets/aha.png";

export default ApplicationView(() => {
  return (
    <div className="flex items-center justify-center w-full h-full prose-2xl">
      <div className="flex flex-col items-center justify-around gap-2">
        <img className="m-0" src={logo} />
        <h1 className="m-0 font-bold">MVC</h1>
        <h3>mvc: A simple MVC framework with React views</h3>
        <blockquote className="flex">
          <svg
            className="w-8 h-8 mb-4 text-gray-200"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 18 14"
          >
            <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
          </svg>
          <p>Have your state and mutate it too</p>
        </blockquote>
      </div>
    </div>
  );
});
