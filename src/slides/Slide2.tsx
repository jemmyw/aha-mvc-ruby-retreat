import Slide from "./Slide";

import cerebral from "../assets/libraries/cerebral.png";
import jotai from "../assets/libraries/jotai.png";
import undux from "../assets/libraries/undux.png";
import recoil from "../assets/libraries/recoil.svg";
import xstate from "../assets/libraries/xstate.svg";
import easy from "../assets/libraries/easy.svg";
import kea from "../assets/libraries/kea.svg";
import mobx from "../assets/libraries/mobx.png";
import redux from "../assets/libraries/redux.svg";
import constate from "../assets/libraries/constate.png";
import elf from "../assets/libraries/elf.png";
import dutier from "../assets/libraries/dutier.png";
import easypeasy from "../assets/libraries/easy-peasy.png";
import effector from "../assets/libraries/effector.svg";
import mobxStateTree from "../assets/libraries/mobx-state-tree.png";
import nano from "../assets/libraries/nano.svg";
import zero from "../assets/libraries/zero.png";
import rex from "../assets/libraries/rex.png";
import robot from "../assets/libraries/robot.png";
import asta from "../assets/libraries/asta.png";
import statek from "../assets/libraries/statek.png";
import storeon from "../assets/libraries/storeon.svg";

const images = [
  cerebral,
  easy,
  jotai,
  kea,
  mobx,
  recoil,
  redux,
  xstate,
  undux,
  constate,
  elf,
  dutier,
  easypeasy,
  effector,
  mobxStateTree,
  nano,
  zero,
  rex,
  robot,
  asta,
  statek,
  storeon,
];

export default Slide(() => {
  const imgs = images.map((img, index) => (
    <div className="w-[50px]" key={index}>
      <img className="w-full m-0" src={img} />
    </div>
  ));

  return (
    <div className="flex flex-col items-center justify-center w-full h-full prose-xl">
      <h1>React state libraries</h1>
      <div
        className="flex flex-wrap items-center justify-center gap-5 px-20"
        data-show={1}
      >
        {imgs}
      </div>
    </div>
  );
});

/**
 * However, React purports to be a view library, not a framework. And so there
 * is a proliferation of state management libraries that have sprung up around
 * React.
 *
 * A lot of state management libraries... I collected logos until I got bored.
 *
 * I've tried and used a few of these.
 */
