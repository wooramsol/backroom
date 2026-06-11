import { createRng } from "./rng.js";

export const CELL = 12;
export const FLOOR_STEP = 3.1;
export const WALL_THICK = 0.14;

const DOOR_STYLES = ["standard", "wide", "narrow", "low", "offset"];

function rect(w, d) {
  const hw = w / 2;
  const hd = d / 2;
  return [
    [-hw, -hd],
    [hw, -hd],
    [hw, hd],
    [-hw, hd],
  ];
}

function lShape(rng) {
  const a = rng.range(5, 8);
  const b = rng.range(4, 7);
  const c = rng.range(3, 5);
  return [
    [-a / 2, -b / 2],
    [a / 2, -b / 2],
    [a / 2, -b / 2 + c],
    [-a / 2 + c, -b / 2 + c],
    [-a / 2 + c, b / 2],
    [-a / 2, b / 2],
  ];
}

function hex(rng) {
  const r = rng.range(3.8, 5.5);
  const sides = rng.int(5, 7);
  const rot = rng.range(0, Math.PI);
  const verts = [];
  for (let i = 0; i < sides; i++) {
    const a = rot + (i / sides) * Math.PI * 2;
    const jitter = rng.range(0.85, 1.15);
    verts.push([Math.cos(a) * r * jitter, Math.sin(a) * r * jitter]);
  }
  return verts;
}

function trapezoid(rng) {
  const w1 = rng.range(5, 9);
  const w2 = rng.range(4, 8);
  const d = rng.range(5, 9);
  return [
    [-w1 / 2, -d / 2],
    [w1 / 2, -d / 2],
    [w2 / 2, d / 2],
    [-w2 / 2, d / 2],
  ];
}

function hall(rng) {
  const w = rng.range(3, 5);
  const d = rng.range(10, 16);
  return rect(w, d);
}

function triangle(rng) {
  const s = rng.range(7, 10);
  return [
    [0, -s * 0.45],
    [s * 0.5, s * 0.35],
    [-s * 0.5, s * 0.35],
  ];
}

function pentagon(rng) {
  const r = rng.range(4, 6);
  const verts = [];
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i / 5) * Math.PI * 2;
    verts.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  return verts;
}

function edgeNormal(v0, v1) {
  const dx = v1[0] - v0[0];
  const dz = v1[1] - v0[1];
  const len = Math.hypot(dx, dz) || 1;
  return [dx / len, dz / len];
}

function outwardNormal(v0, v1, verts) {
  const n = edgeNormal(v0, v1);
  const mx = (v0[0] + v1[0]) / 2;
  const mz = (v0[1] + v1[1]) / 2;
  const cx = verts.reduce((s, v) => s + v[0], 0) / verts.length;
  const cz = verts.reduce((s, v) => s + v[1], 0) / verts.length;
  const dot = (mx - cx) * n[0] + (mz - cz) * n[1];
  return dot > 0 ? [-n[0], -n[1]] : n;
}

function cardinalOfEdge(v0, v1) {
  const n = edgeNormal(v0, v1);
  const ax = Math.abs(n[0]);
  const az = Math.abs(n[1]);
  if (az > ax) return n[1] < 0 ? "n" : "s";
  return n[0] > 0 ? "e" : "w";
}

function makeDoor(rng, edgeLen) {
  const style = rng.pick(DOOR_STYLES);
  let width = rng.range(1.1, 2.3);
  if (style === "wide") width = rng.range(2.2, 3.2);
  if (style === "narrow") width = rng.range(0.8, 1.3);
  width = Math.min(width, edgeLen * 0.65);

  let offset = 0;
  if (style === "offset") offset = rng.range(-edgeLen * 0.15, edgeLen * 0.15);

  let height = rng.range(2.0, 2.35);
  if (style === "low") height = rng.range(1.7, 2.0);

  return { width, offset, height, style };
}

export function generateRoom(cx, cz, floorLevel) {
  const rng = createRng(cx, cz, floorLevel);
  const type = rng.pick([
    "rect",
    "rect",
    "lshape",
    "hex",
    "trap",
    "hall",
    "tri",
    "pent",
  ]);

  let vertices;
  switch (type) {
    case "lshape":
      vertices = lShape(rng);
      break;
    case "hex":
      vertices = hex(rng);
      break;
    case "trap":
      vertices = trapezoid(rng);
      break;
    case "hall":
      vertices = hall(rng);
      break;
    case "tri":
      vertices = triangle(rng);
      break;
    case "pent":
      vertices = pentagon(rng);
      break;
    default:
      vertices = rect(rng.range(5.5, 10), rng.range(5, 9.5));
  }

  const height = floorLevel < 0 ? rng.range(2.4, 2.8) : rng.range(2.6, 3.3);
  const edges = [];

  for (let i = 0; i < vertices.length; i++) {
    const v0 = vertices[i];
    const v1 = vertices[(i + 1) % vertices.length];
    const len = Math.hypot(v1[0] - v0[0], v1[1] - v0[1]);
    const card = cardinalOfEdge(v0, v1);
    const normal = outwardNormal(v0, v1, vertices);
    const hasDoor = rng.chance(0.62);
    edges.push({
      v0,
      v1,
      len,
      card,
      normal,
      door: hasDoor ? makeDoor(rng, len) : null,
    });
  }

  let feature = null;
  const southEdge = edges.findIndex((e) => e.card === "s");
  const northEdge = edges.findIndex((e) => e.card === "n");

  if (cx === 0 && cz === 0 && floorLevel === 0) {
    feature = { type: "stairs_down", edgeIndex: southEdge >= 0 ? southEdge : 0 };
  } else if (cx === 0 && cz === 0 && floorLevel === -1) {
    feature = { type: "stairs_up", edgeIndex: northEdge >= 0 ? northEdge : 0 };
  } else if (floorLevel > -2 && rng.chance(0.055)) {
    feature = { type: "stairs_down", edgeIndex: rng.int(0, edges.length - 1) };
  } else if (floorLevel < 1 && rng.chance(0.05)) {
    feature = { type: "stairs_up", edgeIndex: rng.int(0, edges.length - 1) };
  }

  if (feature) {
    edges[feature.edgeIndex].door = null;
    edges[feature.edgeIndex].feature = feature.type;
  }

  return {
    cx,
    cz,
    floorLevel,
    type,
    vertices,
    height,
    edges,
    feature,
    isBasement: floorLevel < 0,
  };
}

