import ApplicationController from "../lib/mvc";
import PresentationController from "./PresentationController";

interface State {
  stepIndex: number;
  stepCount: number;
}

export interface Options {
  advanceKeys?: string[];
  backKeys?: string[];
}

export default class SlideController extends ApplicationController<State> {
  element?: HTMLElement;
  options: Options = {};

  get initialState(): State {
    return { stepIndex: 0, stepCount: 0 };
  }

  initialize() {
    document.addEventListener("keydown", this.handleKeyDown);
    this.addDependency("keydown", () =>
      document.removeEventListener("keydown", this.handleKeyDown)
    );
  }

  setOptions(options: Options) {
    this.options = options;
  }

  handleKeyDown = (event: KeyboardEvent) => {
    if (this.locked) return;

    const advanceKeys = this.options.advanceKeys ?? ["ArrowRight", " "];
    const backKeys = this.options.backKeys ?? ["ArrowLeft"];

    if (advanceKeys.includes(event.key)) {
      event.preventDefault();
      this.actionAdvance();
    }
    if (backKeys.includes(event.key)) {
      event.preventDefault();
      this.actionBack();
    }
  };

  get locked() {
    return this.getElementsAtCurrentIndex().some((el) => el.dataset.lock);
  }

  get elements() {
    if (!this.element) return [];
    return [
      ...this.element.querySelectorAll(":scope [data-show]"),
      ...this.element.querySelectorAll(":scope [data-hide]"),
      ...this.element.querySelectorAll(":scope [data-lock]"),
    ] as HTMLElement[];
  }

  getElementsAtIndex(index: number) {
    return this.elements.filter(
      (element) =>
        Number(element.dataset.show) === index ||
        Number(element.dataset.lock) === index
    );
  }

  getElementsAtCurrentIndex() {
    return this.getElementsAtIndex(this.state.stepIndex);
  }

  get stepCount(): number {
    if (!this.element) return 0;

    return this.elements.reduce((count, element) => {
      const showIndex = Number(element.dataset.show);
      if (showIndex > count) return showIndex;

      const hideIndex = Number(element.dataset.hide);
      if (hideIndex > count) return hideIndex;

      const lockIndex = Number(element.dataset.lock);
      if (lockIndex > count) return lockIndex;

      return count;
    }, 0);
  }

  registerSlide(element: HTMLElement | null) {
    if (this.element === element) return;

    this.element = element ?? undefined;
    this.state.stepCount = this.stepCount;

    if (this.presentationController.state.cameFrom === "next") {
      this.state.stepIndex = this.stepCount;
    } else {
      this.state.stepIndex = 0;
    }

    this.showToIndex();
  }

  showToIndex() {
    if (!this.element) return;

    this.elements.forEach((element) => {
      const showAt = element.dataset.show ? Number(element.dataset.show) : 0;
      const hideAt = element.dataset.hide ? Number(element.dataset.hide) : null;
      const className = element.dataset["hideClass"] ?? "invisible";

      if (
        showAt <= this.state.stepIndex &&
        (hideAt === null || hideAt > this.state.stepIndex)
      ) {
        element.classList.remove(className);
      } else {
        element.classList.add(className);
      }
    });
  }

  get presentationController() {
    return this.get(PresentationController);
  }

  actionAdvance() {
    if (this.state.stepIndex < this.stepCount) {
      this.setState({ stepIndex: this.state.stepIndex + 1 });
    } else if (this.presentationController.canGoForward) {
      this.resolveDependency("keydown");
      this.presentationController.actionNextSlide();
    }

    this.showToIndex();
  }

  actionBack() {
    if (this.state.stepIndex > 0) {
      this.setState({ stepIndex: this.state.stepIndex - 1 });
    } else if (this.presentationController.canGoBack) {
      this.resolveDependency("keydown");
      this.presentationController.actionPrevSlide();
    }

    this.showToIndex();
  }
}
