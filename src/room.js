import { createRng } from "./rng.js";
import {
  CELL,
  HW,
  WALL_T,
  DOOR_H,
  DOOR_CLEAR,
  MIN_ROOM_H,
  MAX_ROOM_H,
} from "./constants.js";

export { CELL, HW };

/** Same doorway on both sides of a shared wall */
export function getSharedDoor(cx0, cz0, cx1, cz1) {
  const ax = Math.min(cx0, cx1);
  const az = Math.min(cz0, cz1);
  const bx = Math.max(cx0, cx1);
  const bz = Math.max(cz0, cz1);
  const rng = createRng(ax, az, bx, bz, 42);
  return {
    width: rng.pick([1.9, 2.3, 2.7]),
    offset: rng.range(-1.8, 1.8),
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
  };
}

function addBox(out, minX, maxX, minZ, maxZ, minY, maxY) {
  if (maxX - minX < 0.04 || maxZ - minZ < 0.04 || maxY - minY < 0.04) return;
  out.push({ minX, maxX, minZ, maxZ, minY, maxY });
}

function wallAlongZ(boxes, z, x0, span, door, y0, yTop) {
  const t = WALL_T;
  const cx = x0;
  const dc = cx + door.offset;
  const half = door.width / 2 + DOOR_CLEAR;
  const lo = dc - half;
  const hi = dc + half;
  addBox(boxes, cx - span, lo, z - t, z + t, y0, y0 + DOOR_H);
  addBox(boxes, hi, cx + span, z - t, z + t, y0, y0 + DOOR_H);
  addBox(boxes, cx - span, cx + span, z - t, z + t, y0 + DOOR_H, yTop);
}

function wallAlongX(boxes, x, z0, span, door, y0, yTop) {
  const t = WALL_T;
  const cz = z0;
  const dc = cz + door.offset;
  const half = door.width / 2 + DOOR_CLEAR;
  const lo = dc - half;
  const hi = dc + half;
  addBox(boxes, x - t, x + t, cz - span, lo, y0, y0 + DOOR_H);
  addBox(boxes, x - t, x + t, hi, cz + span, y0, y0 + DOOR_H);
  addBox(boxes, x - t, x + t, cz - span, cz + span, y0 + DOOR_H, yTop);
}

export function registerRoomWalls(map, room) {
  const ox = room.cx * CELL;
  const oz = room.cz * CELL;
  const y0 = 0;
  const yTop = room.height;

  const put = (key, fn) => {
    if (!map.has(key)) map.set(key, fn());
  };

  put(`s,${room.cx},${room.cz}`, () => {
    const b = [];
    wallAlongZ(b, oz + HW, ox, HW, room.doors.south, y0, yTop);
    return b;
  });
  put(`n,${room.cx},${room.cz - 1}`, () => {
    const b = [];
    wallAlongZ(b, oz - HW, ox, HW, room.doors.north, y0, yTop);
    return b;
  });
  put(`e,${room.cx},${room.cz}`, () => {
    const b = [];
    wallAlongX(b, ox + HW, oz, HW, room.doors.east, y0, yTop);
    return b;
  });
  put(`w,${room.cx - 1},${room.cz}`, () => {
    const b = [];
    wallAlongX(b, ox - HW, oz, HW, room.doors.west, y0, yTop);
    return b;
  });
}

export function collidersFromMap(map) {
  const out = [];
  for (const boxes of map.values()) out.push(...boxes);
  return out;
}
