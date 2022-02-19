import { polygon, tessellate, centroid, arcLength } from "@thi.ng/geom";

const makePoly = (points) => polygon(points);

function recursiveRandomTess(poly, depth, tessSelectFn, decisionFn) {
  if (decisionFn(poly, depth)) {
    let tessFn = tessSelectFn(poly, depth);
    let polys = tessellate(poly, [tessFn]).map(makePoly);
    return polys.flatMap((poly) =>
      recursiveRandomTess(poly, depth + 1, tessSelectFn, decisionFn)
    );
  }
  return poly;
}

function subdiv(polys, tessSelectFn, decisionFn, maxDepth) {
  // for each polygon, recursively tesselate based on some sort of decision function
  // decisions function returns [0-1] which maps to 0 to max recursion
  let scaledMaxedDecisionFn = (poly, depth) => {
    return depth < decisionFn(poly) * maxDepth;
  };
  const tessFn = (poly) =>
    recursiveRandomTess(poly, 0, tessSelectFn, scaledMaxedDecisionFn);
  return polys.flatMap(tessFn);
}

export { subdiv };
