import { ApplicationView } from "../lib/mvc";
import logo from "../assets/aha.png";

export default ApplicationView(() => {
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
 * Going back to our list, instead of immutable data structures we can mutate in
 * place. Aha! MVC actually supports both mutable and immutable data structures.
 * 
 * Instead of a functional style of programming, we can use an OOP style.
 * useController gives us an instance of the nearest controller in the tree. We
 * can actually make use of multiple controllers in more complex applications.
 * 
 * And finally, we can get performant re-renders by default. This is a little
 * bit of magic in the ApplicationView wrapper. Let's take a look at how that
 * works.
 */