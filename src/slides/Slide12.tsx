import { Highlighter } from "../components/Highlighter";
import { ApplicationView } from "../lib/mvc";

const code = `
import { observe, observable } from '@nx-js/observer-util';

const store = observable({ count: 0, list: [] });

observe(() => {
  console.log('update count', store.count);
});
// update count 0

observe(() => {
  console.log('update list', store.list);
});
// update list []

store.count++;
// update count 1

store.list.push(1);
// update list [1]
`;

export default ApplicationView(() => {
  return (
    <div className="flex items-center justify-center w-full h-full prose-2xl">
      <Highlighter code={code} />
    </div>
  );
});

/**
 * However, it goes further than this, and it's this that makes it so powerful.
 * When observe is called with the callback, nx-js will record the paths of the
 * observable properties that are accessed. That allows it to only re-run the
 * callback when those properties change.
 * 
 * Notice that the observe callback for the specific key in this example is the
 * one that is called.
 * 
 * Signals are the all new hotness in the JavaScript world, but this library has
 * been doing it better for years.
 * 
 * ApplicationView turns a component render function into an observer.
 * ApplicationController's `state` property is an observable.
 */
