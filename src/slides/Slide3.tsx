import librariesPng from "../assets/libraries.png";
import Slide from "./Slide";

export default Slide(() => {
  return <div>
    <img src={librariesPng} alt="React state libraries" />
  </div>;
});

/**
 * You'll probably recognise some of these. This is a long list. Any style of
 * state management you can think of is likely represented here.
 */