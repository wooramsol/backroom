/**
 * Step 3 — find player walk path crossing consecutive macro zones.
 */
import { getMacroZoneAt } from "./ZoneClusterField.js";
import { getZoneProfile } from "./ZoneTypes.js";
import { generateRoom, isWalkableLocal } from "../room.js";
import { collectSpatialCameraPoses } from "../mapgen/RoomSpatialQA.js";
import { CHUNK, EYE_H, ROOM_H } from "../constants.js";

const NEIGHBORS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

export function zoneKeyAt(cx, cz) {
  const z = getMacroZoneAt(cx, cz);
  return `${z.type}@${z.clusterId}`;
}

export function zoneMetaAt(cx, cz) {
  const macro = getMacroZoneAt(cx, cz);
  const profile = getZoneProfile(macro.type);
  return {
    ...macro,
    label: profile.label,
    profile,
  };
}

function clusterKey(zone) {
  return `${zone.type}:${zone.clusterId}`;
}

function stepKey(cx, cz) {
  return `${cx},${cz}`;
}

/**
 * Walk through macro-zone clusters — stay inside each Voronoi cell, then cross borders.
 * @returns {Array<{ cx: number, cz: number, zone: ReturnType<typeof zoneMetaAt> }>}
 */
export function findZoneCrossingPath(startCx = 0, startCz = 0, minZones = 5, maxSteps = 64) {
  const path = [];
  const visited = new Set();
  const clustersSeen = new Set();
  let cx = startCx;
  let cz = startCz;

  while (clustersSeen.size < minZones && path.length < maxSteps) {
    const zone = zoneMetaAt(cx, cz);
    path.push({ cx, cz, zone });
    visited.add(stepKey(cx, cz));
    clustersSeen.add(clusterKey(zone));

    const neighbors = NEIGHBORS.map(([dx, dz]) => ({
      cx: cx + dx,
      cz: cz + dz,
      zone: zoneMetaAt(cx + dx, cz + dz),
    })).filter((n) => !visited.has(stepKey(n.cx, n.cz)));

    let pdx = 1;
    let pdz = 0;
    if (path.length >= 2) {
      pdx = cx - path[path.length - 2].cx;
      pdz = cz - path[path.length - 2].cz;
    }

    const straight = neighbors.find((n) => n.cx - cx === pdx && n.cz - cz === pdz);
    if (straight && straight.zone.clusterId === zone.clusterId) {
      cx = straight.cx;
      cz = straight.cz;
      continue;
    }

    const newClusters = neighbors.filter((n) => !clustersSeen.has(clusterKey(n.zone)));
    if (newClusters.length) {
      const pick =
        newClusters.sort((a, b) => {
          const seenA = [...clustersSeen].some((k) => k.startsWith(`${a.zone.type}:`)) ? 1 : 0;
          const seenB = [...clustersSeen].some((k) => k.startsWith(`${b.zone.type}:`)) ? 1 : 0;
          if (seenA !== seenB) return seenA - seenB;
          return a.zone.type.localeCompare(b.zone.type);
        })[0];
      cx = pick.cx;
      cz = pick.cz;
      continue;
    }

    const inCluster = neighbors.filter((n) => n.zone.clusterId === zone.clusterId);
    if (inCluster.length) {
      const pick = inCluster.sort((a, b) => a.cx - b.cx || a.cz - b.cz)[0];
      cx = pick.cx;
      cz = pick.cz;
      continue;
    }

    const pick = neighbors[0];
    if (!pick) break;
    cx = pick.cx;
    cz = pick.cz;
  }

  return path;
}

function scoreTourPath(path, minZones) {
  const segments = segmentZonePath(path);
  if (segments.length < minZones) return -1;
  const avgChunks = segments.reduce((s, seg) => s + seg.steps.length, 0) / segments.length;
  const types = new Set(segments.map((seg) => seg.type)).size;
  return avgChunks * 20 + types * 8 + Math.min(segments.length, 12);
}

/** Pick start coords that yield a deep multi-zone tour. */
export function findBestZoneTour(minZones = 5) {
  const starts = [
    [0, 0],
    [3, 3],
    [7, 4],
    [-5, 2],
    [10, 0],
    [0, 7],
    [14, 3],
  ];
  let best = null;
  for (const [sx, sz] of starts) {
    const path = findZoneCrossingPath(sx, sz, minZones, 72);
    const score = scoreTourPath(path, minZones);
    if (score < 0) continue;
    if (!best || score > best.score) {
      best = {
        path,
        score,
        start: { cx: sx, cz: sz },
        segments: segmentZonePath(path),
      };
    }
  }
  if (best) return best;
  const fallback = findZoneCrossingPath(0, 0, minZones, 96);
  return {
    path: fallback,
    score: scoreTourPath(fallback, minZones),
    start: { cx: 0, cz: 0 },
    segments: segmentZonePath(fallback),
  };
}

