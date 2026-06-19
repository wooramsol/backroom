import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { SMAAPass } from "three/addons/postprocessing/SMAAPass.js";
import {
  BLOOM_STRENGTH,
  BLOOM_RADIUS,
  BLOOM_THRESHOLD,
  BLOOM_RESOLUTION_SCALE,
  RENDER_RESOLUTION_SCALE,
} from "./constants.js";

function renderPixelRatio(renderer) {
  return renderer.getPixelRatio() * RENDER_RESOLUTION_SCALE;
}

function bloomResolution(renderer, w, h) {
  const pr = renderer.getPixelRatio();
  return new THREE.Vector2(w * pr * BLOOM_RESOLUTION_SCALE, h * pr * BLOOM_RESOLUTION_SCALE);
}

export function createBloomPipeline(renderer, scene, camera) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(renderPixelRatio(renderer));
  composer.setSize(w, h);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(
    bloomResolution(renderer, w, h),
    BLOOM_STRENGTH,
    BLOOM_RADIUS,
    BLOOM_THRESHOLD,
  );
  composer.addPass(bloom);
  const smaa = new SMAAPass(w * renderPixelRatio(renderer), h * renderPixelRatio(renderer));
  composer.addPass(smaa);
  return { composer, bloom, smaa };
}

export function resizeBloomPipeline(renderer, composer, bloom, smaa, w, h) {
  const pr = renderPixelRatio(renderer);
  renderer.setSize(w, h);
  composer.setPixelRatio(pr);
  composer.setSize(w, h);
  bloom.resolution.copy(bloomResolution(renderer, w, h));
  smaa.setSize(w * pr, h * pr);
}
