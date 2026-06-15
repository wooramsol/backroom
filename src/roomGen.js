import { createRng } from "./rng.js";

export const CELL = 12;
export const HW = CELL / 2;
export const FLOOR_STEP = 3.1;
export const WALL_THICK = 0.18;
export const DOOR_H = 2.25;
export const DOOR_CLEARANCE = 0.35;

const H = HW;

const DOOR_STYLES = ["standard", "wide", "narrow", "offset"];

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
  const cut = rng.range(3.5, 5.5);
  return [
    [-H, -H],
    [H, -H],
    [H, -H + cut],
    [-H + cut, -H + cut],
    [-H + cut, H],
    [-H, H],
  ];
}

function tShape(rng) {
  const arm = rng.range(3, 4.5);
  const stem = rng.range(2.5, 4);
  return [
    [-H, -H],
    [H, -H],
    [H, -H + arm],
    [stem, -H + arm],
    [stem, H],
    [-stem, H],
    [-stem, -H + arm],
    [-H, -H + arm],
  ];
}

function uShape(rng) {
  const leg = rng.range(3.5, 5);
  const gap = rng.range(3, 5);
  const half = gap / 2;
  return [
    [-H, -H],
    [H, -H],
    [H, H],
    [half, H],
    [half, -H + leg],
    [-half, -H + leg],
    [-half, H],
    [-H, H],
  ];
}

function trapezoid(rng) {
  const narrow = rng.range(3.5, 5);
  return [
    [-H, -H],
    [H, -H],
    [narrow, H],
    [-narrow, H],
  ];
}

function pentagon(rng) {
  const notch = rng.range(2, 4);
  return [
    [-H, -H],
    [H, -H],
    [H, H - notch],
    [0, H],
    [-H, H],
  ];
}

function octagon(rng) {
  const c = rng.range(2.5, 4);
  return [
    [-H, -H + c],
    [-H + c, -H],
    [H - c, -H],
    [H, -H + c],
    [H, H - c],
    [H - c, H],
    [-H + c, H],
    [-H, H - c],
  ];
}

function hall(rng) {
  const w = rng.range(3, 5.5);
  const hw = w / 2;
  return [
    [-hw, -H],
    [hw, -H],
    [hw, H],
    [-hw, H],
  ];
}

function wideHall(rng) {
  const d = rng.range(3, 5.5);
  const hd = d / 2;
  return [
    [-H, -hd],
    [H, -hd],
    [H, hd],
    [-H, hd],
  ];
}

function triangle(rng) {
  const cut = rng.range(4, 6);
  return [
    [-H, -H],
    [H, -H],
    [0, H],
    [-cut, H],
    [-H, H - cut],
  ];
}

function zigzag(rng) {
  const s = rng.range(2.5, 4);
  return [
    [-H, -H],
    [0, -H],
    [0, -s],
    [H, -s],
    [H, s],
    [0, s],
    [0, H],
    [-H, H],
  ];
}

function outwardNormal(v0, v1, verts) {
  const dx = v1[0] - v0[0];
  const dz = v1[1] - v0[1];
  const len = Math.hypot(dx, dz) || 1;
  const nx = dx / len;
  const nz = dz / len;
  const mx = (v0[0] + v1[0]) / 2;
  const mz = (v0[1] + v1[1]) / 2;
  const cx = verts.reduce((s, v) => s + v[0], 0) / verts.length;
  const cz = verts.reduce((s, v) => s + v[1], 0) / verts.length;
  const dot = (mx - cx) * nx + (mz - cz) * nz;
  return dot > 0 ? [-nx, -nz] : [nx, nz];
}

function boundarySide(v0, v1) {
  const mx = (v0[0] + v1[0]) / 2;
  const mz = (v0[1] + v1[1]) / 2;
  const eps = 0.35;
  if (Math.abs(mz + H) < eps && Math.abs(v0[0] - v1[0]) > 0.5) return "n";
  if (Math.abs(mz - H) < eps && Math.abs(v0[0] - v1[0]) > 0.5) return "s";
  if (Math.abs(mx - H) < eps && Math.abs(v0[1] - v1[1]) > 0.5) return "e";
  if (Math.abs(mx + H) < eps && Math.abs(v0[1] - v1[1]) > 0.5) return "w";
  return null;
}

