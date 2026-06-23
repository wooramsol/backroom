import { MAP_GRID_SIZE, ROOM_CELLS_MAX, ROOM_CELLS_MIN } from "../constants.js";
import { CELL_FLOOR, GridMap } from "./grid.js";
import {
  pickLoungeShape,
  pickRoomShape,
  pickCompactRoomShape,
  pickSeedLoungeShape,
  roomCentroid,
  roomSizeKey,
  shapePassageOK,
} from "./roomShapes.js";
import { minPassageCells } from "./passage.js";

const MARGIN = 1;
const MIN_DIM = minPassageCells();
const TARGET_FILL = 0.86;
const MAX_PACK_ATTEMPTS = 200;
const SEED_LOUNGE_MAX = 8;

function shapeFits(shape) {
  if (!shape) return false;
  if (shape.w < MIN_DIM || shape.h < MIN_DIM) return false;
  return (
    shape.w >= ROOM_CELLS_MIN &&
    shape.h >= ROOM_CELLS_MIN &&
    shape.w <= ROOM_CELLS_MAX &&
    shape.h <= ROOM_CELLS_MAX &&
    shapePassageOK(shape)
  );
}

function fillRatio(grid) {
  let floor = 0;
  const n = grid.size * grid.size;
  for (let z = 0; z < grid.size; z++) {
    for (let x = 0; x < grid.size; x++) {
      if (grid.get(x, z) === CELL_FLOOR) floor++;
    }
  }
  return floor / n;
}

function inMargin(x, z, size) {
  return x >= MARGIN && z >= MARGIN && x < size - MARGIN && z < size - MARGIN;
}

function canPlace(grid, ox, oz, cells, requireTouch) {
  let touches = false;
  for (const [dx, dz] of cells) {
    const x = ox + dx;
    const z = oz + dz;
    if (!inMargin(x, z, grid.size)) return false;
    if (grid.get(x, z) !== 0) return false;
  }

  if (!requireTouch) return true;

  for (const [dx, dz] of cells) {
    const x = ox + dx;
    const z = oz + dz;
    for (const [nx, nz] of [
      [x + 1, z],
      [x - 1, z],
      [x, z + 1],
      [x, z - 1],
    ]) {
      if (!grid.inBounds(nx, nz)) continue;
      if (grid.get(nx, nz) === CELL_FLOOR) touches = true;
    }
  }
  return touches;
}

function attachOrigins(grid, shape) {
  const origins = [];
  const seen = new Set();
  const dirs = [
    [1, 0],
    [-1, 0],
    [0, 1],
    [0, -1],
  ];

  for (let z = 0; z < grid.size; z++) {
    for (let x = 0; x < grid.size; x++) {
      if (grid.get(x, z) !== CELL_FLOOR) continue;
      for (const [dx, dz] of dirs) {
        const vx = x + dx;
        const vz = z + dz;
        if (!grid.inBounds(vx, vz) || grid.get(vx, vz) !== 0) continue;
        for (const [cx, cz] of shape.cells) {
          const ox = vx - cx;
          const oz = vz - cz;
          const key = `${ox},${oz}`;
          if (seen.has(key)) continue;
          seen.add(key);
          if (canPlace(grid, ox, oz, shape.cells, true)) origins.push({ ox, oz });
        }
      }
    }
  }
  return origins;
}

/** Packs rooms edge-to-edge — room-centric, no corridor-first layout */
export class BackroomsRoomPacker {
  constructor(rng) {
    this.rng = rng;
    this.rooms = [];
    this.usedSizes = new Set();
  }

  rememberSize(shape) {
    this.usedSizes.add(roomSizeKey(shape));
  }

  placeRoom(shape, ox, oz, id) {
    const room = {
      id,
      kind: shape.kind,
      ox,
      oz,
      cells: shape.cells.map(([x, z]) => [ox + x, oz + z]),
      localCells: shape.cells,
      centroid: roomCentroid(shape.cells.map(([x, z]) => [ox + x, oz + z])),
      sizeKey: roomSizeKey(shape),
    };
    this.rooms.push(room);
    this.rememberSize(shape);
    return room;
  }

  tryPlace(grid, shape, id, requireTouch) {
    if (!shapeFits(shape)) return null;

    if (!requireTouch) {
      const ox = MARGIN;
      const oz = MARGIN;
      if (canPlace(grid, ox, oz, shape.cells, false)) {
        grid.stampCells(shape.cells, ox, oz, CELL_FLOOR, id);
        return this.placeRoom(shape, ox, oz, id);
      }
      const cx = Math.floor((MAP_GRID_SIZE - shape.w) / 2);
      const cz = Math.floor((MAP_GRID_SIZE - shape.h) / 2);
      if (canPlace(grid, cx, cz, shape.cells, false)) {
        grid.stampCells(shape.cells, cx, cz, CELL_FLOOR, id);
        return this.placeRoom(shape, cx, cz, id);
      }
      return null;
    }

    const origins = attachOrigins(grid, shape);
    if (!origins.length) return null;
    const { ox, oz } = this.rng.pick(origins);
    grid.stampCells(shape.cells, ox, oz, CELL_FLOOR, id);
    return this.placeRoom(shape, ox, oz, id);
  }

  pickNextShape(fillRatio = 0) {
    if (this.rooms.length === 0) {
      return pickSeedLoungeShape(this.rng, this.usedSizes);
    }
    if (fillRatio >= 0.55) {
      return pickCompactRoomShape(this.rng, this.usedSizes) ?? pickRoomShape(this.rng, this.usedSizes);
    }
    if (this.rng.chance(0.1)) {
      return pickLoungeShape(this.rng, this.usedSizes);
    }
    return pickRoomShape(this.rng, this.usedSizes);
  }

  generate(grid) {
    this.rooms = [];
    this.usedSizes = new Set();
    let id = 0;

    const seed = this.tryPlace(grid, pickSeedLoungeShape(this.rng, this.usedSizes), id++, false);
    if (!seed) {
      this.tryPlace(grid, pickCompactRoomShape(this.rng, this.usedSizes), id++, false);
    }

    let fails = 0;
    while (fillRatio(grid) < TARGET_FILL && fails < MAX_PACK_ATTEMPTS) {
      const ratio = fillRatio(grid);
      let placed = false;
      for (let t = 0; t < 10; t++) {
        const shape = this.pickNextShape(ratio);
        if (!shape) continue;
        const room = this.tryPlace(grid, shape, id, true);
        if (room) {
          id++;
          fails = 0;
          placed = true;
          break;
        }
      }
      if (!placed) fails++;
    }

    if (!this.rooms.length) {
      const shape = pickSeedLoungeShape(this.rng, new Set());
      const ox = MARGIN;
      const oz = MARGIN;
      grid.stampCells(shape.cells, ox, oz, CELL_FLOOR, 0);
      this.placeRoom(shape, ox, oz, 0);
    }

    return this.rooms;
  }
}
