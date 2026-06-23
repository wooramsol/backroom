import { minPassageCells } from "./passage.js";

const MIN_DIM = minPassageCells();

/** Canonical room kinds for Step 2 (matches design + user spec). */
export const ROOM_KINDS = [
  "rect",
  "long-rect",
  "square",
  "L",
  "U",
  "Z",
  "T",
  "cross",
  "lounge",
  "narrow",
  "very-long",
];

function fillRect(w, h) {
  const cells = [];
  for (let x = 0; x < w; x++) {
    for (let z = 0; z < h; z++) cells.push([x, z]);
  }
  return cells;
}

function uniqueCells(cells) {
  const seen = new Set();
  const out = [];
  for (const [x, z] of cells) {
    const k = `${x},${z}`;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push([x, z]);
  }
  return out;
}

function bboxOf(cells) {
  let w = 0;
  let h = 0;
  for (const [x, z] of cells) {
    w = Math.max(w, x + 1);
    h = Math.max(h, z + 1);
  }
  return { w, h };
}

function finalize(kind, cells) {
  const { w, h } = bboxOf(cells);
  return { kind, cells: uniqueCells(cells), w, h };
}

/** Bounding-box footprint key — no two rooms in one chunk share this. */
export function roomSizeKey(shape) {
  const a = Math.min(shape.w, shape.h);
  const b = Math.max(shape.w, shape.h);
  return `${a}x${b}`;
}

function pickSquareDim(rng, min, max, usedSizes, maxTries = 48) {
  for (let t = 0; t < maxTries; t++) {
    const s = rng.int(min, max);
    const key = `${s}x${s}`;
    if (usedSizes.has(key)) continue;
    return { w: s, h: s, key };
  }
  return null;
}

function pickRectDims(rng, wMin, wMax, hMin, hMax, usedSizes, maxTries = 48) {
  for (let t = 0; t < maxTries; t++) {
    const w = rng.int(wMin, wMax);
    const h = rng.int(hMin, hMax);
    const key = `${Math.min(w, h)}x${Math.max(w, h)}`;
    if (usedSizes.has(key)) continue;
    return { w, h, key };
  }
  return null;
}

export function shapeSquare(rng, usedSizes = new Set(), maxSide = 9) {
  const dims = pickSquareDim(rng, MIN_DIM, maxSide, usedSizes);
  if (!dims) return null;
  const { w } = dims;
  return finalize("square", fillRect(w, w));
}

export function shapeRectangle(rng, usedSizes = new Set(), maxW = 12, maxH = 10) {
  const dims = pickRectDims(rng, MIN_DIM + 1, maxW, MIN_DIM + 1, maxH, usedSizes);
  if (!dims) return null;
  let { w, h } = dims;
  if (rng.chance(0.5)) [w, h] = [h, w];
  if (Math.max(w, h) / Math.min(w, h) >= 2.2) return null;
  return finalize("rect", fillRect(w, h));
}

export function shapeLongRectangle(rng, usedSizes = new Set()) {
  const dims = pickRectDims(rng, 7, 13, MIN_DIM, 6, usedSizes);
  if (!dims) return null;
  let { w, h } = dims;
  if (w < h) [w, h] = [h, w];
  if (w / h < 2 || w / h > 3.5) return null;
  return finalize("long-rect", fillRect(w, h));
}

export function shapeVeryLong(rng, usedSizes = new Set()) {
  const dims = pickRectDims(rng, 10, 14, MIN_DIM, 5, usedSizes);
  if (!dims) return null;
  let { w, h } = dims;
  if (w < h) [w, h] = [h, w];
  if (w / h < 3) return null;
  return finalize("very-long", fillRect(w, h));
}

export function shapeLounge(rng, usedSizes = new Set()) {
  const dims = pickRectDims(rng, 8, 13, 7, 12, usedSizes);
  if (!dims) return null;
  let { w, h } = dims;
  if (rng.chance(0.4)) [w, h] = [h, w];
  if (w * h < 42) return null;
  return finalize("lounge", fillRect(w, h));
}

export function shapeNarrow(rng, usedSizes = new Set()) {
  const dims = pickRectDims(rng, 6, 11, MIN_DIM, MIN_DIM + 1, usedSizes);
  if (!dims) return null;
  let { w, h } = dims;
  if (w < h) [w, h] = [h, w];
  if (h > MIN_DIM + 1) return null;
  return finalize("narrow", fillRect(w, h));
}

