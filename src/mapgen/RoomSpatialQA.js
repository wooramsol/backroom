/**
 * Step 2 — Backrooms spatial feel analysis (room generator only).
 */
import { CHUNK, EYE_H, MAP_CELL_M, ROOM_H } from "../constants.js";
import { isWalkableLocal } from "../room.js";
import { CELL_CORRIDOR, CELL_FLOOR } from "./grid.js";
import { findRoomAdjacencies } from "./RoomConnector.js";
import { widthAlongX, widthAlongZ } from "./passage.js";
import { corridorRatio, roomFloorRatio } from "./backroomsMetrics.js";

const CORRIDOR_NARROW_CELLS = 3;
const CORRIDOR_ASPECT = 2.5;
const LONG_CORRIDOR_CELLS = 8;
const LOUNGE_KINDS = new Set(["lounge"]);
export const ORTHO_SHAPES = new Set(["L", "U", "Z", "T", "cross"]);
const NARROW_KINDS = new Set(["narrow", "narrow-x", "narrow-z"]);
const WIDE_KINDS = new Set(["lounge", "long-rect", "very-long"]);

export const SPATIAL_FAIL = {
  CORRIDOR_DOMINANT: "corridor_dominant",
  LONG_CORRIDOR_REPEAT: "long_corridor_repeat",
  SAME_SIZE_CONSECUTIVE: "same_size_consecutive",
  NO_LOUNGE: "no_lounge",
  NO_SIZE_MIX: "no_size_mix",
  LOW_NOVELTY: "low_novelty",
  DUNGEON_LIKE: "dungeon_like",
};

function narrowStripRoomIds(grid, x, z) {
  const wx = widthAlongX(grid, x, z);
  const wz = widthAlongZ(grid, x, z);
  const ids = new Set();
  if (wx <= wz) {
    let lo = x;
    while (grid.inBounds(lo - 1, z) && grid.isWalkable(lo - 1, z)) {
      const w = widthAlongX(grid, lo - 1, z);
      if (w > CORRIDOR_NARROW_CELLS) break;
      lo--;
    }
    let hi = x;
    while (grid.inBounds(hi + 1, z) && grid.isWalkable(hi + 1, z)) {
      const w = widthAlongX(grid, hi + 1, z);
      if (w > CORRIDOR_NARROW_CELLS) break;
      hi++;
    }
    for (let ix = lo; ix <= hi; ix++) {
      const id = grid.roomId[grid.idx(ix, z)];
      if (id >= 0) ids.add(id);
    }
  } else {
    let lo = z;
    while (grid.inBounds(x, lo - 1) && grid.isWalkable(x, lo - 1)) {
      const w = widthAlongZ(grid, x, lo - 1);
      if (w > CORRIDOR_NARROW_CELLS) break;
      lo--;
    }
    let hi = z;
    while (grid.inBounds(x, hi + 1) && grid.isWalkable(x, hi + 1)) {
      const w = widthAlongZ(grid, x, hi + 1);
      if (w > CORRIDOR_NARROW_CELLS) break;
      hi++;
    }
    for (let iz = lo; iz <= hi; iz++) {
      const id = grid.roomId[grid.idx(x, iz)];
      if (id >= 0) ids.add(id);
    }
  }
  return ids;
}

function isCorridorLikeCell(grid, x, z) {
  if (grid.get(x, z) === CELL_CORRIDOR) return true;
  if (!grid.isWalkable(x, z)) return false;
  const wx = widthAlongX(grid, x, z);
  const wz = widthAlongZ(grid, x, z);
  const narrow = Math.min(wx, wz);
  const wide = Math.max(wx, wz);
  if (narrow > CORRIDOR_NARROW_CELLS) return false;
  if (wide < narrow * CORRIDOR_ASPECT) return false;
  const stripRooms = narrowStripRoomIds(grid, x, z);
  return stripRooms.size > 1;
}

function scanStraightRuns(grid, axis) {
  const size = grid.size;
  let best = 0;
  if (axis === "x") {
    for (let z = 0; z < size; z++) {
      let run = 0;
      for (let x = 0; x < size; x++) {
        if (isCorridorLikeCell(grid, x, z)) run++;
        else {
          best = Math.max(best, run);
          run = 0;
        }
      }
      best = Math.max(best, run);
    }
  } else {
    for (let x = 0; x < size; x++) {
      let run = 0;
      for (let z = 0; z < size; z++) {
        if (isCorridorLikeCell(grid, x, z)) run++;
        else {
          best = Math.max(best, run);
          run = 0;
        }
      }
      best = Math.max(best, run);
    }
  }
  return best;
}

export function longestStraightCorridorCells(grid) {
  return Math.max(scanStraightRuns(grid, "x"), scanStraightRuns(grid, "z"));
}

export function corridorLikeRatio(grid) {
  let corridorLike = 0;
  let walkable = 0;
  for (let z = 0; z < grid.size; z++) {
    for (let x = 0; x < grid.size; x++) {
      if (!grid.isWalkable(x, z)) continue;
      walkable++;
      if (isCorridorLikeCell(grid, x, z) || grid.get(x, z) === CELL_CORRIDOR) corridorLike++;
    }
  }
  return walkable ? corridorLike / walkable : 0;
}

