import * as THREE from "three";
import {
  createSurfaceMaterial,
  createBakedWallMaterial,
} from "./textures.js";

/** Shared materials for the whole session — lightweight MeshBasic where possible */
export function createGameMaterials(wallpaper, surfaceTex, floorTex) {
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
  surfaceTex.wrapS = surfaceTex.wrapT = THREE.RepeatWrapping;

  return {
    wallTex: wallpaper,
    surfaceTex,
    floorTex,
    wall: createBakedWallMaterial(wallpaper),
    floor: createSurfaceMaterial(floorTex),
    ceilingTile: createSurfaceMaterial(surfaceTex, { side: THREE.DoubleSide }),
  };
}
