import {
  MAP_CELL_M,
  MIN_CLEAR_PASSAGE,
  MIN_PASSAGE_SPAN,
} from "../constants.js";

/** Walkable cells needed so the player body fits (floor grid, walls on edges) */
export function minPassageCells() {
  return Math.max(2, Math.ceil(MIN_PASSAGE_SPAN / MAP_CELL_M));
}

/** Preferred corridor width in cells — comfortable clearance */
export function minCorridorCells() {
  return Math.max(minPassageCells(), Math.ceil(MIN_CLEAR_PASSAGE / MAP_CELL_M));
}

export function doorPassageCells(doorWidthM) {
  return Math.max(minPassageCells(), Math.ceil(doorWidthM / MAP_CELL_M));
}

export function widthAlongX(grid, x, z) {
  let lo = x;
  let hi = x;
  while (grid.isWalkable(lo - 1, z)) lo--;
  while (grid.isWalkable(hi + 1, z)) hi++;
  return hi - lo + 1;
}

export function widthAlongZ(grid, x, z) {
  let lo = z;
  let hi = z;
  while (grid.isWalkable(x, lo - 1)) lo--;
  while (grid.isWalkable(x, hi + 1)) hi++;
  return hi - lo + 1;
}

/** Both axes at a point must allow the body — catches 1-cell-wide spurs */
export function localPassageOK(grid, x, z, minCells) {
  const wx = widthAlongX(grid, x, z);
  const wz = widthAlongZ(grid, x, z);
  return Math.min(wx, wz) >= minCells;
}

export function allPassagesWideEnough(grid, minCells = minPassageCells()) {
  for (let z = 0; z < grid.size; z++) {
    for (let x = 0; x < grid.size; x++) {
      if (!grid.isWalkable(x, z)) continue;
      if (!localPassageOK(grid, x, z, minCells)) return false;
    }
  }
  return true;
}

export function narrowPassageCells(grid, minCells = minPassageCells()) {
  const bad = [];
  for (let z = 0; z < grid.size; z++) {
    for (let x = 0; x < grid.size; x++) {
      if (!grid.isWalkable(x, z)) continue;
      if (!localPassageOK(grid, x, z, minCells)) bad.push([x, z]);
    }
  }
  return bad;
}
