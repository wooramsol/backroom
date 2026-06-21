import { createRng } from "./rng.js";
import { CEILING_TILE_M } from "./textures.js";
import { tileCenterLocal, chunkTileRange } from "./ceilingGrid.js";
import {
  CHUNK,
  WALL_T,
  DOOR_H,
  DOOR_JAMB_INSET,
  MIN_DOOR_WIDTH,
  MIN_PASSAGE_SPAN,
  MIN_ZONE_DIM,
  MIN_ZONE_DIM_SMALL,
  ROOM_H,
  PANEL_EDGE_INSET,
  PANEL_W,
  PANEL_H,
  PANEL_SIZE,
} from "./constants.js";

export { CHUNK };
export const CELL = CHUNK;
export const HW = CHUNK / 2;

const DOOR_WIDTHS = [1.15, 1.3, 1.45, 1.6, 1.75, 1.9, 2.05, 2.25, 2.5, 2.75, 3.0, 3.3, 3.6, 3.95, 4.3];
const SHARED_DOOR_WIDTHS = [1.35, 1.5, 1.7, 1.9, 2.1, 2.35, 2.6, 2.85, 3.15, 3.45, 3.75, 4.1, 4.5];

function fract(n) {
  return n - Math.floor(n);
}

function pickDoorWidth(rng, span) {
  const maxW = span - 0.8;
  if (maxW < MIN_DOOR_WIDTH) return null;
  if (rng.chance(0.38)) {
    const w = rng.range(MIN_DOOR_WIDTH, maxW);
    return Math.round(w * 20) / 20;
  }
  const choices = DOOR_WIDTHS.filter((w) => w <= maxW + 0.01);
  return Math.max(MIN_DOOR_WIDTH, rng.pick(choices.length ? choices : [MIN_DOOR_WIDTH]));
}

function doorSpec(rng, span) {
  const maxW = span - 0.8;
  const width = Math.min(pickDoorWidth(rng, span) ?? MIN_DOOR_WIDTH, maxW);
  if (width < MIN_DOOR_WIDTH) return null;
  const maxOff = Math.max(0, span / 2 - width / 2 - 0.25);
  return { width, offset: rng.range(-maxOff, maxOff) };
}

function zoneInset(zone) {
  const w = zone.x1 - zone.x0;
  const d = zone.z1 - zone.z0;
  return Math.min(PANEL_EDGE_INSET, w * 0.2, d * 0.2, 0.9);
}

function panelWallList(room) {
  return [
    { axis: "z", pos: 0, span0: 0, span1: CHUNK },
    { axis: "z", pos: CHUNK, span0: 0, span1: CHUNK },
    { axis: "x", pos: 0, span0: 0, span1: CHUNK },
    { axis: "x", pos: CHUNK, span0: 0, span1: CHUNK },
    ...room.innerWalls,
  ];
}

function spansOverlap(a0, a1, b0, b1) {
  return a0 < b1 && a1 > b0;
}

/** Keep ceiling panels off wall slabs (open floor only) */
function panelOnWall(px, pz, wall) {
  const halfW = PANEL_W / 2;
  const halfH = PANEL_H / 2;
  const halfT = WALL_T / 2;
  const margin = 0.1;

  if (wall.axis === "z") {
    const wMinZ = wall.pos - halfT - margin;
    const wMaxZ = wall.pos + halfT + margin;
    if (pz + halfH <= wMinZ || pz - halfH >= wMaxZ) return false;
    return spansOverlap(px - halfW, px + halfW, wall.span0, wall.span1);
  }

  const wMinX = wall.pos - halfT - margin;
  const wMaxX = wall.pos + halfT + margin;
  if (px + halfW <= wMinX || px - halfW >= wMaxX) return false;
  return spansOverlap(pz - halfH, pz + halfH, wall.span0, wall.span1);
}

function panelBlocked(px, pz, room) {
  const walls = panelWallList(room);
  for (let i = 0; i < walls.length; i++) {
    if (panelOnWall(px, pz, walls[i])) return true;
  }
  return false;
}

const PANEL_MIN_GAP = 0.18;

