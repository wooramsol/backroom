import { createRng } from "./rng.js";

export const MIN_FLOOR = -1;
export const MAX_FLOOR = 4;
export const CELL = 10;
export const HW = CELL / 2;
export const ROOM_H = 2.8;
export const BASEMENT_H = 2.6;
export const FLOOR_STEP = 3.0;
export const DOOR_H = 2.25;
export const DOOR_CLEARANCE = 0.4;
export const WALL_THICK = 0.15;

const DIRS = ["north", "south", "east", "west"];

const DIR_VEC = {
  north: { dx: 0, dz: -1, wall: "n" },
  south: { dx: 0, dz: 1, wall: "s" },
  east: { dx: 1, dz: 0, wall: "e" },
  west: { dx: -1, dz: 0, wall: "w" },
};

function edgeKey(x0, z0, x1, z1, floor) {
  const ax = Math.min(x0, x1);
  const az = Math.min(z0, z1);
  const bx = Math.max(x0, x1);
  const bz = Math.max(z0, z1);
  return `${ax},${az},${bx},${bz},${floor}`;
}

/** Shared door on an edge between two cells — same on both sides. */
export function getEdgeDoor(x0, z0, x1, z1, floor) {
  const rng = createRng(...edgeKey(x0, z0, x1, z1, floor).split(",").map(Number));
  return {
    width: rng.pick([2.0, 2.4, 2.8]),
    offset: rng.range(-2.8, 2.8),
    height: DOOR_H,
    open: false,
  };
}

function chunkHash(cx, cz, floor) {
  return Math.abs((cx * 374761393 + cz * 668265559 + floor * 982451653) | 0);
}

/**
 * Minecraft-style: deterministic per-chunk features from coordinates.
 */
export function generateStair(cx, cz, floor) {
  if (floor >= MAX_FLOOR || floor < MIN_FLOOR) return null;

  const h = chunkHash(cx, cz, floor);

  // Hub stairs at origin
  if (cx === 0 && cz === 0) {
    if (floor === MIN_FLOOR) return { dir: "north", lower: floor, upper: floor + 1 };
    if (floor === 0) return { dir: "south", lower: floor, upper: floor + 1 };
    if (floor === 1) return { dir: "east", lower: floor, upper: floor + 1 };
    if (floor === 2) return { dir: "west", lower: floor, upper: floor + 1 };
    if (floor === 3) return { dir: "south", lower: floor, upper: floor + 1 };
  }

  // Scattered shafts (~1 per 11 chunks)
  if (h % 11 !== 0) return null;

  const dir = DIRS[h % 4];
  return { dir, lower: floor, upper: floor + 1 };
}

export function pickDecor(cx, cz, floor) {
  const rng = createRng(cx, cz, floor, 77);
  const biome = rng.pick(["lobby", "office", "storage", "hall", "plain"]);

  switch (biome) {
    case "lobby":
      return { type: "mat", size: rng.range(3, 5) };
    case "storage":
      return { type: "corner", x: rng.pick([-3.2, 3.2]), z: rng.pick([-3.2, 3.2]), w: 2.2, d: 2.2 };
    case "hall":
      return { type: "cross", w: 0.3, len: rng.range(3, 4.5) };
    case "office":
      return {
        type: "pillars",
        posts: [
          { x: -3, z: -3 },
          { x: 3, z: 3 },
        ],
      };
    default:
      return rng.chance(0.4)
        ? { type: "island", x: rng.range(-1.5, 1.5), z: rng.range(-1.5, 1.5), w: 1.8, d: 1.2 }
        : { type: "none" };
  }
}

export function generateChunk(cx, cz, floor) {
  const stair = generateStair(cx, cz, floor);
  const doors = {
    north: getEdgeDoor(cx, cz, cx, cz - 1, floor),
    south: getEdgeDoor(cx, cz, cx, cz + 1, floor),
    east: getEdgeDoor(cx, cz, cx + 1, cz, floor),
    west: getEdgeDoor(cx, cz, cx - 1, cz, floor),
  };

  if (stair) {
    const d = DIR_VEC[stair.dir];
    doors[d.wall] = { width: 3.2, offset: 0, height: DOOR_H, open: true };
  }

  return {
    cx,
    cz,
    floorLevel: floor,
    doors,
    stair,
    decor: pickDecor(cx, cz, floor),
    height: floor < 0 ? BASEMENT_H : ROOM_H,
    isBasement: floor < 0,
  };
}

export function buildStairShaft(chunk) {
  if (!chunk.stair) return null;
  const { dir, lower, upper } = chunk.stair;
  const dv = DIR_VEC[dir];
  const ox = chunk.cx * CELL;
  const oz = chunk.cz * CELL;
  const y0 = lower * FLOOR_STEP;

  let cx = ox;
  let cz = oz;
  if (dir === "south") cz = oz + 2.5;
  else if (dir === "north") cz = oz - 2.5;
  else if (dir === "east") cx = ox + 2.5;
  else if (dir === "west") cx = ox - 2.5;

  return {
    cx,
    cz,
    dirX: dv.dx,
    dirZ: dv.dz,
    width: 3.2,
    depth: 3.2,
    lowerFloor: lower,
    upperFloor: upper,
    fromY: y0,
    toY: upper * FLOOR_STEP,
    dir,
  };
}

export function cellOf(pos) {
  return {
    x: Math.floor((pos.x + HW) / CELL),
    z: Math.floor((pos.z + HW) / CELL),
  };
}

export function getFloorLabel(floor) {
  if (floor < 0) return `BASEMENT ${Math.abs(floor)}`;
  return `LEVEL ${floor}`;
}
