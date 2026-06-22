import * as THREE from "three";

const STATIC_SIZE = 128;
let _canvas;
let _ctx;
let _staticTex;

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
    const on = Math.random() < 0.78;
    const v = on ? (Math.random() * 255) | 0 : 0;
    d[i] = d[i + 1] = d[i + 2] = v;
    d[i + 3] = on ? 255 : 0;
  }
  _ctx.putImageData(imageData, 0, 0);
  tex.needsUpdate = true;
}

function injectFragmentGlitch(shader) {
  const hook = "#include <fog_fragment>";
  if (!shader.fragmentShader.includes(hook)) return;
  shader.fragmentShader = shader.fragmentShader.replace(
    hook,
    `float scan = step(0.4, fract(sin(gl_FragCoord.y * 1.2 + uGlitchTime * 160.0)));
      float block = step(0.7, fract(sin(gl_FragCoord.x * 0.05 + uGlitchTime * 200.0)));
      float snow = step(0.5, fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233)) + uGlitchTime * 380.0)));
      float corrupt = scan * block;
      gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(snow), 0.28 + corrupt * 0.38);
      gl_FragColor.rgb += corrupt * 0.35;
      gl_FragColor.r += step(0.92, fract(uGlitchTime * 17.0 + gl_FragCoord.y * 0.03)) * 0.25;
      ${hook}`,
  );
}

function makeGlitchMaterial(srcMat) {
  const tex = staticTexture();
  const baseMap = srcMat.map || null;
  if (baseMap) baseMap.colorSpace = THREE.SRGBColorSpace;

  const mat = new THREE.MeshStandardMaterial({
    map: baseMap,
    color: srcMat.color?.clone?.() ?? new THREE.Color(0xbfb8a0),
    emissiveMap: tex,
    emissive: new THREE.Color(0xcccccc),
    emissiveIntensity: 0.65,
    roughness: srcMat.roughness ?? 0.85,
    metalness: srcMat.metalness ?? 0.05,
    normalMap: srcMat.normalMap || null,
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
      float nx = sin(transformed.y * 21.0 + t * 59.0) * cos(transformed.x * 15.0 + t * 47.0);
      float nz = cos(transformed.z * 19.0 + t * 53.0);
      float burst = step(0.88, fract(sin(t * 29.0 + transformed.x * 9.0)));
      float snapX = step(0.58, fract(sin(transformed.z * 41.0 + t * 83.0)));
      float snapZ = step(0.56, fract(sin(transformed.y * 37.0 + t * 71.0)));
      float amp = uGlitchAmp * (1.0 + burst * 1.8);
      transformed += normal * (nx + nz) * amp * 0.055;
      transformed.x += (snapX - 0.5) * amp * 0.09;
      transformed.z += (snapZ - 0.5) * amp * 0.075;
      `,
    );

    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <common>",
      `#include <common>
      uniform float uGlitchTime;`,
    );

    injectFragmentGlitch(shader);
  };

  return mat;
}

/** TV glitch + mesh warp — Chair.glb only */
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
  if ((Math.floor(time * 60) & 1) === 0) refreshStaticTexture();

  const spike = Math.random() < 0.11 ? 2.2 : 1;
  const amp = spike * (1.0 + Math.sin(time * 61.0) * 0.3 + Math.random() * 0.55);

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
      mat.emissiveIntensity = 0.5 + Math.random() * 0.95;
    }
  });
}
