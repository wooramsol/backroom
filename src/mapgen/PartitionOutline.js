import { MAP_CELL_M, MAP_GRID_SIZE } from "../constants.js";
import { edgeKey } from "./RoomConnector.js";

const EPS = 1e-6;

function ridAt(grid, x, z) {
  if (!grid.inBounds(x, z)) return -1;
  return grid.roomId[grid.idx(x, z)];
}

/**
 * Outline with partition walls between rooms until a doorway is opened.
 */
export class PartitionOutline {
  constructor(grid, openEdges) {
    this.grid = grid;
    this.openEdges = openEdges;
  }

  partitionWall(x, z, side) {
    if (side === "east") {
      const rb = ridAt(this.grid, x + 1, z);
      const ra = ridAt(this.grid, x, z);
      if (rb < 0 || ra === rb) return false;
      return !this.openEdges.has(edgeKey(x, z, "east"));
    }
    if (side === "west") {
      const ra = ridAt(this.grid, x, z);
      const rb = ridAt(this.grid, x - 1, z);
      if (rb < 0 || ra === rb) return false;
      return !this.openEdges.has(edgeKey(x - 1, z, "east"));
    }
    if (side === "south") {
      const rb = ridAt(this.grid, x, z + 1);
      const ra = ridAt(this.grid, x, z);
      if (rb < 0 || ra === rb) return false;
      return !this.openEdges.has(edgeKey(x, z, "south"));
    }
    if (side === "north") {
      const ra = ridAt(this.grid, x, z);
      const rb = ridAt(this.grid, x, z - 1);
      if (rb < 0 || ra === rb) return false;
      return !this.openEdges.has(edgeKey(x, z - 1, "south"));
    }
    return false;
  }

  extract() {
    const raw = [];
    const size = this.grid.size;

    for (let z = 0; z < size; z++) {
      for (let x = 0; x < size; x++) {
        if (ridAt(this.grid, x, z) < 0) continue;

        if (!this.grid.isWalkable(x, z - 1)) {
          raw.push({ axis: "z", pos: z, s0: x, s1: x + 1 });
        } else if (this.partitionWall(x, z, "north")) {
          raw.push({ axis: "z", pos: z, s0: x, s1: x + 1 });
        }

        if (!this.grid.isWalkable(x + 1, z)) {
          raw.push({ axis: "x", pos: x + 1, s0: z, s1: z + 1 });
        } else if (this.partitionWall(x, z, "east")) {
          raw.push({ axis: "x", pos: x + 1, s0: z, s1: z + 1 });
        }

        if (!this.grid.isWalkable(x, z + 1)) {
          raw.push({ axis: "z", pos: z + 1, s0: x, s1: x + 1 });
        } else if (this.partitionWall(x, z, "south")) {
          raw.push({ axis: "z", pos: z + 1, s0: x, s1: x + 1 });
        }

        if (!this.grid.isWalkable(x - 1, z)) {
          raw.push({ axis: "x", pos: x, s0: z, s1: z + 1 });
        } else if (this.partitionWall(x, z, "west")) {
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
      group.sort((a, b) => a.s0 - b.s0);
      let cur = { ...group[0] };
      for (let i = 1; i < group.length; i++) {
        const e = group[i];
        if (Math.abs(e.s0 - cur.s1) < EPS) cur.s1 = e.s1;
        else {
          merged.push(cur);
          cur = { ...e };
        }
      }
      merged.push(cur);
    }
    return merged;
  }

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
