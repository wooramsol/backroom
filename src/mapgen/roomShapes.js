import { minPassageCells } from "./passage.js";

const MIN_DIM = minPassageCells();

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

export function shapeSquare(rng) {
  const s = rng.int(MIN_DIM, 8);
  return { kind: "square", cells: fillRect(s, s), w: s, h: s };
}

export function shapeRectangle(rng) {
  const w = rng.int(Math.max(4, MIN_DIM), 12);
  const h = rng.int(MIN_DIM, 10);
  if (rng.chance(0.5)) return { kind: "rect", cells: fillRect(w, h), w, h };
  return { kind: "rect", cells: fillRect(h, w), w: h, h: w };
}

export function shapeLongHall(rng) {
  const long = rng.int(8, 14);
  const narrow = rng.int(MIN_DIM, 5);
  if (rng.chance(0.5)) return { kind: "meeting-x", cells: fillRect(long, narrow), w: long, h: narrow };
  return { kind: "meeting-z", cells: fillRect(narrow, long), w: narrow, h: long };
}

/** Wide open office / lounge */
export function shapeLounge(rng) {
  const w = rng.int(8, 13);
  const h = rng.int(7, 12);
  if (rng.chance(0.45)) return { kind: "lounge", cells: fillRect(w, h), w, h };
  return { kind: "lounge", cells: fillRect(h, w), w: h, h: w };
}

export function pickLoungeShape(rng) {
  return rng.pickWeighted([
    [shapeLounge, 55],
    [shapeRectangle, 20],
    [shapeLongHall, 15],
    [shapeRandomOrtho, 10],
  ])(rng);
}

export function shapeNarrow(rng) {
  const long = rng.int(6, 12);
  const narrow = rng.int(MIN_DIM, Math.max(MIN_DIM, 4));
  if (rng.chance(0.5)) return { kind: "narrow-x", cells: fillRect(long, narrow), w: long, h: narrow };
  return { kind: "narrow-z", cells: fillRect(narrow, long), w: narrow, h: long };
}

export function shapeL(rng) {
  const w = rng.int(MIN_DIM * 2 + 1, 10);
  const h = rng.int(MIN_DIM * 2 + 1, 10);
  const ax = rng.int(MIN_DIM, w - MIN_DIM);
  const az = rng.int(MIN_DIM, h - MIN_DIM);
  const cells = [];
  for (let x = 0; x < w; x++) {
    for (let z = 0; z < h; z++) {
      if (x < ax || z < az) cells.push([x, z]);
    }
  }
  return { kind: "L", cells: uniqueCells(cells), w, h };
}

export function shapeU(rng) {
  const w = rng.int(6, 11);
  const h = rng.int(5, 9);
  const thick = rng.int(MIN_DIM, 3);
  const cells = [];
  for (let x = 0; x < w; x++) {
    for (let z = 0; z < h; z++) {
      if (z < thick || x < thick || x >= w - thick) cells.push([x, z]);
    }
  }
  return { kind: "U", cells: uniqueCells(cells), w, h };
}

export function shapeT(rng) {
  const w = rng.int(6, 10);
  const h = rng.int(5, 9);
  const bar = rng.int(MIN_DIM, 3);
  const stem = rng.int(MIN_DIM, Math.max(MIN_DIM, Math.floor(w / 2) - 1));
  const cells = [];
  for (let x = 0; x < w; x++) {
    for (let z = 0; z < h; z++) {
      const onBar = z < bar;
      const onStem = x >= stem && x < stem + bar && z >= bar;
      if (onBar || onStem) cells.push([x, z]);
    }
  }
  return { kind: "T", cells: uniqueCells(cells), w, h };
}

export function shapeZ(rng) {
  const w = rng.int(7, 11);
  const h = rng.int(5, 8);
  const bar = rng.int(MIN_DIM, 3);
  const cells = [];
  for (let x = 0; x < w; x++) {
    for (let z = 0; z < h; z++) {
      const top = z < bar;
      const mid = z >= bar && z < h - bar && x >= bar && x < w - bar;
      const bot = z >= h - bar;
      if (top || mid || bot) cells.push([x, z]);
    }
  }
  return { kind: "Z", cells: uniqueCells(cells), w, h };
}

export function shapeRandomOrtho(rng) {
  const parts = rng.int(2, 4);
  let cells = [];
  let w = 0;
  let h = 0;
  for (let i = 0; i < parts; i++) {
    const rw = rng.int(MIN_DIM, 7);
    const rh = rng.int(MIN_DIM, 7);
    const ox = rng.int(0, Math.max(0, 10 - rw));
    const oz = rng.int(0, Math.max(0, 10 - rh));
    for (const [x, z] of fillRect(rw, rh)) {
      cells.push([ox + x, oz + z]);
      w = Math.max(w, ox + x + 1);
      h = Math.max(h, oz + z + 1);
    }
  }
  return { kind: "ortho", cells: uniqueCells(cells), w, h };
}

const BUILDERS = [
  [shapeSquare, 12],
  [shapeRectangle, 18],
  [shapeLongHall, 10],
  [shapeNarrow, 8],
  [shapeL, 14],
  [shapeU, 10],
  [shapeT, 8],
  [shapeZ, 6],
  [shapeRandomOrtho, 14],
];

export function pickRoomShape(rng) {
  const fn = rng.pickWeighted(BUILDERS);
  return fn(rng);
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
  return { kind: "fallback", cells: fillRect(w, h), w, h };
}
