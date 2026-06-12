import { generateChunk, buildStairShaft, cellOf, getFloorLabel } from "./generator.js";
import { getEdges } from "./shapes.js";

export {
  MIN_FLOOR,
  MAX_FLOOR,
  CELL,
  HW,
  ROOM_H,
  BASEMENT_H,
  FLOOR_STEP,
  DOOR_H,
  DOOR_CLEARANCE,
  WALL_THICK,
  cellOf,
  getFloorLabel,
} from "./generator.js";

export function generateRoom(cx, cz, floorLevel) {
  const chunk = generateChunk(cx, cz, floorLevel);
  const verts = [
    [-HW + 0.1, -HW + 0.1],
    [HW - 0.1, -HW + 0.1],
    [HW - 0.1, HW - 0.1],
    [-HW + 0.1, HW - 0.1],
  ];

  return {
    ...chunk,
    shape: { type: "cell", verts, decor: chunk.decor },
    edges: getEdges(verts),
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
  if (!door) {
    addBox(boxes, xCenter - span, xCenter + span, z - t, z + t, y0, yTop);
    return;
  }
  const dc = xCenter + (door.offset || 0);
  const gap = doorGap(dc, door, span);
  const lo = Math.max(gap.clampLo, gap.lo);
  const hi = Math.min(gap.clampHi, gap.hi);
  addBox(boxes, xCenter - span, lo, z - t, z + t, y0, y0 + door.height);
  addBox(boxes, hi, xCenter + span, z - t, z + t, y0, y0 + door.height);
  addBox(boxes, xCenter - span, xCenter + span, z - t, z + t, y0 + door.height, yTop);
}

function wallAlongX(boxes, x, zCenter, span, door, y0, yTop, open) {
  if (open) return;
  const t = WALL_THICK;
  if (!door) {
    addBox(boxes, x - t, x + t, zCenter - span, zCenter + span, y0, yTop);
    return;
  }
  const dc = zCenter + (door.offset || 0);
  const gap = doorGap(dc, door, span);
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
    const b = [];
    wallAlongZ(b, oz + HW, ox, HW, room.doors.south, y0, yTop, room.doors.south?.open);
    return b;
  });
  put(`h,${room.cx},${room.cz - 1}`, () => {
    const b = [];
    wallAlongZ(b, oz - HW, ox, HW, room.doors.north, y0, yTop, room.doors.north?.open);
    return b;
  });
  put(`v,${room.cx},${room.cz}`, () => {
    const b = [];
    wallAlongX(b, ox + HW, oz, HW, room.doors.east, y0, yTop, room.doors.east?.open);
    return b;
  });
  put(`v,${room.cx - 1},${room.cz}`, () => {
    const b = [];
    wallAlongX(b, ox - HW, oz, HW, room.doors.west, y0, yTop, room.doors.west?.open);
    return b;
  });
}

export function buildCollidersFromEdges(edgeMap) {
  const boxes = [];
  for (const segs of edgeMap.values()) boxes.push(...segs);
  return boxes;
}

export { buildStairShaft as buildStairVolume } from "./generator.js";
