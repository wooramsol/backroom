import * as THREE from "three";
import {
  createCeilingGapMaterial,
  createCeilingTileMaterial,
  createFloorSurfaceMaterial,
  createBakedWallMaterial,
  tiledAt,
  CEILING_TILE_M,
  FLOOR_TILE_M,
} from "./textures.js";
import { CHUNK } from "./constants.js";

/** Shared materials for the whole session — lightweight MeshBasic where possible */
export function createGameMaterials(wallpaper, surfaceTex, floorTex) {
  const panelOnColor = new THREE.Color(0xfff4e5).multiplyScalar(2.2);

  return {
    wallTex: wallpaper,
    surfaceTex,
    floorTex,
    wall: createBakedWallMaterial(wallpaper),
    /** bottom2.jpg — world UVs baked on each chunk's ceiling mesh */
    ceilingTile: createCeilingTileMaterial(surfaceTex),
    ceilingGroove: createCeilingGapMaterial(),
    lightPanelOn: new THREE.MeshBasicMaterial({
      color: panelOnColor,
      toneMapped: false,
    }),
  };
}

/** Per-chunk floor — carpet.jpg tiled in world space (30 cm repeats) */
export function createChunkFloorMaterial(materials, worldX, worldZ) {
  const map = tiledAt(materials.floorTex, FLOOR_TILE_M, CHUNK, CHUNK, worldX, worldZ);
  map.userData.chunkOwned = true;
  const mat = createFloorSurfaceMaterial(map);
  mat.userData.chunkOwned = true;
  return mat;
}
