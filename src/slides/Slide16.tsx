import Slide from "./Slide";

export default Slide(() => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full prose-2xl text-center">
      <video autoPlay muted loop={true}>
        <source src="/develop.webm" type="video/mp4" />
      </video>
    </div>
  );
});

/**
 * We've built complex apps with our MVC pattern, including workflow boards,
 */
