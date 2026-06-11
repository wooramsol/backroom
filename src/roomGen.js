export const CELL = 10;
export const ROOM_H = 2.8;
export const BASEMENT_H = 2.6;
export const FLOOR_STEP = 3.0;
export const DOOR_W = 2.0;
export const DOOR_H = 2.2;
export const WALL_THICK = 0.15;

const HW = CELL / 2;
const DW = DOOR_W / 2;

export function cellOf(pos) {
  return {
    x: Math.floor((pos.x + HW) / CELL),
    z: Math.floor((pos.z + HW) / CELL),
  };
}

export function generateRoom(cx, cz, floorLevel) {
  let feature = null;
  if (cx === 0 && cz === 0 && floorLevel === 0) feature = "stairs_down";
  if (cx === 0 && cz === 0 && floorLevel === -1) feature = "stairs_up";

  return {
    cx,
    cz,
    floorLevel,
    height: floorLevel < 0 ? BASEMENT_H : ROOM_H,
    feature,
    isBasement: floorLevel < 0,
  };
}

/** Axis-aligned wall boxes that match visuals exactly. */
export function buildColliders(room) {
  const ox = room.cx * CELL;
  const oz = room.cz * CELL;
  const y0 = room.floorLevel * FLOOR_STEP;
  const yDoor = y0 + DOOR_H;
  const yTop = y0 + room.height;
  const t = WALL_THICK;
  const boxes = [];

  const add = (minX, maxX, minZ, maxZ, minY, maxY) => {
    boxes.push({ minX, maxX, minZ, maxZ, minY, maxY });
  };

  const openSouth = room.feature === "stairs_down";
  const openNorth = room.feature === "stairs_up";

  // North (-Z)
  if (!openNorth) {
    add(ox - HW, ox - DW, oz - HW - t, oz - HW + t, y0, yDoor);
    add(ox + DW, ox + HW, oz - HW - t, oz - HW + t, y0, yDoor);
    add(ox - HW, ox + HW, oz - HW - t, oz - HW + t, yDoor, yTop);
  }

  // West (-X) — south/east walls come from neighboring cells (no double collision)
  add(ox - HW - t, ox - HW + t, oz - HW, oz - DW, y0, yDoor);
  add(ox - HW - t, ox - HW + t, oz + DW, oz + HW, y0, yDoor);
  add(ox - HW - t, ox - HW + t, oz - HW, oz + HW, yDoor, yTop);

  return boxes;
}

export function buildStairVolume(room) {
  if (!room.feature) return null;
  const ox = room.cx * CELL;
  const oz = room.cz * CELL;
  const y0 = room.floorLevel * FLOOR_STEP;
  const target =
    room.feature === "stairs_down" ? room.floorLevel - 1 : room.floorLevel + 1;

  return {
    type: room.feature,
    cx: ox,
    cz: room.feature === "stairs_down" ? oz + HW - 1.5 : oz - HW + 1.5,
    dirX: 0,
    dirZ: room.feature === "stairs_down" ? 1 : -1,
    width: DOOR_W,
    depth: 3,
    fromY: y0,
    toY: target * FLOOR_STEP,
    targetFloor: target,
    sourceFloor: room.floorLevel,
  };
}
