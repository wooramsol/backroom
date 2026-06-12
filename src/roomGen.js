import { createRng } from "./rng.js";

export const CELL = 10;
export const HW = CELL / 2;
export const ROOM_H = 2.8;
export const BASEMENT_H = 2.6;
export const FLOOR_STEP = 3.0;
export const DOOR_H = 2.25;
export const WALL_THICK = 0.15;
export const DOOR_CLEARANCE = 0.35;

const STYLES = ["standard", "lobby", "storage", "hall", "columns"];

export function getEdgeDoor(x0, z0, x1, z1, floor) {
  const key = `${Math.min(x0, x1)},${Math.min(z0, z1)},${Math.max(x0, x1)},${Math.max(z0, z1)},${floor}`;
  const rng = createRng(...key.split(",").map(Number));
  return {
    width: rng.pick([2.2, 2.4, 2.6]),
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
  const style = rng.pick(STYLES);

  let feature = null;
  if (cx === 0 && cz === 0 && floorLevel === 0) feature = "stairs_south";
  if (cx === 0 && cz === 0 && floorLevel === -1) feature = "stairs_north";

  const doors = {
    north: getEdgeDoor(cx, cz, cx, cz - 1, floorLevel),
    south: getEdgeDoor(cx, cz, cx, cz + 1, floorLevel),
    east: getEdgeDoor(cx, cz, cx + 1, cz, floorLevel),
    west: getEdgeDoor(cx, cz, cx - 1, cz, floorLevel),
  };

  if (feature === "stairs_south") doors.south = { width: 2.8, height: DOOR_H, open: true };
  if (feature === "stairs_north") doors.north = { width: 2.8, height: DOOR_H, open: true };

  return {
    cx,
    cz,
    floorLevel,
    style,
    height: floorLevel < 0 ? BASEMENT_H : ROOM_H,
    doors,
    interior: buildInterior(style, rng),
    feature,
    isBasement: floorLevel < 0,
  };
}

function buildInterior(style, rng) {
  switch (style) {
    case "lobby":
      return { type: "mat", size: rng.range(3, 5) };
    case "storage":
      return {
        type: "partition",
        walls: [{ axis: "z", z: -2.5, x0: -2, x1: 2 }],
      };
    case "hall":
      return {
        type: "partition",
        walls: [{ axis: "z", z: 0, x0: -3, x1: 3, door: true }],
      };
    case "columns":
      return { type: "columns", posts: [{ x: -2.2, z: 0 }, { x: 2.2, z: 0 }] };
    default:
      return rng.chance(0.3)
        ? {
            type: "partition",
            walls: [
              {
                axis: rng.pick(["x", "z"]),
                ...(rng.chance(0.5)
                  ? { z: 0, x0: -2, x1: 2, door: true }
                  : { x: 1.5, z0: -2, z1: 2 }),
              },
            ],
          }
        : { type: "open" };
  }
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

function interiorBoxes(boxes, room, y0, yTop) {
  for (const p of room.interior.walls || []) {
    if (p.axis === "z") {
      const z = room.cz * CELL + p.z;
      const x0 = room.cx * CELL + p.x0;
      const x1 = room.cx * CELL + p.x1;
      if (p.door) {
        const mid = (x0 + x1) / 2;
        const dw = 1.1;
        addBox(boxes, x0, mid - dw, z - WALL_THICK, z + WALL_THICK, y0, y0 + DOOR_H);
        addBox(boxes, mid + dw, x1, z - WALL_THICK, z + WALL_THICK, y0, y0 + DOOR_H);
        addBox(boxes, x0, x1, z - WALL_THICK, z + WALL_THICK, y0 + DOOR_H, yTop);
      } else {
        addBox(boxes, x0, x1, z - WALL_THICK, z + WALL_THICK, y0, yTop);
      }
    } else {
      const x = room.cx * CELL + p.x;
      const z0 = room.cz * CELL + p.z0;
      const z1 = room.cz * CELL + p.z1;
      if (p.door) {
        const mid = (z0 + z1) / 2;
        const dw = 1.1;
        addBox(boxes, x - WALL_THICK, x + WALL_THICK, z0, mid - dw, y0, y0 + DOOR_H);
        addBox(boxes, x - WALL_THICK, x + WALL_THICK, mid + dw, z1, y0, y0 + DOOR_H);
        addBox(boxes, x - WALL_THICK, x + WALL_THICK, z0, z1, y0 + DOOR_H, yTop);
      } else {
        addBox(boxes, x - WALL_THICK, x + WALL_THICK, z0, z1, y0, yTop);
      }
    }
  }
}

/** Register all 4 edges; dedupe by edge key in world. */
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

export function buildCollidersFromEdges(edgeMap, rooms) {
  const boxes = [];
  for (const segs of edgeMap.values()) boxes.push(...segs);
  for (const room of rooms) {
    const y0 = room.floorLevel * FLOOR_STEP;
    interiorBoxes(boxes, room, y0, y0 + room.height);
  }
  return boxes;
}

export function buildStairVolume(room) {
  if (!room.feature) return null;
  const ox = room.cx * CELL;
  const oz = room.cz * CELL;
  const y0 = room.floorLevel * FLOOR_STEP;
  const down = room.feature === "stairs_south";

  return {
    type: down ? "down" : "up",
    cx: ox,
    cz: down ? oz + HW - 2 : oz - HW + 2,
    dirX: 0,
    dirZ: down ? 1 : -1,
    width: 2.6,
    depth: 3.5,
    fromY: y0,
    toY: (room.floorLevel + (down ? -1 : 1)) * FLOOR_STEP,
    targetFloor: room.floorLevel + (down ? -1 : 1),
    sourceFloor: room.floorLevel,
  };
}
