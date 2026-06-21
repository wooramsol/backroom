import * as THREE from "three";
import {
  createCeilingGapMaterial,
  createCeilingTileMaterial,
  createFloorSurfaceMaterial,
  createBakedWallMaterial,
  SURFACE_TILE_M,
} from "./textures.js";
import { CHUNK } from "./constants.js";

/** Shared materials for the whole session — lightweight MeshBasic where possible */
export function createGameMaterials(wallpaper, surfaceTex) {
  const panelOnColor = new THREE.Color(0xfff4e5).multiplyScalar(2.2);

  return {
    wallTex: wallpaper,
    surfaceTex,
    wall: createBakedWallMaterial(wallpaper),
    /** bottom2.jpg — subtle grain, world UVs baked per chunk */
    ceilingTile: createCeilingTileMaterial(surfaceTex),
    ceilingGroove: createCeilingGapMaterial(),
    lightPanelOn: new THREE.MeshBasicMaterial({
      color: panelOnColor,
      toneMapped: false,
    }),
  };
}

/** Per-chunk floor — seamless world UVs (no repeat seams between chunks) */
export function createChunkFloorMaterial(materials) {
  const map = materials.surfaceTex.clone();
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(1, 1);
  map.userData.chunkOwned = true;
  const mat = createFloorSurfaceMaterial(map);
  mat.userData.chunkOwned = true;
  return mat;
}
