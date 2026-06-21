import * as THREE from "three";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";

/** VCR / camcorder — soft blur, scanlines, visible grain */
export const FilmNoiseShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0 },
    resolution: { value: new THREE.Vector2(1280, 720) },
    intensity: { value: 0.16 },
    blurAmount: { value: 0.58 },
    scanStrength: { value: 0.11 },
    wobble: { value: 0.0022 },
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
    uniform float blurAmount;
    uniform float scanStrength;
    uniform float wobble;
    varying vec2 vUv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    vec4 sampleBlur(vec2 uv) {
      vec2 px = 1.0 / resolution;
      vec4 c = texture2D(tDiffuse, uv) * 2.0;
      c += texture2D(tDiffuse, uv + vec2(px.x, 0.0));
      c += texture2D(tDiffuse, uv - vec2(px.x, 0.0));
      c += texture2D(tDiffuse, uv + vec2(0.0, px.y));
      c += texture2D(tDiffuse, uv - vec2(0.0, px.y));
      c += texture2D(tDiffuse, uv + px);
      c += texture2D(tDiffuse, uv - px);
      return c / 8.0;
    }

    void main() {
      vec2 uv = vUv;
      uv.x += (hash(vec2(time * 6.7, uv.y * 48.0)) - 0.5) * wobble;

      vec4 sharp = texture2D(tDiffuse, uv);
      vec4 soft = sampleBlur(uv);
      vec4 col = mix(sharp, soft, blurAmount);

      float scan = sin(uv.y * resolution.y * 1.35 + time * 2.0) * 0.5 + 0.5;
      col.rgb *= 1.0 - scanStrength * (1.0 - scan);

      vec2 p = uv * resolution;
      float grain = hash(floor(p * 0.9) + floor(time * 20.0)) - 0.5;
      float fine = hash(p * 1.8 + time * 4.1) - 0.5;
      float snow = hash(p * 3.3 - time * 9.0) - 0.5;
      float noise = grain * 0.5 + fine * 0.35 + snow * 0.15;
      col.rgb += noise * intensity;
      col.rgb += abs(noise) * intensity * 0.22;

      col.rgb = col.rgb * 0.96 + 0.025;
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
