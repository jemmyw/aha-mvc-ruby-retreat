import { ApplicationView } from "../lib/mvc";
import librariesPng from "../assets/libraries.png";

export default ApplicationView(() => {
  return <div>
    <img src={librariesPng} alt="React state libraries" />
  </div>;
});
