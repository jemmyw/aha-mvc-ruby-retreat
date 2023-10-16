import ApplicationController from "../lib/mvc";
import PresentationController from "./PresentationController";

interface State {
  elementIndex: number;
  elementCount: number;
}

export default class SlideController extends ApplicationController<State> {
  element?: HTMLElement;

  get initialState(): State {
    return { elementIndex: 0, elementCount: 0 };
  }

  initialize() {
    document.addEventListener("keydown", this.handleKeyDown);
    this.addDependency(() =>
      document.removeEventListener("keydown", this.handleKeyDown)
    );

    this.get(PresentationController).actionDisableShortcuts();
    this.addDependency(() => {
      this.get(PresentationController).actionEnableShortcuts();
    });
  }

  handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight" || event.key === " ") {
      event.preventDefault();
      this.actionAdvance();
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      this.actionBack();
    }
  };

  get elements() {
    if (!this.element) return [];
    return [
      ...this.element.querySelectorAll(":scope [data-show]"),
    ] as HTMLElement[];
  }

  get elementCount(): number {
    if (!this.element) return 0;

    return this.elements.reduce((count, element) => {
      const n = Number(element.dataset.show);
      if (n > count) return n;
      return count;
    }, 0);
  }

  registerSlide(element: HTMLElement | null) {
    this.element = element ?? undefined;
    this.state.elementCount = this.elementCount;

    if (this.get(PresentationController).state.cameFrom === "next") {
      this.state.elementIndex = this.elementCount;
    } else {
      this.state.elementIndex = 0;
    }

    this.showToIndex();
  }

  showToIndex() {
    if (!this.element) return;
    this.elements.forEach((element) => {
      const index = Number(element.dataset.show);

      if (index <= this.state.elementIndex) {
        element.classList.remove("invisible");
      } else {
        element.classList.add("invisible");
      }
    });
  }

  actionAdvance() {
    if (this.state.elementIndex < this.elementCount) {
      this.setState({ elementIndex: this.state.elementIndex + 1 });
    } else {
      this.get(PresentationController).actionNextSlide();
    }

    this.showToIndex();
  }

  actionBack() {
    if (this.state.elementIndex > 0) {
      this.setState({ elementIndex: this.state.elementIndex - 1 });
    } else {
      this.get(PresentationController).actionPrevSlide();
    }

    this.showToIndex();
  }
}
