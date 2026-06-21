import * as THREE from "three";
import {
  createCeilingGapMaterial,
  createCeilingTileMaterial,
  createBakedWallMaterial,
  tiledAt,
  CEILING_TILE_M,
} from "./textures.js";
import { CHUNK } from "./constants.js";

/** Shared materials for the whole session — lightweight MeshBasic where possible */
export function createGameMaterials(wallpaper, surfaceTex) {
  const panelOnColor = new THREE.Color(0xfff4e5).multiplyScalar(2.2);

  return {
    wallTex: wallpaper,
    surfaceTex,
    wall: createBakedWallMaterial(wallpaper),
    /** bottom.jpg — shared base for ceiling tile faces (UVs baked per chunk) */
    surfaceMat: createCeilingTileMaterial(surfaceTex),
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
  const mat = materials.surfaceMat.clone();
  mat.map = map;
  mat.userData.chunkOwned = true;
  return mat;
}
