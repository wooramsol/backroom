import { MAP_CELL_M, WALL_T } from "../constants.js";
import { OutlineExtractor } from "./OutlineExtractor.js";

const JUNCTION_EPS = 1e-4;

/**
 * Builds wall segments from outline edges with vertex-aware junction metadata.
 */
export class WallGenerator {
  static fromGrid(grid) {
    const extractor = new OutlineExtractor(grid);
    const cellEdges = extractor.filterBoundary(extractor.extract());
    const segments = extractor.toMetres(cellEdges);
    return WallGenerator.resolveJunctions(segments);
  }

  static resolveJunctions(segments) {
    const verts = WallGenerator.vertexMap(segments);

    return segments.map((seg) => {
      const startKey = WallGenerator.endKey(seg, "start");
      const endKey = WallGenerator.endKey(seg, "end");
      const startJ = verts.get(startKey) || { type: "end" };
      const endJ = verts.get(endKey) || { type: "end" };
      return {
        axis: seg.axis,
        pos: seg.pos,
        span0: seg.span0,
        span1: seg.span1,
        startJunction: startJ.type,
        endJunction: endJ.type,
      };
    });
  }

  static endKey(seg, end) {
    if (seg.axis === "z") {
      const x = end === "start" ? seg.span0 : seg.span1;
      return `${x.toFixed(4)},${seg.pos.toFixed(4)}`;
    }
    const z = end === "start" ? seg.span0 : seg.span1;
    return `${seg.pos.toFixed(4)},${z.toFixed(4)}`;
  }

  static vertexMap(segments) {
    const counts = new Map();

    for (const seg of segments) {
      for (const end of ["start", "end"]) {
        const key = WallGenerator.endKey(seg, end);
        if (!counts.has(key)) counts.set(key, { x: 0, z: 0, segs: [] });
        const v = counts.get(key);
        if (seg.axis === "z") {
          v.x = end === "start" ? seg.span0 : seg.span1;
          v.z = seg.pos;
        } else {
          v.x = seg.pos;
          v.z = end === "start" ? seg.span0 : seg.span1;
        }
        v.segs.push({ seg, end });
      }
    }

    const verts = new Map();
    for (const [key, v] of counts) {
      const axes = new Set(v.segs.map((s) => s.seg.axis));
      let type = "end";
      if (v.segs.length >= 3 && axes.size >= 2) type = "cross";
      else if (v.segs.length === 2 && axes.size === 2) type = "elbow";
      else if (v.segs.length === 2) type = "straight";
      verts.set(key, { type, x: v.x, z: v.z, count: v.segs.length });
    }
    return verts;
  }

  /** Runtime wall list — strips junction metadata for collision / legacy APIs */
  static toInnerWalls(segments) {
    return segments.map(({ axis, pos, span0, span1 }) => ({
      axis,
      pos,
      span0,
      span1,
    }));
  }

  static validate(segments) {
    const issues = [];
    const verts = WallGenerator.vertexMap(segments);

    for (const seg of segments) {
      const len = seg.span1 - seg.span0;
      if (len < MAP_CELL_M - JUNCTION_EPS) {
        issues.push({ kind: "short", seg });
      }
    }

    const seen = new Set();
    for (const seg of segments) {
      const key = `${seg.axis}|${seg.pos}|${seg.span0}|${seg.span1}`;
      if (seen.has(key)) issues.push({ kind: "duplicate", seg });
      seen.add(key);
    }

    for (const [key, v] of verts) {
      if (v.count === 1) issues.push({ kind: "dangling", key, v });
    }

    return issues;
  }

  static snapSegments(segments) {
    const half = WALL_T / 2;
    return segments.map((s) => ({
      ...s,
      pos: Math.round(s.pos / MAP_CELL_M) * MAP_CELL_M,
      span0: Math.round(s.span0 / MAP_CELL_M) * MAP_CELL_M,
      span1: Math.round(s.span1 / MAP_CELL_M) * MAP_CELL_M,
    }));
  }
}
