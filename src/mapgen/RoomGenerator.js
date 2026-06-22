import { MAP_GRID_SIZE, ROOM_CELLS_MIN, ROOM_CELLS_MAX } from "../constants.js";
import { CELL_FLOOR, GridMap } from "./grid.js";
import { pickRoomShape, roomCentroid, shapePassageOK } from "./roomShapes.js";
import { minPassageCells } from "./passage.js";

const MARGIN = 1;
const MIN_ROOM_DIM = minPassageCells();

function shapeFits(shape) {
  if (shape.w < MIN_ROOM_DIM || shape.h < MIN_ROOM_DIM) return false;
  return (
    shape.w >= ROOM_CELLS_MIN &&
    shape.h >= ROOM_CELLS_MIN &&
    shape.w <= ROOM_CELLS_MAX &&
    shape.h <= ROOM_CELLS_MAX
  );
}

function canPlace(grid, ox, oz, cells) {
  for (const [dx, dz] of cells) {
    const x = ox + dx;
    const z = oz + dz;
    if (x < MARGIN || z < MARGIN || x >= MAP_GRID_SIZE - MARGIN || z >= MAP_GRID_SIZE - MARGIN) {
      return false;
    }
    if (grid.get(x, z) !== 0) return false;
  }
  return true;
}

function pickOrigin(rng, shape) {
  const maxX = MAP_GRID_SIZE - MARGIN - shape.w;
  const maxZ = MAP_GRID_SIZE - MARGIN - shape.h;
  if (maxX < MARGIN || maxZ < MARGIN) return null;
  return { ox: rng.int(MARGIN, maxX), oz: rng.int(MARGIN, maxZ) };
}

/** Places non-overlapping orthogonal rooms on a grid */
export class RoomGenerator {
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

  tryAddRoom(grid, id) {
    for (let attempt = 0; attempt < 48; attempt++) {
      const shape = pickRoomShape(this.rng);
      if (!shapeFits(shape)) continue;
      if (!shapePassageOK(shape)) continue;
      const origin = pickOrigin(this.rng, shape);
      if (!origin) continue;
      if (!canPlace(grid, origin.ox, origin.oz, shape.cells)) continue;
      grid.stampCells(shape.cells, origin.ox, origin.oz, CELL_FLOOR, id);
      return this.placeRoom(shape, origin.ox, origin.oz, id);
    }
    return null;
  }

  generate(grid) {
    this.rooms = [];
    const count = this.rng.pickWeighted([
      [2, 10],
      [3, 22],
      [4, 28],
      [5, 20],
      [6, 12],
      [7, 8],
    ]);

    let id = 0;
    for (let i = 0; i < count; i++) {
      const room = this.tryAddRoom(grid, id);
      if (room) id++;
    }

    if (!this.rooms.length) {
      const shape = pickRoomShape(this.rng);
      const ox = Math.floor((MAP_GRID_SIZE - shape.w) / 2);
      const oz = Math.floor((MAP_GRID_SIZE - shape.h) / 2);
      grid.stampCells(shape.cells, ox, oz, CELL_FLOOR, 0);
      this.placeRoom(shape, ox, oz, 0);
    }

    return this.rooms;
  }
}
