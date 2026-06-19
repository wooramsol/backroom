import { CEILING_TILE_M } from "./textures.js";

/** World tile index from chunk-local position */
export function tileIndexAt(worldX, worldZ, localX, localZ, tileM = CEILING_TILE_M) {
  return {
    tx: Math.floor((worldX + localX) / tileM),
    tz: Math.floor((worldZ + localZ) / tileM),
  };
}

/** Chunk-local centre of one ceiling grid cell */
export function tileCenterLocal(tx, tz, worldX, worldZ, tileM = CEILING_TILE_M) {
  return {
    x: (tx + 0.5) * tileM - worldX,
    z: (tz + 0.5) * tileM - worldZ,
  };
}

/** Tile index range covering a chunk */
export function chunkTileRange(worldX, worldZ, spanM, tileM = CEILING_TILE_M) {
  return {
    tx0: Math.floor(worldX / tileM),
    tx1: Math.floor((worldX + spanM - 1e-6) / tileM),
    tz0: Math.floor(worldZ / tileM),
    tz1: Math.floor((worldZ + spanM - 1e-6) / tileM),
  };
}
