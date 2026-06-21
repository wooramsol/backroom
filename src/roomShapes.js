import { CHUNK, PANEL_SIZE, MIN_PASSAGE_SPAN } from "./constants.js";

/** Wall length limits — ceiling/floor tile grid */
export const MAX_WALL_TILES = 10;
export const MIN_WALL_TILES = 3;
export const MAX_WALL_SPAN = PANEL_SIZE * MAX_WALL_TILES;
export const MIN_WALL_SPAN = PANEL_SIZE * MIN_WALL_TILES;

const BOUND_EPS = 0.25;

/** Liminal cell footprint — varied, but keeps walkable pockets small */
const ROOM_TILE_LO = 3;
const ROOM_TILE_HI = 7;
const LEG_TILE_LO = 4;
const LEG_TILE_HI = 9;
const GAP_TILE_LO = 2;
const GAP_TILE_HI = 3;

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
  return tileMetres(rng, GAP_TILE_LO, GAP_TILE_HI);
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

/** L-shaped cove from a corner — legs vary, third rail splits the open wing */
function cornerCove(rng, corner, doorSpec) {
  const legA = legSpan(rng);
  const legB = legSpan(rng);
  const rail = roomSpan(rng);
  const doorOn = rng.pick(["leg-a", "leg-b", "rail", "none"]);

  const mk = {
    nw: () => {
      const innerWalls = [
        wall("z", legB, 0, legA, doorOn === "leg-a" ? doorSpec(rng, legA) : null),
        wall("x", legA, 0, legB, doorOn === "leg-b" ? doorSpec(rng, legB) : null),
        wall("x", legA, CHUNK - rail, CHUNK, doorOn === "rail" ? doorSpec(rng, rail) : null),
      ];
      return {
        kind: "cove-nw",
        zones: [zone(0, 0, legA, legB), zone(legA, CHUNK - rail, CHUNK, CHUNK)],
        innerWalls,
      };
    },
    ne: () => {
      const x0 = CHUNK - legA;
      const innerWalls = [
        wall("z", legB, x0, CHUNK, doorOn === "leg-a" ? doorSpec(rng, legA) : null),
        wall("x", x0, 0, legB, doorOn === "leg-b" ? doorSpec(rng, legB) : null),
        wall("x", x0, CHUNK - rail, CHUNK, doorOn === "rail" ? doorSpec(rng, rail) : null),
      ];
      return {
        kind: "cove-ne",
        zones: [zone(x0, 0, CHUNK, legB), zone(0, CHUNK - rail, x0, CHUNK)],
        innerWalls,
      };
    },
    sw: () => {
      const z0 = CHUNK - legB;
      const innerWalls = [
        wall("z", z0, 0, legA, doorOn === "leg-a" ? doorSpec(rng, legA) : null),
        wall("x", legA, z0, CHUNK, doorOn === "leg-b" ? doorSpec(rng, legB) : null),
        wall("x", legA, 0, rail, doorOn === "rail" ? doorSpec(rng, rail) : null),
      ];
      return {
        kind: "cove-sw",
        zones: [zone(0, z0, legA, CHUNK), zone(legA, 0, CHUNK, rail)],
        innerWalls,
      };
    },
    se: () => {
      const x0 = CHUNK - legA;
      const z0 = CHUNK - legB;
      const innerWalls = [
        wall("x", x0, z0, CHUNK, doorOn === "leg-a" ? doorSpec(rng, legB) : null),
        wall("z", z0, x0, CHUNK, doorOn === "leg-b" ? doorSpec(rng, legA) : null),
        wall("z", z0, 0, rail, doorOn === "rail" ? doorSpec(rng, rail) : null),
      ];
      return {
        kind: "cove-se",
        zones: [zone(x0, z0, CHUNK, CHUNK), zone(0, 0, x0, rail)],
        innerWalls,
      };
    },
  };
  return mk[corner]();
}

