import { ApplicationView } from "../lib/mvc";
import image from "../assets/develop.webp";

export default ApplicationView(() => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full prose-2xl text-center">
      <h2>What is it good for?</h2>
      <img src={image} />
    </div>
  );
});

/**
 * We've built complex apps with our MVC pattern, including workflow boards,
 */