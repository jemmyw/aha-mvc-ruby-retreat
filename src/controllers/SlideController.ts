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
  }

  handleKeyDown = (event: KeyboardEvent) => {
    if (this.locked) return;

    if (event.key === "ArrowRight" || event.key === " ") {
      event.preventDefault();
      this.actionAdvance();
    }
    if (event.key === "ArrowLeft") {
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
    return this.getElementsAtIndex(this.state.elementIndex);
  }

  get elementCount(): number {
    if (!this.element) return 0;

    return this.elements.reduce((count, element) => {
      const showIndex = Number(element.dataset.show);
      if (showIndex > count) return showIndex;

      const lockIndex = Number(element.dataset.lock);
      if (lockIndex > count) return lockIndex;

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
      if (element.dataset.show) {
        const index = Number(element.dataset.show);
        const className = element.dataset["hideClass"] ?? "invisible";

        if (index <= this.state.elementIndex) {
          element.classList.remove(className);
        } else {
          element.classList.add(className);
        }
      }

      if (element.dataset.hide) {
        const index = Number(element.dataset.hide);
        const className = element.dataset["hideClass"] ?? "invisible";

        if (index <= this.state.elementIndex) {
          element.classList.add(className);
        } else {
          element.classList.remove(className);
        }
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
