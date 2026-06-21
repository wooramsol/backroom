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
import { createFilmNoisePass, resizeFilmNoise } from "./filmNoise.js";

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

/** One scene draw + threshold bloom + FXAA + VCR noise (no per-frame traverse) */
export function createBloomPipeline(renderer, scene, camera) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const pr = renderPixelRatio(renderer);

  const composer = new EffectComposer(renderer);
  composer.setPixelRatio(pr);
  composer.setSize(w, h);
  composer.addPass(new RenderPass(scene, camera));
  const bloomPass = new UnrealBloomPass(
    bloomResolution(renderer, w, h),
    BLOOM_STRENGTH,
    BLOOM_RADIUS,
    BLOOM_THRESHOLD,
  );
  composer.addPass(bloomPass);
  const fxaa = new ShaderPass(FXAAShader);
  fxaa.material.uniforms.resolution.value.copy(fxaaResolution(renderer, w, h));
  composer.addPass(fxaa);
  const noise = createFilmNoisePass();
  resizeFilmNoise(noise, w, h, pr);
  composer.addPass(noise);

  return {
    composer,
    bloomPass,
    fxaa,
    noise,
    render() {
      composer.render();
    },
  };
}

export function resizeBloomPipeline(renderer, pipeline, w, h) {
  const pr = renderPixelRatio(renderer);
  renderer.setSize(w, h);
  pipeline.composer.setPixelRatio(pr);
  pipeline.composer.setSize(w, h);
  pipeline.bloomPass.resolution.copy(bloomResolution(renderer, w, h));
  pipeline.fxaa.material.uniforms.resolution.value.copy(fxaaResolution(renderer, w, h));
  resizeFilmNoise(pipeline.noise, w, h, pr);
}

export function createLitePipeline(renderer, scene, camera) {
  return createBloomPipeline(renderer, scene, camera);
}

export function resizeLitePipeline(renderer, pipeline, fxaa, w, h) {
  resizeBloomPipeline(renderer, pipeline, w, h);
}
