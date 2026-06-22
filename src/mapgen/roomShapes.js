/** Orthogonal room footprints as lists of [dx, dz] cell offsets */

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
  const s = rng.int(3, 8);
  return { kind: "square", cells: fillRect(s, s), w: s, h: s };
}

export function shapeRectangle(rng) {
  const w = rng.int(4, 12);
  const h = rng.int(3, 10);
  if (rng.chance(0.5)) return { kind: "rect", cells: fillRect(w, h), w, h };
  return { kind: "rect", cells: fillRect(h, w), w: h, h: w };
}

export function shapeLongHall(rng) {
  const long = rng.int(10, 14);
  const narrow = rng.int(3, 5);
  if (rng.chance(0.5)) return { kind: "hall-x", cells: fillRect(long, narrow), w: long, h: narrow };
  return { kind: "hall-z", cells: fillRect(narrow, long), w: narrow, h: long };
}

export function shapeNarrow(rng) {
  const long = rng.int(6, 12);
  const narrow = rng.int(3, 4);
  if (rng.chance(0.5)) return { kind: "narrow-x", cells: fillRect(long, narrow), w: long, h: narrow };
  return { kind: "narrow-z", cells: fillRect(narrow, long), w: narrow, h: long };
}

export function shapeL(rng) {
  const w = rng.int(5, 10);
  const h = rng.int(5, 10);
  const ax = rng.int(2, Math.max(2, w - 2));
  const az = rng.int(2, Math.max(2, h - 2));
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
  const thick = rng.int(2, 3);
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
  const bar = rng.int(2, 3);
  const stem = rng.int(2, Math.max(2, Math.floor(w / 2) - 1));
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
  const bar = rng.int(2, 3);
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
    const rw = rng.int(3, 7);
    const rh = rng.int(3, 7);
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
