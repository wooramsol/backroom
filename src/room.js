import { createRng } from "./rng.js";
import {
  buildPseudoRoom,
  buildFallbackPseudoRoom,
  wallsWithinTileLimit,
  hasThreeSidedStructure,
  nookIsWalkable,
  parallelPassagesWideEnough,
} from "./roomShapes.js";
import {
  CHUNK,
  WALL_T,
  DOOR_H,
  DOOR_JAMB_INSET,
  MIN_DOOR_WIDTH,
  MIN_CLEAR_DOOR_WIDTH,
  MAX_DOOR_WIDTH,
  ROOM_H,
} from "./constants.js";

export { CHUNK };
export const CELL = CHUNK;
export const HW = CHUNK / 2;

const DOOR_WIDTHS = [1.55, 1.7, 1.85, 2.0, 2.15, 2.35, 2.55, 2.75, 3.0];
const SHARED_DOOR_WIDTHS = [1.6, 1.75, 1.95, 2.15, 2.35, 2.55, 2.8, 3.0];

function minDoorWidth() {
  return Math.max(MIN_DOOR_WIDTH, MIN_CLEAR_DOOR_WIDTH);
}

function maxDoorSpan(span) {
  return Math.min(span - 0.8, MAX_DOOR_WIDTH);
}

function pickDoorWidth(rng, span) {
  const maxW = maxDoorSpan(span);
  const minW = minDoorWidth();
  if (maxW < minW) return null;
  if (rng.chance(0.52)) {
    const w = rng.range(minW, maxW);
    return Math.round(w * 20) / 20;
  }
  const choices = DOOR_WIDTHS.filter((w) => w >= minW - 0.01 && w <= maxW + 0.01);
  return Math.max(minW, rng.pick(choices.length ? choices : [minW]));
}

function doorSpec(rng, span) {
  const maxW = maxDoorSpan(span);
  const width = Math.min(pickDoorWidth(rng, span) ?? minDoorWidth(), maxW);
  if (width < minDoorWidth()) return null;
  const maxOff = Math.max(0, span / 2 - width / 2 - 0.25);
  return { width, offset: rng.range(-maxOff, maxOff) };
}

export function getSharedDoor(cx0, cz0, cx1, cz1) {
  const ax = Math.min(cx0, cx1);
  const az = Math.min(cz0, cz1);
  const bx = Math.max(cx0, cx1);
  const bz = Math.max(cz0, cz1);
  const rng = createRng(ax, az, bx, bz, 42);
  const maxW = Math.min(CHUNK - 0.8, MAX_DOOR_WIDTH);
  const minW = minDoorWidth();
  let width;
  if (rng.chance(0.52)) {
    width = Math.round(rng.range(minW, maxW) * 20) / 20;
  } else {
    const choices = SHARED_DOOR_WIDTHS.filter((w) => w >= minW - 0.01 && w <= maxW + 0.01);
    width = Math.max(minW, rng.pick(choices.length ? choices : [minW]));
  }
  width = Math.max(minW, Math.min(width, maxW));
  const maxOff = Math.max(0, CHUNK / 2 - width / 2 - 0.5);
  const centerClear = width / 2 + 0.38;
  const cap = Math.min(maxOff, centerClear);
  return {
    width,
    offset: rng.range(-cap, cap),
  };
}

const BOUND_EPS = 0.25;

function wallTouchesBoundary(wall) {
  return wall.span0 <= BOUND_EPS || wall.span1 >= CHUNK - BOUND_EPS;
}

function wallEndpoints(wall) {
  if (wall.axis === "z") {
    return [
      { x: wall.span0, z: wall.pos },
      { x: wall.span1, z: wall.pos },
    ];
  }
  return [
    { x: wall.pos, z: wall.span0 },
    { x: wall.pos, z: wall.span1 },
  ];
}

function pointOnWall(point, wall, eps = 0.2) {
  if (wall.axis === "z") {
    if (Math.abs(point.z - wall.pos) > eps) return false;
    return point.x >= wall.span0 - eps && point.x <= wall.span1 + eps;
  }
  if (Math.abs(point.x - wall.pos) > eps) return false;
  return point.z >= wall.span0 - eps && point.z <= wall.span1 + eps;
}