function makeDoor(rng, edgeLen) {
  const style = rng.pick(DOOR_STYLES);
  let width = rng.range(1.4, 2.4);
  if (style === "wide") width = rng.range(2.4, 3.4);
  if (style === "narrow") width = rng.range(1.0, 1.5);
  width = Math.min(width, edgeLen * 0.55);

  let offset = 0;
  if (style === "offset") offset = rng.range(-edgeLen * 0.22, edgeLen * 0.22);

  return { width, offset, height: DOOR_H, style };
}

/** Deterministic door on shared cell boundary — same for both neighbors. */
export function getBoundaryDoor(x0, z0, x1, z1, floor) {
  const ax = Math.min(x0, x1);
  const az = Math.min(z0, z1);
  const bx = Math.max(x0, x1);
  const bz = Math.max(z0, z1);
  const rng = createRng(ax, az, bx, bz, floor, 17);
  return {
    width: rng.pick([2.0, 2.4, 2.8]),
    offset: rng.range(-1.8, 1.8),
    height: DOOR_H,
    style: "standard",
  };
}

function cellBoundaryEdges(cx, cz, floor) {
  const len = CELL;
  const specs = [
    { v0: [-H, -H], v1: [H, -H], side: "n", nx: cx, nz: cz - 1 },
    { v0: [H, -H], v1: [H, H], side: "e", nx: cx + 1, nz: cz },
    { v0: [H, H], v1: [-H, H], side: "s", nx: cx, nz: cz + 1 },
    { v0: [-H, H], v1: [-H, -H], side: "w", nx: cx - 1, nz: cz },
  ];

  return specs.map((s) => ({
    v0: s.v0,
    v1: s.v1,
    len,
    side: s.side,
    normal: outwardNormal(s.v0, s.v1, [
      [-H, -H],
      [H, -H],
      [H, H],
      [-H, H],
    ]),
    door: getBoundaryDoor(cx, cz, s.nx, s.nz, floor),
  }));
}

function shapeInteriorEdges(vertices, rng) {
  const edges = [];
  for (let i = 0; i < vertices.length; i++) {
    const v0 = vertices[i];
    const v1 = vertices[(i + 1) % vertices.length];
    if (boundarySide(v0, v1)) continue;

    const len = Math.hypot(v1[0] - v0[0], v1[1] - v0[1]);
    if (len < 0.4) continue;

    edges.push({
      v0,
      v1,
      len,
      side: null,
      normal: outwardNormal(v0, v1, vertices),
      door: rng.chance(0.4) ? makeDoor(rng, len) : null,
    });
  }
  return edges;
}

export function generateRoom(cx, cz, floorLevel) {
  const rng = createRng(cx, cz, floorLevel);
  const type = rng.pick([
    "rect",
    "rect",
    "lshape",
    "tshape",
    "ushape",
    "trap",
    "pent",
    "oct",
    "hall",
    "widehall",
    "tri",
    "zig",
  ]);

  let vertices;
  switch (type) {
    case "lshape":
      vertices = lShape(rng);
      break;
    case "tshape":
      vertices = tShape(rng);
      break;
    case "ushape":
      vertices = uShape(rng);
      break;
    case "trap":
      vertices = trapezoid(rng);
      break;
    case "pent":
      vertices = pentagon(rng);
      break;
    case "oct":
      vertices = octagon(rng);
      break;
    case "hall":
      vertices = hall(rng);
      break;
    case "widehall":
      vertices = wideHall(rng);
      break;
    case "tri":
      vertices = triangle(rng);
      break;
    case "zig":
      vertices = zigzag(rng);
      break;
    default:
      vertices = rect(
        rng.range(CELL - 2, CELL),
        rng.range(CELL - 2, CELL)
      );
  }

  const height = floorLevel < 0 ? rng.range(2.4, 2.8) : rng.range(2.6, 3.2);
  const edges = [
    ...cellBoundaryEdges(cx, cz, floorLevel),
    ...shapeInteriorEdges(vertices, rng),
  ];

  return {
    cx,
    cz,
    floorLevel,
    type,
    vertices,
    height,
    edges,
    isBasement: floorLevel < 0,
  };
}

