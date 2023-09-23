import {
  ApplicationController,
  StartControllerScope,
  ControlledComponent,
  useController,
} from "./controller/ApplicationController";
import { raw, observe, unobserve } from "@nx-js/observer-util";
import { ApplicationView } from "./ApplicationView";

// Export our public API.
export default ApplicationController;
export {
  // Controller
  ApplicationController,
  StartControllerScope,
  ControlledComponent,
  useController,
  // View
  ApplicationView,
  // observer.
  raw,
  observe,
  unobserve,
};
