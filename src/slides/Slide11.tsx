import { Highlighter } from "../components/Highlighter";
import Slide from "./Slide";

const code1 = `
import { observe, observable } from '@nx-js/observer-util';

const store = observable({ count: 0, list: [] });
`;
const code2 = `
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

export default Slide(() => {
  return (
    <div className="flex items-center justify-center w-full h-full prose-2xl">
      <div data-show={0} data-hide={1} data-hide-class="hidden">
        <Highlighter code={code1} />
      </div>
      <div data-show={1} data-hide-class="hidden">
        <Highlighter code={code2} />
      </div>
    </div>
  );
});

/**
 * Under the hood we use a library called @nx-js/observer-util. This makes use
 * of JavaScript proxies to observe changes to objects. Once an observable is
 * created, any change at any depth within that can trigger an observer.
 */


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
 * Tying this back to Aha! MVC: The `ApplicationView` essentially transforms a
 * component's render function into this observer mechanism. Coupled with the
 * `ApplicationController`, where the `state` property is inherently observable,
 * we achieve a reactive architecture, primed for efficient and seamless
 * updates.
 */