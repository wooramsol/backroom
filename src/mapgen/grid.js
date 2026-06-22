import { MAP_CELL_M, MAP_GRID_SIZE } from "../constants.js";

export const CELL_VOID = 0;
export const CELL_FLOOR = 1;
export const CELL_CORRIDOR = 2;

/** Discrete orthogonal grid — all coordinates snap to integer cells */
export class GridMap {
  constructor(size = MAP_GRID_SIZE) {
    this.size = size;
    this.cells = new Uint8Array(size * size);
    this.roomId = new Int16Array(size * size);
    this.roomId.fill(-1);
  }

  idx(x, z) {
    return z * this.size + x;
  }

  inBounds(x, z) {
    return x >= 0 && z >= 0 && x < this.size && z < this.size;
  }

  get(x, z) {
    if (!this.inBounds(x, z)) return CELL_VOID;
    return this.cells[this.idx(x, z)];
  }

  isWalkable(x, z) {
    const v = this.get(x, z);
    return v === CELL_FLOOR || v === CELL_CORRIDOR;
  }

  set(x, z, value, rid = -1) {
    if (!this.inBounds(x, z)) return;
    const i = this.idx(x, z);
    this.cells[i] = value;
    if (rid >= 0) this.roomId[i] = rid;
  }

  stampCells(cells, ox, oz, value, rid = -1) {
    for (const [dx, dz] of cells) {
      this.set(ox + dx, oz + dz, value, rid);
    }
  }

  /** Axis-aligned bounding box of walkable cells in metres */
  walkableBounds() {
    let x0 = this.size;
    let z0 = this.size;
    let x1 = 0;
    let z1 = 0;
    let any = false;
    for (let z = 0; z < this.size; z++) {
      for (let x = 0; x < this.size; x++) {
        if (!this.isWalkable(x, z)) continue;
        any = true;
        x0 = Math.min(x0, x);
        z0 = Math.min(z0, z);
        x1 = Math.max(x1, x + 1);
        z1 = Math.max(z1, z + 1);
      }
    }
    if (!any) return null;
    return {
      x0: x0 * MAP_CELL_M,
      z0: z0 * MAP_CELL_M,
      x1: x1 * MAP_CELL_M,
      z1: z1 * MAP_CELL_M,
    };
  }

  floodComponent(sx, sz) {
    const visited = new Set();
    if (!this.isWalkable(sx, sz)) return visited;
    const queue = [[sx, sz]];
    while (queue.length) {
      const [x, z] = queue.pop();
      const key = `${x},${z}`;
      if (visited.has(key)) continue;
      if (!this.isWalkable(x, z)) continue;
      visited.add(key);
      queue.push([x + 1, z], [x - 1, z], [x, z + 1], [x, z - 1]);
    }
    return visited;
  }

  toMetres(cell) {
    return cell * MAP_CELL_M;
  }
}

export function snapMetres(m) {
  return Math.round(m / MAP_CELL_M) * MAP_CELL_M;
}
