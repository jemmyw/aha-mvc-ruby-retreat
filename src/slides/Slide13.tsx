import { ApplicationView } from "../lib/mvc";

export default ApplicationView(() => {
  return (
    <div className="flex items-center justify-center w-full h-full prose-2xl">
      <h1>Comparison with Recoil</h1>
    </div>
  );
});

/**
 * So, I've shown the features and a basic example. But I could implement that
 * example in just about any React store library, or just use some React hooks.
 * It wouldn't be much different.  Where Aha! MVC gets interesting is complex
 * examples and async code.
 *
 * So, let's delve into a more elaborate version of the todo-list app, one that
 * interacts with a backend for data persistence.
 *
 * For a meaningful comparison, I've also implemented this version using Recoil.
 * My choice for Recoil is twofold: firstly, it's a library I'm familiar with
 * and fond of. Secondly, it represents the modern evolution of patterns we
 * first saw in tools like Redux.
 */

// Maybe some slides on proxies and observables