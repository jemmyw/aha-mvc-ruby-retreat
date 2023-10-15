import { ApplicationView } from "../lib/mvc";

export default ApplicationView(() => {
  return (
    <div className="flex items-center justify-center w-full h-full prose-2xl">
      <ul className="text-4xl list-disc">
        <li>Immutable modifications can be slow</li>
        <li>Care needed to update the components</li>
        <li>Where do things happen, where do they start?</li>
        <li>React has a fat views problem</li>
      </ul>
    </div>
  );
});

/**
 * These things can all lead to problems though. Immutable modifications can be
 * slow, and care needs to be taken to make sure that the components are
 * updated. If you update the state in the wrong place, then you can end up
 * with a lot of unnecessary re-renders.
 * 
 * Since moving to functional components and hooks, we lost some lifecycle
 * management. Personally, I appreciate hooks, but it's hard to ignore the
 * persistent "fat views" dilemma cropping up in React projects.
 */