function panelOverlapsExisting(px, pz, panels) {
  const halfW = PANEL_W / 2 + PANEL_MIN_GAP;
  const halfH = PANEL_H / 2 + PANEL_MIN_GAP;
  const minX = px - halfW;
  const maxX = px + halfW;
  const minZ = pz - halfH;
  const maxZ = pz + halfH;

  for (let i = 0; i < panels.length; i++) {
    const p = panels[i];
    const eMinX = p.x - halfW;
    const eMaxX = p.x + halfW;
    const eMinZ = p.z - halfH;
    const eMaxZ = p.z + halfH;
    if (spansOverlap(minX, maxX, eMinX, eMaxX) && spansOverlap(minZ, maxZ, eMinZ, eMaxZ)) {
      return true;
    }
  }
  return false;
}

function generatePanels(_rng, _room) {
  return [];
}

export function getSharedDoor(cx0, cz0, cx1, cz1) {
  const ax = Math.min(cx0, cx1);
  const az = Math.min(cz0, cz1);
  const bx = Math.max(cx0, cx1);
  const bz = Math.max(cz0, cz1);
  const rng = createRng(ax, az, bx, bz, 42);
  const maxW = CHUNK - 0.8;
  let width;
  if (rng.chance(0.38)) {
    width = Math.round(rng.range(MIN_DOOR_WIDTH, maxW) * 20) / 20;
  } else {
    const choices = SHARED_DOOR_WIDTHS.filter((w) => w <= maxW + 0.01);
    width = Math.max(MIN_DOOR_WIDTH, rng.pick(choices.length ? choices : [MIN_DOOR_WIDTH]));
  }
  width = Math.max(MIN_DOOR_WIDTH, Math.min(width, maxW));
  const maxOff = Math.max(0, CHUNK / 2 - width / 2 - 0.5);
  const centerClear = width / 2 + 0.38;
  const cap = Math.min(maxOff, centerClear);
  return {
    width,
    offset: rng.range(-cap, cap),
  };
}

function narrowSpan(rng, lo, hi) {
  const min = MIN_PASSAGE_SPAN + 1.4;
  return Math.max(min, rng.range(lo, hi));
}

/** Same E–W corridor band across chunks in a row (shared cz) */
function alignedBandEW(cz) {
  const lane = createRng(0, cz, 88);
  const depth = lane.range(CHUNK * 0.3, CHUNK * 0.46);
  const maxZ0 = CHUNK - depth - 0.6;
  const z0 = lane.range(1.2, Math.max(1.2, maxZ0));
  return { z0, depth };
}

/** Same N–S corridor band across chunks in a column (shared cx) */
function alignedBandNS(cx) {
  const lane = createRng(cx, 0, 88);
  const width = lane.range(CHUNK * 0.3, CHUNK * 0.46);
  const maxX0 = CHUNK - width - 0.6;
  const x0 = lane.range(1.2, Math.max(1.2, maxX0));
  return { x0, width };
}

function hallEW(rng, cx, cz, forceWide = false) {
  const wide = forceWide;
  const band = alignedBandEW(cz);
  const depth = wide ? rng.range(CHUNK * 0.62, CHUNK * 0.94) : band.depth;
  const z0 = wide ? rng.range(0.4, CHUNK - depth - 0.4) : band.z0;
  return {
    kind: wide ? "wide-hall" : "hall",
    zones: [{ x0: 0, z0, x1: CHUNK, z1: z0 + depth }],
    innerWalls: [
      { axis: "z", pos: z0, span0: 0, span1: CHUNK, door: doorSpec(rng, CHUNK) },
      { axis: "z", pos: z0 + depth, span0: 0, span1: CHUNK, door: doorSpec(rng, CHUNK) },
    ],
  };
}

function hallNS(rng, cx, cz, forceWide = false) {
  const wide = forceWide;
  const band = alignedBandNS(cx);
  const width = wide ? rng.range(CHUNK * 0.62, CHUNK * 0.94) : band.width;
  const x0 = wide ? rng.range(0.4, CHUNK - width - 0.4) : band.x0;
  return {
    kind: wide ? "wide-hall" : "hall",
    zones: [{ x0, z0: 0, x1: x0 + width, z1: CHUNK }],
    innerWalls: [
      { axis: "x", pos: x0, span0: 0, span1: CHUNK, door: doorSpec(rng, CHUNK) },
      { axis: "x", pos: x0 + width, span0: 0, span1: CHUNK, door: doorSpec(rng, CHUNK) },
    ],
  };
}

