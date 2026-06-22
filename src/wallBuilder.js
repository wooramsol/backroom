import { buildRoomWallGeometry, tileHFromWallTex } from "./mapgen/walls/WallMeshBuilder.js";

/**
 * Chunk wall mesh entry — Design Guide §7.4 footprint outline extrusion.
 * Outline → Shape → ExtrudeGeometry (not per-segment merge).
 */
export function buildMergedWallGeometry(room, wallTex, h, roomWx, roomWz) {
  const geometry = buildRoomWallGeometry(room, wallTex, h, roomWx, roomWz);
  return { geometry };
}

export { tileHFromWallTex };
