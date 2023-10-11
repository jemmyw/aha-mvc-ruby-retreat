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
 * Let's look at the code.
 */