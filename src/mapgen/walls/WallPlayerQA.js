import { CHUNK, WALL_T, ROOM_H, EYE_H } from "../../constants.js";
import { isWalkableLocal } from "../../room.js";
import { collectRoomWallSegments } from "./wallSegments.js";
import { segmentsToFootprint, footprintExtrudeOutlines } from "./WallFootprint.js";
import {
  validateWallMesh,
  analyzeConnectors,
  repairFootprint,
} from "./WallQuality.js";
import {
  buildSolidWallGeometry,
  wallThicknessOK,
  countThicknessFaces,
} from "./WallMeshBuilder.js";
import { CONNECTOR } from "./ConnectorTypes.js";
import { analyzeOutlineLoop } from "./WallOutlineDebug.js";

const EPS = 1e-4;
const HALF = WALL_T / 2;

/** Korean corner labels for QA reporting */
export const CORNER_SHAPE = {
  [CONNECTOR.INNER_CORNER]: "ㄱ",
  [CONNECTOR.OUTER_CORNER]: "ㄴ",
  [CONNECTOR.T_JUNCTION]: "ㄷ",
  [CONNECTOR.CROSS]: "ㅁ",
  [CONNECTOR.END_CAP]: "end",
  [CONNECTOR.STRAIGHT]: "straight",
  [CONNECTOR.DOOR]: "door",
  [CONNECTOR.WIDE]: "wide",
};

const FAIL = {
  OVERLAP: "wall_overlap",
  PROTRUSION: "wall_protrusion",
  END_PROTRUSION: "wall_end_protrusion",
  GAP: "wall_gap",
  THICKNESS: "wall_thickness_mismatch",
  FLOOR_GAP: "floor_wall_gap",
  CEILING_GAP: "ceiling_wall_gap",
  ABNORMAL_FACE: "abnormal_corner_face",
  UV_BREAK: "wallpaper_uv_break",
  Z_FIGHT: "z_fighting",
  FLIPPED_NORMAL: "flipped_normal",
  STAIR_CORNER: "stair_corner_player_view",
  PLANE_WALL: "plane_wall_view",
};

function fakeTex() {
  return { userData: { tileW: 0.76, tileH: 0.76 } };
}

function walkableProbe(room, x, z) {
  return isWalkableLocal(x, z, room.innerWalls ?? []);
}

function pickStandPoint(junction, room) {
  const { x, z, dirMask } = junction;
  const d = 0.55;
  let px = x;
  let pz = z;
  if (dirMask & 1) pz += d;
  if (dirMask & 4) pz -= d;
  if (dirMask & 2) px -= d;
  if (dirMask & 8) px += d;
  if (walkableProbe(room, px, pz)) return { px, pz };

  const probes = [
    { px: x + d, pz: z - d },
    { px: x - d, pz: z - d },
    { px: x - d, pz: z + d },
    { px: x + d, pz: z + d },
  ];
  return probes.find((p) => walkableProbe(room, p.px, p.pz)) ?? null;
}

/** Player camera pose looking at a wall junction from walkable space. */
export function cameraPoseForJunction(junction, room) {
  const { x, z } = junction;
  const stand = pickStandPoint(junction, room);
  if (!stand) return null;

  const dx = x - stand.px;
  const dz = z - stand.pz;
  const len = Math.hypot(dx, dz) || 1;
  const standDist = junction.connector === CONNECTOR.END_CAP ? 0.55 : 0.95;
  let camX = stand.px - (dx / len) * standDist;
  let camZ = stand.pz - (dz / len) * standDist;

  if (!walkableProbe(room, camX, camZ)) {
    camX = stand.px;
    camZ = stand.pz;
    if (!walkableProbe(room, camX, camZ)) return null;
  }

  const perpX = -dz / len;
  const perpZ = dx / len;
  const pan = junction.connector === CONNECTOR.INNER_CORNER ? 0.12 : 0.05;
  camX += perpX * pan;
  camZ += perpZ * pan;

  return {
    camX,
    camY: EYE_H,
    camZ,
    lookX: x,
    lookY: 1.42,
    lookZ: z,
    connector: junction.connector,
    shape: CORNER_SHAPE[junction.connector] ?? "?",
  };
}

