import TodoMvcBasic from "../TodoMvcBasic";
import { ApplicationView } from "../lib/mvc";

export default ApplicationView(() => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <TodoMvcBasic />
    </div>
  );
});

/**
 */
