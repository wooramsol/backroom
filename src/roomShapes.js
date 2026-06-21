import { CHUNK, PANEL_SIZE, MIN_PASSAGE_SPAN } from "./constants.js";

/** Wall length limits — ceiling/floor tile grid */
export const MAX_WALL_TILES = 10;
export const MIN_WALL_TILES = 3;
export const MAX_WALL_SPAN = PANEL_SIZE * MAX_WALL_TILES;
export const MIN_WALL_SPAN = PANEL_SIZE * MIN_WALL_TILES;

const BOUND_EPS = 0.25;

const ROOM_TILE_LO = 3;
const ROOM_TILE_HI = 7;
const LEG_TILE_LO = 4;
const LEG_TILE_HI = 8;

function tileMetres(rng, lo, hi) {
  return rng.int(lo, hi) * PANEL_SIZE;
}

function roomSpan(rng) {
  return tileMetres(rng, ROOM_TILE_LO, ROOM_TILE_HI);
}

function legSpan(rng) {
  return tileMetres(rng, LEG_TILE_LO, Math.min(LEG_TILE_HI, Math.floor(CHUNK / PANEL_SIZE) - 1));
}

function gapSpan(rng) {
  return tileMetres(rng, 2, 3);
}

function wall(axis, pos, span0, span1, door = null) {
  const len = span1 - span0;
  if (len < MIN_WALL_SPAN - 0.01 || len > MAX_WALL_SPAN + 0.01) return null;
  if (pos <= BOUND_EPS || pos >= CHUNK - BOUND_EPS) return null;
  if (span0 > BOUND_EPS && span1 < CHUNK - BOUND_EPS) return null;
  return { axis, pos, span0, span1, door };
}

function zone(x0, z0, x1, z1) {
  return { x0, z0, x1, z1 };
}

/** L + return leg — all three walls meet at one corner cluster */
function cornerCove(rng, corner, doorSpec) {
  const legA = legSpan(rng);
  const legB = legSpan(rng);
  const doorOn = rng.pick(["leg-a", "leg-b", "return", "none"]);

  const mk = {
    nw: () => ({
      kind: "cove-nw",
      zones: [zone(0, 0, legA, legB)],
      innerWalls: [
        wall("z", legB, 0, legA, doorOn === "leg-a" ? doorSpec(rng, legA) : null),
        wall("x", legA, 0, legB, doorOn === "leg-b" ? doorSpec(rng, legB) : null),
        wall("z", legB, legA, CHUNK, doorOn === "return" ? doorSpec(rng, CHUNK - legA) : null),
      ],
    }),
    ne: () => {
      const x0 = CHUNK - legA;
      return {
        kind: "cove-ne",
        zones: [zone(x0, 0, CHUNK, legB)],
        innerWalls: [
          wall("z", legB, x0, CHUNK, doorOn === "leg-a" ? doorSpec(rng, legA) : null),
          wall("x", x0, 0, legB, doorOn === "leg-b" ? doorSpec(rng, legB) : null),
          wall("z", legB, 0, x0, doorOn === "return" ? doorSpec(rng, x0) : null),
        ],
      };
    },
    sw: () => {
      const z0 = CHUNK - legB;
      return {
        kind: "cove-sw",
        zones: [zone(0, z0, legA, CHUNK)],
        innerWalls: [
          wall("z", z0, 0, legA, doorOn === "leg-a" ? doorSpec(rng, legA) : null),
          wall("x", legA, z0, CHUNK, doorOn === "leg-b" ? doorSpec(rng, legB) : null),
          wall("z", z0, legA, CHUNK, doorOn === "return" ? doorSpec(rng, CHUNK - legA) : null),
        ],
      };
    },
    se: () => {
      const x0 = CHUNK - legA;
      const z0 = CHUNK - legB;
      return {
        kind: "cove-se",
        zones: [zone(x0, z0, CHUNK, CHUNK)],
        innerWalls: [
          wall("z", z0, x0, CHUNK, doorOn === "leg-a" ? doorSpec(rng, legA) : null),
          wall("x", x0, z0, CHUNK, doorOn === "leg-b" ? doorSpec(rng, legB) : null),
          wall("z", z0, 0, x0, doorOn === "return" ? doorSpec(rng, x0) : null),
        ],
      };
    },
  };
  return mk[corner]();
}

