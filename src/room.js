import { createRng } from "./rng.js";
import {
  CHUNK,
  WALL_T,
  DOOR_H,
  ROOM_H,
  MIN_ROOM_W,
  MAX_ROOM_W,
  MIN_ROOM_D,
  MAX_ROOM_D,
  PANEL_ON_CHANCE,
  PANEL_EDGE_INSET,
  PANEL_W,
  PANEL_H,
} from "./constants.js";

export { CHUNK };
export const CELL = CHUNK;
export const HW = CHUNK / 2;

function fract(n) {
  return n - Math.floor(n);
}

function generatePanels(rng, room) {
  const hash = (x) => fract(Math.sin(x * 12.9898 + room.lightSeed) * 43758.5453);
  const spacing = room.lightSpacing;
  const panels = [];

  const xLo = room.westOff + PANEL_EDGE_INSET;
  const xHi = CHUNK - PANEL_EDGE_INSET;
  const zLo = room.northOff + PANEL_EDGE_INSET;
  const zHi = CHUNK - PANEL_EDGE_INSET;
  if (xHi - xLo < PANEL_W || zHi - zLo < PANEL_H) return panels;

  for (let x = xLo + spacing / 2; x < xHi; x += spacing) {
    for (let z = zLo + spacing / 2; z < zHi; z += spacing) {
      if (hash(x * 3.1 + z) < 0.28) continue;
      panels.push({
        x,
        z,
        on: rng.chance(PANEL_ON_CHANCE),
        phase: rng.range(0, Math.PI * 2),
        bright: 0.92 + hash(z) * 0.12,
      });
    }
  }
  return panels;
}

export function getSharedDoor(cx0, cz0, cx1, cz1) {
  const ax = Math.min(cx0, cx1);
  const az = Math.min(cz0, cz1);
  const bx = Math.max(cx0, cx1);
  const bz = Math.max(cz0, cz1);
  const rng = createRng(ax, az, bx, bz, 42);
  const width = rng.pick([2.0, 2.4, 2.8, 3.2]);
  const maxOff = Math.max(0, CHUNK / 2 - width / 2 - 0.5);
  const centerClear = width / 2 + 0.38;
  const cap = Math.min(maxOff, centerClear);
  return {
    width,
    offset: rng.range(-cap, cap),
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

  const room = {
    cx,
    cz,
    width,
    depth,
    westOff,
    northOff,
    height: ROOM_H,
    doors: {
      north: getSharedDoor(cx, cz, cx, cz - 1),
      south: getSharedDoor(cx, cz, cx, cz + 1),
      east: getSharedDoor(cx, cz, cx + 1, cz),
      west: getSharedDoor(cx, cz, cx - 1, cz),
      innerWest: westOff > 0.5 ? innerDoor(CHUNK - northOff) : null,
      innerNorth: northOff > 0.5 ? innerDoor(CHUNK - westOff) : null,
    },
    lightSeed: rng.int(0, 99999),
    lightSpacing: rng.pick([3.8, 4.2, 4.6]),
  };
  room.panels = generatePanels(rng, room);
  room.litRatio =
    room.panels.length > 0 ? room.panels.filter((p) => p.on).length / room.panels.length : 0;
  return room;
}

/** 0–1 brightness from how many ceiling panels are on in this room */
export function roomLitStrength(room) {
  return room.litRatio ?? 0;
}

function addBox(out, minX, maxX, minZ, maxZ, minY, maxY) {
  if (maxX - minX < 0.04 || maxZ - minZ < 0.04 || maxY - minY < 0.04) return;
  out.push({ minX, maxX, minZ, maxZ, minY, maxY });
}

function wallAlongZ(boxes, z, x0, x1, door, y0, yTop) {
  const t = WALL_T;
  const mid = (x0 + x1) / 2 + door.offset;
  // Match visible mesh opening — DOOR_CLEAR was only for offset RNG, not gap size
  const half = door.width / 2 + 0.02;
  const lo = mid - half;
  const hi = mid + half;
  addBox(boxes, x0, lo, z - t, z + t, y0, y0 + DOOR_H);
  addBox(boxes, hi, x1, z - t, z + t, y0, y0 + DOOR_H);
  addBox(boxes, x0, x1, z - t, z + t, y0 + DOOR_H, yTop);
}

function wallAlongX(boxes, x, z0, z1, door, y0, yTop) {
  const t = WALL_T;
  const mid = (z0 + z1) / 2 + door.offset;
  const half = door.width / 2 + 0.02;
  const lo = mid - half;
  const hi = mid + half;
  addBox(boxes, x - t, x + t, z0, lo, y0, y0 + DOOR_H);
  addBox(boxes, x - t, x + t, hi, z1, y0, y0 + DOOR_H);
  addBox(boxes, x - t, x + t, z0, z1, y0 + DOOR_H, yTop);
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

  if (room.westOff > 0.5 && room.doors.innerWest) {
    put(`iw,${room.cx},${room.cz}`, () => {
      const b = [];
      wallAlongX(b, ox + room.westOff, oz + room.northOff, oz + CHUNK, room.doors.innerWest, y0, yTop);
      return b;
    });
  }

  if (room.northOff > 0.5 && room.doors.innerNorth) {
    put(`in,${room.cx},${room.cz}`, () => {
      const b = [];
      wallAlongZ(b, oz + room.northOff, ox + room.westOff, ox + CHUNK, room.doors.innerNorth, y0, yTop);
      return b;
    });
  }

  return added;
}

export function registerRoomWalls(map, room) {
  appendRoomWalls(map, room);
}

export function collidersFromMap(map) {
  const out = [];
  for (const boxes of map.values()) out.push(...boxes);
  return out;
}
