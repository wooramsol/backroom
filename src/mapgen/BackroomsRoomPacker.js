import { MAP_GRID_SIZE, ROOM_CELLS_MAX, ROOM_CELLS_MIN } from "../constants.js";
import { CELL_FLOOR, GridMap } from "./grid.js";
import {
  pickLoungeShape,
  pickRoomShape,
  roomCentroid,
  shapePassageOK,
} from "./roomShapes.js";
import { minPassageCells } from "./passage.js";

const MARGIN = 1;
const MIN_DIM = minPassageCells();
const TARGET_FILL = 0.9;

function shapeFits(shape) {
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

/** Packs rooms edge-to-edge — offices touch, no corridor-first layout */
export class BackroomsRoomPacker {
  constructor(rng) {
    this.rng = rng;
    this.rooms = [];
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
    };
    this.rooms.push(room);
    return room;
  }

  tryPlace(grid, shape, id, requireTouch) {
    if (!shapeFits(shape)) return null;

    if (!requireTouch) {
      const ox = Math.floor((MAP_GRID_SIZE - shape.w) / 2);
      const oz = Math.floor((MAP_GRID_SIZE - shape.h) / 2);
      if (canPlace(grid, ox, oz, shape.cells, false)) {
        grid.stampCells(shape.cells, ox, oz, CELL_FLOOR, id);
        return this.placeRoom(shape, ox, oz, id);
      }
      return null;
    }

    const origins = attachOrigins(grid, shape);
    if (!origins.length) return null;
    const { ox, oz } = this.rng.pick(origins);
    grid.stampCells(shape.cells, ox, oz, CELL_FLOOR, id);
    return this.placeRoom(shape, ox, oz, id);
  }

  pickNextShape() {
    if (this.rooms.length === 0) return pickLoungeShape(this.rng);
    return this.rng.chance(0.22) ? pickLoungeShape(this.rng) : pickRoomShape(this.rng);
  }

  generate(grid) {
    this.rooms = [];
    let id = 0;

    const seed = this.tryPlace(grid, pickLoungeShape(this.rng), id++, false);
    if (!seed) {
      this.tryPlace(grid, pickRoomShape(this.rng), id++, false);
    }

    let fails = 0;
    while (fillRatio(grid) < TARGET_FILL && fails < 120) {
      const shape = this.pickNextShape();
      const room = this.tryPlace(grid, shape, id, true);
      if (room) {
        id++;
        fails = 0;
      } else {
        fails++;
      }
    }

    if (!this.rooms.length) {
      const shape = pickLoungeShape(this.rng);
      const ox = Math.floor((MAP_GRID_SIZE - shape.w) / 2);
      const oz = Math.floor((MAP_GRID_SIZE - shape.h) / 2);
      grid.stampCells(shape.cells, ox, oz, CELL_FLOOR, 0);
      this.placeRoom(shape, ox, oz, 0);
    }

    return this.rooms;
  }
}