/** U pocket from a corner — three walls, one open side */
function uPocket(rng, corner, doorSpec) {
  const w = roomSpan(rng);
  const d = legSpan(rng);
  const doorOn = rng.pick(["cap-x", "cap-z", "none"]);

  const mk = {
    nw: () => ({
      kind: "u-nw",
      zones: [zone(0, 0, w, d)],
      innerWalls: [
        wall("z", d, 0, w, doorOn === "cap-z" ? doorSpec(rng, w) : null),
        wall("x", w, 0, d, doorOn === "cap-x" ? doorSpec(rng, d) : null),
        wall("x", w, d, CHUNK, null),
      ],
    }),
    ne: () => {
      const x0 = CHUNK - w;
      return {
        kind: "u-ne",
        zones: [zone(x0, 0, CHUNK, d)],
        innerWalls: [
          wall("z", d, x0, CHUNK, doorOn === "cap-z" ? doorSpec(rng, w) : null),
          wall("x", x0, 0, d, doorOn === "cap-x" ? doorSpec(rng, d) : null),
          wall("x", x0, d, CHUNK, null),
        ],
      };
    },
    sw: () => {
      const z0 = CHUNK - d;
      return {
        kind: "u-sw",
        zones: [zone(0, z0, w, CHUNK)],
        innerWalls: [
          wall("z", z0, 0, w, doorOn === "cap-z" ? doorSpec(rng, w) : null),
          wall("x", w, z0, CHUNK, doorOn === "cap-x" ? doorSpec(rng, d) : null),
          wall("x", w, 0, z0, null),
        ],
      };
    },
    se: () => {
      const x0 = CHUNK - w;
      const z0 = CHUNK - d;
      return {
        kind: "u-se",
        zones: [zone(x0, z0, CHUNK, CHUNK)],
        innerWalls: [
          wall("z", z0, x0, CHUNK, doorOn === "cap-z" ? doorSpec(rng, w) : null),
          wall("x", x0, z0, CHUNK, doorOn === "cap-x" ? doorSpec(rng, d) : null),
          wall("x", x0, 0, z0, null),
        ],
      };
    },
  };
  return mk[corner]();
}

/** Four-wall notch from a corner — small enclosed pocket */
function boxNotch(rng, corner, doorSpec) {
  const w = roomSpan(rng);
  const d = roomSpan(rng);
  const doorOn = rng.pick(["north", "west", "none"]);

  const mk = {
    nw: () => ({
      kind: "notch-nw",
      zones: [zone(0, 0, w, d)],
      innerWalls: [
        wall("z", d, 0, w, doorOn === "north" ? doorSpec(rng, w) : null),
        wall("x", w, 0, d, doorOn === "west" ? doorSpec(rng, d) : null),
        wall("z", d, w, CHUNK, null),
        wall("x", w, d, CHUNK, null),
      ],
    }),
    ne: () => {
      const x0 = CHUNK - w;
      return {
        kind: "notch-ne",
        zones: [zone(x0, 0, CHUNK, d)],
        innerWalls: [
          wall("z", d, x0, CHUNK, doorOn === "north" ? doorSpec(rng, w) : null),
          wall("x", x0, 0, d, doorOn === "west" ? doorSpec(rng, d) : null),
          wall("z", d, 0, x0, null),
          wall("x", x0, d, CHUNK, null),
        ],
      };
    },
    sw: () => {
      const z0 = CHUNK - d;
      return {
        kind: "notch-sw",
        zones: [zone(0, z0, w, CHUNK)],
        innerWalls: [
          wall("z", z0, 0, w, doorOn === "north" ? doorSpec(rng, w) : null),
          wall("x", w, z0, CHUNK, doorOn === "west" ? doorSpec(rng, d) : null),
          wall("z", z0, w, CHUNK, null),
          wall("x", w, 0, z0, null),
        ],
      };
    },
    se: () => {
      const x0 = CHUNK - w;
      const z0 = CHUNK - d;
      return {
        kind: "notch-se",
        zones: [zone(x0, z0, CHUNK, CHUNK)],
        innerWalls: [
          wall("z", z0, x0, CHUNK, doorOn === "north" ? doorSpec(rng, w) : null),
          wall("x", x0, z0, CHUNK, doorOn === "west" ? doorSpec(rng, d) : null),
          wall("z", z0, 0, x0, null),
          wall("x", x0, 0, z0, null),
        ],
      };
    },
  };
  return mk[corner]();
}

