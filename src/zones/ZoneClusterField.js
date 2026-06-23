/**
 * Step 3 — clustered macro-zone field (Voronoi seeds, not per-chunk random).
 * Similar zone types persist across many chunks, then switch abruptly at borders.
 */
import { ZONE_TYPES } from "./ZoneTypes.js";

const WORLD_ZONE_SEED = 88031;
const CLUSTER_SPACING = 7;

function hash32(x, y, salt = 0) {
  let h = (x | 0) * 374761393 + (y | 0) * 668265263 + salt + WORLD_ZONE_SEED;
  h = (h ^ (h >>> 13)) | 0;
  h = Math.imul(h, 1274126177);
  return (h ^ (h >>> 16)) >>> 0;
}

function zoneForSeed(sx, sz) {
  const h = hash32(sx, sz, 17);
  return ZONE_TYPES[h % ZONE_TYPES.length];
}

function seedPoint(gx, gz) {
  const h1 = hash32(gx, gz, 101);
  const h2 = hash32(gx, gz, 202);
  const jx = ((h1 % 1000) / 1000 - 0.5) * CLUSTER_SPACING * 0.55;
  const jz = ((h2 % 1000) / 1000 - 0.5) * CLUSTER_SPACING * 0.55;
  return {
    sx: gx * CLUSTER_SPACING + jx,
    sz: gz * CLUSTER_SPACING + jz,
    type: zoneForSeed(gx, gz),
    gridX: gx,
    gridZ: gz,
  };
}

/**
 * Macro zone at chunk coordinates — stable within a Voronoi cell.
 * @returns {{ type: string, clusterId: string, seedGx: number, seedGz: number }}
 */
export function getMacroZoneAt(cx, cz) {
  const gx0 = Math.floor(cx / CLUSTER_SPACING);
  const gz0 = Math.floor(cz / CLUSTER_SPACING);

  let best = null;
  let bestD = Infinity;

  for (let dgx = -1; dgx <= 1; dgx++) {
    for (let dgz = -1; dgz <= 1; dgz++) {
      const gx = gx0 + dgx;
      const gz = gz0 + dgz;
      const seed = seedPoint(gx, gz);
      const d = (cx - seed.sx) ** 2 + (cz - seed.sz) ** 2;
      if (d < bestD) {
        bestD = d;
        best = seed;
      }
    }
  }

  return {
    type: best.type,
    clusterId: `${best.gridX},${best.gridZ}`,
    seedGx: best.gridX,
    seedGz: best.gridZ,
  };
}

/** Sample zone grid for debug maps */
export function sampleZoneField(x0, z0, w, h) {
  const out = [];
  for (let z = z0; z < z0 + h; z++) {
    const row = [];
    for (let x = x0; x < x0 + w; x++) {
      row.push(getMacroZoneAt(x, z).type);
    }
    out.push(row);
  }
  return out;
}
