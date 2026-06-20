import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";
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

function fxaaResolution(renderer, w, h) {
  const pr = renderPixelRatio(renderer);
  return new THREE.Vector2(1 / (w * pr), 1 / (h * pr));
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
  const fxaa = new ShaderPass(FXAAShader);
  fxaa.material.uniforms.resolution.value.copy(fxaaResolution(renderer, w, h));
  composer.addPass(fxaa);
  return { composer, bloom, fxaa };
}

export function resizeBloomPipeline(renderer, composer, bloom, fxaa, w, h) {
  const pr = renderPixelRatio(renderer);
  renderer.setSize(w, h);
  composer.setPixelRatio(pr);
  composer.setSize(w, h);
  bloom.resolution.copy(bloomResolution(renderer, w, h));
  fxaa.material.uniforms.resolution.value.copy(fxaaResolution(renderer, w, h));
}
