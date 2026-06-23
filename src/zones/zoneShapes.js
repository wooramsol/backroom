/**
 * Step 3 — zone-specific shape pickers (calls frozen roomShapes, no edits there).
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

function pickWeighted(rng, builders, usedSizes, tries = 24) {
  for (let i = 0; i < tries; i++) {
    const fn = rng.pickWeighted(builders);
    const shape = fn(rng, usedSizes);
    if (shape) return shape;
  }
  return null;
}

const SMALL_BUILDERS = [
  [(rng, u) => shapeSquare(rng, u, 5), 35],
  [(rng, u) => shapeRectangle(rng, u, 7, 6), 30],
  [(rng, u) => shapeNarrow(rng, u), 20],
  [(rng, u) => shapeSquare(rng, u, 4), 15],
];

const LOUNGE_BUILDERS = [
  [shapeLounge, 55],
  [(rng, u) => shapeRectangle(rng, u, 12, 10), 25],
  [shapeCross, 20],
];

const LONG_BUILDERS = [
  [shapeVeryLong, 40],
  [shapeLongRectangle, 40],
  [(rng, u) => shapeRectangle(rng, u, 12, 5), 20],
];

const MAZE_BUILDERS = [
  [shapeL, 22],
  [shapeU, 18],
  [shapeZ, 16],
  [shapeT, 16],
  [shapeCross, 14],
  [(rng, u) => shapeSquare(rng, u, 6), 14],
];

const OPEN_BUILDERS = [
  [shapeLounge, 70],
  [(rng, u) => shapeRectangle(rng, u, 11, 9), 30],
];

const NARROW_BUILDERS = [
  [shapeNarrow, 50],
  [(rng, u) => shapeVeryLong(rng, u), 25],
  [(rng, u) => shapeSquare(rng, u, 4), 25],
];

export function pickZoneSeedShape(rng, usedSizes, seedMode) {
  switch (seedMode) {
    case "compact":
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
  if (fillRatio >= 0.58 && pickMode !== "open") {
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
