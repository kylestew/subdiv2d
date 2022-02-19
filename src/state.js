import { createStore } from "redux";
import { LUTCubeLoader } from "three/examples/jsm/loaders/LUTCubeLoader";
import { ImageSampler } from "../snod/sampler";
import { randomImage } from "./lib/images";
import { random } from "canvas-sketch-util";
import {
  tessOptionToName,
  tessNameToOption,
  buildRandomTessStack,
} from "./lib/tesses";

import lutUrl from "/assets/luts/Everyday_Pro_Color.cube?url";

function randomState() {
  let willStroke = random.chance(0.2);

  return {
    sampler: undefined,

    // gridDensity: random.rangeFloor(6, 13),
    gridDensity: 12,

    tessStack: buildRandomTessStack(),

    get tessLevel1() {
      return tessOptionToName(this.tessStack[0]);
    },
    set tessLevel1(dropped) {},
    get tessLevel2() {
      return tessOptionToName(this.tessStack[1]);
    },
    set tessLevel2(dropped) {},
    get tessLevel3() {
      return tessOptionToName(this.tessStack[2]);
    },
    set tessLevel3(dropped) {},
    get tessLevel4() {
      return tessOptionToName(this.tessStack[3]);
    },
    set tessLevel4(dropped) {},
    maxDepth: random.rangeFloor(2, 5),
    invert: random.boolean(),

    enableFill: true,
    enableStroke: willStroke,
    lineWidth: 2.0,
    lineColor: willStroke ? "#000000" : "#ffffff",
    lineOpacity: willStroke ? 128 : 255,
  };
}

const AppActions = {
  ReplaceSampler: "ReplaceSampler",
  SetTessLevel: "SetTessLevel",
  UpdateParam: "UpdateParam",
  RandomizeState: "RandomizeState",
};

function appReducer(state = randomState(), action) {
  switch (action.type) {
    case AppActions.ReplaceSampler:
      return Object.assign(randomState(), { sampler: action.payload });

    case AppActions.SetTessLevel:
      let { level, name } = action.payload;
      let tessFn = tessNameToOption(name);
      let tessStack = state.tessStack;
      tessStack[level] = tessFn;
      return Object.assign({}, state, { tessStack });

    case AppActions.UpdateParam:
      return Object.assign({}, state, action.payload);

    case AppActions.RandomizeState:
      return Object.assign(randomState(), { sampler: state.sampler });

    default:
      return state;
  }
}

function replaceSamplerFromUrl(url, store) {
  ImageSampler.CreateFromImageUrl(url, (sampler) => {
    store.dispatch({
      type: AppActions.ReplaceSampler,
      payload: sampler,
    });
  });
}

function loadLUT(callback) {
  let url = lutUrl;
  new LUTCubeLoader().load(url, (lut) => {
    callback(lut);
  });
}

function createApp() {
  let store = createStore(appReducer);

  replaceSamplerFromUrl(randomImage(), store);

  setTimeout(() => {
    loadLUT((lut) => {
      store.dispatch({
        type: AppActions.UpdateParam,
        payload: { lut: lut.texture },
      });
    });
  }, 0);

  return store;
}

export { AppActions, createApp, replaceSamplerFromUrl };