/** All junctions that need player-perspective corner shots. */
export function collectCornerViews(room) {
  const segs = collectRoomWallSegments(room);
  const connectors = analyzeConnectors(room, segs);
  const views = [];

  for (const j of connectors) {
    if (!j.connector) continue;
    if (j.connector === CONNECTOR.STRAIGHT) continue;
    if (j.connector === CONNECTOR.DOOR || j.connector === CONNECTOR.WIDE) continue;
    const pose = cameraPoseForJunction(j, room);
    if (!pose) continue;
    views.push({
      x: j.x,
      z: j.z,
      ...pose,
    });
  }

  return views;
}

function pointInSolid(x, z, cells) {
  return cells.some(
    (c) => x > c.x0 + 0.001 && x < c.x1 - 0.001 && z > c.z0 + 0.001 && z < c.z1 - 0.001,
  );
}

/** End-cap faces — thin (≈WALL_T) vertical quads closing a wall run. */
export function findEndCapFaces(geo) {
  if (!geo) return [];
  const pos = geo.attributes.position;
  const norm = geo.attributes.normal;
  const faces = [];
  const seen = new Set();

  for (let i = 0; i < pos.count; i += 3) {
    const xs = [pos.getX(i), pos.getX(i + 1), pos.getX(i + 2)];
    const ys = [pos.getY(i), pos.getY(i + 1), pos.getY(i + 2)];
    const zs = [pos.getZ(i), pos.getZ(i + 1), pos.getZ(i + 2)];
    const dx = Math.max(...xs) - Math.min(...xs);
    const dz = Math.max(...zs) - Math.min(...zs);
    const dy = Math.max(...ys) - Math.min(...ys);
    if (dy < ROOM_H - 0.2) continue;
    const horiz = Math.max(dx, dz);
    const thin = Math.min(dx, dz);
    if (thin > WALL_T + 0.05 || horiz < WALL_T - 0.02 || horiz > WALL_T + 0.06) continue;

    const cx = (xs[0] + xs[1] + xs[2]) / 3;
    const cz = (zs[0] + zs[1] + zs[2]) / 3;
    const nx = norm.getX(i);
    const nz = norm.getZ(i);
    const key = `${cx.toFixed(3)},${cz.toFixed(3)},${nx.toFixed(2)},${nz.toFixed(2)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    faces.push({ cx, cz, nx, nz, width: horiz });
  }

  return faces;
}

/** Signed lateral offset from a head-on view axis (unit normal in XZ). */
export function endCapViewLateral(camX, camZ, lookX, lookZ, nx, nz) {
  const dx = camX - lookX;
  const dz = camZ - lookZ;
  return Math.abs(dx * nz - dz * nx);
}

/** Along-axis distance from look point toward the camera (positive when on -normal side). */
export function endCapViewAlong(camX, camZ, lookX, lookZ, nx, nz) {
  const dx = camX - lookX;
  const dz = camZ - lookZ;
  return -(dx * nx + dz * nz);
}

/**
 * Player camera ~distance metres from end-cap face, centred on cap.
 * Camera must be in walkable space, outside wall solid.
 */
export function cameraPoseForEndCap(room, cap, cells, distance = 1.0) {
  const { cx, cz, nx, nz } = cap;
  const lookY = ROOM_H * 0.45;
  const lookX = cx;
  const lookZ = cz;
  const baseX = cx - nx * distance;
  const baseZ = cz - nz * distance;
  const perpX = -nz;
  const perpZ = nx;

  const tryPose = (camX, camZ, lookAtZ = lookZ, lookAtX = lookX) => {
    if (!walkableProbe(room, camX, camZ)) return null;
    if (pointInSolid(camX, camZ, cells)) return null;
    const along = endCapViewAlong(camX, camZ, lookAtX, lookAtZ, nx, nz);
    if (along < distance * 0.75 || along > distance * 1.35) return null;
    const lateral = endCapViewLateral(camX, camZ, lookAtX, lookAtZ, nx, nz);
    return {
      camX,
      camY: EYE_H,
      camZ,
      lookX: lookAtX,
      lookY,
      lookZ: lookAtZ,
      distance: along,
      lateral,
      cap,
      shape: "end",
    };
  };

  let best = null;
  let bestScore = -Infinity;
  const consider = (pose) => {
    if (!pose) return;
    const lat = pose.lateral;
    if (lat < 0.4) return;
    const score = -Math.abs(lat - 0.75);
    if (score > bestScore) {
      bestScore = score;
      best = pose;
    }
  };

  consider(tryPose(baseX, baseZ));

  for (const off of [0.1, 0.2, 0.3, 0.5, 0.8, 1.0, 1.2, 1.5, 2.0]) {
    for (const sign of [1, -1]) {
      consider(tryPose(baseX + perpX * off * sign, baseZ + perpZ * off * sign));
    }
  }

  return best;
}

/** Best end-cap shot for a room (prefers interior caps over chunk shell). */
export function findBestEndCapView(room, distance = 1.0) {
  const segs = collectRoomWallSegments(room);
  const cells = segmentsToFootprint(segs);
  const geo = buildSolidWallGeometry(segs, ROOM_H, 0, 0, 0.76, 0.76, {
    room,
    validate: false,
  });
  if (!geo) return null;

  const faces = findEndCapFaces(geo);
  const ranked = faces
    .map((cap) => ({ cap, pose: cameraPoseForEndCap(room, cap, cells, distance) }))
    .filter((e) => e.pose)
    .sort((a, b) => scoreEndCapShot(b) - scoreEndCapShot(a));

  geo.dispose();
  return ranked[0]?.pose ?? null;
}

function scoreEndCapShot({ cap, pose }) {
  const lateral = pose.lateral ?? endCapViewLateral(
    pose.camX, pose.camZ, pose.lookX, pose.lookZ, cap.nx, cap.nz,
  );
  const interior =
    (cap.cx > 1.5 && cap.cx < CHUNK - 1.5 ? 2 : 0) +
    (cap.cz > 1.5 && cap.cz < CHUNK - 1.5 ? 2 : 0);
  const onShell =
    cap.cx < 0.25 || cap.cx > CHUNK - 0.25 || cap.cz < 0.25 || cap.cz > CHUNK - 0.25;
  const outOfChunk = cap.cx < 0 || cap.cx > CHUNK || cap.cz < 0 || cap.cz > CHUNK;
  return (
    interior * 10 -
    lateral * 8 +
    pose.distance * 2 -
    (onShell ? 20 : 0) -
    (outOfChunk ? 60 : 0)
  );
}

/** Head-on end-cap camera ~distance from face; prefers interior caps, minimal lateral offset. */
export function findHeadOnEndCapView(room, distance = 1.0) {
  const segs = collectRoomWallSegments(room);
  const cells = segmentsToFootprint(segs);
  const geo = buildSolidWallGeometry(segs, ROOM_H, 0, 0, 0.76, 0.76, {
    room,
    validate: false,
  });
  if (!geo) return null;

  let best = null;
  let bestScore = -Infinity;
  for (const cap of findEndCapFaces(geo)) {
    const pose = cameraPoseForEndCap(room, cap, cells, distance);
    if (!pose || pose.lateral < 0.4 || pose.lateral > 1.25) continue;
    const score = scoreEndCapShot({ cap, pose });
    if (score > bestScore) {
      bestScore = score;
      best = pose;
    }
  }

  geo.dispose();
  return best;
}

function cellAt(cells, x, z) {
  return cells.some(
    (c) => x >= c.x0 - EPS && x <= c.x1 + EPS && z >= c.z0 - EPS && z <= c.z1 + EPS,
  );
}

/** Detect voids between wall solids near junctions (wall_gap). */
function findWallGaps(room, segments, cells) {
  const issues = [];
  const connectors = analyzeConnectors(room, segments);

  for (const j of connectors) {
    if (!j.connector || j.connector === CONNECTOR.DOOR || j.connector === CONNECTOR.WIDE) continue;
    const { x, z } = j;
    const offsets = [
      [WALL_T, 0],
      [-WALL_T, 0],
      [0, WALL_T],
      [0, -WALL_T],
    ];
    for (const [ox, oz] of offsets) {
      const px = x + ox;
      const pz = z + oz;
      if (px < 0.3 || pz < 0.3 || px > CHUNK - 0.3 || pz > CHUNK - 0.3) continue;
      if (walkableProbe(room, px, pz)) continue;
      if (cellAt(cells, px, pz)) continue;
      const nearest = cells.reduce(
        (best, c) => {
          const cx = (c.x0 + c.x1) / 2;
          const cz = (c.z0 + c.z1) / 2;
          const d = Math.hypot(cx - px, cz - pz);
          return d < best.d ? { d, c } : best;
        },
        { d: Infinity, c: null },
      );
      if (nearest.d < WALL_T * 1.2 && nearest.d > WALL_T * 0.35) {
        issues.push({ kind: FAIL.GAP, at: [px, pz], junction: [x, z], dist: nearest.d });
      }
    }
  }
  return issues;
}

function findEndProtrusions(segments, cells) {
  const issues = [];
  for (const seg of segments) {
    const ends = [
      { x: seg.axis === "z" ? seg.span0 : seg.pos, z: seg.axis === "z" ? seg.pos : seg.span0 },
      { x: seg.axis === "z" ? seg.span1 : seg.pos, z: seg.axis === "z" ? seg.pos : seg.span1 },
    ];
    for (const { x, z } of ends) {
      const hits = cells.filter(
        (c) =>
          x >= c.x0 - EPS &&
          x <= c.x1 + EPS &&
          z >= c.z0 - EPS &&
          z <= c.z1 + EPS,
      );
      if (hits.length === 0) continue;
      const maxW = Math.max(...hits.map((c) => c.x1 - c.x0));
      const maxD = Math.max(...hits.map((c) => c.z1 - c.z0));
      if (maxW > WALL_T + 0.06 && maxD > WALL_T + 0.06) {
        issues.push({ kind: FAIL.END_PROTRUSION, at: [x, z], cell: hits[0] });
      }
    }
  }
  return issues;
}

function checkFloorCeilingGaps(geo) {
  const issues = [];
  if (!geo) return issues;
  const pos = geo.attributes.position;
  let yMin = Infinity;
  let yMax = -Infinity;
  for (let i = 0; i < pos.count; i++) {
    yMin = Math.min(yMin, pos.getY(i));
    yMax = Math.max(yMax, pos.getY(i));
  }
  if (yMin > 0.02) issues.push({ kind: FAIL.FLOOR_GAP, gap: yMin });
  if (yMax < ROOM_H - 0.02) issues.push({ kind: FAIL.CEILING_GAP, gap: ROOM_H - yMax });
  return issues;
}

function checkFlippedNormals(geo, room) {
  const issues = [];
  if (!geo?.attributes?.normal) return issues;
  const pos = geo.attributes.position;
  const norm = geo.attributes.normal;
  const along = 0.38;

  for (let i = 0; i < pos.count; i += 3) {
    const ny = Math.abs(norm.getY(i));
    if (ny > 0.5) continue;
    const cx = (pos.getX(i) + pos.getX(i + 1) + pos.getX(i + 2)) / 3;
    const cz = (pos.getZ(i) + pos.getZ(i + 1) + pos.getZ(i + 2)) / 3;
    const nx = norm.getX(i);
    const nz = norm.getZ(i);
    const posP = walkableProbe(room, cx + along * nx, cz + along * nz);
    const posN = walkableProbe(room, cx - along * nx, cz - along * nz);
    const onBoundary = cx < 0.25 || cx > CHUNK - 0.25 || cz < 0.25 || cz > CHUNK - 0.25;
    if (onBoundary) continue;

    if (!posP && posN) {
      issues.push({ kind: FAIL.FLIPPED_NORMAL, at: [cx, cz], normal: [nx, norm.getY(i), nz] });
      break;
    }
  }
  return issues;
}

function checkZFighting(geo) {
  const issues = [];
  if (!geo) return issues;
  const pos = geo.attributes.position;
  const norm = geo.attributes.normal;
  const tris = [];

  for (let i = 0; i < pos.count; i += 3) {
    const xs = [pos.getX(i), pos.getX(i + 1), pos.getX(i + 2)];
    const ys = [pos.getY(i), pos.getY(i + 1), pos.getY(i + 2)];
    const zs = [pos.getZ(i), pos.getZ(i + 1), pos.getZ(i + 2)];
    tris.push({
      i,
      cx: (xs[0] + xs[1] + xs[2]) / 3,
      cy: (ys[0] + ys[1] + ys[2]) / 3,
      cz: (zs[0] + zs[1] + zs[2]) / 3,
      nx: norm.getX(i),
      ny: norm.getY(i),
      nz: norm.getZ(i),
    });
  }

  for (let a = 0; a < tris.length; a++) {
    for (let b = a + 1; b < tris.length; b++) {
      const ta = tris[a];
      const tb = tris[b];
      if (Math.abs(ta.nx - tb.nx) > 0.01 || Math.abs(ta.ny - tb.ny) > 0.01 || Math.abs(ta.nz - tb.nz) > 0.01)
        continue;
      const d = Math.hypot(ta.cx - tb.cx, ta.cy - tb.cy, ta.cz - tb.cz);
      if (d < 0.003 && d > 0) {
        issues.push({ kind: FAIL.Z_FIGHT, at: [ta.cx, ta.cy, ta.cz] });
        return issues;
      }
    }
  }
  return issues;
}

function checkUVBreaks(geo, roomWx, roomWz, tileW = 0.76) {
  const issues = [];
  if (!geo?.attributes?.uv) return issues;
  const pos = geo.attributes.position;
  const norm = geo.attributes.normal;
  const uv = geo.attributes.uv;
  const buckets = new Map();

  for (let i = 0; i < pos.count; i++) {
    const ny = Math.abs(norm.getY(i));
    if (ny > 0.5) continue;
    const wx = roomWx + pos.getX(i);
    const wy = pos.getY(i);
    const wz = roomWz + pos.getZ(i);
    const key = `${norm.getX(i).toFixed(2)},${norm.getZ(i).toFixed(2)}`;
    const snap = `${wx.toFixed(2)},${wy.toFixed(2)},${wz.toFixed(2)}`;
    if (!buckets.has(key)) buckets.set(key, new Map());
    const face = buckets.get(key);
    if (!face.has(snap)) face.set(snap, []);
    face.get(snap).push([uv.getX(i), uv.getY(i)]);
  }

  for (const face of buckets.values()) {
    for (const [, uvs] of face) {
      if (uvs.length < 2) continue;
      const u0 = uvs[0][0];
      const v0 = uvs[0][1];
      for (let k = 1; k < uvs.length; k++) {
        const du = Math.abs(uvs[k][0] - u0);
        const dv = Math.abs(uvs[k][1] - v0);
        if (du > 0.08 || dv > 0.08) {
          issues.push({ kind: FAIL.UV_BREAK, delta: [du, dv] });
          return issues;
        }
      }
    }
  }
  return issues;
}

/** Horizontal slice at eye height — detect stair-step profile near corner. */
function checkStairCorners(geo, room, views) {
  const issues = [];
  if (!geo) return issues;
  const pos = geo.attributes.position;
  const ySlice = 1.32;
  const yTol = 0.08;

  for (const view of views) {
    const { x, z, shape } = view;
    if (!shape || shape === "door" || shape === "wide" || shape === "end") continue;

    const samples = [];
    const range = 1.2;
    const steps = 24;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const px = x + (t - 0.5) * range * 2;
      const pz = z + (t - 0.5) * range * 2;
      let best = null;
      for (let vi = 0; vi < pos.count; vi++) {
        if (Math.abs(pos.getY(vi) - ySlice) > yTol) continue;
        if (Math.abs(pos.getX(vi) - px) > 0.35 && Math.abs(pos.getZ(vi) - pz) > 0.35) continue;
        const d = Math.hypot(pos.getX(vi) - px, pos.getZ(vi) - pz);
        if (!best || d < best.d) best = { d, x: pos.getX(vi), z: pos.getZ(vi) };
      }
      if (best) samples.push([best.x, best.z]);
    }

    if (samples.length < 5) continue;
    let stairs = 0;
    for (let i = 2; i < samples.length; i++) {
      const [x0, z0] = samples[i - 2];
      const [x1, z1] = samples[i - 1];
      const [x2, z2] = samples[i];
      const dx0 = x1 - x0;
      const dz0 = z1 - z0;
      const dx1 = x2 - x1;
      const dz1 = z2 - z1;
      const len0 = Math.hypot(dx0, dz0);
      const len1 = Math.hypot(dx1, dz1);
      if (len0 < 0.04 || len1 < 0.04) continue;
      const cross = dx0 * dz1 - dz0 * dx1;
      const dot = dx0 * dx1 + dz0 * dz1;
      const angle = (Math.atan2(Math.abs(cross), Math.abs(dot) < EPS ? EPS : dot) * 180) / Math.PI;
      if (angle > 8 && angle < 82 && len0 < 0.28 && len1 < 0.28) stairs++;
    }
    if (stairs >= 2) {
      issues.push({ kind: FAIL.STAIR_CORNER, at: [x, z], shape, stairs });
    }
  }
  return issues;
}

function checkAbnormalCornerFaces(geo, room, views) {
  const issues = [];
  if (!geo) return issues;
  const pos = geo.attributes.position;
  const norm = geo.attributes.normal;

  for (const view of views) {
    const { x, z, shape } = view;
    if (!["ㄱ", "ㄴ", "ㄷ", "ㅁ", "ㄹ"].includes(shape) && shape !== "?") continue;

    let near = 0;
    let bad = 0;
    for (let i = 0; i < pos.count; i += 3) {
      const cx = (pos.getX(i) + pos.getX(i + 1) + pos.getX(i + 2)) / 3;
      const cz = (pos.getZ(i) + pos.getZ(i + 1) + pos.getZ(i + 2)) / 3;
      if (Math.hypot(cx - x, cz - z) > 0.55) continue;
      near++;
      const ax = Math.abs(norm.getX(i));
      const ay = Math.abs(norm.getY(i));
      const az = Math.abs(norm.getZ(i));
      if (ay > 0.85) continue;
      const maxA = Math.max(ax, az);
      if (maxA < 0.85) bad++;
    }
    if (near > 0 && bad > 0) {
      issues.push({ kind: FAIL.ABNORMAL_FACE, at: [x, z], shape, bad });
    }
  }
  return issues;
}

/** Player views that must show 0.16m wall thickness (doors, end caps). */
export function collectThicknessPlayerViews(room) {
  const segs = collectRoomWallSegments(room);
  const views = [];

  for (const j of analyzeConnectors(room, segs)) {
    if (j.connector === CONNECTOR.DOOR || j.connector === CONNECTOR.WIDE) {
      const pose = cameraPoseForJunction(j, room);
      if (pose) views.push({ ...pose, tag: j.connector });
    }
  }

  const headOn = findHeadOnEndCapView(room, 0.85);
  if (headOn) views.push({ ...headOn, tag: "head_on_cap" });

  return views;
}

/** At player poses, wall silhouette depth along view axis must show WALL_T thickness. */
function checkPlayerThicknessViews(room, geo, views) {
  const issues = [];
  if (!geo?.attributes?.position || !views.length) return issues;

  const pos = geo.attributes.position;
  const norm = geo.attributes.normal;
  const eyeY = EYE_H;

  for (const view of views) {
    const { camX, camZ, lookX, lookZ } = view;
    const dx = lookX - camX;
    const dz = lookZ - camZ;
    const len = Math.hypot(dx, dz) || 1;
    const rdx = dx / len;
    const rdz = dz / len;
    const pdx = -rdz;
    const pdz = rdx;

    let minPerp = Infinity;
    let maxPerp = -Infinity;
    let visibleFaces = 0;

    for (let i = 0; i < pos.count; i += 3) {
      const fcx = (pos.getX(i) + pos.getX(i + 1) + pos.getX(i + 2)) / 3;
      const fcy = (pos.getY(i) + pos.getY(i + 1) + pos.getY(i + 2)) / 3;
      const fcz = (pos.getZ(i) + pos.getZ(i + 1) + pos.getZ(i + 2)) / 3;
      if (Math.abs(fcy - eyeY) > 0.55) continue;

      const toFace = (fcx - camX) * rdx + (fcz - camZ) * rdz;
      if (toFace < 0.12 || toFace > 4) continue;

      const fnx = norm.getX(i);
      const fnz = norm.getZ(i);
      if (fnx * rdx + fnz * rdz > -0.05) continue;

      const perp = (fcx - lookX) * pdx + (fcz - lookZ) * pdz;
      minPerp = Math.min(minPerp, perp);
      maxPerp = Math.max(maxPerp, perp);
      visibleFaces++;
    }

    if (visibleFaces < 2) continue;
    const depth = maxPerp - minPerp;
    if (depth < WALL_T * 0.62) {
      issues.push({
        kind: FAIL.PLANE_WALL,
        reason: "thin_player_view",
        tag: view.tag,
        depth,
        at: [lookX, lookZ],
      });
    }
  }

  return issues;
}

/** Reject meshes with too few thickness faces — walls would read as zero-depth planes. */
function checkPlaneWallViews(room, geo, cells, segs, thicknessViews) {
  const issues = [];
  if (!geo) return issues;

  const thicknessFaces = countThicknessFaces(geo);
  const caps = findEndCapFaces(geo);
  const minCaps = Math.max(4, Math.min(8, Math.floor(segs.filter((s) => !s.door).length * 0.22)));

  if (thicknessFaces < 4) {
    issues.push({ kind: FAIL.PLANE_WALL, reason: "low_thickness_faces", count: thicknessFaces });
  }
  if (caps.length < minCaps) {
    issues.push({ kind: FAIL.PLANE_WALL, reason: "low_end_caps", count: caps.length, minCaps });
  }

  issues.push(...checkPlayerThicknessViews(room, geo, thicknessViews));

  return issues;
}

function outlineStairIssues(room, segs) {
  const issues = [];
  const outlines = footprintExtrudeOutlines(segs);
  for (const { outer } of outlines) {
    const a = analyzeOutlineLoop(outer);
    if (a.staircaseSteps > 0 || a.diagonalEdges > 0 || a.microEdges > 0) {
      issues.push({ kind: FAIL.STAIR_CORNER, stage: "outline", analysis: a });
    }
  }
  return issues;
}

/**
 * Full player-perspective QA for one room.
 * @returns {{ pass: boolean, issues: object[], corners: object[], stats: object }}
 */
export function inspectRoomPlayerWalls(room, cx, cz) {
  const segs = collectRoomWallSegments(room);
  let cells = segmentsToFootprint(segs);
  const wx = cx * CHUNK;
  const wz = cz * CHUNK;
  const tex = fakeTex();

  const baseIssues = validateWallMesh(room, segs, cells);
  for (const issue of baseIssues) {
    if (issue.kind === "protrusion") issue.qaKind = FAIL.OVERLAP;
    else if (issue.kind === "short_segment") issue.qaKind = FAIL.PROTRUSION;
    else issue.qaKind = issue.kind;
  }

  if (baseIssues.some((i) => i.kind === "protrusion")) {
    cells = repairFootprint(cells);
  }

  const geo = buildSolidWallGeometry(segs, ROOM_H, wx, wz, tex.userData.tileW, tex.userData.tileH, {
    room,
    validate: false,
  });

  const corners = collectCornerViews(room);
  const thicknessViews = collectThicknessPlayerViews(room);
  const issues = [...baseIssues.map((i) => ({ ...i, qaKind: i.qaKind ?? i.kind }))];

  if (!wallThicknessOK(cells)) {
    issues.push({ kind: FAIL.THICKNESS, qaKind: FAIL.THICKNESS });
  }

  issues.push(...findWallGaps(room, segs, cells));
  issues.push(...findEndProtrusions(segs, cells));
  issues.push(...checkFloorCeilingGaps(geo));
  issues.push(...checkFlippedNormals(geo, room));
  issues.push(...checkZFighting(geo));
  issues.push(...checkUVBreaks(geo, wx, wz, tex.userData.tileW));
  issues.push(...checkStairCorners(geo, room, corners));
  issues.push(...checkAbnormalCornerFaces(geo, room, corners));
  issues.push(...checkPlaneWallViews(room, geo, cells, segs, thicknessViews));
  issues.push(...outlineStairIssues(room, segs));

  const thicknessFaces = geo ? countThicknessFaces(geo) : 0;
  if (geo) geo.dispose();

  const critical = issues.filter((i) =>
    [
      FAIL.OVERLAP,
      FAIL.PROTRUSION,
      FAIL.END_PROTRUSION,
      FAIL.GAP,
      FAIL.THICKNESS,
      FAIL.FLOOR_GAP,
      FAIL.CEILING_GAP,
      FAIL.ABNORMAL_FACE,
      FAIL.UV_BREAK,
      FAIL.Z_FIGHT,
      FAIL.FLIPPED_NORMAL,
      FAIL.STAIR_CORNER,
      FAIL.PLANE_WALL,
      "protrusion",
      "short_segment",
    ].includes(i.kind ?? i.qaKind),
  );

  return {
    pass: critical.length === 0,
    issues: critical,
    corners,
    thicknessViews,
    stats: {
      segments: segs.length,
      cells: cells.length,
      thicknessFaces,
      cornerViews: corners.length,
    },
  };
}

export { FAIL as PLAYER_WALL_FAIL };
