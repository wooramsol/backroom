import {
  CORRIDOR_CELLS_MAX,
  MAP_GRID_SIZE,
} from "../constants.js";
import { CELL_CORRIDOR, CELL_FLOOR, CELL_VOID } from "./grid.js";
import { doorPassageCells, minCorridorCells } from "./passage.js";

function stampBlockFloor(grid, cx, cz, widthCells, roomId) {
  const half = Math.floor(widthCells / 2);
  const extra = widthCells % 2;
  for (let dz = -half; dz < half + extra; dz++) {
    for (let dx = -half; dx < half + extra; dx++) {
      const x = Math.round(cx) + dx;
      const z = Math.round(cz) + dz;
      if (!grid.inBounds(x, z)) continue;
      grid.set(x, z, CELL_FLOOR, roomId);
    }
  }
}

function nearestRoom(rooms, x, z) {
  let best = rooms[0];
  let d = Infinity;
  for (const room of rooms) {
    const dx = room.centroid.x - x;
    const dz = room.centroid.z - z;
    const dd = dx * dx + dz * dz;
    if (dd < d) {
      d = dd;
      best = room;
    }
  }
  return best;
}

/** Short boundary spurs only — stamped as floor, not dungeon corridors */
export class CorridorGenerator {
  constructor(rng) {
    this.rng = rng;
    this.minWidth = minCorridorCells();
  }

  pickWidth() {
    return this.rng.int(this.minWidth, Math.max(this.minWidth, CORRIDOR_CELLS_MAX));
  }

  connectDoorSpur(grid, doorX, doorZ, widthCells, inwardDx, inwardDz, rooms) {
    const w = Math.max(this.minWidth, widthCells);
    const depth = this.minWidth;
    const room = nearestRoom(rooms, doorX + inwardDx * 2, doorZ + inwardDz * 2);

    for (let i = 0; i < depth; i++) {
      stampBlockFloor(grid, doorX + inwardDx * i, doorZ + inwardDz * i, w, room.id);
    }

    const mouthX = doorX + inwardDx * (depth - 1);
    const mouthZ = doorZ + inwardDz * (depth - 1);
    const key = (x, z) => `${x},${z}`;
    const queue = [];
    const visited = new Set();
    const parent = new Map();

    const half = Math.floor(w / 2);
    const extra = w % 2;
    for (let dz = -half; dz < half + extra; dz++) {
      for (let dx = -half; dx < half + extra; dx++) {
        const x = mouthX + dx;
        const z = mouthZ + dz;
        if (!grid.inBounds(x, z)) continue;
        const k = key(x, z);
        visited.add(k);
        queue.push([x, z]);
      }
    }

    let found = null;

    while (queue.length && !found) {
      const [x, z] = queue.shift();
      for (const [dx, dz] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nx = x + dx;
        const nz = z + dz;
        if (!grid.inBounds(nx, nz)) continue;
        const k = key(nx, nz);
        if (visited.has(k)) continue;
        const cell = grid.get(nx, nz);
        if (cell === CELL_FLOOR) {
          found = [nx, nz];
          parent.set(k, [x, z]);
          break;
        }
        if (cell === CELL_VOID) {
          visited.add(k);
          parent.set(k, [x, z]);
          queue.push([nx, nz]);
        }
      }
    }

    if (!found) {
      const extraDepth = Math.max(2, Math.ceil(MAP_GRID_SIZE / 4));
      for (let i = 1; i <= extraDepth; i++) {
        stampBlockFloor(
          grid,
          mouthX + inwardDx * i,
          mouthZ + inwardDz * i,
          w,
          room.id,
        );
      }
      return;
    }

    let [x, z] = found;
    while (true) {
      if (grid.get(x, z) === CELL_VOID) stampBlockFloor(grid, x, z, w, room.id);
      if (x === mouthX && z === mouthZ) break;
      const p = parent.get(key(x, z));
      if (!p) break;
      [x, z] = p;
    }
  }

  widenAt(grid, x, z, widthCells, roomId) {
    stampBlockFloor(grid, x, z, Math.max(this.minWidth, widthCells), roomId);
  }

  connectChunkDoors(grid, rooms, doors) {
    const mid = MAP_GRID_SIZE / 2;
    const entries = [
      { x: Math.round(mid + doors.north.offset), z: 0, door: doors.north, dx: 0, dz: 1 },
      { x: Math.round(mid + doors.south.offset), z: MAP_GRID_SIZE - 1, door: doors.south, dx: 0, dz: -1 },
      { x: MAP_GRID_SIZE - 1, z: Math.round(mid + doors.east.offset), door: doors.east, dx: -1, dz: 0 },
      { x: 0, z: Math.round(mid + doors.west.offset), door: doors.west, dx: 1, dz: 0 },
    ];

    for (const entry of entries) {
      if (!grid.inBounds(entry.x, entry.z)) continue;
      const w = doorPassageCells(entry.door.width);
      this.connectDoorSpur(grid, entry.x, entry.z, w, entry.dx, entry.dz, rooms);
    }
  }
}

/** Rare void filler — only when absolutely needed */
export function stampCorridorCell(grid, x, z) {
  if (grid.get(x, z) === CELL_VOID) grid.set(x, z, CELL_CORRIDOR);
}