/** Offset pocket — uneven legs, reads as a liminal dead-end */
function offsetPocket(rng, corner, doorSpec) {
  const shallow = roomSpan(rng);
  const deep = legSpan(rng);
  const stub = tileMetres(rng, ROOM_TILE_LO, ROOM_TILE_HI + 1);
  const doorOn = rng.pick(["deep", "shallow", "none"]);

  const mk = {
    nw: () => {
      const innerWalls = [
        wall("z", shallow, 0, stub, doorOn === "shallow" ? doorSpec(rng, stub) : null),
        wall("x", stub, 0, deep, doorOn === "deep" ? doorSpec(rng, deep) : null),
        wall("z", deep, stub, CHUNK, null),
      ];
      return { kind: "pocket-nw", zones: [zone(0, 0, stub, shallow)], innerWalls };
    },
    ne: () => {
      const x0 = CHUNK - stub;
      const innerWalls = [
        wall("z", shallow, x0, CHUNK, doorOn === "shallow" ? doorSpec(rng, stub) : null),
        wall("x", x0, 0, deep, doorOn === "deep" ? doorSpec(rng, deep) : null),
        wall("z", deep, 0, x0, null),
      ];
      return { kind: "pocket-ne", zones: [zone(x0, 0, CHUNK, shallow)], innerWalls };
    },
    sw: () => {
      const z0 = CHUNK - shallow;
      const innerWalls = [
        wall("z", z0, 0, stub, doorOn === "shallow" ? doorSpec(rng, stub) : null),
        wall("x", stub, CHUNK - deep, CHUNK, doorOn === "deep" ? doorSpec(rng, deep) : null),
        wall("z", CHUNK - deep, stub, CHUNK, null),
      ];
      return { kind: "pocket-sw", zones: [zone(0, z0, stub, CHUNK)], innerWalls };
    },
    se: () => {
      const x0 = CHUNK - stub;
      const z0 = CHUNK - shallow;
      const innerWalls = [
        wall("z", z0, x0, CHUNK, doorOn === "shallow" ? doorSpec(rng, stub) : null),
        wall("x", x0, CHUNK - deep, CHUNK, doorOn === "deep" ? doorSpec(rng, deep) : null),
        wall("z", CHUNK - deep, 0, x0, null),
      ];
      return { kind: "pocket-se", zones: [zone(x0, z0, CHUNK, CHUNK)], innerWalls };
    },
  };
  return mk[corner]();
}

/** Stepped partition — zig wall pair breaking sightlines */
function steppedSplit(rng, doorSpec) {
  const xStep = tileMetres(rng, 5, 9);
  const zStep = tileMetres(rng, 4, 8);
  const zRail = tileMetres(rng, ROOM_TILE_LO, ROOM_TILE_HI + 2);
  const vertical = rng.chance(0.5);

  if (vertical) {
    const innerWalls = [
      wall("x", xStep, 0, zStep, doorSpec(rng, zStep)),
      wall("z", zStep, xStep, CHUNK, null),
      wall("x", xStep, CHUNK - zRail, CHUNK, null),
    ];
    return {
      kind: "step-v",
      zones: [zone(0, 0, xStep, zStep), zone(xStep, zStep, CHUNK, CHUNK)],
      innerWalls,
    };
  }

  const innerWalls = [
    wall("z", zStep, 0, xStep, doorSpec(rng, xStep)),
    wall("x", xStep, zStep, CHUNK, null),
    wall("z", zStep, 0, zRail, null),
  ];
  return {
    kind: "step-h",
    zones: [zone(0, 0, xStep, zStep), zone(xStep, 0, CHUNK, CHUNK)],
    innerWalls,
  };
}

