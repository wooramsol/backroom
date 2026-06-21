import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";
import {
  BLOOM_LAYER,
  BLOOM_STRENGTH,
  BLOOM_RADIUS,
  BLOOM_THRESHOLD,
  BLOOM_RESOLUTION_SCALE,
  RENDER_RESOLUTION_SCALE,
} from "./constants.js";
import { createFilmNoisePass, resizeFilmNoise } from "./filmNoise.js";

const bloomLayer = new THREE.Layers();
bloomLayer.set(BLOOM_LAYER);

const darkMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, toneMapped: false });
const swappedMaterials = new Map();

function darkenNonBloomed(obj) {
  if (!obj.isMesh || bloomLayer.test(obj.layers)) return;
  swappedMaterials.set(obj.uuid, obj.material);
  obj.material = darkMaterial;
}

function restoreMaterials(obj) {
  if (!obj.isMesh) return;
  const prev = swappedMaterials.get(obj.uuid);
  if (prev) {
    obj.material = prev;
    swappedMaterials.delete(obj.uuid);
  }
}

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

const mixShader = {
  uniforms: {
    baseTexture: { value: null },
    bloomTexture: { value: null },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D baseTexture;
    uniform sampler2D bloomTexture;
    varying vec2 vUv;
    void main() {
      gl_FragColor = texture2D(baseTexture, vUv) + texture2D(bloomTexture, vUv);
    }
  `,
};

/** Base scene + selective troffer bloom + FXAA + VCR noise */
export function createBloomPipeline(renderer, scene, camera) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const pr = renderPixelRatio(renderer);

  const basePass = new RenderPass(scene, camera);

  const bloomComposer = new EffectComposer(renderer);
  bloomComposer.renderToScreen = false;
  bloomComposer.setPixelRatio(pr);
  bloomComposer.setSize(w, h);
  bloomComposer.addPass(basePass);
  const bloomPass = new UnrealBloomPass(
    bloomResolution(renderer, w, h),
    BLOOM_STRENGTH,
    BLOOM_RADIUS,
    BLOOM_THRESHOLD,
  );
  bloomComposer.addPass(bloomPass);

  const finalComposer = new EffectComposer(renderer);
  finalComposer.setPixelRatio(pr);
  finalComposer.setSize(w, h);
  finalComposer.addPass(new RenderPass(scene, camera));
  const mixPass = new ShaderPass(new THREE.ShaderMaterial(mixShader), "baseTexture");
  mixPass.needsSwap = true;
  mixPass.uniforms.bloomTexture.value = bloomComposer.readBuffer.texture;
  finalComposer.addPass(mixPass);
  const fxaa = new ShaderPass(FXAAShader);
  fxaa.material.uniforms.resolution.value.copy(fxaaResolution(renderer, w, h));
  finalComposer.addPass(fxaa);
  const noise = createFilmNoisePass();
  resizeFilmNoise(noise, w, h, pr);
  finalComposer.addPass(noise);

  return {
    scene,
    bloomComposer,
    finalComposer,
    bloomPass,
    fxaa,
    noise,
    render() {
      scene.traverse(darkenNonBloomed);
      bloomComposer.render();
      scene.traverse(restoreMaterials);
      mixPass.uniforms.bloomTexture.value = bloomComposer.readBuffer.texture;
      finalComposer.render();
    },
  };
}

export function resizeBloomPipeline(renderer, pipeline, w, h) {
  const pr = renderPixelRatio(renderer);
  renderer.setSize(w, h);
  pipeline.bloomComposer.setPixelRatio(pr);
  pipeline.bloomComposer.setSize(w, h);
  pipeline.bloomPass.resolution.copy(bloomResolution(renderer, w, h));
  pipeline.finalComposer.setPixelRatio(pr);
  pipeline.finalComposer.setSize(w, h);
  pipeline.fxaa.material.uniforms.resolution.value.copy(fxaaResolution(renderer, w, h));
  resizeFilmNoise(pipeline.noise, w, h, pr);
}

export function createLitePipeline(renderer, scene, camera) {
  return createBloomPipeline(renderer, scene, camera);
}

export function resizeLitePipeline(renderer, pipeline, fxaa, w, h) {
  resizeBloomPipeline(renderer, pipeline, w, h);
}
