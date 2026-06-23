/**
 * Dev pages — match deployed game lighting, fog, and texture loading.
 */
import * as THREE from "three";
import {
  FOG_COLOR,
  FOG_NEAR,
  FOG_FAR,
  AMBIENT_COLOR,
  AMBIENT_INTENSITY,
  HEMI_SKY_COLOR,
  HEMI_GROUND_COLOR,
  HEMI_INTENSITY,
  TONE_MAPPING_EXPOSURE,
} from "../constants.js";
import {
  loadWallpaperOrFallback,
  loadSurfaceOrFallback,
  loadCarpetFloor,
} from "../textures.js";

export function configureGameLikeRenderer(renderer) {
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = TONE_MAPPING_EXPOSURE;
}

export function configureGameLikeScene(scene) {
  scene.background = new THREE.Color(FOG_COLOR);
  scene.fog = new THREE.Fog(FOG_COLOR, FOG_NEAR, FOG_FAR);
  scene.add(new THREE.AmbientLight(AMBIENT_COLOR, AMBIENT_INTENSITY));
  scene.add(new THREE.HemisphereLight(HEMI_SKY_COLOR, HEMI_GROUND_COLOR, HEMI_INTENSITY));
}

export async function loadGameTextures(loader = new THREE.TextureLoader()) {
  const [wallpaper, surfaceTex, floorTex] = await Promise.all([
    loadWallpaperOrFallback(loader),
    loadSurfaceOrFallback(loader),
    loadCarpetFloor(loader),
  ]);
  return { wallpaper, surfaceTex, floorTex };
}

export async function loadGameWallpaper(loader = new THREE.TextureLoader()) {
  return loadWallpaperOrFallback(loader);
}