/** Edge shelf — three connected rails */
function staggerShelf(rng, edge, doorSpec) {
  const depth = legSpan(rng);
  const gap = gapSpan(rng);
  const a = roomSpan(rng);
  const b = a + gap;
  const doorOn = rng.pick(["rail-a", "rail-b", "cap"]);

  const mk = {
    west: () => ({
      kind: "shelf-w",
      zones: [zone(0, 0, depth, b)],
      innerWalls: [
        wall("z", a, 0, depth, doorOn === "rail-a" ? doorSpec(rng, depth) : null),
        wall("z", b, 0, depth, doorOn === "rail-b" ? doorSpec(rng, depth) : null),
        wall("x", depth, 0, a, doorOn === "cap" ? doorSpec(rng, a) : null),
      ],
    }),
    east: () => {
      const x0 = CHUNK - depth;
      return {
        kind: "shelf-e",
        zones: [zone(x0, 0, CHUNK, b)],
        innerWalls: [
          wall("z", a, x0, CHUNK, doorOn === "rail-a" ? doorSpec(rng, depth) : null),
          wall("z", b, x0, CHUNK, doorOn === "rail-b" ? doorSpec(rng, depth) : null),
          wall("x", x0, 0, a, doorOn === "cap" ? doorSpec(rng, a) : null),
        ],
      };
    },
    north: () => ({
      kind: "shelf-n",
      zones: [zone(0, 0, b, depth)],
      innerWalls: [
        wall("x", a, 0, depth, doorOn === "rail-a" ? doorSpec(rng, depth) : null),
        wall("x", b, 0, depth, doorOn === "rail-b" ? doorSpec(rng, depth) : null),
        wall("z", depth, 0, a, doorOn === "cap" ? doorSpec(rng, a) : null),
      ],
    }),
    south: () => {
      const z0 = CHUNK - depth;
      return {
        kind: "shelf-s",
        zones: [zone(0, z0, b, CHUNK)],
        innerWalls: [
          wall("x", a, z0, CHUNK, doorOn === "rail-a" ? doorSpec(rng, depth) : null),
          wall("x", b, z0, CHUNK, doorOn === "rail-b" ? doorSpec(rng, depth) : null),
          wall("z", z0, 0, a, doorOn === "cap" ? doorSpec(rng, a) : null),
        ],
      };
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
  (rng, doorSpec) => finalizeShape(cornerCove(rng, rng.pick(["nw", "ne", "sw", "se"]), doorSpec)),
  (rng, doorSpec) => finalizeShape(uPocket(rng, rng.pick(["nw", "ne", "sw", "se"]), doorSpec)),
  (rng, doorSpec) => finalizeShape(boxNotch(rng, rng.pick(["nw", "ne", "sw", "se"]), doorSpec)),
  (rng, doorSpec) => finalizeShape(staggerShelf(rng, rng.pick(["west", "east", "north", "south"]), doorSpec)),
];

export function buildPseudoRoom(rng, doorSpec) {
  return rng.pick(BUILDERS)(rng, doorSpec);
}

export function buildFallbackPseudoRoom(rng, doorSpec) {
  return finalizeShape(uPocket(rng, "nw", doorSpec));
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
