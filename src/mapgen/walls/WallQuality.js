import { CHUNK, WALL_T } from "../../constants.js";
import { isWalkableLocal } from "../../room.js";
import {
  CONNECTOR,
  DIR,
  classifyConnector,
  probeWalkableQuads,
} from "./ConnectorTypes.js";

const EPS = 0.02;
const HALF = WALL_T / 2;

function junctionPoints(segments) {
  const pts = new Map();

  const add = (x, z, dirBit) => {
    const k = `${x.toFixed(4)},${z.toFixed(4)}`;
    if (!pts.has(k)) pts.set(k, { x, z, dirs: 0 });
    pts.get(k).dirs |= dirBit;
  };

  for (const seg of segments) {
    if (seg.axis === "z") {
      add(seg.span0, seg.pos, DIR.E);
      add(seg.span1, seg.pos, DIR.W);
    } else {
      add(seg.pos, seg.span0, DIR.S);
      add(seg.pos, seg.span1, DIR.N);
    }
  }

  return pts;
}

/** Detect door/wide openings from intentional gaps between colinear wall runs. */
function doorGaps(segments) {
  const gaps = [];
  const buckets = new Map();

  for (const seg of segments) {
    const key = `${seg.axis}:${seg.pos.toFixed(4)}`;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(seg);
  }

  for (const [, group] of buckets) {
    group.sort((a, b) => a.span0 - b.span0);
    for (let i = 0; i < group.length - 1; i++) {
      const gap = group[i + 1].span0 - group[i].span1;
      if (gap >= 0.9 && gap <= 4.5) {
        gaps.push({
          axis: group[0].axis,
          pos: group[0].pos,
          span0: group[i].span1,
          span1: group[i + 1].span0,
          width: gap,
        });
      }
    }
  }

  return gaps;
}

/**
 * Post-generation QA — flags protrusions, thickness drift, and bad junctions.
 * Returns issue records; footprint union already prevents pillar overlap.
 */
export function validateWallMesh(room, segments, cells) {
  const issues = [];
  const innerWalls = room.innerWalls ?? [];
  const isWalkable = (x, z) => isWalkableLocal(x, z, innerWalls);

  const junctions = junctionPoints(segments);
  for (const [, pt] of junctions) {
    const mask = pt.dirs;
    const quads = probeWalkableQuads(pt.x, pt.z, isWalkable);
    const kind = classifyConnector(mask, quads);
    if (!kind) continue;

    if (kind === CONNECTOR.CROSS && mask !== 15) {
      issues.push({ kind: "junction", type: kind, at: [pt.x, pt.z], mask });
    }
  }

  for (const seg of segments) {
    const len = seg.span1 - seg.span0;
    if (len < 0.2) {
      issues.push({ kind: "short_segment", seg });
    }
  }

  const gaps = doorGaps(segments);
  for (const gap of gaps) {
    if (gap.width > 3.2) {
      issues.push({ kind: CONNECTOR.WIDE, gap });
    }
  }

  for (const cell of cells) {
    const w = cell.x1 - cell.x0;
    const d = cell.z1 - cell.z0;
    if (w > HALF + EPS && d > HALF + EPS && w > WALL_T + 0.05 && d > WALL_T + 0.05) {
      issues.push({ kind: "protrusion", cell, size: [w, d] });
    }
  }

  const maxSpan = CHUNK + WALL_T;
  for (const cell of cells) {
    if (cell.x0 < -EPS || cell.z0 < -EPS || cell.x1 > maxSpan || cell.z1 > maxSpan) {
      issues.push({ kind: "out_of_bounds", cell });
    }
  }

  return issues;
}

/**
 * Attempt automatic repair — erode isolated protrusion cells (rare after union).
 */
export function repairFootprint(cells) {
  return cells.filter((c) => {
    const w = c.x1 - c.x0;
    const d = c.z1 - c.z0;
    if (w > WALL_T + 0.06 && d > WALL_T + 0.06) return false;
    return true;
  });
}

export function analyzeConnectors(room, segments) {
  const innerWalls = room.innerWalls ?? [];
  const isWalkable = (x, z) => isWalkableLocal(x, z, innerWalls);
  const result = [];

  for (const [, pt] of junctionPoints(segments)) {
    const mask = pt.dirs;
    const quads = probeWalkableQuads(pt.x, pt.z, isWalkable);
    result.push({
      x: pt.x,
      z: pt.z,
      connector: classifyConnector(mask, quads),
      dirMask: mask,
      walkableQuads: quads,
    });
  }

  for (const gap of doorGaps(segments)) {
    result.push({
      x: (gap.span0 + gap.span1) / 2,
      z: gap.pos,
      connector: gap.width >= 2.5 ? CONNECTOR.WIDE : CONNECTOR.DOOR,
      width: gap.width,
    });
  }

  return result;
}
