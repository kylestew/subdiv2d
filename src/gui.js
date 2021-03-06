import * as dat from "dat.gui";
import { AppActions, replaceSamplerFromUrl } from "./state";
import { tessOptions } from "./lib/tesses";

let imageSelector = {};

function createImageSelector(app) {
  const reader = new FileReader();
  const input = document.getElementById("imageInput");

  reader.onload = (e) => {
    replaceSamplerFromUrl(e.target.result, app);
  };

  input.addEventListener("change", (e) => {
    const f = e.target.files[0];
    reader.readAsDataURL(f);
  });

  return {
    reader,
    input,
  };
}

function createGUI(app) {
  const state = app.getState();
  const gui = new dat.GUI();

  const dispatchUpdate = (payload) => {
    app.dispatch({
      type: AppActions.UpdateParam,
      payload: payload,
    });
  };
  const setTessLevel = (level, name) => {
    app.dispatch({
      type: AppActions.SetTessLevel,
      payload: { level: level, name: name },
    });
  };

  imageSelector = createImageSelector(app);

  var baseGridFolder = gui.addFolder("Base Grid");
  // baseGridFolder.open();

  baseGridFolder
    .add(state, "gridDensity")
    .name("Density")
    .min(2)
    .max(18)
    .step(1)
    .onChange((val) => dispatchUpdate({ gridDensity: val }));

  var tessFolder = gui.addFolder("Tessellation");
  // tessFolder.open();

  tessFolder
    .add(state, "maxDepth", 1, 5, 1)
    .name("Max Depth")
    .onChange((val) => dispatchUpdate({ maxDepth: val }));

  tessFolder
    .add(state, "invert")
    .name("Invert")
    .onChange((val) => dispatchUpdate({ invert: val }));

  tessFolder
    .add(state, "tessLevel1", Object.keys(tessOptions))
    .name("Level 1")
    .onChange((val) => setTessLevel(0, val));
  tessFolder
    .add(state, "tessLevel2", Object.keys(tessOptions))
    .name("Level 2")
    .onChange((val) => setTessLevel(1, val));
  tessFolder
    .add(state, "tessLevel3", Object.keys(tessOptions))
    .name("Level 3")
    .onChange((val) => setTessLevel(2, val));
  tessFolder
    .add(state, "tessLevel4", Object.keys(tessOptions))
    .name("Level 4")
    .onChange((val) => setTessLevel(3, val));

  let styleFolder = gui.addFolder("Style");
  // styleFolder.open();

  styleFolder
    .add(state, "enableFill")
    .name("Fill Polygons")
    .onChange((val) => dispatchUpdate({ enableFill: val }));

  styleFolder
    .add(state, "enableStroke")
    .name("Draw Lines")
    .onChange((val) => dispatchUpdate({ enableStroke: val }));

  styleFolder
    .add(state, "lineWidth")
    .name("Line Width")
    .min(0.1)
    .max(24.0)
    .step(0.1)
    .onChange((val) => dispatchUpdate({ lineWidth: val }));

  styleFolder
    .addColor(state, "lineColor")
    .onChange((val) => dispatchUpdate({ lineColor: val }));

  styleFolder
    .add(state, "lineOpacity")
    .name("Line Opacity")
    .min(0)
    .max(255)
    .step(1)
    .onChange((val) => dispatchUpdate({ lineOpacity: val }));
}

export { createGUI };
