import { createRng } from "./rng.js";
import { generateShape, getEdges } from "./shapes.js";

export const CELL = 10;
export const HW = CELL / 2;
export const ROOM_H = 2.8;
export const BASEMENT_H = 2.6;
export const FLOOR_STEP = 3.0;
export const DOOR_H = 2.25;
export const DOOR_W = 2.6;
export const WALL_THICK = 0.15;
export const DOOR_CLEARANCE = 0.4;

export function getEdgeDoor(x0, z0, x1, z1, floor) {
  return {
    width: DOOR_W,
    height: DOOR_H,
    open: false,
  };
}

export function cellOf(pos) {
  return {
    x: Math.floor((pos.x + HW) / CELL),
    z: Math.floor((pos.z + HW) / CELL),
  };
}

export function generateRoom(cx, cz, floorLevel) {
  const rng = createRng(cx, cz, floorLevel);
  const shape = generateShape(rng);

  let feature = null;
  if (cx === 0 && cz === 0 && floorLevel === 0) feature = "stairs_south";
  if (cx === 0 && cz === 0 && floorLevel === -1) feature = "stairs_north";

  const doors = {
    north: getEdgeDoor(cx, cz, cx, cz - 1, floorLevel),
    south: getEdgeDoor(cx, cz, cx, cz + 1, floorLevel),
    east: getEdgeDoor(cx, cz, cx + 1, cz, floorLevel),
    west: getEdgeDoor(cx, cz, cx - 1, cz, floorLevel),
  };

  if (feature === "stairs_south") doors.south = { width: 3.2, height: DOOR_H, open: true };
  if (feature === "stairs_north") doors.north = { width: 3.2, height: DOOR_H, open: true };

  return {
    cx,
    cz,
    floorLevel,
    shape,
    height: floorLevel < 0 ? BASEMENT_H : ROOM_H,
    doors,
    edges: getEdges(shape.verts),
    feature,
    isBasement: floorLevel < 0,
  };
}

function addBox(boxes, minX, maxX, minZ, maxZ, minY, maxY) {
  if (maxX - minX < 0.05 || maxZ - minZ < 0.05 || maxY - minY < 0.05) return;
  boxes.push({ minX, maxX, minZ, maxZ, minY, maxY });
}

function doorGap(center, door, span) {
  const half = door.width / 2 + DOOR_CLEARANCE;
  return { lo: center - half, hi: center + half, clampLo: center - span, clampHi: center + span };
}

function wallAlongZ(boxes, z, xCenter, span, door, y0, yTop, open) {
  if (open) return;
  const t = WALL_THICK;
  const gap = doorGap(xCenter, door, span);
  const lo = Math.max(gap.clampLo, gap.lo);
  const hi = Math.min(gap.clampHi, gap.hi);
  addBox(boxes, xCenter - span, lo, z - t, z + t, y0, y0 + door.height);
  addBox(boxes, hi, xCenter + span, z - t, z + t, y0, y0 + door.height);
  addBox(boxes, xCenter - span, xCenter + span, z - t, z + t, y0 + door.height, yTop);
}

function wallAlongX(boxes, x, zCenter, span, door, y0, yTop, open) {
  if (open) return;
  const t = WALL_THICK;
  const gap = doorGap(zCenter, door, span);
  const lo = Math.max(gap.clampLo, gap.lo);
  const hi = Math.min(gap.clampHi, gap.hi);
  addBox(boxes, x - t, x + t, zCenter - span, lo, y0, y0 + door.height);
  addBox(boxes, x - t, x + t, hi, zCenter + span, y0, y0 + door.height);
  addBox(boxes, x - t, x + t, zCenter - span, zCenter + span, y0 + door.height, yTop);
}

export function registerRoomEdges(edgeMap, room) {
  const ox = room.cx * CELL;
  const oz = room.cz * CELL;
  const y0 = room.floorLevel * FLOOR_STEP;
  const yTop = y0 + room.height;

  const put = (key, fn) => {
    if (!edgeMap.has(key)) edgeMap.set(key, fn());
  };

  put(`h,${room.cx},${room.cz}`, () => {
    const boxes = [];
    wallAlongZ(boxes, oz + HW, ox, HW, room.doors.south, y0, yTop, room.doors.south.open);
    return boxes;
  });

  put(`h,${room.cx},${room.cz - 1}`, () => {
    const boxes = [];
    wallAlongZ(boxes, oz - HW, ox, HW, room.doors.north, y0, yTop, room.doors.north.open);
    return boxes;
  });

  put(`v,${room.cx},${room.cz}`, () => {
    const boxes = [];
    wallAlongX(boxes, ox + HW, oz, HW, room.doors.east, y0, yTop, room.doors.east.open);
    return boxes;
  });

  put(`v,${room.cx - 1},${room.cz}`, () => {
    const boxes = [];
    wallAlongX(boxes, ox - HW, oz, HW, room.doors.west, y0, yTop, room.doors.west.open);
    return boxes;
  });
}

export function buildCollidersFromEdges(edgeMap) {
  const boxes = [];
  for (const segs of edgeMap.values()) boxes.push(...segs);
  return boxes;
}

export function buildStairVolume(room) {
  if (!room.feature) return null;
  const ox = room.cx * CELL;
  const oz = room.cz * CELL;
  const y0 = room.floorLevel * FLOOR_STEP;
  const down = room.feature === "stairs_south";

  return {
    cx: ox,
    cz: down ? oz + 2.5 : oz - 2.5,
    dirX: 0,
    dirZ: down ? 1 : -1,
    width: 3,
    depth: 3,
    fromY: y0,
    toY: (room.floorLevel + (down ? -1 : 1)) * FLOOR_STEP,
    targetFloor: room.floorLevel + (down ? -1 : 1),
    sourceFloor: room.floorLevel,
    label: down ? "지하로 내려가기 (W)" : "위로 올라가기 (W)",
  };
}
