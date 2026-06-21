import * as THREE from "three";
import {
  createCeilingGapMaterial,
  createCeilingTileMaterial,
  createFloorSurfaceMaterial,
  createBakedWallMaterial,
} from "./textures.js";
import { FLUORESCENT_COLOR } from "./constants.js";

/** Shared materials for the whole session — lightweight MeshBasic where possible */
export function createGameMaterials(wallpaper, surfaceTex, floorTex) {
  const panelOnColor = new THREE.Color(FLUORESCENT_COLOR).multiplyScalar(2.2);

  return {
    wallTex: wallpaper,
    surfaceTex,
    floorTex,
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
