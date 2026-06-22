import * as THREE from "three";

const STATIC_SIZE = 160;
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
    const on = Math.random() < 0.82;
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
    emissiveIntensity: 1.1,
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
      float nx = sin(transformed.y * 23.0 + t * 67.0) * cos(transformed.x * 17.0 + t * 53.0);
      float nz = cos(transformed.z * 21.0 + t * 59.0) * sin(transformed.y * 15.0 + t * 71.0);
      float burst = step(0.82, fract(sin(t * 31.7 + transformed.x * 7.0)));
      float snapX = step(0.55, fract(sin(transformed.z * 43.0 + t * 89.0)));
      float snapY = step(0.5, fract(cos(transformed.x * 37.0 + t * 73.0)));
      float snapZ = step(0.58, fract(sin(transformed.y * 49.0 + t * 97.0)));
      float amp = uGlitchAmp * (1.0 + burst * 2.5);
      transformed += normal * (nx + nz) * amp * 0.19;
      transformed.x += (snapX - 0.5) * amp * 0.28 + sin(t * 120.0 + transformed.y * 9.0) * amp * 0.04;
      transformed.y += (snapY - 0.5) * amp * 0.14;
      transformed.z += (snapZ - 0.5) * amp * 0.22;
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
      float scan = step(0.42, fract(sin(gl_FragCoord.y * 1.1 + uGlitchTime * 140.0)));
      float block = step(0.62, fract(sin(gl_FragCoord.x * 0.06 + uGlitchTime * 180.0)));
      float snow = step(0.48, fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + uGlitchTime * 320.0)));
      float corrupt = scan * block;
      gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(snow), 0.42 + corrupt * 0.35);
      gl_FragColor.rgb += corrupt * 0.45;
      gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(step(0.5, fract(uGlitchTime * 77.0 + gl_FragCoord.x * 0.2))), 0.12);
      `,
    );
  };

  return mat;
}

/** Extreme TV glitch + mesh warp — Chair.glb only */
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
  refreshStaticTexture();

  const spike = Math.random() < 0.08 ? 2.8 : 1;
  const amp = spike * (1.1 + Math.sin(time * 53.7) * 0.35 + Math.random() * 0.65);

  scene.traverse((obj) => {
    if (!obj.isMesh?.material) return;
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const mat of mats) {
      if (!mat.userData?.chairGlitch) continue;
      const u = mat.userData.glitchUniforms;
      if (u) {
        u.uGlitchTime.value = time + Math.random() * 0.04;
        u.uGlitchAmp.value = amp;
      }
      mat.emissiveIntensity = 0.75 + Math.random() * 1.25;
    }
  });
}
