import { CHUNK, PANEL_SIZE, MIN_PASSAGE_SPAN } from "./constants.js";

/** Wall length limits — ceiling/floor tile grid */
export const MAX_WALL_TILES = 10;
export const MIN_WALL_TILES = 3;
export const MAX_WALL_SPAN = PANEL_SIZE * MAX_WALL_TILES;
export const MIN_WALL_SPAN = PANEL_SIZE * MIN_WALL_TILES;

const BOUND_EPS = 0.25;

/** Room footprint — ~½ prior linear span → ~¼ area */
const ROOM_TILE_LO = 3;
const ROOM_TILE_HI = 3;
const GAP_TILE_LO = 1;
const GAP_TILE_HI = 2;

function tileMetres(rng, lo = MIN_WALL_TILES, hi = MAX_WALL_TILES) {
  return rng.int(lo, hi) * PANEL_SIZE;
}

function roomTileMetres(rng) {
  return tileMetres(rng, ROOM_TILE_LO, ROOM_TILE_HI);
}

function gapMetres(rng) {
  return rng.int(GAP_TILE_LO, GAP_TILE_HI) * PANEL_SIZE;
}

function wall(axis, pos, span0, span1, door = null) {
  const len = span1 - span0;
  if (len < MIN_WALL_SPAN - 0.01 || len > MAX_WALL_SPAN + 0.01) return null;
  if (pos <= BOUND_EPS || pos >= CHUNK - BOUND_EPS) return null;
  if (span0 > BOUND_EPS && span1 < CHUNK - BOUND_EPS) return null;
  return { axis, pos, span0, span1, door };
}

/** 3-wall corner bay — open toward opposite corner */
function cornerBay(rng, corner, doorSpec) {
  const side = roomTileMetres(rng);
  const doorOn = rng.pick(["leg-a", "leg-b", "none"]);

  const mk = {
    nw: () => {
      const x1 = side;
      const z1 = side;
      const innerWalls = [
        wall("z", z1, 0, x1, doorOn === "leg-a" ? doorSpec(rng, x1) : null),
        wall("x", x1, 0, z1, doorOn === "leg-b" ? doorSpec(rng, z1) : null),
        wall("x", x1, CHUNK - side, CHUNK, null),
      ];
      return { kind: "bay-nw", zones: [{ x0: 0, z0: 0, x1, z1 }], innerWalls };
    },
    ne: () => {
      const x0 = CHUNK - side;
      const z1 = side;
      const innerWalls = [
        wall("z", z1, x0, CHUNK, doorOn === "leg-a" ? doorSpec(rng, side) : null),
        wall("x", x0, 0, z1, doorOn === "leg-b" ? doorSpec(rng, z1) : null),
        wall("x", x0, CHUNK - side, CHUNK, null),
      ];
      return { kind: "bay-ne", zones: [{ x0, z0: 0, x1: CHUNK, z1 }], innerWalls };
    },
    sw: () => {
      const x1 = side;
      const z0 = CHUNK - side;
      const innerWalls = [
        wall("z", z0, 0, x1, doorOn === "leg-a" ? doorSpec(rng, x1) : null),
        wall("x", x1, z0, CHUNK, doorOn === "leg-b" ? doorSpec(rng, side) : null),
        wall("z", z0, CHUNK - side, CHUNK, null),
      ];
      return { kind: "bay-sw", zones: [{ x0: 0, z0, x1, z1: CHUNK }], innerWalls };
    },
    se: () => {
      const depth = side;
      const gap = gapMetres(rng);
      const x0 = CHUNK - depth;
      const z0 = CHUNK - depth;
      const zA = z0 - gap;
      const innerWalls = [
        wall("x", x0, z0, CHUNK, doorOn === "leg-a" ? doorSpec(rng, depth) : null),
        wall("z", z0, x0, CHUNK, doorOn === "leg-b" ? doorSpec(rng, depth) : null),
        wall("z", zA, x0, CHUNK, null),
      ];
      return { kind: "bay-se", zones: [{ x0, z0: zA, x1: CHUNK, z1: CHUNK }], innerWalls };
    },
  };
  return mk[corner]();
}

