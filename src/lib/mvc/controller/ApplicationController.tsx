import { observable, observe } from "@nx-js/observer-util";
import Debug from "debug";
import React, { useContext, useEffect, useId, useMemo, useState } from "react";
import { deepClone } from "../utils/deepClone";
import { keys } from "../utils/keys";

const debug = Debug("framework:controller");

type UndefApp = ApplicationController<any, unknown, unknown> | undefined | null;

interface ApplicationController<State = object, Props = object, Parent = UndefApp> {
  constructor: Function & {
    initialState: State;
  };
  initialize(props: Props): void | Promise<void>;
}

export interface ApplicationControllerConstructor<
  State extends object = object,
  Props = object,
  Parent = UndefApp,
> {
  new (id: string): ApplicationController<State, Props, Parent>;
}

interface Constructor<C extends ApplicationController> {
  new (id: string): C;
}

type ControllerProps<T extends ApplicationControllerConstructor | ApplicationController> =
  T extends ApplicationControllerConstructor<any, infer P, unknown>
    ? P
    : T extends ApplicationController<any, infer P, unknown>
    ? P
    : {};

export type ControllerState<T extends ApplicationControllerConstructor | ApplicationController> =
  T extends ApplicationControllerConstructor<infer S, unknown, unknown>
    ? S
    : T extends ApplicationController<infer S, unknown, unknown>
    ? S
    : {};

export type DependencyCallback = () => void | Promise<void>;

/*
 * General rules to follow for using controllers:
 *
 * 1. Any data that should trigger React re-rendering should be stored in
 *    the `state` object.
 * 2. Note that HMR updates will only reload the STATE and then call changeProps
 *    with the previous props
 * 2. After adding data to `state` get a new reference to it, via the `state`
 *    object before using it again. This ensures that the new access or mutation
 *    is tracked.
 * 3. The `state` object, and any content within it, must only be mutated
 *    inside an `action...` function.
 * 4. Action functions can be called from anywhere, including event handlers,
 *    callbacks, after `await`, render methods, and from within other action
 *    functions.
 */
class ApplicationController<State extends object = object, Props = object, Parent = UndefApp> {
  static initialState = {};

  /**
   * Shortcut for using the controller in a React component.
   */
  static use<C extends Constructor<ApplicationController>>(this: C): InstanceType<C> {
    return useController(this) as any;
  }

  static scope<C extends Constructor<ApplicationController>, T extends React.ComponentType<any>>(
    this: C,
    component: T,
  ) {
    return StartControllerScope(this, component);
  }

  parent: Parent | null = null;
  // @ts-ignore
  state: State;
  initialized: boolean = false;
  private debugLog = Debug(`controller:${this.constructor.name}`);

  constructor(public id: string) {}

  initialize(props: Props): void | Promise<void> {}

  debug(...args: any[]) {
    // @ts-ignore
    this.debugLog(...args);
  }

  private controllerCache: Map<Constructor<ApplicationController>, WeakRef<ApplicationController>> =
    new Map();

  get<Controller extends ApplicationController>(controllerClass: Constructor<Controller>): Controller {
    let controller = this;
    const found = [this.constructor.name];

    if (this.controllerCache.has(controllerClass)) {
      const ref = this.controllerCache.get(controllerClass)!;
      const cached = ref.deref();
      if (cached) return cached as any as Controller;
    }

    do {
      // @ts-ignore
      if (controller.constructor === controllerClass) break;
      // @ts-ignore
      controller = controller.parent;
      if (parent) {
        found.push(controller?.constructor?.name);
      }
    } while (controller);

    if (!controller)
      throw new Error(`Could not find controller ${controllerClass.name} in ${found.join(" > ")}`);

    this.controllerCache.set(controllerClass, new WeakRef(controller as any));
    return controller as any as Controller;
  }

  get initialState(): State {
    return this.constructor.initialState;
  }

  resetState() {
    this.state = observable(deepClone(this.initialState));
  }

  async internalInitialize(parentController: Parent, initialArgs: Props): Promise<void> {
    if (this.initialized) {
      await this.changeProps(initialArgs);
      return;
    }

    this.parent = parentController;

    debug(
      `Initializing ${this.constructor.name}(${this.id})${
        parentController ? " > " + parentController.constructor.name : ""
      }`,
    );

    this.resetState();

    await this.initialize(initialArgs);
    this.initialized = true;
  }

  destroy(): void {
    // Override in child for custom destroy
  }

  internalDestroy() {
    this.deferredDestroyCallbacks.forEach(([_name, callback]) => callback());
    this.deferredDestroyCallbacks = [];
  }

  private deferredDestroyCallbacks: [string, DependencyCallback][] = [];

  resolveDependency(name: string) {
    const callbacks = this.deferredDestroyCallbacks.filter(([n]) => n === name);
    callbacks.forEach(([_, callback]) => callback());
    this.deferredDestroyCallbacks = this.deferredDestroyCallbacks.filter(([n]) => n !== name);
  }

