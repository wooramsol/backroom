import { CHUNK, WALL_T, DOOR_JAMB_INSET, MIN_PASSAGE_SPAN } from "./constants.js";
import { passageWidthAlong } from "./passage.js";

const JUNCTION_EPS = 0.02;
const CORNER_PROBE = 0.45;

function wallBlocksNav(wall, x, z) {
  const halfT = WALL_T / 2 + 0.05;
  if (wall.axis === "z") {
    if (Math.abs(z - wall.pos) > halfT) return false;
    if (x < wall.span0 - 0.05 || x > wall.span1 + 0.05) return false;
    if (wall.door) {
      const mid = (wall.span0 + wall.span1) / 2 + wall.door.offset;
      const half = wall.door.width / 2 - DOOR_JAMB_INSET;
      if (x >= mid - half && x <= mid + half) return false;
    }
    return true;
  }
  if (Math.abs(x - wall.pos) > halfT) return false;
  if (z < wall.span0 - 0.05 || z > wall.span1 + 0.05) return false;
  if (wall.door) {
    const mid = (wall.span0 + wall.span1) / 2 + wall.door.offset;
    const half = wall.door.width / 2 - DOOR_JAMB_INSET;
    if (z >= mid - half && z <= mid + half) return false;
  }
  return true;
}

function isWalkableLocal(x, z, innerWalls) {
  if (x < 0.3 || x > CHUNK - 0.3 || z < 0.3 || z > CHUNK - 0.3) return false;
  for (const wall of innerWalls) {
    if (wallBlocksNav(wall, x, z)) return false;
  }
  return true;
}

export function cornerKey(x, z) {
  return `${x.toFixed(4)}:${z.toFixed(4)}`;
}

function spansMeet(value, s0, s1) {
  return value >= s0 - JUNCTION_EPS && value <= s1 + JUNCTION_EPS;
}

export function expandWallSegments(room) {
  const segments = [];

  const push = (axis, pos, a0, a1, door) => {
    if (door) {
      const mid = (a0 + a1) / 2 + (door.offset || 0);
      const dw = door.width / 2;
      if (mid - dw - a0 > 0.1) segments.push({ axis, pos, s0: a0, s1: mid - dw });
      if (a1 - (mid + dw) > 0.1) segments.push({ axis, pos, s0: mid + dw, s1: a1 });
      return;
    }
    if (a1 - a0 >= 0.1) segments.push({ axis, pos, s0: a0, s1: a1 });
  };

  push("z", 0, 0, CHUNK, room.doors.north);
  push("z", CHUNK, 0, CHUNK, room.doors.south);
  push("x", 0, 0, CHUNK, room.doors.west);
  push("x", CHUNK, 0, CHUNK, room.doors.east);

  for (const wall of room.innerWalls) {
    const axis = wall.axis === "x" ? "x" : "z";
    push(axis, wall.pos, wall.span0, wall.span1, wall.door);
  }

  return segments;
}

export function findPerpendicularCorners(segments) {
  const corners = new Map();
  const zWalls = segments.filter((s) => s.axis === "z");
  const xWalls = segments.filter((s) => s.axis === "x");

  for (const zw of zWalls) {
    for (const xw of xWalls) {
      if (spansMeet(xw.pos, zw.s0, zw.s1) && spansMeet(zw.pos, xw.s0, xw.s1)) {
        corners.set(cornerKey(xw.pos, zw.pos), { x: xw.pos, z: zw.pos });
      }
    }
  }

  return [...corners.values()];
}

/**
 * Seal when the corner pocket is narrower than player passage, or when only
 * one/two sides are open (typical L) so mesh gaps should be closed solid.
 */
export function cornerNeedsSeal(x, z, innerWalls) {
  const minW = MIN_PASSAGE_SPAN;
  const d = CORNER_PROBE;
  const probes = [
    { px: x - d, pz: z - d },
    { px: x + d, pz: z - d },
    { px: x - d, pz: z + d },
    { px: x + d, pz: z + d },
  ];

  const open = probes.filter((p) => isWalkableLocal(p.px, p.pz, innerWalls));
  const isNarrow = (p) => {
    const wx = passageWidthAlong(p.px, p.pz, innerWalls, "x");
    const wz = passageWidthAlong(p.px, p.pz, innerWalls, "z");
    return wx < minW || wz < minW;
  };

  if (open.length >= 3) return open.some(isNarrow);
  if (open.length === 0) return true;
  if (open.length <= 2) return true;
  return open.some(isNarrow);
}

export function findSealedCorners(segments, innerWalls) {
  const sealed = new Set();
  for (const corner of findPerpendicularCorners(segments)) {
    if (cornerNeedsSeal(corner.x, corner.z, innerWalls)) {
      sealed.add(cornerKey(corner.x, corner.z));
    }
  }
  return sealed;
}

export function cornerSealColliderBoxes(room) {
  const segments = expandWallSegments(room);
  const sealed = findSealedCorners(segments, room.innerWalls);
  const ox = room.cx * CHUNK;
  const oz = room.cz * CHUNK;
  const half = WALL_T / 2;
  const boxes = [];

  for (const corner of findPerpendicularCorners(segments)) {
    if (!sealed.has(cornerKey(corner.x, corner.z))) continue;
    boxes.push({
      minX: ox + corner.x - half,
      maxX: ox + corner.x + half,
      minZ: oz + corner.z - half,
      maxZ: oz + corner.z + half,
      minY: 0,
      maxY: room.height,
    });
  }

  return boxes;
}
