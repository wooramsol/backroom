import * as THREE from "three";
import {
  createCeilingSeamTexture,
  createCeilingTileMaterial,
  createFloorSurfaceMaterial,
  createBakedWallMaterial,
} from "./textures.js";

/** Shared materials for the whole session — lightweight MeshBasic where possible */
export function createGameMaterials(wallpaper, surfaceTex, floorTex) {
  const ceilingSeamTex = createCeilingSeamTexture(surfaceTex);

  return {
    wallTex: wallpaper,
    surfaceTex,
    floorTex,
    wall: createBakedWallMaterial(wallpaper),
    /** Seam texture — tile grooves baked in, world UVs per chunk */
    ceilingTile: createCeilingTileMaterial(ceilingSeamTex),
  };
}

/** Per-chunk floor — carpet2.jpg, seamless world UVs (no tile bevel/shadow) */
export function createChunkFloorMaterial(materials) {
  const map = materials.floorTex.clone();
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(1, 1);
  map.userData.chunkOwned = true;
  const mat = createFloorSurfaceMaterial(map);
  mat.userData.chunkOwned = true;
  return mat;
}
