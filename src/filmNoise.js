import * as THREE from "three";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

/** Light VHS / CCTV grain — full-screen, time-varying */
export const FilmNoiseShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0 },
    resolution: { value: new THREE.Vector2(1280, 720) },
    intensity: { value: 0.04 },
    scale: { value: 1.35 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform vec2 resolution;
    uniform float intensity;
    uniform float scale;
    varying vec2 vUv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    void main() {
      vec4 col = texture2D(tDiffuse, vUv);
      vec2 p = vUv * resolution / scale;
      float n = hash(floor(p) + floor(time * 24.0)) - 0.5;
      col.rgb += n * intensity;
      gl_FragColor = col;
    }
  `,
};

export function createFilmNoisePass() {
  return new ShaderPass(FilmNoiseShader);
}

export function updateFilmNoise(pass, time) {
  pass.uniforms.time.value = time;
}

export function resizeFilmNoise(pass, w, h, pixelRatio = 1) {
  pass.uniforms.resolution.value.set(w * pixelRatio, h * pixelRatio);
}
