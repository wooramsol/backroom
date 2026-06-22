import { CHUNK, WALL_T } from "./constants.js";

/** Total walkable span between opposing walls/boundaries along one axis */
export function passageWidthAlong(x, z, innerWalls, axis) {
  if (axis === "x") {
    let neg = x - WALL_T / 2;
    let pos = CHUNK - WALL_T / 2 - x;
    for (const wall of innerWalls) {
      if (wall.axis !== "x") continue;
      if (z < wall.span0 - 0.05 || z > wall.span1 + 0.05) continue;
      if (wall.pos <= x) neg = Math.min(neg, x - wall.pos - WALL_T / 2);
      else pos = Math.min(pos, wall.pos - x - WALL_T / 2);
    }
    return neg + pos;
  }
  let neg = z - WALL_T / 2;
  let pos = CHUNK - WALL_T / 2 - z;
  for (const wall of innerWalls) {
    if (wall.axis !== "z") continue;
    if (x < wall.span0 - 0.05 || x > wall.span1 + 0.05) continue;
    if (wall.pos <= z) neg = Math.min(neg, z - wall.pos - WALL_T / 2);
    else pos = Math.min(pos, wall.pos - z - WALL_T / 2);
  }
  return neg + pos;
}
