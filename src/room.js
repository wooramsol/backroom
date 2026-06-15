import { createRng } from "./rng.js";
import {
  CHUNK,
  WALL_T,
  DOOR_H,
  DOOR_CLEAR,
  MIN_ROOM_H,
  MAX_ROOM_H,
} from "./constants.js";

export { CHUNK };
export const CELL = CHUNK;
export const HW = CHUNK / 2;

export function getSharedDoor(cx0, cz0, cx1, cz1) {
  const ax = Math.min(cx0, cx1);
  const az = Math.min(cz0, cz1);
  const bx = Math.max(cx0, cx1);
  const bz = Math.max(cz0, cz1);
  const rng = createRng(ax, az, bx, bz, 42);
  const width = rng.pick([2.0, 2.4, 2.8, 3.2]);
  const maxOff = Math.max(0, CHUNK / 2 - width / 2 - 0.5);
  // Door must include room center (spawn) so exits are never blocked invisibly
  const centerClear = width / 2 + DOOR_CLEAR - 0.1;
  const cap = Math.min(maxOff, centerClear);
  return {
    width,
    offset: rng.range(-cap, cap),
  };
}

export function generateRoom(cx, cz) {
  const rng = createRng(cx, cz, 7);
  return {
    cx,
    cz,
    height: rng.range(MIN_ROOM_H, MAX_ROOM_H),
    doors: {
      north: getSharedDoor(cx, cz, cx, cz - 1),
      south: getSharedDoor(cx, cz, cx, cz + 1),
      east: getSharedDoor(cx, cz, cx + 1, cz),
      west: getSharedDoor(cx, cz, cx - 1, cz),
    },
    lightSeed: rng.int(0, 99999),
    flicker: rng.range(0, Math.PI * 2),
    // Visual variety — ceiling light density
    lightSpacing: rng.pick([2.2, 2.5, 2.8]),
  };
}

function addBox(out, minX, maxX, minZ, maxZ, minY, maxY) {
  if (maxX - minX < 0.04 || maxZ - minZ < 0.04 || maxY - minY < 0.04) return;
  out.push({ minX, maxX, minZ, maxZ, minY, maxY });
}

function wallAlongZ(boxes, z, x0, x1, door, y0, yTop) {
  const t = WALL_T;
  const mid = (x0 + x1) / 2 + door.offset;
  const half = door.width / 2 + DOOR_CLEAR;
  const lo = mid - half;
  const hi = mid + half;
  addBox(boxes, x0, lo, z - t, z + t, y0, y0 + DOOR_H);
  addBox(boxes, hi, x1, z - t, z + t, y0, y0 + DOOR_H);
  addBox(boxes, x0, x1, z - t, z + t, y0 + DOOR_H, yTop);
}

function wallAlongX(boxes, x, z0, z1, door, y0, yTop) {
  const t = WALL_T;
  const mid = (z0 + z1) / 2 + door.offset;
  const half = door.width / 2 + DOOR_CLEAR;
  const lo = mid - half;
  const hi = mid + half;
  addBox(boxes, x - t, x + t, z0, lo, y0, y0 + DOOR_H);
  addBox(boxes, x - t, x + t, hi, z1, y0, y0 + DOOR_H);
  addBox(boxes, x - t, x + t, z0, z1, y0 + DOOR_H, yTop);
}

export function registerRoomWalls(map, room) {
  const ox = room.cx * CHUNK;
  const oz = room.cz * CHUNK;
  const y0 = 0;
  const yTop = room.height;
  const x0 = ox;
  const x1 = ox + CHUNK;
  const z0 = oz;
  const z1 = oz + CHUNK;

  const put = (key, fn) => {
    if (!map.has(key)) map.set(key, fn());
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
}

export function collidersFromMap(map) {
  const out = [];
  for (const boxes of map.values()) out.push(...boxes);
  return out;
}
