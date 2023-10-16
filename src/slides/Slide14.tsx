import TodoApp from "../TodoApp";
import { ApplicationView } from "../lib/mvc";

export default ApplicationView(() => {
  return <TodoApp />;
});

/**
 * Here we have the exact same todo list app written with MVC and Recoil. They
 * are loading the data from a fake API, and they are connected with some
 * messages so they stay in sync.
 *
 * Let's look at the code. We'll start with the Recoil version.
 *
 * So Recoil has a pretty neat feature where it leverages React Suspense for
 * loading, by making it's store throw a promise. I've seen some other libraries
 * do this too.
 *
 * Now looking at the list component, we can see that in order to implement
 * loading and show saving state and so forth there's a lot of code in the view.
 *
 * If we look at the add button we've got the same thing going on. Yes, I was
 * able to wrap some logic in functions and move them to the store file, but
 * because I need to access different parts of the store via hooks I need quite
 * a bit of code in the view to pass those around.
 *
 * Here is the todo item, view, this is more succinct.
 *
 * Finally here is the store. Again, not too bad, but here we have to deal with
 * the specific items I listed earlier - immutability does add some overhead to
 * supporting code. Memoization via selectors is required for good performance.
 *
 * Let's flip over to the MVC version of this code.
 *
 * The first thing I hope you'll notice is that this view is very similar in
 * size to the basic version I showed earlier. I've added a loader and that's
 * it.
 *
 * Remember that neat Suspense feature? While I did toy with that concept in MVC
 * it dawned on me that it adds more complexity that it's worth. For the gain of
 * a cascading load you get the additional advantage of needing to debug a
 * thrown promise causing rerender loops. My conclusion is, save Suspense for
 * the purpose it was designed for - code loading.
 *
 * Our add button does have more code. But I'd argue it's the right sort of
 * evolution - dealing with class names. When it's time to add a new item, the
 * controller leaps into action, sans intricate state management.
 *
 * Our item view remains largely unaltered, only replacing direct state
 * manipulations with controller actions.
 *
 * Now, obviously to support saving and loading the model classes are more
 * complex. But I think that isn't a very interesting thing to look at. Instead
 * lets look at the controller changes.
 *
 * So we can see that most of the changes to this app are in the controllers,
 * not the views. The controller now implements an initialize that loads the
 * list from an API, sets up some event handlers, and then changes the loading
 * state.
 *
 * The actions are emminently more readable in my opinion. Actions follow a
 * predictable flow: The add action, it sets a flag for the view to say we're
 * creating, it adds a blank item to the list, it saves the list, it unsets the
 * flag. Whereas in Recoil, and similar, you end up hopping between functions
 * and files to figure out this flow.
 *
 * The save action, sets a flag, saves, sends a message (for syncing with the
 * Recoil app), unsets the flag.
 *
 * Anything saving, including adding and deleting, uses the same save action,
 * therefore we can use the saving state to show the Saving text.
 *
 * In Recoil, implementing this saving label was an ass. I had to think about
 * it. The best I came up with was a function that would take the setSaving
 * dispatcher I got from the hook, and then call another function.
 *
 * Notice I've got another controller for items. Each item in my list now has
 * it's own controller.
 *
 * Because controllers exist in a tree just like components, we can find the
 * nearest controller from a component or from another controller. Here the item
 * controller calls up to the list controller to manage saving and deleting
 * items.
 *
 * There's nothing stopping me from calling 2 or more controllers from the view
 * either, which is very useful for some patterns.
 *
 * As I've talked about before, the way the state updates cause re-renders gives
 * some automatic performance benefits without needing to use memoization or
 * React.memo, useMemo, or anything. If I turn on show updates and update the
 * MVC list only the changed item re-renders. If I do the same for the Recoil
 * app the whole list re-renders. I would need to do a little performance tuning
 * on this Recoil react if it was going to be dealing with a large list.
 */

// Makes todo notes better