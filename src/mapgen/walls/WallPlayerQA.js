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
      "protrusion",
      "short_segment",
    ].includes(i.kind ?? i.qaKind),
  );

  return {
    pass: critical.length === 0,
    issues: critical,
    corners,
    stats: {
      segments: segs.length,
      cells: cells.length,
      thicknessFaces,
      cornerViews: corners.length,
    },
  };
}

export { FAIL as PLAYER_WALL_FAIL };
