import * as THREE from "three";
import {
  createCeilingGapMaterial,
  createCeilingTileFaceTexture,
  createCeilingTileMaterial,
  createBakedWallMaterial,
  tiledAt,
  CEILING_TILE_M,
  WALL_TILE_W,
} from "./textures.js";

/** Shared materials for the whole session — lightweight MeshBasic where possible */
export function createGameMaterials(wallpaper, surfaceTex) {
  const carpetTileTex = createCeilingTileFaceTexture(surfaceTex);
  const carpet = createCeilingTileMaterial(carpetTileTex);
  const panelOnColor = new THREE.Color(0xfff4e5).multiplyScalar(2.2);

  return {
    wallTex: wallpaper,
    carpetTileTex,
    wall: createBakedWallMaterial(wallpaper),
    carpet,
    ceilingGroove: createCeilingGapMaterial(),
    ceilingTile: createCeilingTileMaterial(carpetTileTex),
    lightPanelOn: new THREE.MeshBasicMaterial({
      color: panelOnColor,
      toneMapped: false,
    }),
  };
}

/** Per-chunk floor map + material (disposed with chunk) */
export function createChunkFloorMaterial(materials, worldX, worldZ) {
  const map = tiledAt(materials.carpetTileTex, CEILING_TILE_M, 14, 14, worldX, worldZ);
  map.userData.chunkOwned = true;
  const mat = materials.carpet.clone();
  mat.map = map;
  mat.userData.chunkOwned = true;
  return mat;
}
