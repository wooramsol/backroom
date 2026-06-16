import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import {
  createCarpetTexture,
  loadWallpaperOrFallback,
  tiled,
  createCarpetSurfaceMaterial,
  CARPET_TILE_M,
} from "./textures.js";
import { World } from "./world.js";
import { Player } from "./player.js";
import { FluorescentHum } from "./audio.js";
import { createBloomPipeline, resizeBloomPipeline } from "./postfx.js";
import {
  CHUNK,
  EYE_H,
  FOG_COLOR,
  FOG_NEAR,
  FOG_FAR,
  AMBIENT_COLOR,
  AMBIENT_INTENSITY,
  HEMI_SKY_COLOR,
  HEMI_GROUND_COLOR,
  HEMI_INTENSITY,
  LIGHT_PANEL_COLOR,
  LIGHT_PANEL_OFF_COLOR,
  LIGHT_PANEL_INTENSITY,
  PANEL_LIGHT_INTENSITY,
  TONE_MAPPING_EXPOSURE,
  CAMERA_FOV,
  CAMERA_NEAR,
  ENABLE_FLUORESCENT_HUM,
} from "./constants.js";

const overlay = document.getElementById("overlay");
const hud = document.getElementById("hud");
const vignette = document.getElementById("vignette");

const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
RectAreaLightUniformsLib.init();
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = TONE_MAPPING_EXPOSURE;
renderer.domElement.style.cssText = "position:fixed;inset:0;z-index:1;visibility:hidden";
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(FOG_COLOR);
scene.fog = new THREE.Fog(FOG_COLOR, FOG_NEAR, FOG_FAR);

const camera = new THREE.PerspectiveCamera(CAMERA_FOV, window.innerWidth / window.innerHeight, CAMERA_NEAR, 50);
camera.position.set(CHUNK / 2, EYE_H, CHUNK / 2);

scene.add(new THREE.AmbientLight(AMBIENT_COLOR, AMBIENT_INTENSITY));
scene.add(new THREE.HemisphereLight(HEMI_SKY_COLOR, HEMI_GROUND_COLOR, HEMI_INTENSITY));

const hum = new FluorescentHum();

async function init() {
  const loader = new THREE.TextureLoader();
  const wallpaper = await loadWallpaperOrFallback(loader);
  const carpetTex = createCarpetTexture();
  const floorMap = tiled(carpetTex, CARPET_TILE_M, CHUNK, CHUNK);

  const materials = {
    wallTex: wallpaper,
    carpetTex,
    carpet: createCarpetSurfaceMaterial(floorMap),
    lightPanelOn: new THREE.MeshBasicMaterial({
      color: LIGHT_PANEL_COLOR,
    }),
    lightPanelOff: new THREE.MeshBasicMaterial({
      color: LIGHT_PANEL_OFF_COLOR,
    }),
  };

  const world = new World(scene, materials);
  const player = new Player(camera, renderer.domElement);
  world.init(player.position);
  player.connect();

  const { composer, bloom } = createBloomPipeline(renderer, scene, camera);

  let started = false;
  let ready = false;
  const hint = document.querySelector("#overlay .hint");
  const defaultHint =
    "클릭하여 시작<br />WASD · 이동 &nbsp; Shift · 달리기 &nbsp; Space · 점프 &nbsp; 마우스 · 시야";

  if (hint) hint.textContent = "주변 공간 생성 중…";
  overlay.style.cursor = "wait";

  world
    .preloadAround(player.position, (done, total) => {
      if (hint && !ready) {
        hint.innerHTML = `주변 공간 생성 중… ${done}/${total}<br/>잠시만 기다려 주세요`;
      }
    })
    .then(() => {
      for (let i = 0; i < 5; i++) composer.render();
      player.setColliders(world.getColliders());
      ready = true;
      renderer.domElement.style.visibility = "visible";
      overlay.style.cursor = "pointer";
      if (hint) hint.innerHTML = defaultHint;
    })
    .catch((err) => {
      console.error(err);
      ready = true;
      renderer.domElement.style.visibility = "visible";
      overlay.style.cursor = "pointer";
      if (hint) hint.textContent = "로딩 오류 — 새로고침 해주세요.";
    });

  overlay.addEventListener("click", () => {
    if (!ready) return;
    player.requestLock();
    if (!started) {
      started = true;
      overlay.classList.add("hidden");
      hud.classList.add("visible");
      vignette.classList.add("visible");
      if (ENABLE_FLUORESCENT_HUM) hum.start();
    }
  });

  const clock = new THREE.Clock();
  let lightT = 0;
  const _panelColor = new THREE.Color(LIGHT_PANEL_COLOR);
  const TARGET_FRAME_MS = 16.7;

  function animate() {
    requestAnimationFrame(animate);
    const frameStart = performance.now();
    const dt = Math.min(clock.getDelta(), 0.05);
    lightT += dt;

    world.tick(dt);
    if (!world.preloading) {
      world.update(player.position);
      world.flushColliders();
    }
    player.setColliders(world.getColliders());
    if (world.consumeColliderRebuild()) {
      player.resolvePenetration();
    }
    if (started) {
      player.update(dt);
      if (ENABLE_FLUORESCENT_HUM) hum.tick(lightT);
    }

    for (const { light, panel, face } of world.getFixtures()) {
      const flicker = 0.94 + Math.sin(lightT * 8 + panel.phase) * 0.04;
      light.intensity = PANEL_LIGHT_INTENSITY * panel.bright * flicker;
      face.material.color
        .copy(_panelColor)
        .multiplyScalar(LIGHT_PANEL_INTENSITY * panel.bright * flicker);
    }

    composer.render();

    if (!world.preloading) {
      const elapsed = performance.now() - frameStart;
      let loadBudget = Math.max(3, Math.min(8, TARGET_FRAME_MS - elapsed));
      if (world.hasPendingLoads()) {
        loadBudget = Math.max(loadBudget, 14);
      }
      world.processLoadQueue(player.position, loadBudget);
    }
  }

  animate();

  window.addEventListener("resize", () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    resizeBloomPipeline(renderer, composer, bloom, w, h);
  });
}

init().catch((err) => {
  console.error(err);
  const hint = document.querySelector("#overlay .hint");
  if (hint) hint.textContent = "로딩 오류 — 새로고침 해주세요.";
});
