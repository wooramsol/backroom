import { createRng } from "./rng.js";
import {
  CHUNK,
  WALL_T,
  DOOR_H,
  DOOR_CLEAR,
  MIN_ROOM_H,
  MAX_ROOM_H,
  MIN_ROOM_W,
  MAX_ROOM_W,
  MIN_ROOM_D,
  MAX_ROOM_D,
} from "./constants.js";

export { CHUNK };
export const CELL = CHUNK;
export const HW = CHUNK / 2;

export function getSharedDoor(cx0, cz0, cx1, cz1, span) {
  const ax = Math.min(cx0, cx1);
  const az = Math.min(cz0, cz1);
  const bx = Math.max(cx0, cx1);
  const bz = Math.max(cz0, cz1);
  const rng = createRng(ax, az, bx, bz, 42);
  const maxW = span * 0.55;
  const width = Math.min(rng.pick([1.6, 2.0, 2.4, 2.8, 3.2]), maxW);
  const maxOff = Math.max(0, span / 2 - width / 2 - 0.45);
  return {
    width,
    offset: rng.range(-maxOff, maxOff),
  };
}

export function generateRoom(cx, cz) {
  const rng = createRng(cx, cz, 7);
  const width = rng.range(MIN_ROOM_W, MAX_ROOM_W);
  const depth = rng.range(MIN_ROOM_D, MAX_ROOM_D);
  const westOff = CHUNK - width;
  const northOff = CHUNK - depth;

  const innerDoor = (span) => {
    const w = rng.pick([1.4, 1.8, 2.2, 2.6]);
    const maxOff = Math.max(0, span / 2 - w / 2 - 0.35);
    return { width: Math.min(w, span * 0.5), offset: rng.range(-maxOff, maxOff) };
  };

  return {
    cx,
    cz,
    width,
    depth,
    westOff,
    northOff,
    height: rng.range(MIN_ROOM_H, MAX_ROOM_H),
    doors: {
      north: getSharedDoor(cx, cz, cx, cz - 1, CHUNK),
      south: getSharedDoor(cx, cz, cx, cz + 1, CHUNK),
      east: getSharedDoor(cx, cz, cx + 1, cz, CHUNK),
      west: getSharedDoor(cx, cz, cx - 1, cz, CHUNK),
      innerWest: westOff > 0.5 ? innerDoor(CHUNK - northOff) : null,
      innerNorth: northOff > 0.5 ? innerDoor(CHUNK - westOff) : null,
    },
    lightSeed: rng.int(0, 99999),
    flicker: rng.range(0, Math.PI * 2),
  };
}

function addBox(out, minX, maxX, minZ, maxZ, minY, maxY) {
  if (maxX - minX < 0.04 || maxZ - minZ < 0.04 || maxY - minY < 0.04) return;
  out.push({ minX, maxX, minZ, maxZ, minY, maxY });
}

/** Wall along constant Z; xCenter is wall center X, xSpan half-width along X */
function wallAlongZ(boxes, z, xCenter, xSpan, door, y0, yTop) {
  const t = WALL_T;
  const dc = xCenter + door.offset;
  const half = door.width / 2 + DOOR_CLEAR;
  const lo = dc - half;
  const hi = dc + half;
  addBox(boxes, xCenter - xSpan, lo, z - t, z + t, y0, y0 + DOOR_H);
  addBox(boxes, hi, xCenter + xSpan, z - t, z + t, y0, y0 + DOOR_H);
  addBox(boxes, xCenter - xSpan, xCenter + xSpan, z - t, z + t, y0 + DOOR_H, yTop);
}

/** Wall along constant X; zCenter is wall center Z */
function wallAlongX(boxes, x, zCenter, zSpan, door, y0, yTop) {
  const t = WALL_T;
  const dc = zCenter + door.offset;
  const half = door.width / 2 + DOOR_CLEAR;
  const lo = dc - half;
  const hi = dc + half;
  addBox(boxes, x - t, x + t, zCenter - zSpan, lo, y0, y0 + DOOR_H);
  addBox(boxes, x - t, x + t, hi, zCenter + zSpan, y0, y0 + DOOR_H);
  addBox(boxes, x - t, x + t, zCenter - zSpan, zCenter + zSpan, y0 + DOOR_H, yTop);
}

export function registerRoomWalls(map, room) {
  const ox = room.cx * CHUNK;
  const oz = room.cz * CHUNK;
  const y0 = 0;
  const yTop = room.height;
  const midX = ox + CHUNK / 2;
  const midZ = oz + CHUNK / 2;
  const half = CHUNK / 2;

  const put = (key, fn) => {
    if (!map.has(key)) map.set(key, fn());
  };

  // South + east only — north/west owned by neighbor (no duplicate invisible walls)
  put(`h,${room.cx},${room.cz}`, () => {
    const b = [];
    wallAlongZ(b, oz + CHUNK, midX, half, room.doors.south, y0, yTop);
    return b;
  });
  put(`v,${room.cx},${room.cz}`, () => {
    const b = [];
    wallAlongX(b, ox + CHUNK, midZ, half, room.doors.east, y0, yTop);
    return b;
  });

  if (room.westOff > 0.5 && room.doors.innerWest) {
    put(`iw,${room.cx},${room.cz}`, () => {
      const b = [];
      const z0 = oz + room.northOff;
      const z1 = oz + CHUNK;
      wallAlongX(b, ox + room.westOff, (z0 + z1) / 2, (z1 - z0) / 2, room.doors.innerWest, y0, yTop);
      return b;
    });
  }

  if (room.northOff > 0.5 && room.doors.innerNorth) {
    put(`in,${room.cx},${room.cz}`, () => {
      const b = [];
      const x0 = ox + room.westOff;
      const x1 = ox + CHUNK;
      wallAlongZ(b, oz + room.northOff, (x0 + x1) / 2, (x1 - x0) / 2, room.doors.innerNorth, y0, yTop);
      return b;
    });
  }
}

export function collidersFromMap(map) {
  const out = [];
  for (const boxes of map.values()) out.push(...boxes);
  return out;
}