export function shapeL(rng, usedSizes = new Set()) {
  const dims = pickRectDims(rng, MIN_DIM * 2 + 2, 11, MIN_DIM * 2 + 2, 11, usedSizes);
  if (!dims) return null;
  const { w, h } = dims;
  const ax = rng.int(MIN_DIM, w - MIN_DIM - 1);
  const az = rng.int(MIN_DIM, h - MIN_DIM - 1);
  const cells = [];
  for (let x = 0; x < w; x++) {
    for (let z = 0; z < h; z++) {
      if (x < ax || z < az) cells.push([x, z]);
    }
  }
  return finalize("L", cells);
}

export function shapeU(rng, usedSizes = new Set()) {
  const dims = pickRectDims(rng, 6, 11, 5, 9, usedSizes);
  if (!dims) return null;
  const { w, h } = dims;
  const thick = rng.int(MIN_DIM, Math.min(4, Math.floor(w / 2) - 1));
  const cells = [];
  for (let x = 0; x < w; x++) {
    for (let z = 0; z < h; z++) {
      if (z < thick || x < thick || x >= w - thick) cells.push([x, z]);
    }
  }
  return finalize("U", cells);
}

export function shapeT(rng, usedSizes = new Set()) {
  const dims = pickRectDims(rng, 6, 10, 5, 9, usedSizes);
  if (!dims) return null;
  const { w, h } = dims;
  const bar = rng.int(MIN_DIM, Math.min(4, h - MIN_DIM));
  const stem = rng.int(MIN_DIM, Math.max(MIN_DIM, Math.floor(w / 2) - 1));
  const cells = [];
  for (let x = 0; x < w; x++) {
    for (let z = 0; z < h; z++) {
      const onBar = z < bar;
      const onStem = x >= stem && x < stem + bar && z >= bar;
      if (onBar || onStem) cells.push([x, z]);
    }
  }
  return finalize("T", cells);
}

export function shapeZ(rng, usedSizes = new Set()) {
  const dims = pickRectDims(rng, 7, 11, 5, 8, usedSizes);
  if (!dims) return null;
  const { w, h } = dims;
  const bar = rng.int(MIN_DIM, Math.min(4, Math.floor(h / 3)));
  const cells = [];
  for (let x = 0; x < w; x++) {
    for (let z = 0; z < h; z++) {
      const top = z < bar;
      const mid = z >= bar && z < h - bar && x >= bar && x < w - bar;
      const bot = z >= h - bar;
      if (top || mid || bot) cells.push([x, z]);
    }
  }
  return finalize("Z", cells);
}

export function shapeCross(rng, usedSizes = new Set()) {
  const dims = pickSquareDim(rng, 7, 11, usedSizes);
  if (!dims) return null;
  const { w, h } = dims;
  const bar = rng.int(MIN_DIM, Math.min(4, Math.floor(Math.min(w, h) / 2) - 1));
  const cx = Math.floor(w / 2);
  const cz = Math.floor(h / 2);
  const half = Math.floor(bar / 2);
  const cells = [];
  for (let x = 0; x < w; x++) {
    for (let z = 0; z < h; z++) {
      const onH = z >= cz - half && z < cz - half + bar;
      const onV = x >= cx - half && x < cx - half + bar;
      if (onH || onV) cells.push([x, z]);
    }
  }
  return finalize("cross", cells);
}

const ROOM_BUILDERS = [
  [shapeRectangle, 22],
  [shapeL, 16],
  [shapeLounge, 14],
  [shapeLongRectangle, 10],
  [shapeSquare, 8],
  [shapeNarrow, 14],
  [shapeVeryLong, 6],
  [shapeU, 12],
  [shapeZ, 5],
  [shapeT, 5],
  [shapeCross, 5],
];

const LOUNGE_BUILDERS = [
  [shapeLounge, 50],
  [shapeRectangle, 20],
  [shapeLongRectangle, 15],
  [shapeCross, 15],
];

function pickFromBuilders(rng, builders, usedSizes, maxAttempts = 20) {
  for (let i = 0; i < maxAttempts; i++) {
    const fn = rng.pickWeighted(builders);
    const shape = fn(rng, usedSizes);
    if (shape && shapePassageOK(shape)) return shape;
  }
  return null;
}