function wallsLinked(a, b) {
  const eps = 0.2;
  const ea = wallEndpoints(a);
  const eb = wallEndpoints(b);
  for (const p of ea) {
    for (const q of eb) {
      if (Math.abs(p.x - q.x) <= eps && Math.abs(p.z - q.z) <= eps) return true;
    }
    if (pointOnWall(p, b, eps)) return true;
    for (const q of eb) {
      if (pointOnWall(q, a, eps)) return true;
    }
  }
  return false;
}

/** Every inner wall must link to the chunk boundary through connected segments */
export function isMazeConnected(innerWalls) {
  if (!innerWalls.length) return true;

  const anchored = innerWalls.map(wallTouchesBoundary);
  if (!anchored.some(Boolean)) return false;

  const visited = new Set();
  const queue = [];
  innerWalls.forEach((wall, i) => {
    if (anchored[i]) {
      visited.add(i);
      queue.push(i);
    }
  });

  while (queue.length) {
    const i = queue.shift();
    for (let j = 0; j < innerWalls.length; j++) {
      if (visited.has(j)) continue;
      if (wallsLinked(innerWalls[i], innerWalls[j])) {
        visited.add(j);
        queue.push(j);
      }
    }
  }

  return visited.size === innerWalls.length;
}

/** Every inner wall must touch at least one other inner wall — no lone segments */
export function wallsPairwiseConnected(innerWalls) {
  if (innerWalls.length < 3) return false;
  for (let i = 0; i < innerWalls.length; i++) {
    let linked = false;
    for (let j = 0; j < innerWalls.length; j++) {
      if (i !== j && wallsLinked(innerWalls[i], innerWalls[j])) {
        linked = true;
        break;
      }
    }
    if (!linked) return false;
  }
  return true;
}

/** No wall segment with both ends floating in open floor */
function hasFloatingWalls(innerWalls) {
  return innerWalls.some(
    (wall) => wall.span0 > BOUND_EPS && wall.span1 < CHUNK - BOUND_EPS,
  );
}

/** Every inner wall must reach a chunk edge — no floating segments in open floor */
function wallsAnchorToBoundary(innerWalls) {
  return innerWalls.every(wallTouchesBoundary);
}

const NAV_CELL = 0.5;

function wallBlocksNav(wall, x, z) {
  const halfT = WALL_T / 2 + 0.05;
  if (wall.axis === "z") {
    if (Math.abs(z - wall.pos) > halfT) return false;
    if (x < wall.span0 - 0.05 || x > wall.span1 + 0.05) return false;
    if (wall.door) {
      const mid = (wall.span0 + wall.span1) / 2 + wall.door.offset;
      const half = wall.door.width / 2 - DOOR_JAMB_INSET;
      if (x >= mid - half && x <= mid + half) return false;
    }
    return true;
  }
  if (Math.abs(x - wall.pos) > halfT) return false;
  if (z < wall.span0 - 0.05 || z > wall.span1 + 0.05) return false;
  if (wall.door) {
    const mid = (wall.span0 + wall.span1) / 2 + wall.door.offset;
    const half = wall.door.width / 2 - DOOR_JAMB_INSET;
    if (z >= mid - half && z <= mid + half) return false;
  }
  return true;
}

function navBlocked(x, z, innerWalls) {
  if (x < 0.3 || x > CHUNK - 0.3 || z < 0.3 || z > CHUNK - 0.3) return true;
  for (const wall of innerWalls) {
    if (wallBlocksNav(wall, x, z)) return true;
  }
  return false;
}

function chunkDoors(cx, cz) {
  return {
    north: getSharedDoor(cx, cz, cx, cz - 1),
    south: getSharedDoor(cx, cz, cx, cz + 1),
    east: getSharedDoor(cx, cz, cx + 1, cz),
    west: getSharedDoor(cx, cz, cx - 1, cz),
  };
}

function chunkDoorPoints(doors) {
  const h = CHUNK / 2;
  return {
    north: { x: h + doors.north.offset, z: 0.55 },
    south: { x: h + doors.south.offset, z: CHUNK - 0.55 },
    east: { x: CHUNK - 0.55, z: h + doors.east.offset },
    west: { x: 0.55, z: h + doors.west.offset },
  };
}

function navCellKey(x, z) {
  return `${Math.floor(x / NAV_CELL)},${Math.floor(z / NAV_CELL)}`;
}