function compactL(rng, voidCorner) {
  const shape = lShape(rng, voidCorner, rng.range(4.0, 7.8), rng.range(4.0, 7.8));
  return { ...shape, kind: "compact-L" };
}

function smallAlcove(rng, corner) {
  const w = rng.range(4.5, 8.5);
  const d = rng.range(4.5, 8.5);
  const shapes = {
    se: {
      zones: [{ x0: CHUNK - w, z0: CHUNK - d, x1: CHUNK, z1: CHUNK }],
      innerWalls: [
        { axis: "x", pos: CHUNK - w, span0: CHUNK - d, span1: CHUNK, door: doorSpec(rng, d) },
        { axis: "z", pos: CHUNK - d, span0: CHUNK - w, span1: CHUNK, door: doorSpec(rng, w) },
      ],
    },
    sw: {
      zones: [{ x0: 0, z0: CHUNK - d, x1: w, z1: CHUNK }],
      innerWalls: [
        { axis: "x", pos: w, span0: CHUNK - d, span1: CHUNK, door: doorSpec(rng, d) },
        { axis: "z", pos: CHUNK - d, span0: 0, span1: w, door: doorSpec(rng, w) },
      ],
    },
    ne: {
      zones: [{ x0: CHUNK - w, z0: 0, x1: CHUNK, z1: d }],
      innerWalls: [
        { axis: "x", pos: CHUNK - w, span0: 0, span1: d, door: doorSpec(rng, d) },
        { axis: "z", pos: d, span0: CHUNK - w, span1: CHUNK, door: doorSpec(rng, w) },
      ],
    },
    nw: {
      zones: [{ x0: 0, z0: 0, x1: w, z1: d }],
      innerWalls: [
        { axis: "x", pos: w, span0: 0, span1: d, door: doorSpec(rng, d) },
        { axis: "z", pos: d, span0: 0, span1: w, door: doorSpec(rng, w) },
      ],
    },
  };
  return { kind: "small-alcove", ...shapes[corner] };
}

function hShape(rng) {
  const leg = rng.range(CHUNK * 0.2, CHUNK * 0.34);
  const thick = narrowSpan(rng, CHUNK * 0.2, CHUNK * 0.34);
  const mid = CHUNK / 2;
  const barZ0 = mid - thick / 2;
  const barZ1 = mid + thick / 2;
  return {
    kind: "H",
    zones: [
      { x0: 0, z0: 0, x1: leg, z1: CHUNK },
      { x0: CHUNK - leg, z0: 0, x1: CHUNK, z1: CHUNK },
      { x0: leg, z0: barZ0, x1: CHUNK - leg, z1: barZ1 },
    ],
    innerWalls: [
      { axis: "x", pos: leg, span0: 0, span1: barZ0, door: doorSpec(rng, barZ0) },
      { axis: "x", pos: leg, span0: barZ1, span1: CHUNK, door: doorSpec(rng, CHUNK - barZ1) },
      { axis: "x", pos: CHUNK - leg, span0: 0, span1: barZ0, door: doorSpec(rng, barZ0) },
      { axis: "x", pos: CHUNK - leg, span0: barZ1, span1: CHUNK, door: doorSpec(rng, CHUNK - barZ1) },
    ],
  };
}

