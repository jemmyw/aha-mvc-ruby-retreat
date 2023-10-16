import Slide from "./Slide";

export default Slide(() => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full prose-2xl text-center">
      <h2>What is it good for?</h2>
      <ul className="p-0 text-center">
        <li>Complex applications</li>
        <li>Async code</li>
      </ul>
      <h2>What is not so good?</h2>
      <ul className="p-0 text-center">
        <li>Very regular code</li>
        <li>Simple CRUD apps</li>
      </ul>
    </div>
  );
});