/** 3-wall shelf from a chunk edge */
function edgeShelf(rng, edge, doorSpec) {
  const depth = roomTileMetres(rng);
  const gap = gapMetres(rng);
  const doorOn = rng.pick(["cap", "rail-a", "rail-b"]);

  const mk = {
    west: () => {
      const zA = tileMetres(rng, ROOM_TILE_LO, ROOM_TILE_HI);
      const zB = zA + gap;
      const innerWalls = [
        wall("z", zA, 0, depth, doorOn === "rail-a" ? doorSpec(rng, depth) : null),
        wall("z", zB, 0, depth, doorOn === "rail-b" ? doorSpec(rng, depth) : null),
        wall("x", depth, 0, zA, doorOn === "cap" ? doorSpec(rng, zA) : null),
      ];
      return { kind: "shelf-w", zones: [{ x0: 0, z0: 0, x1: depth, z1: zB }], innerWalls };
    },
    east: () => {
      const x0 = CHUNK - depth;
      const zA = tileMetres(rng, ROOM_TILE_LO, ROOM_TILE_HI);
      const zB = zA + gap;
      const innerWalls = [
        wall("z", zA, x0, CHUNK, doorOn === "rail-a" ? doorSpec(rng, depth) : null),
        wall("z", zB, x0, CHUNK, doorOn === "rail-b" ? doorSpec(rng, depth) : null),
        wall("x", x0, 0, zA, doorOn === "cap" ? doorSpec(rng, zA) : null),
      ];
      return { kind: "shelf-e", zones: [{ x0, z0: 0, x1: CHUNK, z1: zB }], innerWalls };
    },
    north: () => {
      const xA = tileMetres(rng, ROOM_TILE_LO, ROOM_TILE_HI);
      const xB = xA + gap;
      const innerWalls = [
        wall("x", xA, 0, depth, doorOn === "rail-a" ? doorSpec(rng, depth) : null),
        wall("x", xB, 0, depth, doorOn === "rail-b" ? doorSpec(rng, depth) : null),
        wall("z", depth, 0, xA, doorOn === "cap" ? doorSpec(rng, xA) : null),
      ];
      return { kind: "shelf-n", zones: [{ x0: 0, z0: 0, x1: xB, z1: depth }], innerWalls };
    },
    south: () => {
      const xA = tileMetres(rng, ROOM_TILE_LO, ROOM_TILE_HI);
      const xB = xA + gap;
      const z0 = CHUNK - depth;
      const innerWalls = [
        wall("x", xA, z0, CHUNK, doorOn === "rail-a" ? doorSpec(rng, depth) : null),
        wall("x", xB, z0, CHUNK, doorOn === "rail-b" ? doorSpec(rng, depth) : null),
        wall("z", z0, 0, xA, doorOn === "cap" ? doorSpec(rng, xA) : null),
      ];
      return { kind: "shelf-s", zones: [{ x0: 0, z0, x1: xB, z1: CHUNK }], innerWalls };
    },
  };
  return mk[edge]();
}

function compactWalls(shape) {
  return shape.innerWalls.filter(Boolean);
}

function finalizeShape(shape) {
  return { ...shape, innerWalls: compactWalls(shape) };
}

const BUILDERS = [
  (rng, doorSpec) => finalizeShape(cornerBay(rng, rng.pick(["nw", "ne", "sw", "se"]), doorSpec)),
  (rng, doorSpec) => finalizeShape(edgeShelf(rng, rng.pick(["west", "east", "north", "south"]), doorSpec)),
];

export function buildPseudoRoom(rng, doorSpec) {
  return rng.pick(BUILDERS)(rng, doorSpec);
}

export function wallsWithinTileLimit(innerWalls) {
  return innerWalls.every((w) => {
    const len = w.span1 - w.span0;
    return len >= MIN_WALL_SPAN - 0.01 && len <= MAX_WALL_SPAN + 0.01;
  });
}

export function hasThreeSidedStructure(innerWalls) {
  return innerWalls.length >= 3;
}

export function nookIsWalkable(shape) {
  for (const zone of shape.zones) {
    const w = zone.x1 - zone.x0;
    const d = zone.z1 - zone.z0;
    if (Math.min(w, d) < MIN_PASSAGE_SPAN + 0.5) return false;
  }
  return true;
}