function wallSegments(edge, door) {
  const dx = edge.v1[0] - edge.v0[0];
  const dz = edge.v1[1] - edge.v0[1];
  const len = edge.len;
  const ux = dx / len;
  const uz = dz / len;
  const half = door.width / 2 + DOOR_CLEARANCE;
  const mid = len / 2 + door.offset;
  const d0 = mid - half;
  const d1 = mid + half;

  const segs = [];
  if (d0 > 0.15) {
    segs.push({
      v0: edge.v0,
      v1: [edge.v0[0] + ux * d0, edge.v0[1] + uz * d0],
      normal: edge.normal,
    });
  }
  if (len - d1 > 0.15) {
    segs.push({
      v0: [edge.v0[0] + ux * d1, edge.v0[1] + uz * d1],
      v1: edge.v1,
      normal: edge.normal,
    });
  }
  if (door.height < DOOR_H - 0.05) {
    segs.push({
      v0: [edge.v0[0] + ux * d0, edge.v0[1] + uz * d0],
      v1: [edge.v0[0] + ux * d1, edge.v0[1] + uz * d1],
      normal: edge.normal,
      lintelOnly: true,
      lintelY: door.height,
    });
  } else {
    segs.push({
      v0: [edge.v0[0] + ux * d0, edge.v0[1] + uz * d0],
      v1: [edge.v0[0] + ux * d1, edge.v0[1] + uz * d1],
      normal: edge.normal,
      lintelOnly: true,
      lintelY: door.height,
    });
  }
  return segs;
}

function segmentAabb(seg, yBase, roomH) {
  const pad = WALL_THICK;
  const nx = seg.normal[0] * pad * 0.5;
  const nz = seg.normal[1] * pad * 0.5;
  const xs = [seg.v0[0] + nx, seg.v1[0] + nx];
  const zs = [seg.v0[1] + nz, seg.v1[1] + nz];
  const y0 = seg.lintelOnly ? yBase + (seg.lintelY ?? DOOR_H) : yBase;
  return {
    minX: Math.min(...xs) - pad,
    maxX: Math.max(...xs) + pad,
    minZ: Math.min(...zs) - pad,
    maxZ: Math.max(...zs) + pad,
    minY: y0,
    maxY: yBase + roomH,
  };
}

function edgeKey(room, edge) {
  const ox = room.cx * CELL;
  const oz = room.cz * CELL;
  const ax = ox + edge.v0[0];
  const az = oz + edge.v0[1];
  const bx = ox + edge.v1[0];
  const bz = oz + edge.v1[1];
  const rx0 = Math.round(Math.min(ax, bx) * 20) / 20;
  const rz0 = Math.round(Math.min(az, bz) * 20) / 20;
  const rx1 = Math.round(Math.max(ax, bx) * 20) / 20;
  const rz1 = Math.round(Math.max(az, bz) * 20) / 20;
  return `${room.floorLevel},${rx0},${rz0},${rx1},${rz1}`;
}

export function registerRoomColliders(map, room) {
  const yBase = room.floorLevel * FLOOR_STEP;
  const ox = room.cx * CELL;
  const oz = room.cz * CELL;

  for (const edge of room.edges) {
    const key = edgeKey(room, edge);
    if (map.has(key)) continue;

    const colliders = [];
    if (edge.door) {
      for (const seg of wallSegments(edge, edge.door)) {
        colliders.push(segmentAabb(seg, yBase, room.height));
      }
    } else {
      colliders.push(
        segmentAabb({ v0: edge.v0, v1: edge.v1, normal: edge.normal }, yBase, room.height)
      );
    }

    map.set(key, colliders.map((c) => ({
      minX: c.minX + ox,
      maxX: c.maxX + ox,
      minZ: c.minZ + oz,
      maxZ: c.maxZ + oz,
      minY: c.minY,
      maxY: c.maxY,
    })));
  }
}

export function buildCollidersFromMap(map) {
  const out = [];
  for (const boxes of map.values()) out.push(...boxes);
  return out;
}
