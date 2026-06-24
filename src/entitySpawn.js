import { CHUNK } from "./constants.js";
import { generateRoom, isWalkableLocal, reachableCellsFrom } from "./room.js";
import { createRng } from "./rng.js";

function chunkOf(x, z) {
  return { cx: Math.floor(x / CHUNK), cz: Math.floor(z / CHUNK) };
}

/** Walkable world spots in a ring around the player */
export function collectSpawnSpots(px, pz, minDist, maxDist, chunkRadius, isBlocked) {
  const { cx: pcx, cz: pcz } = chunkOf(px, pz);
  const out = [];

  for (let cz = pcz - chunkRadius; cz <= pcz + chunkRadius; cz++) {
    for (let cx = pcx - chunkRadius; cx <= pcx + chunkRadius; cx++) {
      const room = generateRoom(cx, cz);
      const mid = CHUNK / 2;
      let cells = [];
      if (isWalkableLocal(mid, mid, room.innerWalls)) {
        cells = reachableCellsFrom(room.innerWalls, mid, mid);
      }
      if (!cells.length) {
        for (let iz = 0; iz < Math.ceil(CHUNK / 0.5); iz++) {
          for (let ix = 0; ix < Math.ceil(CHUNK / 0.5); ix++) {
            const x = ix * 0.5 + 0.25;
            const z = iz * 0.5 + 0.25;
            if (isWalkableLocal(x, z, room.innerWalls)) cells.push({ x, z });
          }
        }
      }

      for (const cell of cells) {
        const wx = cx * CHUNK + cell.x;
        const wz = cz * CHUNK + cell.z;
        const d = Math.hypot(wx - px, wz - pz);
        if (d < minDist || d > maxDist) continue;
        if (isBlocked(wx, wz)) continue;
        out.push({ wx, wz });
      }
    }
  }

  return out;
}

export function pickRandomSpawnSpot(px, pz, seed, minDist, maxDist, chunkRadius, isBlocked) {
  const rng = createRng(Math.floor(px), Math.floor(pz), seed);
  const spots = collectSpawnSpots(px, pz, minDist, maxDist, chunkRadius, isBlocked);
  return rng.pick(spots) ?? null;
}
