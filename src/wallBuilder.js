import { buildRoomWallGeometry, tileHFromWallTex } from "./mapgen/walls/WallMeshBuilder.js";

/**
 * Chunk wall mesh entry — Design Guide §7.4 continuous footprint pipeline.
 * No BoxGeometry; thickness = WALL_T via segment footprint union.
 */
export function buildMergedWallGeometry(room, wallTex, h, roomWx, roomWz) {
  const geometry = buildRoomWallGeometry(room, wallTex, h, roomWx, roomWz);
  return { geometry };
}

export { tileHFromWallTex };
