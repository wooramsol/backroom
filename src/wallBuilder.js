import { buildRoomWallGeometry, tileHFromWallTex } from "./mapgen/walls/WallMeshBuilder.js";

/** One merged BufferGeometry — continuous connector-based wall mesh */
export function buildMergedWallGeometry(room, wallTex, h, roomWx, roomWz) {
  const geometry = buildRoomWallGeometry(room, wallTex, h, roomWx, roomWz);
  return { geometry };
}

export { tileHFromWallTex };