function navFloodKeys(innerWalls, startX, startZ) {
  const cols = Math.ceil(CHUNK / NAV_CELL);
  const visited = new Set();
  if (navBlocked(startX, startZ, innerWalls)) return visited;

  const queue = [[startX, startZ]];
  while (queue.length) {
    const [x, z] = queue.pop();
    if (navBlocked(x, z, innerWalls)) continue;
    const ix = Math.floor(x / NAV_CELL);
    const iz = Math.floor(z / NAV_CELL);
    if (ix < 0 || iz < 0 || ix >= cols || iz >= cols) continue;
    const key = navCellKey(x, z);
    if (visited.has(key)) continue;
    visited.add(key);

    const n = NAV_CELL;
    queue.push([x + n, z], [x - n, z], [x, z + n], [x, z - n]);
  }
  return visited;
}

/** North/south/east/west chunk doors must all lie in one walkable maze component */
function allExitsConnected(innerWalls, doors) {
  const pts = chunkDoorPoints(doors);
  const entries = [pts.north, pts.south, pts.east, pts.west];
  for (const p of entries) {
    if (navBlocked(p.x, p.z, innerWalls)) return false;
  }

  const reached = navFloodKeys(innerWalls, pts.north.x, pts.north.z);
  for (const p of entries) {
    if (!reached.has(navCellKey(p.x, p.z))) return false;
  }
  return true;
}

function doorsWideEnough(innerWalls, doors) {
  const minW = minDoorWidth();
  for (const wall of innerWalls) {
    if (wall.door && wall.door.width < minW) return false;
  }
  for (const door of Object.values(doors)) {
    if (door.width < minW) return false;
  }
  return true;
}

function shapePassesValidation(shape, doors) {
  return (
    hasThreeSidedStructure(shape.innerWalls) &&
    wallsWithinTileLimit(shape.innerWalls) &&
    isMazeConnected(shape.innerWalls) &&
    wallsPairwiseConnected(shape.innerWalls) &&
    wallsAnchorToBoundary(shape.innerWalls) &&
    !hasFloatingWalls(shape.innerWalls) &&
    nookIsWalkable(shape) &&
    parallelPassagesWideEnough(shape.innerWalls) &&
    doorsWideEnough(shape.innerWalls, doors) &&
    allExitsConnected(shape.innerWalls, doors)
  );
}

function pickValidShape(rng, cx, cz) {
  const doors = chunkDoors(cx, cz);
  for (let attempt = 0; attempt < 96; attempt++) {
    const shape = buildPseudoRoom(rng, doorSpec);
    if (shapePassesValidation(shape, doors)) return shape;
  }
  const fallbackRng = createRng(cx, cz, 99);
  for (let attempt = 0; attempt < 96; attempt++) {
    const shape = buildPseudoRoom(fallbackRng, doorSpec);
    if (shapePassesValidation(shape, doors)) return shape;
  }
  const guaranteed = buildFallbackPseudoRoom(createRng(cx, cz, 77), doorSpec);
  if (shapePassesValidation(guaranteed, doors)) return guaranteed;
  return {
    kind: "open",
    zones: [{ x0: 0, z0: 0, x1: CHUNK, z1: CHUNK }],
    innerWalls: [],
  };
}

const _roomCache = new Map();

export function generateRoom(cx, cz) {
  const key = `${cx},${cz}`;
  const cached = _roomCache.get(key);
  if (cached) return cached;

  const rng = createRng(cx, cz, 7);
  const shape = pickValidShape(rng, cx, cz);

  const room = {
    cx,
    cz,
    kind: shape.kind,
    zones: shape.zones,
    innerWalls: shape.innerWalls,
    height: ROOM_H,
    doors: {
      north: getSharedDoor(cx, cz, cx, cz - 1),
      south: getSharedDoor(cx, cz, cx, cz + 1),
      east: getSharedDoor(cx, cz, cx + 1, cz),
      west: getSharedDoor(cx, cz, cx - 1, cz),
    },
  };

  _roomCache.set(key, room);
  return room;
}

function addBox(out, minX, maxX, minZ, maxZ, minY, maxY) {
  if (maxX - minX < 0.02 || maxZ - minZ < 0.02 || maxY - minY < 0.02) return;
  out.push({ minX, maxX, minZ, maxZ, minY, maxY });
}

