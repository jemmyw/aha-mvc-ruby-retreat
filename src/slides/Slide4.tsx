import { ApplicationView } from "../lib/mvc";

export default ApplicationView(() => {
  return (
    <div className="flex items-center justify-center w-full h-full prose-2xl">
      <ul className="text-4xl">
        <li>Redux</li>
        <li>Mobx</li>
        <li>Zustand</li>
        <li>Recoil</li>
        <li>Jotai</li>
      </ul>
    </div>
  );
});

/**
 * I've tried and used a lot of popular state management libraries.  These are
 * some of the most popular and my favourites. Note that I'm focusing on ones
 * that are about client side state management. There are other libraries that
 * are more focused on server side state management, like Apollo and
 * React-Query.
 */