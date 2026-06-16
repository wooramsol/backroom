import { createRng } from "./rng.js";
import {
  CHUNK,
  WALL_T,
  DOOR_H,
  DOOR_JAMB_INSET,
  MIN_DOOR_WIDTH,
  ROOM_H,
  PANEL_ON_CHANCE,
  PANEL_EDGE_INSET,
  PANEL_W,
  PANEL_H,
} from "./constants.js";

export { CHUNK };
export const CELL = CHUNK;
export const HW = CHUNK / 2;

const DOOR_WIDTHS = [1.4, 1.6, 1.8, 2.0, 2.4, 2.8, 3.2, 3.6, 4.0];
const SHARED_DOOR_WIDTHS = [1.6, 2.0, 2.4, 2.8, 3.2, 3.6, 4.0, 4.4];

function fract(n) {
  return n - Math.floor(n);
}

function doorSpec(rng, span) {
  const maxW = span - 0.8;
  if (maxW < MIN_DOOR_WIDTH) return null;
  const choices = DOOR_WIDTHS.filter((w) => w <= maxW + 0.01);
  const w = Math.max(MIN_DOOR_WIDTH, rng.pick(choices.length ? choices : [MIN_DOOR_WIDTH]));
  const width = Math.min(w, maxW);
  const maxOff = Math.max(0, span / 2 - width / 2 - 0.25);
  return { width, offset: rng.range(-maxOff, maxOff) };
}

function zoneInset(zone) {
  const w = zone.x1 - zone.x0;
  const d = zone.z1 - zone.z0;
  return Math.min(PANEL_EDGE_INSET, w * 0.2, d * 0.2, 0.9);
}

