import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import {
  createCarpetTexture,
  loadWallpaperOrFallback,
  tiled,
  CARPET_TILE_M,
} from "./textures.js";
import { World } from "./world.js";
import { Player } from "./player.js";
import { FluorescentHum } from "./audio.js";
import {
  CHUNK,
  EYE_H,
  FOG_COLOR,
  FOG_NEAR,
  FOG_FAR,
  AMBIENT_COLOR,
  AMBIENT_INTENSITY,
  LIGHT_PANEL_COLOR,
  LIGHT_PANEL_OFF_COLOR,
  LIGHT_PANEL_INTENSITY,
  PANEL_LIGHT_INTENSITY,
  TONE_MAPPING_EXPOSURE,
  CAMERA_FOV,
  CARPET_COLOR,
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
renderer.domElement.style.cssText = "position:fixed;inset:0;z-index:1";
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(FOG_COLOR);
scene.fog = new THREE.Fog(FOG_COLOR, FOG_NEAR, FOG_FAR);

const camera = new THREE.PerspectiveCamera(CAMERA_FOV, window.innerWidth / window.innerHeight, 0.08, 50);
camera.position.set(CHUNK / 2, EYE_H, CHUNK / 2);

scene.add(new THREE.AmbientLight(AMBIENT_COLOR, AMBIENT_INTENSITY));

const hum = new FluorescentHum();

async function init() {
  const loader = new THREE.TextureLoader();
  const wallpaper = await loadWallpaperOrFallback(loader);
  const carpetTex = createCarpetTexture();

  const materials = {
    wallTex: wallpaper,
    carpetTex,
    carpet: new THREE.MeshStandardMaterial({
      map: tiled(carpetTex, CARPET_TILE_M, CHUNK, CHUNK),
      color: CARPET_COLOR,
      roughness: 0.94,
      metalness: 0,
      side: THREE.DoubleSide,
    }),
    lightPanel: new THREE.MeshBasicMaterial({
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

  let started = false;

  overlay.addEventListener("click", () => {
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
    world.update(player.position);
    world.flushColliders();
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
      const scale = LIGHT_PANEL_INTENSITY * panel.bright * flicker;
      light.intensity = PANEL_LIGHT_INTENSITY * panel.bright * flicker;
      face.material.color.copy(_panelColor).multiplyScalar(scale);
    }

    renderer.render(scene, camera);

    const loadBudget = Math.max(4, TARGET_FRAME_MS - (performance.now() - frameStart));
    world.processLoadQueue(player.position, loadBudget);
  }

  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

init().catch((err) => {
  console.error(err);
  const hint = document.querySelector("#overlay .hint");
  if (hint) hint.textContent = "로딩 오류 — 새로고침 해주세요.";
});
