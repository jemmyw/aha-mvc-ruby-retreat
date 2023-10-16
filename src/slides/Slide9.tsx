import TodoMvcBasic from "../TodoMvcBasic";
import Slide from "./Slide";

export default Slide(() => {
  return (
    <div className="flex items-center justify-center w-full h-full" data-lock={1}>
      <TodoMvcBasic />
    </div>
  );
});

/**
 * Here we have our MVC todo list app. This is very basic, no storage, just what
 * you see.
 * 
 * We have plain old classes for our models. We have a controller with a state
 * and some actions for updating the state.
 * 
 * And then we have the views. We can see a hook to get the controller, we can
 * get state from the controller and we can call methods on the controller. By
 * convention we've named the methods actionSomething, but that's not required.
 */
