import { flushSync } from "react-dom";
import ApplicationController from "../lib/mvc";
import { immediate } from "../lib/mvc/ApplicationView";
import slides from "../slides";
import BlankSlide from "../slides/BlankSlide";

interface State {
  slide: number;
  transitioning: boolean;
  shortcutsEnabled: boolean;
}

function slideFromUrl(url: URL) {
  if (url.pathname.match(/^\/slides\/\d+$/)) {
    const slide = Number(url.pathname.split("/")[2]);
    if (slide > 0 && slide <= slides.length) return slide;
  }
}

function urlForSlide(slide: number) {
  return `/slides/${slide}`;
}

export default class PresentationController extends ApplicationController<State> {
  get initialState(): State {
    return { slide: 1, transitioning: false, shortcutsEnabled: true };
  }

  get SlideComponent() {
    return slides[this.state.slide - 1] || BlankSlide;
  }

  get canGoBack() {
    return this.state.slide > 1;
  }

  get canGoForward() {
    return this.state.slide < slides.length;
  }

  async initialize() {
    const handleNavigate = (event: NavigateEvent) => {
      if (!event.canIntercept) return;

      const url = new URL(event.destination.url);
      if (url.pathname.match(/^\/slides\/\d+$/)) {
        event.intercept({
          handler: () =>
            (async (url: URL) => {
              const slide = slideFromUrl(url);
              if (slide) {
                return this.transition(slide);
              }
            })(url),
        });
      }
    };

    // @ts-expect-error
    navigation?.addEventListener("navigate", handleNavigate);
    this.addDependency(() => {
      // @ts-expect-error
      navigation?.removeEventListener("navigate", handleNavigate);
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!this.state.shortcutsEnabled) return;

      if (event.key === " " || event.key === "ArrowRight") {
        this.actionNextSlide();
      }
      if (event.key === "ArrowLeft") {
        this.actionPrevSlide();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    this.addDependency(() =>
      document.removeEventListener("keydown", handleKeyDown)
    );

    const slide = slideFromUrl(new URL(window.location.href));
    if (slide) {
      this.state.slide = slideFromUrl(new URL(window.location.href)) || 1;
    } else {
      this.actionNavigateToSlide(1);
    }
  }

  actionNavigateToSlide(slide: number) {
    navigation?.navigate(urlForSlide(slide));
  }

  actionNextSlide() {
    if (this.state.slide === slides.length) return;
    this.actionNavigateToSlide(this.state.slide + 1);
  }

  actionPrevSlide() {
    if (this.state.slide === 1) return;
    this.actionNavigateToSlide(this.state.slide - 1);
  }

  actionEnableShortcuts() {
    this.state.shortcutsEnabled = true;
  }

  actionDisableShortcuts() {
    this.state.shortcutsEnabled = false;
  }

  async transition(slide: number) {
    if (slide === this.state.slide) return;
    if (slide < 1 || slide > slides.length) {
      return this.actionNavigateToSlide(1);
    }

    this.setState({ transitioning: true });

    if (slide < this.state.slide) {
      document.documentElement.classList.add("back-transition");
    } else {
      document.documentElement.classList.add("next-transition");
    }

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        immediate(() => this.setState({ slide }));
      });
    });

    await transition.ready;

    try {
      await transition.finished;
    } finally {
      this.setState({ transitioning: false });
      document.documentElement.classList.remove("back-transition");
      document.documentElement.classList.remove("next-transition");
    }
  }
}