/** Deep shelf with staggered rails — not a corridor, shallow alcove only */
function staggerShelf(rng, edge, doorSpec) {
  const depth = legSpan(rng);
  const gap = gapSpan(rng);
  const a = roomSpan(rng);
  const b = a + gap;
  const doorOn = rng.pick(["rail-a", "rail-b", "cap"]);

  const mk = {
    west: () => {
      const innerWalls = [
        wall("z", a, 0, depth, doorOn === "rail-a" ? doorSpec(rng, depth) : null),
        wall("z", b, 0, depth, doorOn === "rail-b" ? doorSpec(rng, depth) : null),
        wall("x", depth, 0, a, doorOn === "cap" ? doorSpec(rng, a) : null),
      ];
      return { kind: "shelf-w", zones: [zone(0, 0, depth, b)], innerWalls };
    },
    east: () => {
      const x0 = CHUNK - depth;
      const innerWalls = [
        wall("z", a, x0, CHUNK, doorOn === "rail-a" ? doorSpec(rng, depth) : null),
        wall("z", b, x0, CHUNK, doorOn === "rail-b" ? doorSpec(rng, depth) : null),
        wall("x", x0, 0, a, doorOn === "cap" ? doorSpec(rng, a) : null),
      ];
      return { kind: "shelf-e", zones: [zone(x0, 0, CHUNK, b)], innerWalls };
    },
    north: () => {
      const innerWalls = [
        wall("x", a, 0, depth, doorOn === "rail-a" ? doorSpec(rng, depth) : null),
        wall("x", b, 0, depth, doorOn === "rail-b" ? doorSpec(rng, depth) : null),
        wall("z", depth, 0, a, doorOn === "cap" ? doorSpec(rng, a) : null),
      ];
      return { kind: "shelf-n", zones: [zone(0, 0, b, depth)], innerWalls };
    },
    south: () => {
      const z0 = CHUNK - depth;
      const innerWalls = [
        wall("x", a, z0, CHUNK, doorOn === "rail-a" ? doorSpec(rng, depth) : null),
        wall("x", b, z0, CHUNK, doorOn === "rail-b" ? doorSpec(rng, depth) : null),
        wall("z", z0, 0, a, doorOn === "cap" ? doorSpec(rng, a) : null),
      ];
      return { kind: "shelf-s", zones: [zone(0, z0, b, CHUNK)], innerWalls };
    },
  };
  return mk[edge]();
}

/** Twin stubs from one edge — two shallow pockets, breaks the cell rectangle */
function twinStub(rng, doorSpec) {
  const fromNorth = rng.chance(0.5);
  const stubA = roomSpan(rng);
  const stubB = stubA + gapSpan(rng);
  const reach = legSpan(rng);

  if (fromNorth) {
    const innerWalls = [
      wall("z", stubA, 0, reach, doorSpec(rng, reach)),
      wall("z", stubB, CHUNK - reach, CHUNK, doorSpec(rng, reach)),
      wall("x", reach, 0, stubB, null),
    ];
    return {
      kind: "twin-z",
      zones: [zone(0, 0, reach, stubA), zone(CHUNK - reach, stubB, CHUNK, CHUNK)],
      innerWalls,
    };
  }

  const innerWalls = [
    wall("x", stubA, 0, reach, doorSpec(rng, reach)),
    wall("x", stubB, CHUNK - reach, CHUNK, doorSpec(rng, reach)),
    wall("z", reach, 0, stubB, null),
  ];
  return {
    kind: "twin-x",
    zones: [zone(0, 0, stubA, reach), zone(stubB, CHUNK - reach, CHUNK, CHUNK)],
    innerWalls,
  };
}

function compactWalls(shape) {
  return shape.innerWalls.filter(Boolean);
}

function finalizeShape(shape) {
  return { ...shape, innerWalls: compactWalls(shape) };
}

const BUILDERS = [
  (rng, doorSpec) => finalizeShape(cornerCove(rng, rng.pick(["nw", "ne", "sw", "se"]), doorSpec)),
  (rng, doorSpec) => finalizeShape(offsetPocket(rng, rng.pick(["nw", "ne", "sw", "se"]), doorSpec)),
  (rng, doorSpec) => finalizeShape(steppedSplit(rng, doorSpec)),
  (rng, doorSpec) => finalizeShape(staggerShelf(rng, rng.pick(["west", "east", "north", "south"]), doorSpec)),
  (rng, doorSpec) => finalizeShape(twinStub(rng, doorSpec)),
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
