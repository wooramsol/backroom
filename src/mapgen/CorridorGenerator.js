import {
  CORRIDOR_CELLS_MAX,
  CORRIDOR_CELLS_MIN,
  CORRIDOR_LOOP_FRAC_MAX,
  CORRIDOR_LOOP_FRAC_MIN,
  MAP_GRID_SIZE,
} from "../constants.js";
import { CELL_CORRIDOR, CELL_FLOOR, CELL_VOID, GridMap } from "./grid.js";

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

function stampDisc(grid, cx, cz, radius) {
  const r = Math.max(1, Math.floor(radius / 2));
  for (let dz = -r; dz <= r; dz++) {
    for (let dx = -r; dx <= r; dx++) {
      const x = Math.round(cx) + dx;
      const z = Math.round(cz) + dz;
      if (!grid.inBounds(x, z)) continue;
      if (grid.get(x, z) === CELL_VOID) grid.set(x, z, CELL_CORRIDOR);
    }
  }
}

function carveSegment(grid, x0, z0, x1, z1, halfW) {
  const steps = Math.max(Math.abs(x1 - x0), Math.abs(z1 - z0));
  for (let i = 0; i <= steps; i++) {
    const t = steps === 0 ? 0 : i / steps;
    const x = x0 + (x1 - x0) * t;
    const z = z0 + (z1 - z0) * t;
    stampDisc(grid, x, z, halfW * 2);
  }
}

/** Carves orthogonal corridors between rooms */
export class CorridorGenerator {
  constructor(rng) {
    this.rng = rng;
  }

  pickWidth() {
    return this.rng.int(CORRIDOR_CELLS_MIN, CORRIDOR_CELLS_MAX);
  }

  carvePath(grid, ax, az, bx, bz, width) {
    const halfW = width / 2;
    if (this.rng.chance(0.55)) {
      carveSegment(grid, ax, az, bx, az, halfW);
      carveSegment(grid, bx, az, bx, bz, halfW);
    } else {
      carveSegment(grid, ax, az, ax, bz, halfW);
      carveSegment(grid, ax, bz, bx, bz, halfW);
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

  connectDoorSpur(grid, doorX, doorZ) {
    grid.set(doorX, doorZ, CELL_CORRIDOR);
    const key = (x, z) => `${x},${z}`;
    const queue = [[doorX, doorZ]];
    const visited = new Set([key(doorX, doorZ)]);
    const parent = new Map();
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
      const mid = MAP_GRID_SIZE / 2;
      this.carvePath(grid, doorX, doorZ, mid, mid, this.pickWidth());
      return;
    }

    let [x, z] = found;
    while (!(x === doorX && z === doorZ)) {
      if (grid.get(x, z) === CELL_VOID) grid.set(x, z, CELL_CORRIDOR);
      const p = parent.get(key(x, z));
      if (!p) break;
      [x, z] = p;
    }
  }

  /** Ensure chunk-edge doors reach the walkable graph */
  connectChunkDoors(grid, rooms, doors) {
    const mid = MAP_GRID_SIZE / 2;
    const entries = [
      { x: Math.round(mid + doors.north.offset), z: 0 },
      { x: Math.round(mid + doors.south.offset), z: MAP_GRID_SIZE - 1 },
      { x: MAP_GRID_SIZE - 1, z: Math.round(mid + doors.east.offset) },
      { x: 0, z: Math.round(mid + doors.west.offset) },
    ];

    for (const entry of entries) {
      if (!grid.inBounds(entry.x, entry.z)) continue;
      this.connectDoorSpur(grid, entry.x, entry.z);
    }
  }
}
