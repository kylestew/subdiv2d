import { centroid, area } from "@thi.ng/geom";
import { rgbToHex } from "../../snod/util";
import { luminosity } from "../../snod/color";

import SimplexNoise from "simplex-noise";

function colorDepthDivider(poly, sampler, invert) {
  let color = sampler.colorAt(centroid(poly));
  let lumi = luminosity(color);
  // shape luminosity so its more responsive on the low end: [0-1] -> [0-1]
  if (invert) {
    return 1.0 - Math.log10(lumi * 9 + 1);
  }
  return Math.log10(lumi * 9 + 1);
}

function tessSelectOnNoiseFn(tessFns, poly, depth) {
  const simplex = new SimplexNoise();

  // tess fn selected based on depth
  let [x, y] = centroid(poly);
  let noise = simplex.noise3D(x / 2048, y / 2048, depth) * 0.5 + 0.5;
  let tessFn = tessFns[Math.floor(noise * tessFns.length)];
  return tessFn;
}

function tessSelectByDepthFn(tessFns, poly, depth) {
  let idx = depth % tessFns.length;
  return tessFns[idx];
}

function sampledPolyTint(poly, sampler) {
  // base sampling circle in area of poly
  const rad = Math.max(Math.floor(area(poly) * 0.001), 1);
  let color = sampler.averageColorCircle(centroid(poly), rad);
  poly.attribs = {
    fill: rgbToHex(color),
  };
  return poly;
}

function colorDistance(a, b) {
  return (
    (b[0] - a[0]) * (b[0] - a[0]) +
    (b[1] - a[1]) * (b[1] - a[1]) +
    (b[2] - a[2]) * (b[2] - a[2])
  );
}

function palettePreferredPolyTintFn(poly, sampler) {
  // base sampling circle in area of poly
  const rad = Math.min(Math.max(Math.floor(area(poly) * 0.001), 1), 16);
  let sampledColor = sampler.averageColorCircle(centroid(poly), rad);

  // find color in palette nearest to sampled color
  if (sampler.palette) {
    let sorted = [...sampler.palette].sort((a, b) => {
      return colorDistance(a, sampledColor) - colorDistance(b, sampledColor);
    });
    let color = sorted[0];

    poly.attribs = {
      fill: rgbToHex(color),
    };
  } else {
    poly.attribs = {
      fill: rgbToHex(sampledColor),
    };
  }

  return poly;
}

export {
  colorDepthDivider,
  tessSelectOnNoiseFn,
  tessSelectByDepthFn,
  sampledPolyTint,
  palettePreferredPolyTintFn,
};