const COMPACT_BUILDERS = [
  [(rng, used) => shapeSquare(rng, used, 6), 25],
  [(rng, used) => shapeNarrow(rng, used), 25],
  [(rng, used) => shapeRectangle(rng, used, 8, 7), 20],
  [(rng, used) => shapeL(rng, used), 15],
  [(rng, used) => shapeT(rng, used), 10],
  [(rng, used) => shapeCross(rng, used), 10],
];

export function pickSeedLoungeShape(rng, usedSizes = new Set()) {
  for (let t = 0; t < 24; t++) {
    const dims = pickSquareDim(rng, 6, 8, usedSizes);
    if (!dims) break;
    const { w } = dims;
    const shape = finalize("lounge", fillRect(w, w));
    if (shapePassageOK(shape)) return shape;
    const dims2 = pickRectDims(rng, 6, 8, 6, 8, usedSizes);
    if (!dims2) continue;
    let { w: rw, h: rh } = dims2;
    if (rng.chance(0.4)) [rw, rh] = [rh, rw];
    const rect = finalize("lounge", fillRect(rw, rh));
    if (shapePassageOK(rect)) return rect;
  }
  return shapeLounge(rng, usedSizes) ?? shapeRectangle(rng, usedSizes, 8, 7);
}

export function pickCompactRoomShape(rng, usedSizes = new Set()) {
  return (
    pickFromBuilders(rng, COMPACT_BUILDERS, usedSizes, 32) ??
    shapeSquare(rng, usedSizes, 6) ??
    shapeRectangle(rng, usedSizes, 7, 6)
  );
}

export function pickLoungeShape(rng, usedSizes = new Set()) {
  return (
    pickFromBuilders(rng, LOUNGE_BUILDERS, usedSizes, 32) ??
    shapeLounge(rng, usedSizes) ??
    shapeRectangle(rng, usedSizes, 10, 9)
  );
}

export function pickRoomShape(rng, usedSizes = new Set()) {
  return (
    pickFromBuilders(rng, ROOM_BUILDERS, usedSizes, 40) ??
    shapeRectangle(rng, usedSizes, 10, 8) ??
    shapeSquare(rng, usedSizes, 8)
  );
}

/** @deprecated — organic multi-rect; kept for fallback compatibility */
export function shapeRandomOrtho(rng) {
  const parts = rng.int(2, 3);
  let cells = [];
  for (let i = 0; i < parts; i++) {
    const rw = rng.int(MIN_DIM, 7);
    const rh = rng.int(MIN_DIM, 7);
    const ox = rng.int(0, Math.max(0, 10 - rw));
    const oz = rng.int(0, Math.max(0, 10 - rh));
    for (const [x, z] of fillRect(rw, rh)) cells.push([ox + x, oz + z]);
  }
  return finalize("ortho", cells);
}

export function roomCentroid(cells) {
  let sx = 0;
  let sz = 0;
  for (const [x, z] of cells) {
    sx += x;
    sz += z;
  }
  const n = cells.length || 1;
  return { x: sx / n, z: sz / n };
}

function widthInShape(set, x, z, axis) {
  if (axis === "x") {
    let lo = x;
    let hi = x;
    while (set.has(`${lo - 1},${z}`)) lo--;
    while (set.has(`${hi + 1},${z}`)) hi++;
    return hi - lo + 1;
  }
  let lo = z;
  let hi = z;
  while (set.has(`${x},${lo - 1}`)) lo--;
  while (set.has(`${x},${hi + 1}`)) hi++;
  return hi - lo + 1;
}

/** Every cell in an orthogonal room footprint must be passable */
export function shapePassageOK(shape) {
  const set = new Set(shape.cells.map(([x, z]) => `${x},${z}`));
  for (const [x, z] of shape.cells) {
    const wx = widthInShape(set, x, z, "x");
    const wz = widthInShape(set, x, z, "z");
    if (Math.min(wx, wz) < MIN_DIM) return false;
  }
  return true;
}

export function shapeFallback(rng) {
  const w = rng.int(8, 11);
  const h = rng.int(7, 10);
  return finalize("fallback", fillRect(w, h));
}
