import { createRng } from "./rng.js";

export const CELL = 10;
export const HW = CELL / 2;
export const ROOM_H = 2.8;
export const BASEMENT_H = 2.6;
export const FLOOR_STEP = 3.0;
export const DOOR_H = 2.25;
export const WALL_THICK = 0.15;

const STYLES = ["standard", "wide", "narrow", "lobby", "storage", "hall"];

/** Shared door for an edge — both adjacent rooms use the same values. */
export function getEdgeDoor(x0, z0, x1, z1, floor) {
  const key = `${Math.min(x0, x1)},${Math.min(z0, z1)},${Math.max(x0, x1)},${Math.max(z0, z1)},${floor}`;
  const rng = createRng(...key.split(",").map(Number));
  return {
    width: rng.range(1.8, 2.8),
    offset: rng.chance(0.3) ? rng.range(-1.0, 1.0) : 0,
    height: DOOR_H,
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

  if (feature === "stairs_south") doors.south = { width: 2.6, offset: 0, height: DOOR_H, open: true };
  if (feature === "stairs_north") doors.north = { width: 2.6, offset: 0, height: DOOR_H, open: true };

  const interior = buildInterior(style, rng);

  return {
    cx,
    cz,
    floorLevel,
    style,
    height: floorLevel < 0 ? BASEMENT_H : ROOM_H,
    doors,
    interior,
    feature,
    isBasement: floorLevel < 0,
  };
}

function buildInterior(style, rng) {
  switch (style) {
    case "wide":
      return { type: "open", scale: rng.range(0.85, 1.0) };
    case "narrow":
      return { type: "columns", posts: [{ x: -2, z: 0 }, { x: 2, z: 0 }] };
    case "lobby":
      return { type: "mat", size: rng.range(3, 5) };
    case "storage":
      return {
        type: "partition",
        walls: [{ x1: -1, z1: -3, x2: 3, z2: -3, axis: "z" }],
      };
    case "hall":
      return {
        type: "partition",
        walls: [
          { x1: -3.5, z1: 0, x2: 3.5, z2: 0, axis: "z", door: true },
        ],
      };
    default:
      return rng.chance(0.35)
        ? {
            type: "partition",
            walls: [
              {
                x1: rng.range(-2, 0),
                z1: rng.range(-2, 2),
                x2: rng.range(1, 3),
                z2: rng.range(-2, 2),
                axis: rng.pick(["x", "z"]),
                door: true,
              },
            ],
          }
        : { type: "open" };
  }
}

function doorGap(center, door, halfSpan) {
  const dw = door.width / 2 + 0.15;
  const c = center + (door.offset || 0);
  return { min: c - dw, max: c + dw, clampMin: -halfSpan, clampMax: halfSpan };
}

function addBox(boxes, minX, maxX, minZ, maxZ, minY, maxY) {
  if (maxX - minX < 0.05 || maxZ - minZ < 0.05 || maxY - minY < 0.05) return;
  boxes.push({ minX, maxX, minZ, maxZ, minY, maxY });
}

/** Horizontal wall at fixed Z (north/south). Door slides along X. */
function wallAlongZ(boxes, z, xCenter, span, door, y0, yTop, open) {
  const t = WALL_THICK;
  if (open) return;
  const gap = doorGap(xCenter, door, span);
  const g0 = Math.max(-span, gap.min);
  const g1 = Math.min(span, gap.max);

  addBox(boxes, xCenter - span, g0, z - t, z + t, y0, y0 + door.height);
  addBox(boxes, g1, xCenter + span, z - t, z + t, y0, y0 + door.height);
  addBox(boxes, xCenter - span, xCenter + span, z - t, z + t, y0 + door.height, yTop);
}

/** Vertical wall at fixed X (east/west). Door slides along Z. */
function wallAlongX(boxes, x, zCenter, span, door, y0, yTop, open) {
  const t = WALL_THICK;
  if (open) return;
  const gap = doorGap(zCenter, door, span);
  const g0 = Math.max(-span, gap.min);
  const g1 = Math.min(span, gap.max);

  addBox(boxes, x - t, x + t, zCenter - span, g0, y0, y0 + door.height);
  addBox(boxes, x - t, x + t, g1, zCenter + span, y0, y0 + door.height);
  addBox(boxes, x - t, x + t, zCenter - span, zCenter + span, y0 + door.height, yTop);
}

/**
 * Each cell owns SOUTH and EAST walls only → every edge has exactly one collider.
 */
export function buildColliders(room) {
  const ox = room.cx * CELL;
  const oz = room.cz * CELL;
  const y0 = room.floorLevel * FLOOR_STEP;
  const yTop = y0 + room.height;
  const boxes = [];

  wallAlongZ(boxes, oz + HW, ox, HW, room.doors.south, y0, yTop, room.doors.south.open);
  wallAlongX(boxes, ox + HW, oz, HW, room.doors.east, y0, yTop, room.doors.east.open);

  for (const p of room.interior.walls || []) {
    if (p.axis === "z") {
      const z = oz + p.z1;
      const x0 = ox + Math.min(p.x1, p.x2);
      const x1 = ox + Math.max(p.x1, p.x2);
      if (p.door) {
        const mid = (x0 + x1) / 2;
        const dw = 1.0;
        addBox(boxes, x0, mid - dw, z - WALL_THICK, z + WALL_THICK, y0, y0 + DOOR_H);
        addBox(boxes, mid + dw, x1, z - WALL_THICK, z + WALL_THICK, y0, y0 + DOOR_H);
        addBox(boxes, x0, x1, z - WALL_THICK, z + WALL_THICK, y0 + DOOR_H, yTop);
      } else {
        addBox(boxes, x0, x1, z - WALL_THICK, z + WALL_THICK, y0, yTop);
      }
    } else {
      const x = ox + p.x1;
      const z0 = oz + Math.min(p.z1, p.z2);
      const z1 = oz + Math.max(p.z1, p.z2);
      if (p.door) {
        const mid = (z0 + z1) / 2;
        const dw = 1.0;
        addBox(boxes, x - WALL_THICK, x + WALL_THICK, z0, mid - dw, y0, y0 + DOOR_H);
        addBox(boxes, x - WALL_THICK, x + WALL_THICK, mid + dw, z1, y0, y0 + DOOR_H);
        addBox(boxes, x - WALL_THICK, x + WALL_THICK, z0, z1, y0 + DOOR_H, yTop);
      } else {
        addBox(boxes, x - WALL_THICK, x + WALL_THICK, z0, z1, y0, yTop);
      }
    }
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
    width: 2.4,
    depth: 3.5,
    fromY: y0,
    toY: (room.floorLevel + (down ? -1 : 1)) * FLOOR_STEP,
    targetFloor: room.floorLevel + (down ? -1 : 1),
    sourceFloor: room.floorLevel,
  };
}
