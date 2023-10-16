import { Highlighter } from "../components/Highlighter";
import Slide from "./Slide";

const code = `
import { observe, observable } from '@nx-js/observer-util';

const store = observable({ count: 0, list: [] });
`;

export default Slide(() => {
  return (
    <div className="flex items-center justify-center w-full h-full prose-2xl">
      <Highlighter code={code} />
    </div>
  );
});

/**
 * Under the hood we use a library called @nx-js/observer-util. This makes use
 * of JavaScript proxies to observe changes to objects. Once an observable is
 * created, any change at any depth within that can trigger an observer.
 */