function doorCollideHalf(door) {
  return door.width * 0.5 - DOOR_JAMB_INSET;
}

function wallAlongZ(boxes, z, x0, x1, door, y0, yTop) {
  const t = WALL_T;
  if (!door) {
    addBox(boxes, x0, x1, z - t, z + t, y0, yTop);
    return;
  }
  const mid = (x0 + x1) / 2 + door.offset;
  const half = doorCollideHalf(door);
  const lo = mid - half;
  const hi = mid + half;
  addBox(boxes, x0, lo, z - t, z + t, y0, DOOR_H);
  addBox(boxes, hi, x1, z - t, z + t, y0, DOOR_H);
}

function wallAlongX(boxes, x, z0, z1, door, y0, yTop) {
  const t = WALL_T;
  if (!door) {
    addBox(boxes, x - t, x + t, z0, z1, y0, yTop);
    return;
  }
  const mid = (z0 + z1) / 2 + door.offset;
  const half = doorCollideHalf(door);
  const lo = mid - half;
  const hi = mid + half;
  addBox(boxes, x - t, x + t, z0, lo, y0, DOOR_H);
  addBox(boxes, x - t, x + t, hi, z1, y0, DOOR_H);
}

function addInnerWall(boxes, ox, oz, wall, y0, yTop) {
  if (wall.axis === "x") {
    wallAlongX(boxes, ox + wall.pos, oz + wall.span0, oz + wall.span1, wall.door, y0, yTop);
  } else {
    wallAlongZ(boxes, oz + wall.pos, ox + wall.span0, ox + wall.span1, wall.door, y0, yTop);
  }
}

/** Outer + inner walls — all visible walls block movement */
export function appendRoomWalls(map, room) {
  const ox = room.cx * CHUNK;
  const oz = room.cz * CHUNK;
  const y0 = 0;
  const yTop = room.height;
  const x0 = ox;
  const x1 = ox + CHUNK;
  const z0 = oz;
  const z1 = oz + CHUNK;
  const added = [];

  const put = (key, fn) => {
    if (map.has(key)) return;
    const boxes = fn();
    map.set(key, boxes);
    added.push(...boxes);
  };

  put(`ex,${room.cx + 1},${room.cz}`, () => {
    const b = [];
    wallAlongX(b, x1, z0, z1, room.doors.east, y0, yTop);
    return b;
  });
  put(`ez,${room.cx},${room.cz + 1}`, () => {
    const b = [];
    wallAlongZ(b, z1, x0, x1, room.doors.south, y0, yTop);
    return b;
  });
  put(`wx,${room.cx},${room.cz}`, () => {
    const b = [];
    wallAlongX(b, x0, z0, z1, room.doors.west, y0, yTop);
    return b;
  });
  put(`nz,${room.cx},${room.cz}`, () => {
    const b = [];
    wallAlongZ(b, z0, x0, x1, room.doors.north, y0, yTop);
    return b;
  });

  room.innerWalls.forEach((wall, i) => {
    put(`iw,${room.cx},${room.cz},${i}`, () => {
      const b = [];
      addInnerWall(b, ox, oz, wall, y0, yTop);
      return b;
    });
  });

  return added;
}

function roomWallKeys(room) {
  const keys = [
    `ex,${room.cx + 1},${room.cz}`,
    `ez,${room.cx},${room.cz + 1}`,
    `wx,${room.cx},${room.cz}`,
    `nz,${room.cx},${room.cz}`,
  ];
  room.innerWalls.forEach((_, i) => keys.push(`iw,${room.cx},${room.cz},${i}`));
  return keys;
}

/** Drop wall boxes this room registered — incremental despawn */
export function removeRoomWalls(map, colliders, room) {
  let changed = false;
  for (const key of roomWallKeys(room)) {
    const boxes = map.get(key);
    if (!boxes) continue;
    map.delete(key);
    for (const box of boxes) {
      const idx = colliders.indexOf(box);
      if (idx !== -1) colliders.splice(idx, 1);
    }
    changed = true;
  }
  return changed;
}

export function registerRoomWalls(map, room) {
  appendRoomWalls(map, room);
}

export function collidersFromMap(map) {
  const out = [];
  for (const boxes of map.values()) out.push(...boxes);
  return out;
}
