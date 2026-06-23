import {
  CHUNK,
  EYE_H,
  PLAYER_R,
  BODY_WALL_CLEAR,
  MIN_CLEAR_PASSAGE,
} from "./constants.js";
import { isWalkableLocal } from "./room.js";
import { passageWidthAlong } from "./passage.js";

const SAMPLE_STEP = 0.25;

function blocksPlayer(colliders, wx, wz, y) {
  const r = PLAYER_R;
  for (const c of colliders) {
    if (c.isCeiling) continue;
    if (y < c.minY - 0.2 || y > c.maxY + 0.2) continue;
    if (wx + r <= c.minX || wx - r >= c.maxX || wz + r <= c.minZ || wz - r >= c.maxZ) continue;
    return true;
  }
  return false;
}

/**
 * Best stand position in a chunk — open clearance, near chunk centre.
 * Returns world-space x/z or null when no spot meets MIN_CLEAR_PASSAGE.
 */
export function findSpawnPosition(room, extraColliders = []) {
  const innerWalls = room.innerWalls ?? [];
  const ox = (room.cx ?? 0) * CHUNK;
  const oz = (room.cz ?? 0) * CHUNK;
  const preferX = CHUNK / 2;
  const preferZ = CHUNK / 2;
  const margin = PLAYER_R + BODY_WALL_CLEAR + 0.2;
  const minClear = MIN_CLEAR_PASSAGE;

  let best = null;

  for (let lx = margin; lx <= CHUNK - margin; lx += SAMPLE_STEP) {
    for (let lz = margin; lz <= CHUNK - margin; lz += SAMPLE_STEP) {
      if (!isWalkableLocal(lx, lz, innerWalls)) continue;

      const clearance = Math.min(
        passageWidthAlong(lx, lz, innerWalls, "x"),
        passageWidthAlong(lx, lz, innerWalls, "z"),
      );
      if (clearance < minClear) continue;

      const wx = ox + lx;
      const wz = oz + lz;
      if (blocksPlayer(extraColliders, wx, wz, EYE_H)) continue;

      const dist2 = (lx - preferX) ** 2 + (lz - preferZ) ** 2;
      const score = clearance - dist2 * 0.015;
      if (!best || score > best.score) {
        best = { x: wx, z: wz, clearance, score };
      }
    }
  }

  return best;
}

export function hasSpawnClearance(innerWalls) {
  return findSpawnPosition({ cx: 0, cz: 0, innerWalls }) !== null;
}
