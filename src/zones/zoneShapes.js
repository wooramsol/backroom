/**
 * Step 3 — zone-specific shape pickers (calls frozen roomShapes, no edits there).
 * Step 4 — tuned weights for architectural variety and size contrast.
 */
import {
  shapeSquare,
  shapeRectangle,
  shapeLongRectangle,
  shapeVeryLong,
  shapeLounge,
  shapeNarrow,
  shapeL,
  shapeU,
  shapeT,
  shapeZ,
  shapeCross,
  pickSeedLoungeShape,
  pickCompactRoomShape,
} from "../mapgen/roomShapes.js";

function pickWeighted(rng, builders, usedSizes, tries = 28) {
  for (let i = 0; i < tries; i++) {
    const fn = rng.pickWeighted(builders);
    const shape = fn(rng, usedSizes);
    if (shape) return shape;
  }
  return null;
}

const SMALL_BUILDERS = [
  [(rng, u) => shapeSquare(rng, u, 5), 22],
  [(rng, u) => shapeRectangle(rng, u, 7, 6), 18],
  [(rng, u) => shapeNarrow(rng, u), 18],
  [shapeL, 14],
  [shapeT, 12],
  [(rng, u) => shapeSquare(rng, u, 4), 16],
];

const LOUNGE_BUILDERS = [
  [shapeLounge, 50],
  [(rng, u) => shapeRectangle(rng, u, 12, 10), 18],
  [shapeCross, 17],
  [shapeU, 15],
];

const LONG_BUILDERS = [
  [shapeVeryLong, 38],
  [shapeLongRectangle, 34],
  [(rng, u) => shapeRectangle(rng, u, 12, 5), 14],
  [shapeZ, 14],
];

const MAZE_BUILDERS = [
  [shapeL, 20],
  [shapeU, 18],
  [shapeZ, 16],
  [shapeT, 16],
  [shapeCross, 15],
  [(rng, u) => shapeSquare(rng, u, 6), 15],
];

const OPEN_BUILDERS = [
  [shapeLounge, 62],
  [(rng, u) => shapeRectangle(rng, u, 11, 9), 22],
  [shapeCross, 16],
];

const NARROW_BUILDERS = [
  [shapeNarrow, 46],
  [(rng, u) => shapeVeryLong(rng, u), 28],
  [(rng, u) => shapeSquare(rng, u, 4), 14],
  [shapeL, 12],
];

export function pickZoneSeedShape(rng, usedSizes, seedMode) {
  switch (seedMode) {
    case "compact":
      if (rng.chance(0.32)) return pickSeedLoungeShape(rng, usedSizes);
      return pickWeighted(rng, SMALL_BUILDERS, usedSizes) ?? pickCompactRoomShape(rng, usedSizes);
    case "lounge":
      return pickSeedLoungeShape(rng, usedSizes);
    case "long":
      return pickWeighted(rng, LONG_BUILDERS, usedSizes) ?? shapeLongRectangle(rng, usedSizes);
    case "narrow":
      return shapeNarrow(rng, usedSizes) ?? pickCompactRoomShape(rng, usedSizes);
    default:
      return pickSeedLoungeShape(rng, usedSizes);
  }
}

export function pickZoneRoomShape(rng, usedSizes, pickMode, fillRatio = 0) {
  if (fillRatio >= 0.52 && pickMode !== "open" && pickMode !== "lounge") {
    const compact = pickCompactRoomShape(rng, usedSizes);
    if (compact) return compact;
  }

  switch (pickMode) {
    case "small":
      return pickWeighted(rng, SMALL_BUILDERS, usedSizes) ?? shapeSquare(rng, usedSizes, 5);
    case "lounge":
      return pickWeighted(rng, LOUNGE_BUILDERS, usedSizes) ?? shapeLounge(rng, usedSizes);
    case "long":
      return pickWeighted(rng, LONG_BUILDERS, usedSizes) ?? shapeLongRectangle(rng, usedSizes);
    case "maze":
      return pickWeighted(rng, MAZE_BUILDERS, usedSizes) ?? shapeL(rng, usedSizes);
    case "open":
      return pickWeighted(rng, OPEN_BUILDERS, usedSizes) ?? shapeLounge(rng, usedSizes);
    case "narrow":
      return pickWeighted(rng, NARROW_BUILDERS, usedSizes) ?? shapeNarrow(rng, usedSizes);
    default:
      return pickCompactRoomShape(rng, usedSizes);
  }
}
