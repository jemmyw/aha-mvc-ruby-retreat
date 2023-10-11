import { ApplicationView } from "../lib/mvc";
import logo from "../assets/aha.png";

export default ApplicationView(() => {
  return (
    <div className="flex items-center justify-center w-full h-full prose-2xl">
      <div className="flex flex-col items-center justify-around gap-2">
        <img className="m-0" src={logo} />
        <h1 className="m-0">MVC</h1>
      </div>
    </div>
  );
});

/**
 * This is where Aha! MVC comes in. It is controllers for React. For our team of
 * Rails developers it makes React a more natural extension of the way we work
 * with Rails.
 * 
 * Let's look at some code.
 */