import { createRng } from "./rng.js";
import { buildZoneMap } from "./zones/index.js";
import { hasSpawnClearance } from "./spawnPosition.js";
import {
  CHUNK,
  WALL_T,
  WALL_JOINT_OVERLAP,
  DOOR_JAMB_INSET,
  MIN_DOOR_WIDTH,
  MIN_CLEAR_DOOR_WIDTH,
  MAX_DOOR_WIDTH,
  ROOM_H,
  SHAPE_ATTEMPTS_MAX,
} from "./constants.js";

export { CHUNK };
export { getMacroZoneAt } from "./zones/index.js";
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

/** Total walkable span between opposing walls/boundaries along one axis */
export { passageWidthAlong } from "./passage.js";

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

/** Chunk-local walkability — for prop placement */
export function isWalkableLocal(x, z, innerWalls) {
  return !navBlocked(x, z, innerWalls);
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

/** Every walkable floor cell must belong to one component — no sealed pockets */
function allWalkableConnected(innerWalls) {
  const cols = Math.ceil(CHUNK / NAV_CELL);
  let start = null;
  let walkable = 0;

  for (let iz = 0; iz < cols; iz++) {
    for (let ix = 0; ix < cols; ix++) {
      const x = ix * NAV_CELL + NAV_CELL * 0.5;
      const z = iz * NAV_CELL + NAV_CELL * 0.5;
      if (navBlocked(x, z, innerWalls)) continue;
      walkable++;
      if (!start) start = [x, z];
    }
  }

  if (!start || walkable === 0) return true;

  const reached = navFloodKeys(innerWalls, start[0], start[1]);
  return reached.size >= walkable;
}

function mapPassesValidation(shape, doors, cx, cz) {
  const base =
    shape.validation?.ok &&
    doorsWideEnough(shape.innerWalls, doors) &&
    allExitsConnected(shape.innerWalls, doors) &&
    allWalkableConnected(shape.innerWalls);
  if (!base) return false;
  if (cx === 0 && cz === 0 && !hasSpawnClearance(shape.innerWalls)) return false;
  return true;
}

/** Single zone-map attempt — safe to call once per animation frame while streaming. */
export function tryPickValidShape(cx, cz, attempt) {
  const doors = chunkDoors(cx, cz);
  const rng = createRng(cx, cz, attempt + 7);
  const shape = buildZoneMap(cx, cz, doors, rng);
  return mapPassesValidation(shape, doors, cx, cz) ? shape : null;
}

export function createRoomFromShape(cx, cz, shape) {
  return {
    cx,
    cz,
    kind: shape.kind,
    zones: shape.zones,
    innerWalls: shape.innerWalls,
    wallSegments: shape.wallSegments,
    rooms: shape.rooms,
    spatial: shape.metrics?.spatial ?? null,
    openPairs: shape.metrics?.openPairs ? [...shape.metrics.openPairs] : [],
    macroZone: shape.macroZone ?? null,
    zoneType: shape.zoneType ?? null,
    zoneProfile: shape.zoneProfile ?? null,
    height: ROOM_H,
    doors: {
      north: getSharedDoor(cx, cz, cx, cz - 1),
      south: getSharedDoor(cx, cz, cx, cz + 1),
      east: getSharedDoor(cx, cz, cx + 1, cz),
      west: getSharedDoor(cx, cz, cx - 1, cz),
    },
  };
}

function pickValidShape(cx, cz) {
  const doors = chunkDoors(cx, cz);
  for (let attempt = 0; attempt < SHAPE_ATTEMPTS_MAX; attempt++) {
    const shape = tryPickValidShape(cx, cz, attempt);
    if (shape) return shape;
  }
  return buildZoneMap(cx, cz, doors, createRng(cx, cz, 999));
}

const _roomCache = new Map();

export function generateRoom(cx, cz) {
  const key = `${cx},${cz}`;
  const cached = _roomCache.get(key);
  if (cached) return cached;

  const shape = pickValidShape(cx, cz);

  const room = createRoomFromShape(cx, cz, shape);

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
  const overlap = WALL_JOINT_OVERLAP * 0.5;
  const ex0 = x0 - overlap;
  const ex1 = x1 + overlap;
  if (!door) {
    addBox(boxes, ex0, ex1, z - t, z + t, y0, yTop);
    return;
  }
  const mid = (x0 + x1) / 2 + door.offset;
  const half = doorCollideHalf(door);
  const lo = mid - half;
  const hi = mid + half;
  addBox(boxes, ex0, lo, z - t, z + t, y0, yTop);
  addBox(boxes, hi, ex1, z - t, z + t, y0, yTop);
}

function wallAlongX(boxes, x, z0, z1, door, y0, yTop) {
  const t = WALL_T;
  const overlap = WALL_JOINT_OVERLAP * 0.5;
  const ez0 = z0 - overlap;
  const ez1 = z1 + overlap;
  if (!door) {
    addBox(boxes, x - t, x + t, ez0, ez1, y0, yTop);
    return;
  }
  const mid = (z0 + z1) / 2 + door.offset;
  const half = doorCollideHalf(door);
  const lo = mid - half;
  const hi = mid + half;
  addBox(boxes, x - t, x + t, ez0, lo, y0, yTop);
  addBox(boxes, x - t, x + t, hi, ez1, y0, yTop);
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

  put(`cl,${room.cx},${room.cz}`, () => {
    const b = [];
    b.push({
      minX: ox,
      maxX: ox + CHUNK,
      minZ: oz,
      maxZ: oz + CHUNK,
      minY: yTop - 0.06,
      maxY: yTop + 0.12,
      isCeiling: true,
    });
    return b;
  });

  return added;
}

function roomWallKeys(room) {
  const keys = [
    `ex,${room.cx + 1},${room.cz}`,
    `ez,${room.cx},${room.cz + 1}`,
    `wx,${room.cx},${room.cz}`,
    `nz,${room.cx},${room.cz}`,
    `cl,${room.cx},${room.cz}`,
  ];
  room.innerWalls.forEach((_, i) => keys.push(`iw,${room.cx},${room.cz},${i}`));
  return keys;
}

/** Wall + ceiling boxes owned by one room in the shared wall map */
export function roomColliderBoxes(map, room) {
  const list = [];
  for (const key of roomWallKeys(room)) {
    const boxes = map.get(key);
    if (boxes?.length) list.push(...boxes);
  }
  return list;
}

/** Drop wall boxes this room registered — map only; rebuild colliders separately */
export function removeRoomWalls(map, room) {
  let changed = false;
  for (const key of roomWallKeys(room)) {
    if (map.delete(key)) changed = true;
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
