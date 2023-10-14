import { ApplicationView } from "../lib/mvc";
import logo from "../assets/aha.png";

export default ApplicationView(() => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full prose-2xl">
      <div className="flex flex-col items-center justify-around gap-2">
        <img className="m-0" src={logo} />
        <h1 className="m-0">MVC</h1>
      </div>
      <div className="pt-10">
        <p className="p-0 m-0">https://github.com/jemmyw/aha-mvc-ruby-retreat</p>
        <p className="p-0 m-0">https://github.com/aha/aha-mvc</p>
      </div>
    </div>
  );
});

/**
 * and this presentation.
 */