/** Group consecutive path steps into macro-zone segments */
export function segmentZonePath(path) {
  const segments = [];
  let cur = null;

  for (const step of path) {
    const id = `${step.zone.type}:${step.zone.clusterId}`;
    if (!cur || cur.id !== id) {
      cur = {
        id,
        type: step.zone.type,
        label: step.zone.label,
        clusterId: step.zone.clusterId,
        steps: [],
      };
      segments.push(cur);
    }
    cur.steps.push(step);
  }

  return segments;
}

function aggregateKinds(rooms) {
  const kinds = {};
  for (const r of rooms) {
    kinds[r.kind] = (kinds[r.kind] ?? 0) + 1;
  }
  return kinds;
}

function roomAreaCells(r) {
  return r.cells?.length ?? 0;
}

/** Stats for one macro-zone segment (aggregated across its chunks). */
export function segmentZoneStats(segment) {
  const rooms = [];
  let directSum = 0;
  let directN = 0;

  for (const { cx, cz } of segment.steps) {
    const room = generateRoom(cx, cz);
    const packed = room.rooms ?? [];
    rooms.push(...packed);
    const d = room.spatial?.roomToRoomDirectRatio;
    if (typeof d === "number") {
      directSum += d;
      directN++;
    }
  }

  const totalArea = rooms.reduce((s, r) => s + roomAreaCells(r), 0);
  const kinds = aggregateKinds(rooms);

  return {
    zoneName: segment.label,
    zoneType: segment.type,
    clusterId: segment.clusterId,
    chunkCount: segment.steps.length,
    roomCount: rooms.length,
    avgRoomAreaM2: rooms.length ? totalArea / rooms.length : 0,
    shapeDistribution: kinds,
    connectionDensity: directN ? directSum / directN : 0,
  };
}

/** Representative chunk — middle of segment */
export function representativeChunk(segment) {
  const mid = segment.steps[Math.floor(segment.steps.length / 2)];
  return mid ?? segment.steps[0];
}

export function heroCameraForChunk(cx, cz) {
  const room = generateRoom(cx, cz);
  const packed = room.rooms ?? [];
  const inner = room.innerWalls ?? [];
  if (!packed.length) {
    return {
      camX: CHUNK / 2,
      camY: EYE_H,
      camZ: CHUNK / 2,
      lookX: CHUNK / 2,
      lookY: ROOM_H * 0.45,
      lookZ: CHUNK / 2 - 2,
    };
  }
  const lounge = packed.find((r) => r.kind === "lounge") ?? packed[0];
  const poses = collectSpatialCameraPoses(room);
  const pose = poses[0] ?? { ...collectSpatialCameraPoses({ rooms: packed, innerWalls: inner })[0] };
  if (pose?.camX != null) return pose;
  const [camX, camZ] = [lounge.centroid.x + 0.5, lounge.centroid.z + 0.5];
  return {
    camX,
    camY: EYE_H,
    camZ,
    lookX: camX + 1.5,
    lookY: ROOM_H * 0.45,
    lookZ: camZ,
  };
}