export function roomToRoomDirectRatio(grid, openPairs) {
  const adj = findRoomAdjacencies(grid);
  if (!adj.length) return 1;
  const open = openPairs instanceof Set ? openPairs : new Set(openPairs);
  return open.size / adj.length;
}

export function consecutiveSameSizeCount(rooms) {
  let n = 0;
  for (let i = 1; i < rooms.length; i++) {
    if (rooms[i].sizeKey && rooms[i].sizeKey === rooms[i - 1].sizeKey) n++;
  }
  return n;
}

function roomAreaCells(room) {
  return room.cells?.length ?? 0;
}

function parseBbox(sizeKey) {
  if (!sizeKey) return [0, 0];
  const parts = sizeKey.split("x").map(Number);
  return [Math.min(parts[0], parts[1]), Math.max(parts[0], parts[1])];
}

function isNarrowRoom(room) {
  if (NARROW_KINDS.has(room.kind) || room.kind?.startsWith("narrow")) return true;
  const area = roomAreaCells(room);
  const [mn] = parseBbox(room.sizeKey);
  return area <= 22 || mn <= 3;
}

function isWideRoom(room) {
  if (WIDE_KINDS.has(room.kind)) return true;
  return roomAreaCells(room) >= 28;
}

export function analyzeSpatialLayout(grid, rooms, openPairs) {
  const kinds = {};
  const sizeHist = {};
  let totalArea = 0;
  let loungeCount = 0;
  let narrowCount = 0;
  let wideCount = 0;
  let orthoCount = 0;

  for (const room of rooms) {
    kinds[room.kind] = (kinds[room.kind] ?? 0) + 1;
    const area = roomAreaCells(room);
    totalArea += area;
    const sk = room.sizeKey ?? "?";
    sizeHist[sk] = (sizeHist[sk] ?? 0) + 1;
    if (LOUNGE_KINDS.has(room.kind)) loungeCount++;
    if (isNarrowRoom(room)) narrowCount++;
    if (isWideRoom(room)) wideCount++;
    if (ORTHO_SHAPES.has(room.kind)) orthoCount++;
  }

  const roomCount = rooms.length;
  const avgRoomArea = roomCount ? totalArea / roomCount : 0;
  const longestCorridor = longestStraightCorridorCells(grid);
  const corrLike = corridorLikeRatio(grid);
  const corrTagged = corridorRatio(grid);
  const roomFloor = roomFloorRatio(grid);
  const directRatio = roomToRoomDirectRatio(grid, openPairs);
  const sameSizeConsecutive = consecutiveSameSizeCount(rooms);

  return {
    roomCount,
    kinds,
    sizeHist,
    avgRoomAreaM2: avgRoomArea * MAP_CELL_M * MAP_CELL_M,
    corridorLikeRatio: corrLike,
    corridorTaggedRatio: corrTagged,
    roomFloorRatio: roomFloor,
    loungePresent: loungeCount > 0,
    loungeCount,
    narrowPresent: narrowCount > 0,
    widePresent: wideCount > 0,
    orthoShapeCount: orthoCount,
    roomToRoomDirectRatio: directRatio,
    longestCorridorCells: longestCorridor,
    longestCorridorM: longestCorridor * MAP_CELL_M,
    sameSizeConsecutive,
    uniqueSizes: new Set(rooms.map((r) => r.sizeKey).filter(Boolean)).size,
  };
}

export function evaluateSpatialFeel(spatial) {
  const issues = [];

  if (spatial.roomFloorRatio < 0.75 || spatial.corridorLikeRatio > spatial.roomFloorRatio * 0.35) {
    issues.push({ kind: SPATIAL_FAIL.CORRIDOR_DOMINANT, detail: spatial });
  }
  if (spatial.longestCorridorCells >= LONG_CORRIDOR_CELLS) {
    issues.push({ kind: SPATIAL_FAIL.LONG_CORRIDOR_REPEAT, detail: { m: spatial.longestCorridorM } });
  }
  if (spatial.sameSizeConsecutive > 0) {
    issues.push({ kind: SPATIAL_FAIL.SAME_SIZE_CONSECUTIVE, detail: spatial.sameSizeConsecutive });
  }
  if (!spatial.loungePresent && spatial.roomCount >= 2) {
    issues.push({ kind: SPATIAL_FAIL.NO_LOUNGE, detail: null });
  }
  if (spatial.roomCount >= 3 && (!spatial.narrowPresent || !spatial.widePresent)) {
    issues.push({ kind: SPATIAL_FAIL.NO_SIZE_MIX, detail: spatial });
  }
  if (spatial.roomCount >= 2 && spatial.uniqueSizes < Math.min(spatial.roomCount, 2)) {
    issues.push({ kind: SPATIAL_FAIL.LOW_NOVELTY, detail: spatial });
  }
  if (spatial.roomToRoomDirectRatio < 0.45 && spatial.roomCount >= 2) {
    issues.push({ kind: SPATIAL_FAIL.DUNGEON_LIKE, detail: spatial.roomToRoomDirectRatio });
  }

  return { pass: issues.length === 0, issues };
}

