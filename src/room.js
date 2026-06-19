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
  ROOM_H,
  PANEL_EDGE_INSET,
  PANEL_W,
  PANEL_H,
  PANEL_SIZE,
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

function generatePanels(rng, room) {
  const hash = (x) => fract(Math.sin(x * 12.9898 + room.lightSeed) * 43758.5453);
  const panels = [];
  const worldX = room.cx * CHUNK;
  const worldZ = room.cz * CHUNK;
  const tileM = CEILING_TILE_M;
  const halfCell = PANEL_SIZE / 2;

  for (const zone of room.zones) {
    const inset = zoneInset(zone);
    const xLo = zone.x0 + inset;
    const xHi = zone.x1 - inset;
    const zLo = zone.z0 + inset;
    const zHi = zone.z1 - inset;
    const zw = xHi - xLo;
    const zd = zHi - zLo;
    if (zw < PANEL_SIZE || zd < PANEL_SIZE) continue;

    const narrow = Math.min(zw, zd) < 5.2;
    const skip = narrow ? 0.14 : 0.28;
    const tileStride = Math.max(2, Math.round(room.lightSpacing / tileM));

    const { tx0, tx1, tz0, tz1 } = chunkTileRange(worldX, worldZ, CHUNK, tileM);

    for (let tx = tx0; tx <= tx1; tx++) {
      if (tx % tileStride !== 0) continue;
      for (let tz = tz0; tz <= tz1; tz++) {
        if (tz % tileStride !== 0) continue;
        const { x: px, z: pz } = tileCenterLocal(tx, tz, worldX, worldZ, tileM);

        if (px - halfCell < xLo || px + halfCell > xHi || pz - halfCell < zLo || pz + halfCell > zHi) {
          continue;
        }
        if (hash(tx * 3.1 + tz + zone.x0 * 0.7) < skip) continue;
        if (panelBlocked(px, pz, room)) continue;
        if (panelOverlapsExisting(px, pz, panels)) continue;
        panels.push({
          x: px,
          z: pz,
          tx,
          tz,
          on: true,
          bright: 0.9 + hash(tz + zone.z0) * 0.14,
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

function narrowSpan(rng, lo, hi) {
  return Math.max(MIN_PASSAGE_SPAN + 0.35, rng.range(lo, hi));
}

function hallEW(rng, forceWide = false) {
  const wide = forceWide || rng.chance(0.38);
  const depth = wide ? rng.range(7.8, 12.2) : narrowSpan(rng, 3.4, 5.8);
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
  const width = wide ? rng.range(7.8, 12.2) : narrowSpan(rng, 3.4, 5.8);
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
  const stemW = narrowSpan(rng, 3.6, 6.2);
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

function tripleSplit(rng) {
  if (rng.chance(0.5)) {
    const x1 = rng.range(4.0, 5.6);
    const x2 = rng.range(8.4, 10.0);
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

  const z1 = rng.range(4.0, 5.6);
  const z2 = rng.range(8.4, 10.0);
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
  const leg = rng.range(3.8, 5.8);
  const open = rng.range(4.8, 7.2);
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
  const margin = rng.range(2.8, 4.2);
  const cx0 = margin;
  const cz0 = margin;
  const cx1 = CHUNK - margin;
  const cz1 = CHUNK - margin;
  return {
    kind: "hub",
    zones: [
      { x0: 0, z0: 0, x1: CHUNK, z1: cz0 },
      { x0: 0, z0: cz1, x1: CHUNK, z1: CHUNK },
      { x0: 0, z0: cz0, x1: cx0, z1: cz1 },
      { x0: cx1, z0: cz0, x1: CHUNK, z1: cz1 },
      { x0: cx0, z0: cz0, x1: cx1, z1: cz1 },
    ],
    innerWalls: [
      { axis: "z", pos: cz0, span0: cx0, span1: cx1, door: doorSpec(rng, cx1 - cx0) },
      { axis: "z", pos: cz1, span0: cx0, span1: cx1, door: doorSpec(rng, cx1 - cx0) },
      { axis: "x", pos: cx0, span0: cz0, span1: cz1, door: doorSpec(rng, cz1 - cz0) },
      { axis: "x", pos: cx1, span0: cz0, span1: cz1, door: doorSpec(rng, cz1 - cz0) },
    ],
  };
}

function zigzag(rng) {
  const mid = rng.range(5.5, 8.5);
  const thick = narrowSpan(rng, 3.6, 5.4);
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

function hallWithPockets(rng) {
  const thick = narrowSpan(rng, 3.6, 5.2);
  const z0 = rng.range(0.3, CHUNK - thick - 0.3);
  const pocket = rng.range(3.2, 5.2);
  const side = rng.pick(["left", "right"]);
  const zones = [{ x0: 0, z0, x1: CHUNK, z1: z0 + thick }];
  const walls = [
    { axis: "z", pos: z0, span0: 0, span1: CHUNK, door: null },
    { axis: "z", pos: z0 + thick, span0: 0, span1: CHUNK, door: null },
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
  const pocket = rng.range(3.0, 4.8);
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
  const arm = narrowSpan(rng, 3.5, 5.4);
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
  const w = narrowSpan(rng, 3.6, 5.2);
  const split = rng.range(5.8, 8.2);
  const a = rng.range(1.2, 3.2);
  const b = rng.range(CHUNK - w - 3.2, CHUNK - 1.2);
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
  const thick = narrowSpan(rng, 3.8, 5.6);
  const offset = rng.range(4.5, 7.5);
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
  const arm = narrowSpan(rng, 3.5, 5.2);
  const cx = (CHUNK - arm) / 2;
  const splitZ = rng.range(6.2, 9.2);
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

function pickShape(rng) {
  const kind = rng.pickWeighted([
    ["full", 3],
    ["hall-ew", 10],
    ["hall-ns", 10],
    ["wide-hall-ew", 5],
    ["wide-hall-ns", 5],
    ["alcove", 12],
    ["L", 14],
    ["T", 10],
    ["triple", 9],
    ["U", 8],
    ["zigzag", 8],
    ["hall-pockets", 8],
    ["compound", 7],
    ["cross", 10],
    ["diag", 9],
    ["fork", 9],
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
    case "T":
      return tShape(rng, rng.pick(["north", "south", "east", "west"]));
    case "triple":
      return tripleSplit(rng);
    case "U":
      return uShape(rng);
    case "zigzag":
      return zigzag(rng);
    case "hall-pockets":
      return hallWithPockets(rng);
    case "compound":
      return compoundLT(rng);
    case "cross":
      return crossHall(rng);
    case "diag":
      return diagonalSlice(rng);
    case "fork":
      return forkHall(rng);
    default:
      return { kind: "full", zones: [{ x0: 0, z0: 0, x1: CHUNK, z1: CHUNK }], innerWalls: [] };
  }
}

function pickValidShape(rng) {
  for (let attempt = 0; attempt < 24; attempt++) {
    const shape = pickShape(rng);
    if (isMazeConnected(shape.innerWalls)) return shape;
  }
  return { kind: "full", zones: [{ x0: 0, z0: 0, x1: CHUNK, z1: CHUNK }], innerWalls: [] };
}

export function generateRoom(cx, cz) {
  const rng = createRng(cx, cz, 7);
  const shape = pickValidShape(rng);

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