function wallSegments(edge, door) {
  const dx = edge.v1[0] - edge.v0[0];
  const dz = edge.v1[1] - edge.v0[1];
  const len = edge.len;
  const ux = dx / len;
  const uz = dz / len;
  const mid = Math.max(0, (len - door.width) / 2 + door.offset);
  const d1 = Math.min(len, mid + door.width);

  const segs = [];
  if (mid > 0.15) {
    segs.push({ t0: 0, tLen: mid });
  }
  if (len - d1 > 0.15) {
    segs.push({ t0: d1, tLen: len - d1 });
  }
  return segs;
}

function segmentCollider(edge, t0, tLen, yBase, roomH, ox, oz) {
  const dx = edge.v1[0] - edge.v0[0];
  const dz = edge.v1[1] - edge.v0[1];
  const len = edge.len;
  const ux = dx / len;
  const uz = dz / len;
  const nx = edge.normal[0];
  const nz = edge.normal[1];
  const off = WALL_THICK / 2;

  const ax = edge.v0[0] + ux * t0 + nx * off + ox;
  const az = edge.v0[1] + uz * t0 + nz * off + oz;
  const bx = edge.v0[0] + ux * (t0 + tLen) + nx * off + ox;
  const bz = edge.v0[1] + uz * (t0 + tLen) + nz * off + oz;

  return {
    ax,
    az,
    bx,
    bz,
    nx,
    nz,
    halfLen: tLen / 2,
    minY: yBase,
    maxY: yBase + roomH,
  };
}

export function buildColliders(room) {
  const colliders = [];
  const yBase = room.floorLevel * FLOOR_STEP;
  const ox = room.cx * CELL;
  const oz = room.cz * CELL;

  for (const edge of room.edges) {
    if (edge.door && !edge.feature) {
      for (const s of wallSegments(edge, edge.door)) {
        colliders.push(segmentCollider(edge, s.t0, s.tLen, yBase, room.height, ox, oz));
      }
      const mid = Math.max(0, (edge.len - edge.door.width) / 2 + edge.door.offset);
      const d1 = Math.min(edge.len, mid + edge.door.width);
      colliders.push(
        segmentCollider(edge, mid, d1 - mid, yBase + edge.door.height, room.height - edge.door.height, ox, oz)
      );
    } else if (!edge.feature) {
      colliders.push(segmentCollider(edge, 0, edge.len, yBase, room.height, ox, oz));
    } else {
      colliders.push(segmentCollider(edge, 0, edge.len * 0.2, yBase, room.height, ox, oz));
      colliders.push(
        segmentCollider(edge, edge.len * 0.8, edge.len * 0.2, yBase, room.height, ox, oz)
      );
      colliders.push(
        segmentCollider(edge, 0, edge.len, yBase + room.height * 0.5, room.height * 0.5, ox, oz)
      );
    }
  }
  return colliders;
}

export function buildStairVolume(room) {
  if (!room.feature) return null;
  const edge = room.edges[room.feature.edgeIndex];
  const mx = (edge.v0[0] + edge.v1[0]) / 2;
  const mz = (edge.v0[1] + edge.v1[1]) / 2;
  const nx = edge.normal[0];
  const nz = edge.normal[1];
  const inward = 1.8;
  const cx = mx - nx * inward;
  const cz = mz - nz * inward;
  const yBase = room.floorLevel * FLOOR_STEP;
  const targetFloor = room.feature.type === "stairs_down" ? room.floorLevel - 1 : room.floorLevel + 1;

  return {
    type: room.feature.type,
    cx: cx + room.cx * CELL,
    cz: cz + room.cz * CELL,
    dirX: -nx,
    dirZ: -nz,
    width: 1.6,
    depth: 2.8,
    fromY: yBase,
    toY: targetFloor * FLOOR_STEP,
    targetFloor,
    sourceFloor: room.floorLevel,
  };
}
