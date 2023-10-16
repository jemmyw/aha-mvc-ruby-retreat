import Slide from "./Slide";

export default Slide(() => {
  return (
    <div className="flex items-center justify-center w-full h-full prose-2xl">
      <ul className="text-4xl list-disc">
        <li>Favour immutable data structures</li>
        <li data-show={1}>Functional style</li>
        <li data-show={2}>Heavy memoization</li>
      </ul>
    </div>
  );
});

/**
 * By and large these libraries are all very similar. They all favour immutable
 * data structures, they all encourage a functional style of programming, and
 * they all make heavy use of memoization.
 *
 * There's good reason for this. Changing the state in a performant way requires
 * that you know what has changed. If you're using mutable data structures, then
 * historically with JavaScript, you'd have to do a deep comparison of the
 * previous state and the new state to figure out what has changed. This is
 * expensive and slow.
 *
 * This is also why these libraries encourage a functional style of programming.
 * If you're using pure functions, then you can be sure that the output of the
 * function is only dependent on the input of the function.
 *
 * And finally, memoization becomes easier when you put those things together.
 */
