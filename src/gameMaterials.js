import * as THREE from "three";
import {
  createCeilingGapMaterial,
  createCeilingTileFaceTexture,
  createCeilingTileMaterial,
  createBakedWallMaterial,
  tiledAt,
  CEILING_TILE_M,
} from "./textures.js";
import { CHUNK } from "./constants.js";

/** Shared materials for the whole session — lightweight MeshBasic where possible */
export function createGameMaterials(wallpaper, surfaceTex) {
  const panelOnColor = new THREE.Color(0xfff4e5).multiplyScalar(2.2);
  const ceilingTileTex = createCeilingTileFaceTexture(surfaceTex);

  return {
    wallTex: wallpaper,
    surfaceTex,
    wall: createBakedWallMaterial(wallpaper),
    ceilingTile: createCeilingTileMaterial(ceilingTileTex),
    ceilingGroove: createCeilingGapMaterial(),
    lightPanelOn: new THREE.MeshBasicMaterial({
      color: panelOnColor,
      toneMapped: false,
    }),
  };
}

/** Per-chunk floor — bottom.jpg tiled in world space */
export function createChunkFloorMaterial(materials, worldX, worldZ) {
  const map = tiledAt(materials.surfaceTex, CEILING_TILE_M, CHUNK, CHUNK, worldX, worldZ);
  map.userData.chunkOwned = true;
  const mat = createCeilingTileMaterial(map);
  mat.userData.chunkOwned = true;
  return mat;
}
