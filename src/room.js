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

/** Shared doorway — position & width identical on both sides */
export function getSharedDoor(cx0, cz0, cx1, cz1, span) {
  const ax = Math.min(cx0, cx1);
  const az = Math.min(cz0, cz1);
  const bx = Math.max(cx0, cx1);
  const bz = Math.max(cz0, cz1);
  const rng = createRng(ax, az, bx, bz, 42);
  const maxW = span * 0.55;
  const width = Math.min(rng.pick([1.6, 2.0, 2.4, 2.8, 3.2]), maxW);
  const maxOff = span / 2 - width / 2 - 0.45;
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
    const maxOff = span / 2 - w / 2 - 0.35;
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
      innerWest: westOff > 0.5 ? innerDoor(depth - northOff) : null,
      innerNorth: northOff > 0.5 ? innerDoor(width - westOff) : null,
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
  const dc = x0 + door.offset;
  const half = door.width / 2 + DOOR_CLEAR;
  const lo = dc - half;
  const hi = dc + half;
  addBox(boxes, x0 - span, lo, z - t, z + t, y0, y0 + DOOR_H);
  addBox(boxes, hi, x0 + span, z - t, z + t, y0, y0 + DOOR_H);
  addBox(boxes, x0 - span, x0 + span, z - t, z + t, y0 + DOOR_H, yTop);
}

function wallAlongX(boxes, x, z0, span, door, y0, yTop) {
  const t = WALL_T;
  const dc = z0 + door.offset;
  const half = door.width / 2 + DOOR_CLEAR;
  const lo = dc - half;
  const hi = dc + half;
  addBox(boxes, x - t, x + t, z0 - span, lo, y0, y0 + DOOR_H);
  addBox(boxes, x - t, x + t, hi, z0 + span, y0, y0 + DOOR_H);
  addBox(boxes, x - t, x + t, z0 - span, z0 + span, y0 + DOOR_H, yTop);
}

export function registerRoomWalls(map, room) {
  const ox = room.cx * CHUNK;
  const oz = room.cz * CHUNK;
  const y0 = 0;
  const yTop = room.height;
  const hw = CHUNK / 2;

  const put = (key, fn) => {
    if (!map.has(key)) map.set(key, fn());
  };

  put(`n,${room.cx},${room.cz - 1}`, () => {
    const b = [];
    wallAlongZ(b, oz, ox, hw, room.doors.north, y0, yTop);
    return b;
  });
  put(`s,${room.cx},${room.cz}`, () => {
    const b = [];
    wallAlongZ(b, oz + CHUNK, ox, hw, room.doors.south, y0, yTop);
    return b;
  });
  put(`e,${room.cx},${room.cz}`, () => {
    const b = [];
    wallAlongX(b, ox + CHUNK, oz, hw, room.doors.east, y0, yTop);
    return b;
  });
  put(`w,${room.cx - 1},${room.cz}`, () => {
    const b = [];
    wallAlongX(b, ox, oz, hw, room.doors.west, y0, yTop);
    return b;
  });

  if (room.doors.innerWest) {
    put(`iw,${room.cx},${room.cz}`, () => {
      const b = [];
      const wallX = ox + room.westOff;
      const z0 = oz + room.northOff;
      const z1 = oz + CHUNK;
      wallAlongX(b, wallX, (z0 + z1) / 2, (z1 - z0) / 2, room.doors.innerWest, y0, yTop);
      return b;
    });
  }

  if (room.doors.innerNorth) {
    put(`in,${room.cx},${room.cz}`, () => {
      const b = [];
      const wallZ = oz + room.northOff;
      const x0 = ox + room.westOff;
      const x1 = ox + CHUNK;
      wallAlongZ(b, wallZ, (x0 + x1) / 2, (x1 - x0) / 2, room.doors.innerNorth, y0, yTop);
      return b;
    });
  }
}

export function collidersFromMap(map) {
  const out = [];
  for (const boxes of map.values()) out.push(...boxes);
  return out;
}
