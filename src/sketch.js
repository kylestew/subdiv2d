import { transformThatFits, insetRect, componentToHex } from "../snod/util";
import grids from "../snod/grids";
import { luminosity } from "../snod/color";
import { subdiv } from "./lib/subdiv";
import { rgbToHex } from "../snod/util";
import { centroid, area } from "@thi.ng/geom";

function colorDepthDivider(poly, sampler, invert) {
  let color = sampler.colorAt(centroid(poly));
  let lumi = luminosity(color);
  // shape luminosity so its more responsive on the low end: [0-1] -> [0-1]
  if (invert) {
    return 1.0 - Math.log10(lumi * 9 + 1);
  }
  return Math.log10(lumi * 9 + 1);
}

function sampledPolyTint(poly, sampler) {
  // base sampling circle in area of poly
  const rad = Math.max(Math.floor(area(poly) * 0.001), 1);
  console.log(rad);
  let color = sampler.averageColorCircle(centroid(poly), rad);
  poly.attribs = {
    fill: rgbToHex(color),
  };
  return poly;
}

function createTessedGeometry(width, height, state) {
  // setup base grid geometry
  let baseGeo = grids.triangle(width, height, parseInt(state.gridDensity));

  // tessellate
  // let decisionFn = (poly) =>
  //   colorDepthDivder(poly, state.sampler, state.invert);
  // let tessedPolys = subdiv(
  //   baseGeo,
  //   state.tessStack,
  //   decisionFn,
  //   state.maxDepth
  // );

  // // color polys
  const polyTintFn = (poly) => sampledPolyTint(poly, state.sampler);
  return baseGeo.map(polyTintFn);
  // const polyTintFn = (poly) => sampledPolyTint(poly, state.sampler);
  // return tessedPolys.map(polyTintFn);
}

function render({ ctx, exporting, time, width, height, state }) {
  const { sampler, enableFill, enableStroke } = state;
  if (sampler == undefined) return;

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
  const polys = createTessedGeometry(width, height, state);

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

    // if (enableStroke) {
    //   ctx.strokeStyle = state.lineColor + componentToHex(state.lineOpacity);
    //   ctx.lineWidth = state.lineWidth;
    //   ctx.stroke();
    // } else if (enableFill) {
    //   // stroke to fill in gaps in polys
    //   ctx.strokeStyle = ctx.fillStyle;
    //   ctx.lineWidth = 2.5;
    //   ctx.stroke();
    // }
  };

  // clip to picture extends (grids will overflow)
  // clip extra to trim errors at edges
  // ctx.beginPath();
  // ctx.rect(2, 2, width - 4, height - 4);
  // ctx.clip();

  // draw grid
  ctx.lineJoin = "round";
  polys.map(renderPoly);
}

export { render };
