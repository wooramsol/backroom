import * as THREE from "three";

const STATIC_SIZE = 128;
let _canvas;
let _ctx;
let _staticTex;
let _frame = 0;

function staticTexture() {
  if (_staticTex) return _staticTex;
  _canvas = document.createElement("canvas");
  _canvas.width = _canvas.height = STATIC_SIZE;
  _ctx = _canvas.getContext("2d");
  _staticTex = new THREE.CanvasTexture(_canvas);
  _staticTex.colorSpace = THREE.SRGBColorSpace;
  return _staticTex;
}

function refreshStaticTexture() {
  const tex = staticTexture();
  const imageData = _ctx.createImageData(STATIC_SIZE, STATIC_SIZE);
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const on = Math.random() < 0.72;
    const v = on ? (Math.random() * 255) | 0 : 0;
    d[i] = d[i + 1] = d[i + 2] = v;
    d[i + 3] = on ? 255 : 0;
  }
  _ctx.putImageData(imageData, 0, 0);
  tex.needsUpdate = true;
}

function makeGlitchMaterial(srcMat) {
  const tex = staticTexture();
  const baseMap = srcMat.map || null;
  if (baseMap) baseMap.colorSpace = THREE.SRGBColorSpace;

  const mat = new THREE.MeshLambertMaterial({
    map: baseMap,
    color: srcMat.color?.clone?.() ?? new THREE.Color(0xbfb8a0),
    emissiveMap: tex,
    emissive: new THREE.Color(0xffffff),
    emissiveIntensity: 0.55,
  });
  mat.userData.chunkOwned = true;
  mat.userData.chairGlitch = true;

  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uGlitchTime = { value: 0 };
    shader.uniforms.uGlitchAmp = { value: 1 };
    mat.userData.glitchUniforms = shader.uniforms;

    shader.vertexShader = shader.vertexShader.replace(
      "#include <common>",
      `#include <common>
      uniform float uGlitchTime;
      uniform float uGlitchAmp;`,
    );

    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      `#include <begin_vertex>
      float t = uGlitchTime;
      float nx = sin(transformed.y * 19.0 + t * 43.0) * cos(transformed.x * 13.0 + t * 31.0);
      float nz = cos(transformed.z * 17.0 + t * 37.0) * sin(transformed.y * 11.0 + t * 29.0);
      float snapX = step(0.68, fract(sin(transformed.z * 37.0 + t * 61.0)));
      float snapY = step(0.62, fract(cos(transformed.x * 29.0 + t * 47.0)));
      float snapZ = step(0.7, fract(sin(transformed.y * 41.0 + t * 53.0)));
      transformed += normal * (nx + nz) * uGlitchAmp * 0.065;
      transformed.x += (snapX - 0.5) * uGlitchAmp * 0.11;
      transformed.y += (snapY - 0.5) * uGlitchAmp * 0.055;
      transformed.z += (snapZ - 0.5) * uGlitchAmp * 0.09;
      `,
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      `#include <common>
      uniform float uGlitchTime;`,
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <dithering_fragment>",
      `#include <dithering_fragment>
      float scan = step(0.55, fract(sin(gl_FragCoord.y * 0.85 + uGlitchTime * 95.0)));
      float block = step(0.78, fract(sin(gl_FragCoord.x * 0.04 + uGlitchTime * 120.0)));
      gl_FragColor.rgb += (scan * block) * 0.22;
      gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(step(0.5, fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + uGlitchTime * 200.0)))), 0.18);
      `,
    );
  };

  return mat;
}

/** Strong TV glitch + vertex warp — Chair.glb only */
export function applyChairGlitchVisual(pivot) {
  pivot.userData.chairGlitch = true;
  pivot.traverse((obj) => {
    if (!obj.isMesh || !obj.material) return;
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    const out = mats.map((m) => makeGlitchMaterial(m));
    obj.material = out.length === 1 ? out[0] : out;
  });
}

export function tickChairGlitchVisuals(scene, time) {
  _frame++;
  if (_frame % 2 === 0) refreshStaticTexture();

  const amp = 0.85 + Math.sin(time * 41.3) * 0.25 + Math.random() * 0.35;
  scene.traverse((obj) => {
    if (!obj.isMesh?.material) return;
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const mat of mats) {
      if (!mat.userData?.chairGlitch) continue;
      const u = mat.userData.glitchUniforms;
      if (u) {
        u.uGlitchTime.value = time;
        u.uGlitchAmp.value = amp;
      }
      mat.emissiveIntensity = 0.45 + Math.random() * 0.55;
    }
  });
}