  addDependency(name: string, callback: DependencyCallback): void;
  addDependency(callback: DependencyCallback): void;
  addDependency(nameOrCallback: string | DependencyCallback, callback?: DependencyCallback) {
    if (typeof nameOrCallback === "string") {
      if (!callback) throw new Error("Callback is required");
      this.deferredDestroyCallbacks.push([nameOrCallback, callback]);
    } else if (typeof nameOrCallback === "function") {
      this.deferredDestroyCallbacks.push(["unknown", nameOrCallback]);
    } else {
      throw new Error("Invalid arguments");
    }
  }

  /**
   *  Force a record to be an observed instance that will
   *  trigger observers on the controller state.
   *
   *  You need this if you're using Spraypaint `.save()` to create a
   *  record and want the updated record to trigger state updates.
   */
  observable<T extends object>(obj: T): T {
    return observable(obj);
  }

  observe(callback: () => void, options: Parameters<typeof observe>[1] = {}) {
    const observer = observe(callback, options);
    this.addDependency(() => observer());
  }

  async changeProps(newProps: Props) {
    // Override in sub-class to respond to changes in props.
  }

  /**
   * Partially set state
   */
  setState(newState: Partial<State>) {
    keys(newState).forEach((key) => {
      const value = newState[key] as State[typeof key];
      this.state[key] = value;
    });
  }
}

/**
 * Wrap a root React component using a new instance of a
 * controller. The controller will receive any props passed to the
 * component in its `initialize` method.
 *
 * When wrapped, any child component can use the `useController` hook
 * to receive the controller instance of its closest ancestor with a
 * ControllerScope.
 *
 * Example:
 *   export default StartControllerScope(WorkflowBoardController, WorkflowBoard);
 *
 * Inside a child component:
 *   const controller = useController();
 *
 * A reference to the controller can be retrieved from the component by
 * passing the `controllerRef` prop a value returned by `useRef()`.
 *
 * Example:
 *
 *   const whiteboardController = useRef();
 *   <Whiteboard controllerRef={whiteboardController} />
 *   ...
 *   whiteboardController.current.actionPanIntoView();
 */
function StartControllerScope<C extends ApplicationControllerConstructor, T extends React.ComponentType<any>>(
  ControllerClass: C,
  ControlledComponent: T,
): React.ComponentType<ControllerProps<C> & React.ComponentProps<T>> {
  // Use React.memo here so if props don't change then we don't re-render and
  // allocate a new controller instance.
  return React.memo((controllerInitialArgs) => {
    const id = useId();
    const controller = useMemo(() => new ControllerClass(id), []);

    if (!controller) {
      throw new Error("No controller is set");
    }

    if (controllerInitialArgs?.controllerRef) {
      if (typeof controllerInitialArgs.controllerRef === "function") {
        controllerInitialArgs.controllerRef(controller);
      } else if (controllerInitialArgs.controllerRef.hasOwnProperty("current")) {
        controllerInitialArgs.controllerRef.current = controller;
      } else {
        throw new Error(
          "The controllerRef prop must be passed the value provided by useRef() or useCallback().",
        );
      }
    }

    return (
      <Controller controller={controller} controllerInitialArgs={controllerInitialArgs} key={controller.id}>
        <ControlledComponent {...(controllerInitialArgs as any)} />
      </Controller>
    );
  });
}

const ControllerContext = React.createContext<ApplicationController | null>(null);

/**
 * A component that initializes a controller instance and wraps its
 * child with a context containing that instance.
 */
function Controller<C extends ApplicationController<object, unknown, UndefApp>>({
  children,
  controller,
  controllerInitialArgs,
}: {
  children: React.ReactNode;
  controller: C;
  controllerInitialArgs: ControllerProps<C>;
}) {
  const parentController = useContext(ControllerContext);
  const [error, setError] = useState<Error | null>(null);

  useMemo(() => {
    controller.internalInitialize(parentController, controllerInitialArgs).catch((err) => {
      setError(err);
    });
  }, [controller, parentController, controllerInitialArgs]);

  // Give controller a chance to deregister when it is removed.
  useEffect(() => {
    return () => {
      debug(`Destroying controller ${controller.constructor.name}(${controller.id})`);
      if (controller.destroy) controller.destroy();
      controller.internalDestroy();
    };
  }, [controller]);

  if (error) {
    throw error;
  }

  return <ControlledComponent controller={controller}>{children}</ControlledComponent>;
}

/**
 * Associate a controller with existing components. Useful if the same controller
 * needs to live longer than its direct parent in the component hierarchy.
 */
const ControlledComponent: React.FC<{
  children: React.ReactNode;
  controller: ApplicationController;
}> = ({ children, controller }) => {
  return <ControllerContext.Provider value={controller}>{children}</ControllerContext.Provider>;
};

/**
 * Returns the controller instance created by the closest
 * ControllerContext.
 */
function useController<Controller extends ApplicationController>(
  controllerClass: Constructor<Controller>,
): Controller {
  let controller = useContext(ControllerContext);
  if (!controller) throw new Error("Could not find controller");

  if (controllerClass) {
    controller = controller.get(controllerClass);
  }

  if (!controller) throw new Error("Could not find controller");
  return controller as Controller;
}

export { ApplicationController, ControlledComponent, StartControllerScope, useController };

if (import.meta?.hot) {
  import.meta.hot.on("vite:beforeUpdate", () => {
    console.log("erm?");
  });
}
