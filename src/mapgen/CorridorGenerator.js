import {
  CORRIDOR_CELLS_MAX,
  CORRIDOR_LOOP_FRAC_MAX,
  CORRIDOR_LOOP_FRAC_MIN,
  MAP_GRID_SIZE,
} from "../constants.js";
import { CELL_CORRIDOR, CELL_FLOOR, CELL_VOID } from "./grid.js";
import { doorPassageCells, minCorridorCells } from "./passage.js";

function dist2(a, b) {
  const dx = a.x - b.x;
  const dz = a.z - b.z;
  return dx * dx + dz * dz;
}

function mstEdges(rooms) {
  if (rooms.length < 2) return [];
  const inTree = new Set([0]);
  const edges = [];

  while (inTree.size < rooms.length) {
    let best = null;
    let bestD = Infinity;
    for (const i of inTree) {
      for (let j = 0; j < rooms.length; j++) {
        if (inTree.has(j)) continue;
        const d = dist2(rooms[i].centroid, rooms[j].centroid);
        if (d < bestD) {
          bestD = d;
          best = [i, j];
        }
      }
    }
    if (best) {
      edges.push(best);
      inTree.add(best[1]);
    } else break;
  }
  return edges;
}

/** Stamp a widthCells × widthCells block centred on (cx, cz) */
function stampBlock(grid, cx, cz, widthCells) {
  const half = Math.floor(widthCells / 2);
  const extra = widthCells % 2;
  for (let dz = -half; dz < half + extra; dz++) {
    for (let dx = -half; dx < half + extra; dx++) {
      const x = Math.round(cx) + dx;
      const z = Math.round(cz) + dz;
      if (!grid.inBounds(x, z)) continue;
      if (grid.get(x, z) === CELL_VOID) grid.set(x, z, CELL_CORRIDOR);
    }
  }
}

function stampBlockForce(grid, cx, cz, widthCells) {
  const half = Math.floor(widthCells / 2);
  const extra = widthCells % 2;
  for (let dz = -half; dz < half + extra; dz++) {
    for (let dx = -half; dx < half + extra; dx++) {
      const x = Math.round(cx) + dx;
      const z = Math.round(cz) + dz;
      if (!grid.inBounds(x, z)) continue;
      grid.set(x, z, CELL_CORRIDOR);
    }
  }
}

function carveSegment(grid, x0, z0, x1, z1, widthCells) {
  const steps = Math.max(Math.abs(x1 - x0), Math.abs(z1 - z0));
  for (let i = 0; i <= steps; i++) {
    const t = steps === 0 ? 0 : i / steps;
    const x = x0 + (x1 - x0) * t;
    const z = z0 + (z1 - z0) * t;
    stampBlock(grid, x, z, widthCells);
  }
}

/** Carves orthogonal corridors between rooms */
export class CorridorGenerator {
  constructor(rng) {
    this.rng = rng;
    this.minWidth = minCorridorCells();
  }

  pickWidth() {
    const lo = this.minWidth;
    const hi = Math.max(lo, CORRIDOR_CELLS_MAX);
    return this.rng.int(lo, hi);
  }

  carvePath(grid, ax, az, bx, bz, widthCells) {
    const w = Math.max(this.minWidth, widthCells);
    if (this.rng.chance(0.55)) {
      carveSegment(grid, ax, az, bx, az, w);
      carveSegment(grid, bx, az, bx, bz, w);
    } else {
      carveSegment(grid, ax, az, ax, bz, w);
      carveSegment(grid, ax, bz, bx, bz, w);
    }
  }

  connectRooms(grid, rooms) {
    const edges = mstEdges(rooms);
    for (const [i, j] of edges) {
      const a = rooms[i].centroid;
      const b = rooms[j].centroid;
      this.carvePath(grid, a.x, a.z, b.x, b.z, this.pickWidth());
    }

    const loopFrac = this.rng.range(CORRIDOR_LOOP_FRAC_MIN, CORRIDOR_LOOP_FRAC_MAX);
    for (let i = 0; i < rooms.length; i++) {
      for (let j = i + 1; j < rooms.length; j++) {
        if (edges.some(([a, b]) => (a === i && b === j) || (a === j && b === i))) continue;
        if (this.rng.chance(loopFrac)) {
          const a = rooms[i].centroid;
          const b = rooms[j].centroid;
          this.carvePath(grid, a.x, a.z, b.x, b.z, this.pickWidth());
        }
      }
    }
  }

  /** Wide landing + corridor from chunk door to walkable area */
  connectDoorSpur(grid, doorX, doorZ, widthCells, inwardDx, inwardDz) {
    const w = Math.max(this.minWidth, widthCells);
    const depth = this.minWidth;

    for (let i = 0; i < depth; i++) {
      stampBlockForce(grid, doorX + inwardDx * i, doorZ + inwardDz * i, w);
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
        if (cell === CELL_FLOOR || cell === CELL_CORRIDOR) {
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
      const extraDepth = Math.max(2, Math.ceil(MAP_GRID_SIZE / 3));
      this.carvePath(
        grid,
        mouthX,
        mouthZ,
        mouthX + inwardDx * extraDepth,
        mouthZ + inwardDz * extraDepth,
        w,
      );
      return;
    }

    let [x, z] = found;
    while (true) {
      if (grid.get(x, z) === CELL_VOID) stampBlockForce(grid, x, z, w);
      if (x === mouthX && z === mouthZ) break;
      const p = parent.get(key(x, z));
      if (!p) break;
      [x, z] = p;
    }
  }

  widenAt(grid, x, z, widthCells) {
    stampBlockForce(grid, x, z, Math.max(this.minWidth, widthCells));
  }

  /** Ensure chunk-edge doors reach the walkable graph with player-sized openings */
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
      this.connectDoorSpur(grid, entry.x, entry.z, w, entry.dx, entry.dz);
    }
  }
}