function generatePanels(rng, room) {
  const hash = (x) => fract(Math.sin(x * 12.9898 + room.lightSeed) * 43758.5453);
  const panels = [];

  for (const zone of room.zones) {
    const inset = zoneInset(zone);
    const xLo = zone.x0 + inset;
    const xHi = zone.x1 - inset;
    const zLo = zone.z0 + inset;
    const zHi = zone.z1 - inset;
    const zw = xHi - xLo;
    const zd = zHi - zLo;
    if (zw < PANEL_W || zd < PANEL_H) continue;

    const narrow = Math.min(zw, zd) < 5.2;
    const spacing = narrow ? rng.pick([2.6, 3.0, 3.4]) : room.lightSpacing;
    const skip = narrow ? 0.14 : 0.28;

    for (let x = xLo + spacing / 2; x < xHi; x += spacing) {
      for (let z = zLo + spacing / 2; z < zHi; z += spacing) {
        if (hash(x * 3.1 + z + zone.x0 * 0.7) < skip) continue;
        panels.push({
          x,
          z,
          on: rng.chance(narrow ? PANEL_ON_CHANCE * 0.92 : PANEL_ON_CHANCE),
          phase: rng.range(0, Math.PI * 2),
          bright: 0.9 + hash(z + zone.z0) * 0.14,
        });
      }
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
  const width = Math.max(MIN_DOOR_WIDTH, rng.pick(SHARED_DOOR_WIDTHS));
  const maxOff = Math.max(0, CHUNK / 2 - width / 2 - 0.5);
  const centerClear = width / 2 + 0.38;
  const cap = Math.min(maxOff, centerClear);
  return {
    width,
    offset: rng.range(-cap, cap),
  };
}

function hallEW(rng, forceWide = false) {
  const wide = forceWide || rng.chance(0.38);
  const depth = wide ? rng.range(7.8, 12.2) : rng.range(3.0, 6.2);
  const z0 = rng.range(0.25, CHUNK - depth - 0.25);
  return {
    kind: wide ? "wide-hall" : "hall",
    zones: [{ x0: 0, z0, x1: CHUNK, z1: z0 + depth }],
    innerWalls: [
      { axis: "z", pos: z0, span0: 0, span1: CHUNK, door: null },
      { axis: "z", pos: z0 + depth, span0: 0, span1: CHUNK, door: null },
    ],
  };
}

function hallNS(rng, forceWide = false) {
  const wide = forceWide || rng.chance(0.38);
  const width = wide ? rng.range(7.8, 12.2) : rng.range(3.0, 6.2);
  const x0 = rng.range(0.25, CHUNK - width - 0.25);
  return {
    kind: wide ? "wide-hall" : "hall",
    zones: [{ x0, z0: 0, x1: x0 + width, z1: CHUNK }],
    innerWalls: [
      { axis: "x", pos: x0, span0: 0, span1: CHUNK, door: null },
      { axis: "x", pos: x0 + width, span0: 0, span1: CHUNK, door: null },
    ],
  };
}

function alcove(rng, corner) {
  const w = rng.range(5.5, 13);
  const d = rng.range(5.5, 13);
  const elongated = rng.chance(0.45);
  const ew = elongated && rng.chance(0.5);
  const W = ew ? Math.min(CHUNK - 0.4, w * rng.range(1.15, 1.55)) : w;
  const D = ew ? d : Math.min(CHUNK - 0.4, d * rng.range(1.15, 1.55));

  const shapes = {
    se: {
      zones: [{ x0: CHUNK - W, z0: CHUNK - D, x1: CHUNK, z1: CHUNK }],
      innerWalls: [
        { axis: "x", pos: CHUNK - W, span0: CHUNK - D, span1: CHUNK, door: doorSpec(rng, D) },
        { axis: "z", pos: CHUNK - D, span0: CHUNK - W, span1: CHUNK, door: doorSpec(rng, W) },
      ],
    },
    sw: {
      zones: [{ x0: 0, z0: CHUNK - D, x1: W, z1: CHUNK }],
      innerWalls: [
        { axis: "x", pos: W, span0: CHUNK - D, span1: CHUNK, door: doorSpec(rng, D) },
        { axis: "z", pos: CHUNK - D, span0: 0, span1: W, door: doorSpec(rng, W) },
      ],
    },
    ne: {
      zones: [{ x0: CHUNK - W, z0: 0, x1: CHUNK, z1: D }],
      innerWalls: [
        { axis: "x", pos: CHUNK - W, span0: 0, span1: D, door: doorSpec(rng, D) },
        { axis: "z", pos: D, span0: CHUNK - W, span1: CHUNK, door: doorSpec(rng, W) },
      ],
    },
    nw: {
      zones: [{ x0: 0, z0: 0, x1: W, z1: D }],
      innerWalls: [
        { axis: "x", pos: W, span0: 0, span1: D, door: doorSpec(rng, D) },
        { axis: "z", pos: D, span0: 0, span1: W, door: doorSpec(rng, W) },
      ],
    },
  };

  return { kind: "alcove", ...shapes[corner] };
}

function lShape(rng, voidCorner) {
  const legX = rng.range(4.8, 9.2);
  const legZ = rng.range(4.8, 9.2);
  const shapes = {
    nw: {
      zones: [
        { x0: 0, z0: legZ, x1: CHUNK, z1: CHUNK },
        { x0: legX, z0: 0, x1: CHUNK, z1: legZ },
      ],
      innerWalls: [
        { axis: "z", pos: legZ, span0: 0, span1: legX, door: null },
        { axis: "x", pos: legX, span0: 0, span1: legZ, door: doorSpec(rng, legZ) },
      ],
    },
    ne: {
      zones: [
        { x0: 0, z0: legZ, x1: CHUNK, z1: CHUNK },
        { x0: 0, z0: 0, x1: CHUNK - legX, z1: legZ },
      ],
      innerWalls: [
        { axis: "z", pos: legZ, span0: CHUNK - legX, span1: CHUNK, door: null },
        { axis: "x", pos: CHUNK - legX, span0: 0, span1: legZ, door: doorSpec(rng, legZ) },
      ],
    },
    sw: {
      zones: [
        { x0: 0, z0: 0, x1: CHUNK, z1: CHUNK - legZ },
        { x0: legX, z0: CHUNK - legZ, x1: CHUNK, z1: CHUNK },
      ],
      innerWalls: [
        { axis: "z", pos: CHUNK - legZ, span0: 0, span1: legX, door: null },
        { axis: "x", pos: legX, span0: CHUNK - legZ, span1: CHUNK, door: doorSpec(rng, CHUNK - legZ) },
      ],
    },
    se: {
      zones: [
        { x0: 0, z0: 0, x1: CHUNK, z1: CHUNK - legZ },
        { x0: 0, z0: CHUNK - legZ, x1: CHUNK - legX, z1: CHUNK },
      ],
      innerWalls: [
        { axis: "z", pos: CHUNK - legZ, span0: CHUNK - legX, span1: CHUNK, door: null },
        { axis: "x", pos: CHUNK - legX, span0: CHUNK - legZ, span1: CHUNK, door: doorSpec(rng, CHUNK - legZ) },
      ],
    },
  };

  return { kind: "L", ...shapes[voidCorner] };
}

function offsetSlab(rng) {
  const elongated = rng.chance(0.62);
  const w = elongated ? rng.range(9, 13.2) : rng.range(5.5, 10);
  const d = elongated ? rng.range(4.5, 7.5) : rng.range(7, 12.5);
  const ew = elongated && rng.chance(0.55);
  const W = ew ? w : d;
  const D = ew ? d : w;
  const x0 = rng.range(0.3, CHUNK - W - 0.3);
  const z0 = rng.range(0.3, CHUNK - D - 0.3);
  const x1 = x0 + W;
  const z1 = z0 + D;
  const walls = [];

  if (x0 > 0.2) walls.push({ axis: "x", pos: x0, span0: z0, span1: z1, door: rng.chance(0.5) ? doorSpec(rng, D) : null });
  if (x1 < CHUNK - 0.2) walls.push({ axis: "x", pos: x1, span0: z0, span1: z1, door: rng.chance(0.5) ? doorSpec(rng, D) : null });
  if (z0 > 0.2) walls.push({ axis: "z", pos: z0, span0: x0, span1: x1, door: rng.chance(0.5) ? doorSpec(rng, W) : null });
  if (z1 < CHUNK - 0.2) walls.push({ axis: "z", pos: z1, span0: x0, span1: x1, door: rng.chance(0.5) ? doorSpec(rng, W) : null });

  return {
    kind: elongated ? "elongated" : "slab",
    zones: [{ x0, z0, x1, z1 }],
    innerWalls: walls,
  };
}

function tShape(rng, stem) {
  const bar = rng.range(9.5, 13.2);
  const stemW = rng.range(3.2, 6.2);
  const stemX0 = (CHUNK - stemW) / 2;
  const stemX1 = stemX0 + stemW;
  const barZ = rng.range(9, 12.5);
  const barX = rng.range(9, 12.5);

  const shapes = {
    south: {
      zones: [
        { x0: 0, z0: 0, x1: CHUNK, z1: bar },
        { x0: stemX0, z0: bar, x1: stemX1, z1: CHUNK },
      ],
      innerWalls: [
        { axis: "z", pos: bar, span0: 0, span1: stemX0, door: null },
        { axis: "z", pos: bar, span0: stemX1, span1: CHUNK, door: null },
        { axis: "x", pos: stemX0, span0: bar, span1: CHUNK, door: doorSpec(rng, CHUNK - bar) },
        { axis: "x", pos: stemX1, span0: bar, span1: CHUNK, door: doorSpec(rng, CHUNK - bar) },
      ],
    },
    north: {
      zones: [
        { x0: 0, z0: CHUNK - bar, x1: CHUNK, z1: CHUNK },
        { x0: stemX0, z0: 0, x1: stemX1, z1: CHUNK - bar },
      ],
      innerWalls: [
        { axis: "z", pos: CHUNK - bar, span0: 0, span1: stemX0, door: null },
        { axis: "z", pos: CHUNK - bar, span0: stemX1, span1: CHUNK, door: null },
        { axis: "x", pos: stemX0, span0: 0, span1: CHUNK - bar, door: doorSpec(rng, CHUNK - bar) },
        { axis: "x", pos: stemX1, span0: 0, span1: CHUNK - bar, door: doorSpec(rng, CHUNK - bar) },
      ],
    },
    east: {
      zones: [
        { x0: 0, z0: 0, x1: barX, z1: CHUNK },
        { x0: barX, z0: stemX0, x1: CHUNK, z1: stemX1 },
      ],
      innerWalls: [
        { axis: "x", pos: barX, span0: 0, span1: stemX0, door: null },
        { axis: "x", pos: barX, span0: stemX1, span1: CHUNK, door: null },
        { axis: "z", pos: stemX0, span0: barX, span1: CHUNK, door: doorSpec(rng, CHUNK - barX) },
        { axis: "z", pos: stemX1, span0: barX, span1: CHUNK, door: doorSpec(rng, CHUNK - barX) },
      ],
    },
    west: {
      zones: [
        { x0: CHUNK - barX, z0: 0, x1: CHUNK, z1: CHUNK },
        { x0: 0, z0: stemX0, x1: CHUNK - barX, z1: stemX1 },
      ],
      innerWalls: [
        { axis: "x", pos: CHUNK - barX, span0: 0, span1: stemX0, door: null },
        { axis: "x", pos: CHUNK - barX, span0: stemX1, span1: CHUNK, door: null },
        { axis: "z", pos: stemX0, span0: 0, span1: CHUNK - barX, door: doorSpec(rng, CHUNK - barX) },
        { axis: "z", pos: stemX1, span0: 0, span1: CHUNK - barX, door: doorSpec(rng, CHUNK - barX) },
      ],
    },
  };

  return { kind: "T", ...shapes[stem] };
}

function twinZone(rng) {
  const splitX = rng.chance(0.5);
  if (splitX) {
    const x = rng.range(5.5, 8.5);
    const z0 = rng.range(0.4, 2.5);
    const z1 = rng.range(CHUNK - 2.5, CHUNK - 0.4);
    return {
      kind: "twin",
      zones: [
        { x0: 0, z0, x1: x, z1 },
        { x0: x, z0, x1: CHUNK, z1 },
      ],
      innerWalls: [{ axis: "x", pos: x, span0: z0, span1: z1, door: doorSpec(rng, z1 - z0) }],
    };
  }

  const z = rng.range(5.5, 8.5);
  const x0 = rng.range(0.4, 2.5);
  const x1 = rng.range(CHUNK - 2.5, CHUNK - 0.4);
  return {
    kind: "twin",
    zones: [
      { x0, z0: 0, x1, z1: z },
      { x0, z0: z, x1, z1: CHUNK },
    ],
    innerWalls: [{ axis: "z", pos: z, span0: x0, span1: x1, door: doorSpec(rng, x1 - x0) }],
  };
}

function pickShape(rng) {
  const kind = rng.pickWeighted([
    ["full", 10],
    ["hall-ew", 16],
    ["hall-ns", 16],
    ["wide-hall-ew", 6],
    ["wide-hall-ns", 6],
    ["alcove", 14],
    ["L", 18],
    ["elongated", 12],
    ["T", 8],
    ["twin", 6],
  ]);

  switch (kind) {
    case "full":
      return { kind: "full", zones: [{ x0: 0, z0: 0, x1: CHUNK, z1: CHUNK }], innerWalls: [] };
    case "hall-ew":
      return hallEW(rng);
    case "hall-ns":
      return hallNS(rng);
    case "wide-hall-ew":
      return hallEW(rng, true);
    case "wide-hall-ns":
      return hallNS(rng, true);
    case "alcove":
      return alcove(rng, rng.pick(["nw", "ne", "sw", "se"]));
    case "L":
      return lShape(rng, rng.pick(["nw", "ne", "sw", "se"]));
    case "elongated":
      return offsetSlab(rng);
    case "T":
      return tShape(rng, rng.pick(["north", "south", "east", "west"]));
    case "twin":
      return twinZone(rng);
    default:
      return { kind: "full", zones: [{ x0: 0, z0: 0, x1: CHUNK, z1: CHUNK }], innerWalls: [] };
  }
}

export function generateRoom(cx, cz) {
  const rng = createRng(cx, cz, 7);
  const shape = pickShape(rng);

  const room = {
    cx,
    cz,
    kind: shape.kind,
    zones: shape.zones,
    innerWalls: shape.innerWalls,
    height: ROOM_H,
    doors: {
      north: getSharedDoor(cx, cz, cx, cz - 1),
      south: getSharedDoor(cx, cz, cx, cz + 1),
      east: getSharedDoor(cx, cz, cx + 1, cz),
      west: getSharedDoor(cx, cz, cx - 1, cz),
    },
    lightSeed: rng.int(0, 99999),
    lightSpacing: rng.pick([3.4, 3.8, 4.2, 4.6, 5.0]),
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
  if (maxX - minX < 0.02 || maxZ - minZ < 0.02 || maxY - minY < 0.02) return;
  out.push({ minX, maxX, minZ, maxZ, minY, maxY });
}

function doorCollideHalf(door) {
  return door.width * 0.5 - DOOR_JAMB_INSET;
}

function wallAlongZ(boxes, z, x0, x1, door, y0, yTop) {
  const t = WALL_T;
  if (!door) {
    addBox(boxes, x0, x1, z - t, z + t, y0, yTop);
    return;
  }
  const mid = (x0 + x1) / 2 + door.offset;
  const half = doorCollideHalf(door);
  const lo = mid - half;
  const hi = mid + half;
  const jambTop = y0 + DOOR_H + 0.08;
  addBox(boxes, x0, lo, z - t, z + t, y0, jambTop);
  addBox(boxes, hi, x1, z - t, z + t, y0, jambTop);
  addBox(boxes, x0, x1, z - t, z + t, y0 + DOOR_H, yTop);
}

function wallAlongX(boxes, x, z0, z1, door, y0, yTop) {
  const t = WALL_T;
  if (!door) {
    addBox(boxes, x - t, x + t, z0, z1, y0, yTop);
    return;
  }
  const mid = (z0 + z1) / 2 + door.offset;
  const half = doorCollideHalf(door);
  const lo = mid - half;
  const hi = mid + half;
  const jambTop = y0 + DOOR_H + 0.08;
  addBox(boxes, x - t, x + t, z0, lo, y0, jambTop);
  addBox(boxes, x - t, x + t, hi, z1, y0, jambTop);
  addBox(boxes, x - t, x + t, z0, z1, y0 + DOOR_H, yTop);
}

function addInnerWall(boxes, ox, oz, wall, y0, yTop) {
  if (wall.axis === "x") {
    wallAlongX(boxes, ox + wall.pos, oz + wall.span0, oz + wall.span1, wall.door, y0, yTop);
  } else {
    wallAlongZ(boxes, oz + wall.pos, ox + wall.span0, ox + wall.span1, wall.door, y0, yTop);
  }
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

  room.innerWalls.forEach((wall, i) => {
    put(`iw,${room.cx},${room.cz},${i}`, () => {
      const b = [];
      addInnerWall(b, ox, oz, wall, y0, yTop);
      return b;
    });
  });

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
