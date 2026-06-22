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

  const ceilingTile = createCeilingTileMaterial(ceilingSeamTex);
  const ceilingLightTile = ceilingTile.clone();
  ceilingLightTile.color = new THREE.Color(0xfffdf2);

  return {
    wallTex: wallpaper,
    surfaceTex,
    floorTex,
    wall: createBakedWallMaterial(wallpaper),
    floor: createFloorSurfaceMaterial(floorTex),
    ceilingTile,
    ceilingLightTile,
    ceilingGroove: createCeilingGapMaterial(),
  };
}
