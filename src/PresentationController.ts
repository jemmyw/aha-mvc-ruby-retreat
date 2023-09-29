import { flushSync } from "react-dom";
import ApplicationController from "./lib/mvc";
import { immediate } from "./lib/mvc/ApplicationView";
import slides from "./slides";
import BlankSlide from "./slides/BlankSlide";

interface State {
  slide: number;
}

function slideFromUrl(url: URL) {
  if (url.pathname.match(/^\/slides\/\d+$/)) {
    const slide = Number(url.pathname.split("/")[2]);
    return slide;
  }
}

export default class PresentationController extends ApplicationController<State> {
  get initialState(): State {
    return { slide: 0 };
  }

  get SlideComponent() {
    return slides[this.state.slide] || BlankSlide;
  }
  get NextSlideComponent() {
    return slides[this.state.slide + 1] || BlankSlide;
  }

  async initialize() {
    navigation?.addEventListener("navigate", (event: NavigateEvent) => {
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
    });

    this.state.slide = slideFromUrl(new URL(window.location.href)) || 0;
  }

  actionNextSlide() {
    if (this.state.slide === slides.length - 1) return;
    navigation?.navigate(`/slides/${this.state.slide + 1}`);
  }

  actionPrevSlide() {
    if (this.state.slide === 0) return;
    navigation?.navigate(`/slides/${this.state.slide - 1}`);
  }

  async transition(slide: number) {
    if (slide === this.state.slide) return;

    if (slide < this.state.slide) {
      document.documentElement.classList.add("back-transition");
    } else {
      document.documentElement.classList.add("next-transition");
    }

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        immediate(() => {
          this.setState({ slide });
        });
      });
    });

    await transition.ready;

    try {
      await transition.finished;
    } finally {
      // setTimeout(() => {
      document.documentElement.classList.remove("back-transition");
      document.documentElement.classList.remove("next-transition");
      // }, 500);
    }
  }
}