/** Camera near shared edge between two chunks */
export function boundaryCameras(chunkA, chunkB) {
  const { cx: ax, cz: az } = chunkA;
  const { cx: bx, cz: bz } = chunkB;
  const dx = bx - ax;
  const dz = bz - az;

  if (dx === 1) {
    return {
      before: { cx: ax, cz: az, camX: CHUNK - 1.2, camZ: CHUNK / 2, lookX: CHUNK + 0.5, lookZ: CHUNK / 2 },
      after: { cx: bx, cz: bz, camX: 1.2, camZ: CHUNK / 2, lookX: -0.5, lookZ: CHUNK / 2 },
      edge: "east",
      tourChunks: `${ax},${az};${bx},${bz}`,
      tourCam: { x: ax * CHUNK + CHUNK - 0.5, y: EYE_H, z: az * CHUNK + CHUNK / 2 },
      tourLook: { x: ax * CHUNK + CHUNK + 2, y: ROOM_H * 0.45, z: az * CHUNK + CHUNK / 2 },
    };
  }
  if (dx === -1) {
    return {
      before: { cx: ax, cz: az, camX: 1.2, camZ: CHUNK / 2, lookX: -0.5, lookZ: CHUNK / 2 },
      after: { cx: bx, cz: bz, camX: CHUNK - 1.2, camZ: CHUNK / 2, lookX: CHUNK + 0.5, lookZ: CHUNK / 2 },
      edge: "west",
      tourChunks: `${bx},${bz};${ax},${az}`,
      tourCam: { x: ax * CHUNK + 0.5, y: EYE_H, z: az * CHUNK + CHUNK / 2 },
      tourLook: { x: ax * CHUNK - 2, y: ROOM_H * 0.45, z: az * CHUNK + CHUNK / 2 },
    };
  }
  if (dz === 1) {
    return {
      before: { cx: ax, cz: az, camX: CHUNK / 2, camZ: CHUNK - 1.2, lookX: CHUNK / 2, lookZ: CHUNK + 0.5 },
      after: { cx: bx, cz: bz, camX: CHUNK / 2, camZ: 1.2, lookX: CHUNK / 2, lookZ: -0.5 },
      edge: "south",
      tourChunks: `${ax},${az};${bx},${bz}`,
      tourCam: { x: ax * CHUNK + CHUNK / 2, y: EYE_H, z: az * CHUNK + CHUNK - 0.5 },
      tourLook: { x: ax * CHUNK + CHUNK / 2, y: ROOM_H * 0.45, z: az * CHUNK + CHUNK + 2 },
    };
  }
  return {
    before: { cx: ax, cz: az, camX: CHUNK / 2, camZ: 1.2, lookX: CHUNK / 2, lookZ: -0.5 },
    after: { cx: bx, cz: bz, camX: CHUNK / 2, camZ: CHUNK - 1.2, lookX: CHUNK / 2, lookZ: CHUNK + 0.5 },
    edge: "north",
    tourChunks: `${bx},${bz};${ax},${az}`,
    tourCam: { x: ax * CHUNK + CHUNK / 2, y: EYE_H, z: az * CHUNK + 0.5 },
    tourLook: { x: ax * CHUNK + CHUNK / 2, y: ROOM_H * 0.45, z: az * CHUNK - 2 },
  };
}

export function segmentDifferentiation(a, b) {
  const roomDelta = Math.abs(a.roomCount - b.roomCount);
  const areaDelta = Math.abs(a.avgRoomAreaM2 - b.avgRoomAreaM2);
  const kindsA = new Set(Object.keys(a.shapeDistribution));
  const kindsB = new Set(Object.keys(b.shapeDistribution));
  let shared = 0;
  for (const k of kindsA) if (kindsB.has(k)) shared++;
  const union = new Set([...kindsA, ...kindsB]).size || 1;
  const shapeOverlap = shared / union;
  const connDelta = Math.abs(a.connectionDensity - b.connectionDensity);
  return {
    roomDelta,
    areaDelta,
    shapeOverlap,
    connDelta,
    visuallyDistinct: roomDelta >= 1 || areaDelta >= 4 || shapeOverlap < 0.65 || connDelta >= 0.08,
  };
}

export function evaluateZoneTransitionTour(segments, transitions) {
  const issues = [];
  if (segments.length < 5) issues.push("few_zones");

  for (let i = 0; i < segments.length - 1; i++) {
    const d = segmentDifferentiation(segments[i].stats, segments[i + 1].stats);
    if (!d.visuallyDistinct) issues.push(`similar_adjacent:${segments[i].type}->${segments[i + 1].type}`);
    if (segments[i].stats.chunkCount < 1) issues.push(`thin_segment:${segments[i].type}`);
  }

  const avgChunks = segments.reduce((s, seg) => s + seg.stats.chunkCount, 0) / (segments.length || 1);
  if (avgChunks < 1.2) issues.push("random_like_chunks");

  const transitionNatural = transitions.every((t) => t.before.clusterId !== t.after.clusterId);
  if (!transitionNatural) issues.push("same_cluster_boundary");

  const distinctTypes = new Set(segments.map((s) => s.stats.zoneType)).size;
  if (distinctTypes < 3) issues.push("low_type_variety");

  return {
    pass: issues.length === 0,
    issues,
    avgChunksPerZone: avgChunks,
    distinctZoneTypes: distinctTypes,
  };
}
