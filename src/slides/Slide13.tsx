import { ApplicationView } from "../lib/mvc";

export default ApplicationView(() => {
  return (
    <div className="flex items-center justify-center w-full h-full prose-2xl">
      <h1>Comparison</h1>
    </div>
  );
});

/**
 * So, I've shown the features and a basic example. But I could implement that
 * example in just about any React store library, or just use some React hooks.
 * It wouldn't be much different.  Where Aha! MVC gets interesting is complex
 * examples and async code.
 * 
 * Let's take a look at a more complex example. The same todo-list but with a
 * backend for saving.
 * 
 * I've also written the same example using Recoil. I've used Recoil because
 * I've used it before, I like it, and it's a modern take on the kind of
 * patterns that Redux introduced.
 */
