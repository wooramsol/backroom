import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";
import { RENDER_RESOLUTION_SCALE } from "./constants.js";

function renderPixelRatio(renderer) {
  return renderer.getPixelRatio() * RENDER_RESOLUTION_SCALE;
}

function fxaaResolution(renderer, w, h) {
  const pr = renderPixelRatio(renderer);
  return new THREE.Vector2(1 / (w * pr), 1 / (h * pr));
}

/** FXAA only — no bloom (saves a full-screen blur pass) */
export function createLitePipeline(renderer, scene, camera) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(renderPixelRatio(renderer));
  composer.setSize(w, h);
  composer.addPass(new RenderPass(scene, camera));
  const fxaa = new ShaderPass(FXAAShader);
  fxaa.material.uniforms.resolution.value.copy(fxaaResolution(renderer, w, h));
  composer.addPass(fxaa);
  return { composer, fxaa };
}

export function resizeLitePipeline(renderer, composer, fxaa, w, h) {
  const pr = renderPixelRatio(renderer);
  renderer.setSize(w, h);
  composer.setPixelRatio(pr);
  composer.setSize(w, h);
  fxaa.material.uniforms.resolution.value.copy(fxaaResolution(renderer, w, h));
}

/** @deprecated bloom removed for performance */
export function createBloomPipeline(renderer, scene, camera) {
  return createLitePipeline(renderer, scene, camera);
}

export function resizeBloomPipeline(renderer, composer, _bloom, fxaa, w, h) {
  resizeLitePipeline(renderer, composer, fxaa, w, h);
}
