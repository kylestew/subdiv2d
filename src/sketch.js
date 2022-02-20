import { transformThatFits, insetRect, componentToHex } from "../snod/util";
import grids from "../snod/grids";
import { subdiv } from "./lib/subdiv";
import {
  applyBrightness,
  applyContrast,
  applyLUT,
} from "../snod/canvas-filters";
import {
  colorDepthDivider,
  tessSelectOnNoiseFn,
  sampledPolyTint,
} from "./lib/decision-fns";

function createTessedGeometry(width, height, state) {
  // setup base grid geometry
  let baseGeo = grids.triangle(width, height, parseInt(state.gridDensity));

  // tessellate
  let decisionFn = (poly) =>
    colorDepthDivider(poly, state.sampler, state.invert);
  let tessSelectFn = (poly, depth) =>
    tessSelectOnNoiseFn(state.tessStack, poly, depth);
  let tessedPolys = subdiv(baseGeo, tessSelectFn, decisionFn, state.maxDepth);

  // color polys
  const polyTintFn = (poly) => sampledPolyTint(poly, state.sampler);
  return tessedPolys.map(polyTintFn);
}

function render({ ctx, exporting, time, width, height, state }) {
  const { sampler, enableFill, enableStroke, lut } = state;
  if (sampler == undefined) return;

  // TODO: extract palette from sampler
  let palette = [];
  if (sampler.palette) {
    palette = [
      sampler.palette.Vibrant.getHex(),
      sampler.palette.LightVibrant.getHex(),
      sampler.palette.DarkVibrant.getHex(),
      sampler.palette.Muted.getHex(),
      sampler.palette.LightMuted.getHex(),
      sampler.palette.DarkMuted.getHex(),
    ];
  }

  ctx.putImageData(sampler.imageData, 0, 0);

  for (let i = 0; i < palette.length; i++) {
    ctx.fillStyle = palette[i];
    ctx.fillRect(20 + i * 110, 20, 100, 100);
  }
  palette.forEach((pal) => {});

  if (!exporting) {
    // transform canvas to fit image
    let trans = transformThatFits(
      [sampler.width, sampler.height],
      insetRect([0, 0, width, height], 40) // cropped border
    );
    ctx.transform(...trans);
    // new canvas size
    width = sampler.width;
    height = sampler.height;
  }

  // do the actual tesselation
  // const polys = createTessedGeometry(width, height, state);

  /*
  const renderPoly = (poly) => {
    ctx.beginPath();
    const p0 = poly.points[0];
    ctx.moveTo(p0[0], p0[1]);
    poly.points.slice(1).map((p) => {
      ctx.lineTo(p[0], p[1]);
    });
    ctx.lineTo(p0[0], p0[1]);

    ctx.stroke();

    if (enableFill) {
      ctx.fillStyle = poly.attribs.fill;
      ctx.fill();
    }

    if (enableStroke) {
      ctx.strokeStyle = state.lineColor + componentToHex(state.lineOpacity);
      ctx.lineWidth = state.lineWidth;
      ctx.stroke();
    } else if (enableFill) {
      // stroke to fill in gaps in polys
      ctx.strokeStyle = ctx.fillStyle;
      ctx.lineWidth = 1.0;
      ctx.stroke();
    }
  };
  */

  // // clip to picture extends (grids will overflow)
  // // clip extra to trim errors at edges
  // ctx.beginPath();
  // ctx.rect(2, 2, width - 4, height - 4);
  // ctx.clip();

  // draw grid
  // ctx.lineJoin = "round";
  // polys.map(renderPoly);

  // post proc workflow
  // let imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  // applyBrightness(imgData.data, 16);
  // applyContrast(imgData.data, 8);
  // if (lut) {
  //   applyLUT(imgData, lut);
  // }
  // ctx.putImageData(imgData, 0, 0);
}

export { render };
