import * as THREE from "three";
import {
  createCeilingGapMaterial,
  createCeilingTileMaterial,
  createFloorSurfaceMaterial,
  createBakedWallMaterial,
} from "./textures.js";
import {
  LIGHT_PANEL_GLOW_COLOR,
  LIGHT_PANEL_BLOOM_COLOR,
  LIGHT_PANEL_HALO_COLOR,
  PANEL_HALO_OPACITY,
} from "./constants.js";

/** Shared materials for the whole session — lightweight MeshBasic where possible */
export function createGameMaterials(wallpaper, surfaceTex, floorTex) {
  return {
    wallTex: wallpaper,
    surfaceTex,
    floorTex,
    wall: createBakedWallMaterial(wallpaper),
    /** bottom2.jpg — subtle grain, world UVs baked per chunk */
    ceilingTile: createCeilingTileMaterial(surfaceTex),
    ceilingGroove: createCeilingGapMaterial(),
    lightPanelOn: new THREE.MeshBasicMaterial({
      color: new THREE.Color(LIGHT_PANEL_GLOW_COLOR),
      toneMapped: false,
    }),
    /** Soft additive wash — visible glow without post-processing */
    lightPanelHalo: new THREE.MeshBasicMaterial({
      color: LIGHT_PANEL_HALO_COLOR,
      transparent: true,
      opacity: PANEL_HALO_OPACITY,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    }),
    /** Bloom pass boost */
    lightPanelBloom: new THREE.MeshBasicMaterial({
      color: LIGHT_PANEL_BLOOM_COLOR,
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
