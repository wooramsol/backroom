import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import {
  BLOOM_STRENGTH,
  BLOOM_RADIUS,
  BLOOM_THRESHOLD,
  BLOOM_RESOLUTION_SCALE,
} from "./constants.js";

export function createBloomPipeline(renderer, scene, camera) {
  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(renderer.getPixelRatio() * BLOOM_RESOLUTION_SCALE);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    BLOOM_STRENGTH,
    BLOOM_RADIUS,
    BLOOM_THRESHOLD
  );
  composer.addPass(bloom);
  return { composer, bloom };
}

export function resizeBloomPipeline(renderer, composer, bloom, w, h) {
  renderer.setSize(w, h);
  composer.setPixelRatio(renderer.getPixelRatio() * BLOOM_RESOLUTION_SCALE);
  composer.setSize(w, h);
  bloom.resolution.set(w, h);
}
