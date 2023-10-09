import { ApplicationView } from "../lib/mvc";
import librariesPng from "../assets/libraries.png";

export default ApplicationView(() => {
  return <div>
    <img src={librariesPng} alt="React state libraries" />
  </div>;
});

/**
 * You'll probably recognise some of these. This is a long list. Any style of
 * state management you can think of is likely represented here.
 */