function alcove(rng, corner) {
  const w = rng.range(CHUNK * 0.32, CHUNK * 0.62);
  const d = rng.range(CHUNK * 0.32, CHUNK * 0.62);
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

function lShape(rng, voidCorner, legX0, legZ0) {
  const legX = legX0 ?? rng.range(CHUNK * 0.26, CHUNK * 0.48);
  const legZ = legZ0 ?? rng.range(CHUNK * 0.26, CHUNK * 0.48);
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
  const bar = rng.range(CHUNK * 0.58, CHUNK * 0.92);
  const stemW = narrowSpan(rng, CHUNK * 0.22, CHUNK * 0.38);
  const stemX0 = (CHUNK - stemW) / 2;
  const stemX1 = stemX0 + stemW;
  const barZ = rng.range(CHUNK * 0.52, CHUNK * 0.82);
  const barX = rng.range(CHUNK * 0.52, CHUNK * 0.82);

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

function tripleSplit(rng) {
  if (rng.chance(0.5)) {
    const x1 = rng.range(CHUNK * 0.24, CHUNK * 0.36);
    const x2 = rng.range(CHUNK * 0.58, CHUNK * 0.74);
    return {
      kind: "triple",
      zones: [
        { x0: 0, z0: 0, x1: x1, z1: CHUNK },
        { x0: x1, z0: 0, x1: x2, z1: CHUNK },
        { x0: x2, z0: 0, x1: CHUNK, z1: CHUNK },
      ],
      innerWalls: [
        { axis: "x", pos: x1, span0: 0, span1: CHUNK, door: doorSpec(rng, CHUNK) },
        { axis: "x", pos: x2, span0: 0, span1: CHUNK, door: doorSpec(rng, CHUNK) },
      ],
    };
  }

  const z1 = rng.range(CHUNK * 0.24, CHUNK * 0.36);
  const z2 = rng.range(CHUNK * 0.58, CHUNK * 0.74);
  return {
    kind: "triple",
    zones: [
      { x0: 0, z0: 0, x1: CHUNK, z1: z1 },
      { x0: 0, z0: z1, x1: CHUNK, z1: z2 },
      { x0: 0, z0: z2, x1: CHUNK, z1: CHUNK },
    ],
    innerWalls: [
      { axis: "z", pos: z1, span0: 0, span1: CHUNK, door: doorSpec(rng, CHUNK) },
      { axis: "z", pos: z2, span0: 0, span1: CHUNK, door: doorSpec(rng, CHUNK) },
    ],
  };
}

function uShape(rng) {
  const leg = rng.range(CHUNK * 0.24, CHUNK * 0.38);
  const open = rng.range(CHUNK * 0.32, CHUNK * 0.48);
  return {
    kind: "U",
    zones: [
      { x0: 0, z0: 0, x1: leg, z1: CHUNK },
      { x0: CHUNK - leg, z0: 0, x1: CHUNK, z1: CHUNK },
      { x0: 0, z0: CHUNK - open, x1: CHUNK, z1: CHUNK },
    ],
    innerWalls: [
      { axis: "x", pos: leg, span0: 0, span1: CHUNK - open, door: doorSpec(rng, CHUNK - open) },
      { axis: "x", pos: CHUNK - leg, span0: 0, span1: CHUNK - open, door: doorSpec(rng, CHUNK - open) },
    ],
  };
}

function hubRoom(rng) {
  const margin = rng.range(CHUNK * 0.045, CHUNK * 0.065);
  return {
    kind: "lounge",
    zones: [
      { x0: 0, z0: 0, x1: CHUNK, z1: margin },
      { x0: 0, z0: CHUNK - margin, x1: CHUNK, z1: CHUNK },
      { x0: 0, z0: margin, x1: margin, z1: CHUNK - margin },
      { x0: CHUNK - margin, z0: margin, x1: CHUNK, z1: CHUNK - margin },
      { x0: margin, z0: margin, x1: CHUNK - margin, z1: CHUNK - margin },
    ],
    innerWalls: [
      { axis: "z", pos: margin, span0: 0, span1: CHUNK, door: doorSpec(rng, CHUNK) },
      { axis: "z", pos: CHUNK - margin, span0: 0, span1: CHUNK, door: doorSpec(rng, CHUNK) },
      { axis: "x", pos: margin, span0: 0, span1: CHUNK, door: doorSpec(rng, CHUNK) },
      { axis: "x", pos: CHUNK - margin, span0: 0, span1: CHUNK, door: doorSpec(rng, CHUNK) },
    ],
  };
}

function zigzag(rng) {
  const mid = rng.range(CHUNK * 0.34, CHUNK * 0.52);
  const thick = narrowSpan(rng, CHUNK * 0.22, CHUNK * 0.36);
  if (rng.chance(0.5)) {
    return {
      kind: "zigzag",
      zones: [
        { x0: 0, z0: 0, x1: mid, z1: thick },
        { x0: mid, z0: 0, x1: CHUNK, z1: CHUNK },
        { x0: 0, z0: thick, x1: mid, z1: CHUNK },
      ],
      innerWalls: [
        { axis: "z", pos: thick, span0: 0, span1: mid, door: null },
        { axis: "x", pos: mid, span0: thick, span1: CHUNK, door: doorSpec(rng, CHUNK - thick) },
      ],
    };
  }

  return {
    kind: "zigzag",
    zones: [
      { x0: 0, z0: 0, x1: thick, z1: mid },
      { x0: 0, z0: mid, x1: CHUNK, z1: CHUNK },
      { x0: thick, z0: 0, x1: CHUNK, z1: mid },
    ],
    innerWalls: [
      { axis: "x", pos: thick, span0: 0, span1: mid, door: null },
      { axis: "z", pos: mid, span0: thick, span1: CHUNK, door: doorSpec(rng, CHUNK - thick) },
    ],
  };
}

function hallWithPockets(rng, cx, cz) {
  const band = alignedBandEW(cz);
  const thick = rng.range(CHUNK * 0.34, CHUNK * 0.52);
  const z0 = rng.chance(0.55) ? band.z0 : rng.range(0.5, CHUNK - thick - 0.5);
  const pocket = rng.range(CHUNK * 0.28, CHUNK * 0.42);
  const side = rng.pick(["left", "right"]);
  const zones = [{ x0: 0, z0, x1: CHUNK, z1: z0 + thick }];
  const walls = [
    { axis: "z", pos: z0, span0: 0, span1: CHUNK, door: doorSpec(rng, CHUNK) },
    { axis: "z", pos: z0 + thick, span0: 0, span1: CHUNK, door: doorSpec(rng, CHUNK) },
  ];

  if (side === "left") {
    zones.push({ x0: 0, z0: z0 + thick, x1: pocket, z1: CHUNK });
    walls.push({ axis: "x", pos: pocket, span0: z0 + thick, span1: CHUNK, door: doorSpec(rng, CHUNK - z0 - thick) });
  } else {
    zones.push({ x0: CHUNK - pocket, z0: z0 + thick, x1: CHUNK, z1: CHUNK });
    walls.push({ axis: "x", pos: CHUNK - pocket, span0: z0 + thick, span1: CHUNK, door: doorSpec(rng, CHUNK - z0 - thick) });
  }

  return { kind: "hall-pockets", zones, innerWalls: walls };
}

function compoundLT(rng) {
  const l = lShape(rng, rng.pick(["nw", "ne", "sw", "se"]));
  const pocket = rng.range(CHUNK * 0.28, CHUNK * 0.42);
  const corner = rng.pick(["nw", "ne", "sw", "se"]);
  const pockets = {
    nw: { x0: 0, z0: 0, x1: pocket, z1: pocket },
    ne: { x0: CHUNK - pocket, z0: 0, x1: CHUNK, z1: pocket },
    sw: { x0: 0, z0: CHUNK - pocket, x1: pocket, z1: CHUNK },
    se: { x0: CHUNK - pocket, z0: CHUNK - pocket, x1: CHUNK, z1: CHUNK },
  };
  const p = pockets[corner];
  l.zones.push(p);
  if (p.x1 < CHUNK - 0.2) {
    l.innerWalls.push({ axis: "x", pos: p.x1, span0: p.z0, span1: p.z1, door: doorSpec(rng, p.z1 - p.z0) });
  }
  if (p.z1 < CHUNK - 0.2) {
    l.innerWalls.push({ axis: "z", pos: p.z1, span0: p.x0, span1: p.x1, door: doorSpec(rng, p.x1 - p.x0) });
  }
  l.kind = "compound";
  return l;
}

function crossHall(rng) {
  const arm = narrowSpan(rng, CHUNK * 0.26, CHUNK * 0.42);
  const cx0 = (CHUNK - arm) / 2;
  const cz0 = (CHUNK - arm) / 2;
  return {
    kind: "cross",
    zones: [
      { x0: cx0, z0: 0, x1: cx0 + arm, z1: CHUNK },
      { x0: 0, z0: cz0, x1: CHUNK, z1: cz0 + arm },
    ],
    innerWalls: [],
  };
}

function staggeredWings(rng) {
  const w = narrowSpan(rng, CHUNK * 0.24, CHUNK * 0.36);
  const split = rng.range(CHUNK * 0.36, CHUNK * 0.52);
  const a = rng.range(1.5, CHUNK * 0.2);
  const b = rng.range(CHUNK - w - CHUNK * 0.2, CHUNK - 1.5);
  return {
    kind: "stagger",
    zones: [
      { x0: a, z0: 0, x1: a + w, z1: split },
      { x0: b - w, z0: split, x1: b, z1: CHUNK },
    ],
    innerWalls: [
      { axis: "x", pos: a + w, span0: split, span1: CHUNK, door: doorSpec(rng, CHUNK - split) },
      { axis: "x", pos: b - w, span0: 0, span1: split, door: doorSpec(rng, split) },
    ],
  };
}

function diagonalSlice(rng) {
  const thick = narrowSpan(rng, CHUNK * 0.24, CHUNK * 0.38);
  const offset = rng.range(CHUNK * 0.3, CHUNK * 0.5);
  if (rng.chance(0.5)) {
    return {
      kind: "diag",
      zones: [
        { x0: 0, z0: 0, x1: offset, z1: thick },
        { x0: offset, z0: thick, x1: CHUNK, z1: CHUNK },
        { x0: 0, z0: thick, x1: CHUNK - offset, z1: CHUNK },
      ],
      innerWalls: [
        { axis: "z", pos: thick, span0: 0, span1: offset, door: null },
        { axis: "x", pos: offset, span0: thick, span1: CHUNK, door: doorSpec(rng, CHUNK - thick) },
      ],
    };
  }
  return {
    kind: "diag",
    zones: [
      { x0: CHUNK - offset, z0: 0, x1: CHUNK, z1: thick },
      { x0: 0, z0: CHUNK - thick, x1: CHUNK - offset, z1: CHUNK },
      { x0: offset, z0: 0, x1: CHUNK, z1: CHUNK - thick },
    ],
    innerWalls: [
      { axis: "z", pos: CHUNK - thick, span0: CHUNK - offset, span1: CHUNK, door: null },
      { axis: "x", pos: CHUNK - offset, span0: 0, span1: CHUNK - thick, door: doorSpec(rng, CHUNK - thick) },
    ],
  };
}

function forkHall(rng) {
  const arm = narrowSpan(rng, CHUNK * 0.24, CHUNK * 0.38);
  const cx = (CHUNK - arm) / 2;
  const splitZ = rng.range(CHUNK * 0.48, CHUNK * 0.72);
  const forkX = cx + arm * rng.range(0.35, 0.65);
  return {
    kind: "fork",
    zones: [
      { x0: cx, z0: 0, x1: cx + arm, z1: splitZ },
      { x0: 0, z0: splitZ, x1: forkX, z1: CHUNK },
      { x0: forkX, z0: splitZ, x1: CHUNK, z1: CHUNK },
    ],
    innerWalls: [
      { axis: "z", pos: splitZ, span0: forkX, span1: CHUNK, door: null },
      { axis: "x", pos: forkX, span0: splitZ, span1: CHUNK, door: doorSpec(rng, CHUNK - splitZ) },
    ],
  };
}

const BOUND_EPS = 0.25;

function wallTouchesBoundary(wall) {
  return wall.span0 <= BOUND_EPS || wall.span1 >= CHUNK - BOUND_EPS;
}

function wallEndpoints(wall) {
  if (wall.axis === "z") {
    return [
      { x: wall.span0, z: wall.pos },
      { x: wall.span1, z: wall.pos },
    ];
  }
  return [
    { x: wall.pos, z: wall.span0 },
    { x: wall.pos, z: wall.span1 },
  ];
}

function pointOnWall(point, wall, eps = 0.2) {
  if (wall.axis === "z") {
    if (Math.abs(point.z - wall.pos) > eps) return false;
    return point.x >= wall.span0 - eps && point.x <= wall.span1 + eps;
  }
  if (Math.abs(point.x - wall.pos) > eps) return false;
  return point.z >= wall.span0 - eps && point.z <= wall.span1 + eps;
}

function wallsLinked(a, b) {
  const eps = 0.2;
  const ea = wallEndpoints(a);
  const eb = wallEndpoints(b);
  for (const p of ea) {
    for (const q of eb) {
      if (Math.abs(p.x - q.x) <= eps && Math.abs(p.z - q.z) <= eps) return true;
    }
    if (pointOnWall(p, b, eps)) return true;
    for (const q of eb) {
      if (pointOnWall(q, a, eps)) return true;
    }
  }
  return false;
}

/** Every inner wall must link to the chunk boundary through connected segments */
export function isMazeConnected(innerWalls) {
  if (!innerWalls.length) return true;

  const anchored = innerWalls.map(wallTouchesBoundary);
  if (!anchored.some(Boolean)) return false;

  const visited = new Set();
  const queue = [];
  innerWalls.forEach((wall, i) => {
    if (anchored[i]) {
      visited.add(i);
      queue.push(i);
    }
  });

  while (queue.length) {
    const i = queue.shift();
    for (let j = 0; j < innerWalls.length; j++) {
      if (visited.has(j)) continue;
      if (wallsLinked(innerWalls[i], innerWalls[j])) {
        visited.add(j);
        queue.push(j);
      }
    }
  }

  return visited.size === innerWalls.length;
}

/** No wall segment with both ends floating in open floor */
function hasFloatingWalls(innerWalls) {
  return innerWalls.some(
    (wall) => wall.span0 > BOUND_EPS && wall.span1 < CHUNK - BOUND_EPS,
  );
}

/** Every inner wall must reach a chunk edge — no floating segments in open floor */
function wallsAnchorToBoundary(innerWalls) {
  return innerWalls.every(wallTouchesBoundary);
}

const NAV_CELL = 0.5;

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

function navBlocked(x, z, innerWalls) {
  if (x < 0.3 || x > CHUNK - 0.3 || z < 0.3 || z > CHUNK - 0.3) return true;
  for (const wall of innerWalls) {
    if (wallBlocksNav(wall, x, z)) return true;
  }
  return false;
}

function chunkDoors(cx, cz) {
  return {
    north: getSharedDoor(cx, cz, cx, cz - 1),
    south: getSharedDoor(cx, cz, cx, cz + 1),
    east: getSharedDoor(cx, cz, cx + 1, cz),
    west: getSharedDoor(cx, cz, cx - 1, cz),
  };
}

function chunkDoorPoints(doors) {
  const h = CHUNK / 2;
  return {
    north: { x: h + doors.north.offset, z: 0.55 },
    south: { x: h + doors.south.offset, z: CHUNK - 0.55 },
    east: { x: CHUNK - 0.55, z: h + doors.east.offset },
    west: { x: 0.55, z: h + doors.west.offset },
  };
}

function navCellKey(x, z) {
  return `${Math.floor(x / NAV_CELL)},${Math.floor(z / NAV_CELL)}`;
}

function navFloodKeys(innerWalls, startX, startZ) {
  const cols = Math.ceil(CHUNK / NAV_CELL);
  const visited = new Set();
  if (navBlocked(startX, startZ, innerWalls)) return visited;

  const queue = [[startX, startZ]];
  while (queue.length) {
    const [x, z] = queue.pop();
    if (navBlocked(x, z, innerWalls)) continue;
    const ix = Math.floor(x / NAV_CELL);
    const iz = Math.floor(z / NAV_CELL);
    if (ix < 0 || iz < 0 || ix >= cols || iz >= cols) continue;
    const key = navCellKey(x, z);
    if (visited.has(key)) continue;
    visited.add(key);

    const n = NAV_CELL;
    queue.push([x + n, z], [x - n, z], [x, z + n], [x, z - n]);
  }
  return visited;
}

/** North/south/east/west chunk doors must all lie in one walkable maze component */
function allExitsConnected(innerWalls, doors) {
  const pts = chunkDoorPoints(doors);
  const entries = [pts.north, pts.south, pts.east, pts.west];
  for (const p of entries) {
    if (navBlocked(p.x, p.z, innerWalls)) return false;
  }

  const reached = navFloodKeys(innerWalls, pts.north.x, pts.north.z);
  for (const p of entries) {
    if (!reached.has(navCellKey(p.x, p.z))) return false;
  }
  return true;
}

/** Reject layouts with zones too small to walk in comfortably */
function shapeIsWalkable(shape, minDim = MIN_ZONE_DIM) {
  for (const zone of shape.zones) {
    const w = zone.x1 - zone.x0;
    const d = zone.z1 - zone.z0;
    if (Math.min(w, d) < minDim) return false;
  }
  return true;
}

function isLoungeCell(cx, cz) {
  const h = fract(Math.sin(cx * 127.1 + cz * 311.7) * 43758.5453);
  return h < 0.025;
}

function pickSizeTier(rng, cx, cz) {
  if (isLoungeCell(cx, cz)) return "large";
  return rng.pickWeighted([
    ["small", 68],
    ["medium", 32],
  ]);
}

function buildShape(size, kind, rng, cx, cz) {
  const corner = () => rng.pick(["nw", "ne", "sw", "se"]);
  const stem = () => rng.pick(["north", "south", "east", "west"]);

  switch (kind) {
    case "compact-L":
      return compactL(rng, corner());
    case "chamber-corner":
      return smallAlcove(rng, corner());
    case "small-alcove":
      return smallAlcove(rng, corner());
    case "hall-ew":
      return hallEW(rng, cx, cz, false);
    case "hall-ns":
      return hallNS(rng, cx, cz, false);
    case "L":
      return lShape(rng, corner());
    case "T":
      return tShape(rng, stem());
    case "H":
      return hShape(rng);
    case "U":
      return uShape(rng);
    case "alcove":
      return alcove(rng, corner());
    case "cross":
      return crossHall(rng);
    case "zigzag":
      return zigzag(rng);
    case "hall-pockets":
      return hallWithPockets(rng, cx, cz);
    case "fork":
      return forkHall(rng);
    case "diag":
      return diagonalSlice(rng);
    case "twin":
      return twinZone(rng);
    case "lounge":
      return hubRoom(rng);
    case "wide-hall-ew":
      return hallEW(rng, cx, cz, true);
    case "wide-hall-ns":
      return hallNS(rng, cx, cz, true);
    case "triple":
      return tripleSplit(rng);
    case "stagger":
      return staggeredWings(rng);
    default:
      return { kind: "full", zones: [{ x0: 0, z0: 0, x1: CHUNK, z1: CHUNK }], innerWalls: [] };
  }
}

const SHAPE_WEIGHTS = {
  small: [
    ["compact-L", 18],
    ["small-alcove", 18],
    ["hall-ew", 17],
    ["hall-ns", 17],
    ["chamber-corner", 14],
    ["twin", 10],
    ["zigzag", 6],
  ],
  medium: [
    ["cross", 14],
    ["L", 12],
    ["T", 11],
    ["H", 9],
    ["U", 9],
    ["hall-ew", 9],
    ["hall-ns", 9],
    ["alcove", 8],
    ["hall-pockets", 8],
    ["fork", 7],
  ],
  large: [
    ["lounge", 70],
    ["wide-hall-ew", 15],
    ["wide-hall-ns", 15],
  ],
};

function pickShape(rng, cx, cz) {
  const size = pickSizeTier(rng, cx, cz);
  const kind = rng.pickWeighted(SHAPE_WEIGHTS[size]);
  const shape = buildShape(size, kind, rng, cx, cz);
  shape.sizeTier = size;
  return shape;
}

function pickValidShape(rng, cx, cz) {
  const doors = chunkDoors(cx, cz);
  for (let attempt = 0; attempt < 32; attempt++) {
    const shape = pickShape(rng, cx, cz);
    const minDim = shape.sizeTier === "small" ? MIN_ZONE_DIM_SMALL : MIN_ZONE_DIM;
    if (
      isMazeConnected(shape.innerWalls) &&
      wallsAnchorToBoundary(shape.innerWalls) &&
      !hasFloatingWalls(shape.innerWalls) &&
      shapeIsWalkable(shape, minDim) &&
      allExitsConnected(shape.innerWalls, doors)
    ) {
      return shape;
    }
  }
  return crossHall(rng);
}

export function generateRoom(cx, cz) {
  const rng = createRng(cx, cz, 7);
  const shape = pickValidShape(rng, cx, cz);

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
  addBox(boxes, x0, lo, z - t, z + t, y0, yTop);
  addBox(boxes, hi, x1, z - t, z + t, y0, yTop);
  addBox(boxes, lo, hi, z - t, z + t, y0 + DOOR_H, yTop);
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
  addBox(boxes, x - t, x + t, z0, lo, y0, yTop);
  addBox(boxes, x - t, x + t, hi, z1, y0, yTop);
  addBox(boxes, x - t, x + t, lo, hi, y0 + DOOR_H, yTop);
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
