import {
  generateChunk,
  buildStairShaft,
  cellOf,
  getFloorLabel,
  CELL,
  HW,
  FLOOR_STEP,
  WALL_THICK,
  DOOR_CLEARANCE,
} from "./generator.js";
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

function wallAlongZ(boxes, z, xCenter, span, door, y0, yTop) {
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

function wallAlongX(boxes, x, zCenter, span, door, y0, yTop) {
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
    wallAlongZ(b, oz + HW, ox, HW, room.doors.south, y0, yTop);
    return b;
  });
  put(`h,${room.cx},${room.cz - 1}`, () => {
    const b = [];
    wallAlongZ(b, oz - HW, ox, HW, room.doors.north, y0, yTop);
    return b;
  });
  put(`v,${room.cx},${room.cz}`, () => {
    const b = [];
    wallAlongX(b, ox + HW, oz, HW, room.doors.east, y0, yTop);
    return b;
  });
  put(`v,${room.cx - 1},${room.cz}`, () => {
    const b = [];
    wallAlongX(b, ox - HW, oz, HW, room.doors.west, y0, yTop);
    return b;
  });
}

export function buildCollidersFromEdges(edgeMap) {
  const boxes = [];
  for (const segs of edgeMap.values()) boxes.push(...segs);
  return boxes;
}

export function registerDecorColliders(boxes, room) {
  const d = room.shape?.decor;
  if (!d || d.type === "none" || d.type === "mat") return;

  const ox = room.cx * CELL;
  const oz = room.cz * CELL;
  const y0 = room.floorLevel * FLOOR_STEP;
  const t = WALL_THICK;

  if (d.type === "pillars") {
    for (const p of d.posts) {
      addBox(boxes, ox + p.x - 0.23, ox + p.x + 0.23, oz + p.z - 0.23, oz + p.z + 0.23, y0, y0 + room.height);
    }
  }

  if (d.type === "corner") {
    const hw = d.w / 2;
    const hd = d.d / 2;
    const wx = ox + d.x;
    const wz = oz + d.z;
    addBox(boxes, wx - hw, wx + hw, wz - hd - t, wz - hd + t, y0, y0 + room.height * 0.5);
    addBox(boxes, wx - hw - t, wx - hw + t, wz - hd, wz + hd, y0, y0 + room.height * 0.5);
  }

  if (d.type === "cross") {
    const h = room.height * 0.35;
    addBox(boxes, ox - d.len, ox + d.len, oz - t, oz + t, y0, y0 + h);
    addBox(boxes, ox - t, ox + t, oz - d.len, oz + d.len, y0, y0 + h);
  }

  if (d.type === "island") {
    const h = room.height * 0.85;
    const wx = ox + d.x;
    const wz = oz + d.z;
    const hw = d.w / 2;
    const hd = d.d / 2;
    addBox(boxes, wx - hw, wx + hw, wz - t, wz + t, y0, y0 + h);
    addBox(boxes, wx - hw, wx + hw, wz + d.d - t, wz + d.d + t, y0, y0 + h);
    addBox(boxes, wx - hw - t, wx - hw + t, wz, wz + d.d, y0, y0 + h);
    addBox(boxes, wx + hw - t, wx + hw + t, wz, wz + d.d, y0, y0 + h);
  }
}

export { buildStairShaft as buildStairVolume } from "./generator.js";
