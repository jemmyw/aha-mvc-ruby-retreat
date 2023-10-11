import { ApplicationView } from "../lib/mvc";

export default ApplicationView(() => {
  return (
    <div className="flex items-center justify-center w-full h-full prose-2xl">
      <h1>MVC</h1>
    </div>
  );
});

/**
 * OK lets talk about something different and familiar. MVC. Rails did not
 * invent MVC. It's a pattern that has been around for a long time, especially
 * in UI code. And the Rails way is actually a little different from the
 * traditional MVC pattern.
 * 
 * In the traditional MVC pattern, there may be multiple controllers and views,
 * and controllers may be long lived.
 */