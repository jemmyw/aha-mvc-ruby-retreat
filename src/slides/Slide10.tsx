import Slide from "./Slide";

export default Slide(() => {
  return (
    <div className="flex items-center justify-center w-full h-full prose-2xl">
      <ul className="text-4xl list-disc">
        <li>Mutable data structures</li>
        <li>OOP style</li>
        <li>Performant re-renders by default</li>
      </ul>
    </div>
  );
});

/**
 * Reflecting back on the challenges we discussed, let's see how Aha! MVC
 * addresses them.
 *
 * While many libraries insist on immutability, Aha! MVC provides the
 * flexibility to mutate data directly. Notably, it doesn't restrict you - both
 * mutable and immutable data structures are supported.
 *
 * Instead of a functional style of programming, we can use an OOP style.
 * useController gives us an instance of the nearest controller in the tree. We
 * can actually make use of multiple controllers in more complex applications.
 *
 * Efficiency is a cornerstone of Aha! MVC. By default, re-renders are optimized
 * for performance. This is largely credited to the magic embedded within the
 * `ApplicationView` wrapper. Let's delve into its mechanics next.
 */
