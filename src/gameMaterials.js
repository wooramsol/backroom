import * as THREE from "three";
import {
  createCeilingGapMaterial,
  createCeilingSeamTexture,
  createCeilingTileMaterial,
  createFloorSurfaceMaterial,
  createBakedWallMaterial,
} from "./textures.js";

/** Shared materials for the whole session — lightweight MeshBasic where possible */
export function createGameMaterials(wallpaper, surfaceTex, floorTex) {
  const ceilingSeamTex = createCeilingSeamTexture(surfaceTex);
  ceilingSeamTex.wrapS = ceilingSeamTex.wrapT = THREE.ClampToEdgeWrapping;

  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;

  return {
    wallTex: wallpaper,
    surfaceTex,
    floorTex,
    wall: createBakedWallMaterial(wallpaper),
    floor: createFloorSurfaceMaterial(floorTex),
    /** Per-tile seam face — clamped UVs, no chunk-boundary double lines */
    ceilingTile: createCeilingTileMaterial(ceilingSeamTex),
    ceilingGroove: createCeilingGapMaterial(),
  };
}
