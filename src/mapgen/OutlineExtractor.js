import { MAP_CELL_M, MAP_GRID_SIZE } from "../constants.js";

const EPS = 1e-6;

/**
 * Extract orthogonal outline edges from a walkable cell set.
 * Walls sit on cell boundaries; each edge is centred on the boundary line.
 */
export class OutlineExtractor {
  constructor(grid) {
    this.grid = grid;
  }

  extract() {
    const raw = [];
    const size = this.grid.size;

    for (let z = 0; z < size; z++) {
      for (let x = 0; x < size; x++) {
        if (!this.grid.isWalkable(x, z)) continue;

        if (!this.grid.isWalkable(x, z - 1)) {
          raw.push({ axis: "z", pos: z, s0: x, s1: x + 1 });
        }
        if (!this.grid.isWalkable(x + 1, z)) {
          raw.push({ axis: "x", pos: x + 1, s0: z, s1: z + 1 });
        }
        if (!this.grid.isWalkable(x, z + 1)) {
          raw.push({ axis: "z", pos: z + 1, s0: x, s1: x + 1 });
        }
        if (!this.grid.isWalkable(x - 1, z)) {
          raw.push({ axis: "x", pos: x, s0: z, s1: z + 1 });
        }
      }
    }

    return this.mergeColinear(raw);
  }

  mergeColinear(edges) {
    const buckets = new Map();
    for (const e of edges) {
      const key = `${e.axis}:${e.pos}`;
      if (!buckets.has(key)) buckets.set(key, []);
      buckets.get(key).push(e);
    }

    const merged = [];
    for (const [, group] of buckets) {
      const axis = group[0].axis;
      group.sort((a, b) => a.s0 - b.s0);
      let cur = { ...group[0] };
      for (let i = 1; i < group.length; i++) {
        const e = group[i];
        if (Math.abs(e.s0 - cur.s1) < EPS) {
          cur.s1 = e.s1;
        } else {
          merged.push(cur);
          cur = { ...e };
        }
      }
      merged.push(cur);
      void axis;
    }
    return merged;
  }

  /** Drop edges that lie on the chunk outer boundary — handled by boundary walls */
  filterBoundary(edges) {
    const size = MAP_GRID_SIZE;
    return edges.filter((e) => {
      if (e.axis === "z" && (e.pos <= 0 || e.pos >= size)) return false;
      if (e.axis === "x" && (e.pos <= 0 || e.pos >= size)) return false;
      return true;
    });
  }

  toMetres(edges) {
    return edges.map((e) => ({
      axis: e.axis,
      pos: e.pos * MAP_CELL_M,
      span0: e.s0 * MAP_CELL_M,
      span1: e.s1 * MAP_CELL_M,
    }));
  }
}
