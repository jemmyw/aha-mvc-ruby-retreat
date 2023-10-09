import { ApplicationView } from "../lib/mvc";

export default ApplicationView(() => {
  return (
    <div className="flex items-center justify-center w-full h-full prose-xl">
      <h1>React state libraries</h1>
    </div>
  );
});

/**
 * However, React purports to be a view library, not a framework. And so there
 * is a proliferation of state management libraries that have sprung up around
 * React.
 */