function pickStandInRoom(room, innerWalls) {
  const cx = room.centroid.x + 0.5;
  const cz = room.centroid.z + 0.5;
  const probes = [
    [cx, cz],
    [cx + 0.6, cz],
    [cx - 0.6, cz],
    [cx, cz + 0.6],
    [cx, cz - 0.6],
  ];
  return probes.find(([x, z]) => isWalkableLocal(x, z, innerWalls)) ?? probes[0];
}

/** Player camera inside a packed zone, looking toward another zone or opening. */
export function cameraPoseForZone(packedRoom, allRooms, innerWalls) {
  const [camX, camZ] = pickStandInRoom(packedRoom, innerWalls);
  let lookX = camX;
  let lookZ = camZ;
  let bestD = 0;

  for (const other of allRooms) {
    if (other.id === packedRoom.id) continue;
    const ox = other.centroid.x + 0.5;
    const oz = other.centroid.z + 0.5;
    const d = Math.hypot(ox - camX, oz - camZ);
    if (d > bestD) {
      bestD = d;
      lookX = ox;
      lookZ = oz;
    }
  }

  if (bestD < 0.5) {
    lookX = camX + 2;
    lookZ = camZ;
  }

  return {
    camX,
    camY: EYE_H,
    camZ,
    lookX,
    lookY: ROOM_H * 0.45,
    lookZ,
    zoneKind: packedRoom.kind,
    zoneSize: packedRoom.sizeKey,
  };
}

/** Best showcase poses for a chunk (lounge + shaped room + transition). */
export function collectSpatialCameraPoses(gameRoom) {
  const packed = gameRoom.rooms ?? [];
  const innerWalls = gameRoom.innerWalls ?? [];
  if (!packed.length) return [];

  const poses = [];
  const lounge = packed.find((r) => LOUNGE_KINDS.has(r.kind)) ?? packed[0];
  poses.push({ ...cameraPoseForZone(lounge, packed, innerWalls), tag: "lounge" });

  const shaped = packed.find((r) => ORTHO_SHAPES.has(r.kind));
  if (shaped && shaped.id !== lounge.id) {
    poses.push({ ...cameraPoseForZone(shaped, packed, innerWalls), tag: shaped.kind });
  }

  const narrow = packed.find((r) => NARROW_KINDS.has(r.kind) || r.kind?.startsWith("narrow"));
  if (narrow && narrow.id !== lounge.id && narrow.id !== shaped?.id) {
    poses.push({ ...cameraPoseForZone(narrow, packed, innerWalls), tag: "narrow" });
  }

  if (poses.length < 2 && packed.length > 1) {
    const alt = packed.find((r) => r.id !== lounge.id);
    if (alt) poses.push({ ...cameraPoseForZone(alt, packed, innerWalls), tag: "alt" });
  }

  return poses.slice(0, 2);
}

export function aggregateSpatialStats(chunkResults) {
  const roomCountDist = {};
  const sizeDist = {};
  const kindTotals = {};
  let totalRooms = 0;
  let totalArea = 0;
  let loungeChunks = 0;
  let directSum = 0;
  let maxCorridor = 0;
  let corridorLikeSum = 0;
  const orthoKindsSeen = new Set();

  for (const c of chunkResults) {
    const s = c.spatial;
    roomCountDist[s.roomCount] = (roomCountDist[s.roomCount] ?? 0) + 1;
    totalRooms += s.roomCount;
    totalArea += s.avgRoomAreaM2 * s.roomCount;
    if (s.loungePresent) loungeChunks++;
    directSum += s.roomToRoomDirectRatio;
    maxCorridor = Math.max(maxCorridor, s.longestCorridorM);
    corridorLikeSum += s.corridorLikeRatio;
    for (const [k, v] of Object.entries(s.kinds)) {
      kindTotals[k] = (kindTotals[k] ?? 0) + v;
      if (ORTHO_SHAPES.has(k)) orthoKindsSeen.add(k);
    }
    for (const [sk, v] of Object.entries(s.sizeHist)) {
      sizeDist[sk] = (sizeDist[sk] ?? 0) + v;
    }
  }

  const n = chunkResults.length || 1;
  const kindRatio = {};
  for (const [k, v] of Object.entries(kindTotals)) {
    kindRatio[k] = v / totalRooms;
  }

  return {
    chunks: chunkResults.length,
    roomCountDistribution: roomCountDist,
    roomSizeDistribution: sizeDist,
    shapeKindRatio: kindRatio,
    avgRoomAreaM2: totalRooms ? totalArea / totalRooms : 0,
    avgCorridorLikeRatio: corridorLikeSum / n,
    loungeChunkProbability: loungeChunks / n,
    avgRoomToRoomDirectRatio: directSum / n,
    maxLongestCorridorM: maxCorridor,
    orthoShapesSeen: [...orthoKindsSeen].sort(),
    orthoShapesRequired: [...ORTHO_SHAPES],
    orthoShapesMissing: [...ORTHO_SHAPES].filter((k) => !orthoKindsSeen.has(k)),
  };
}
