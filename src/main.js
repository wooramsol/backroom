import * as THREE from "three";
import {
  loadWallpaperOrFallback,
  loadSurfaceOrFallback,
  loadCarpetFloor,
} from "./textures.js";
import { createGameMaterials } from "./gameMaterials.js";
import { loadFurnitureModels } from "./furnitureModels.js";
import { World } from "./world.js";
import { Player } from "./player.js";
import { FluorescentHum } from "./audio.js";
import { tickChairGlitchVisuals } from "./chairStatic.js";
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
  TONE_MAPPING_EXPOSURE,
  CAMERA_FOV,
  CAMERA_NEAR,
  CAMERA_FAR,
  ENABLE_FLUORESCENT_HUM,
} from "./constants.js";
import { formatBuildLabel } from "./version.js";

const overlay = document.getElementById("overlay");
const hud = document.getElementById("hud");
const vignette = document.getElementById("vignette");
const crosshair = document.getElementById("crosshair");
const buildLabel = document.getElementById("build-label");
const buildBadge = document.getElementById("build-badge");
const resumePrompt = document.getElementById("resume-prompt");

const buildText = formatBuildLabel();
if (buildLabel) buildLabel.textContent = buildText;
if (buildBadge) buildBadge.textContent = buildText;

function syncCrosshair() {
  if (!crosshair) return;
  const rect = renderer.domElement.getBoundingClientRect();
  crosshair.style.left = `${rect.left + rect.width / 2}px`;
  crosshair.style.top = `${rect.top + rect.height / 2}px`;
}

const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = TONE_MAPPING_EXPOSURE;
renderer.domElement.style.cssText = "position:fixed;inset:0;z-index:1;visibility:hidden";
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(FOG_COLOR);
scene.fog = new THREE.Fog(FOG_COLOR, FOG_NEAR, FOG_FAR);

const camera = new THREE.PerspectiveCamera(CAMERA_FOV, window.innerWidth / window.innerHeight, CAMERA_NEAR, CAMERA_FAR);
camera.position.set(CHUNK / 2, EYE_H, CHUNK / 2);

scene.add(new THREE.AmbientLight(AMBIENT_COLOR, AMBIENT_INTENSITY));
scene.add(new THREE.HemisphereLight(HEMI_SKY_COLOR, HEMI_GROUND_COLOR, HEMI_INTENSITY));

const hum = new FluorescentHum();

async function init() {
  const loader = new THREE.TextureLoader();
  const wallpaper = await loadWallpaperOrFallback(loader);
  const surfaceTex = await loadSurfaceOrFallback(loader);
  const floorTex = await loadCarpetFloor(loader);
  const materials = createGameMaterials(wallpaper, surfaceTex, floorTex);
  const furnitureModels = await loadFurnitureModels();

  const world = new World(scene, materials, furnitureModels);
  const player = new Player(camera, renderer.domElement);
  player.connect();

  function showResumePrompt() {
    if (!resumePrompt) return;
    resumePrompt.hidden = false;
    resumePrompt.classList.add("visible");
  }

  function hideResumePrompt() {
    if (!resumePrompt) return;
    resumePrompt.classList.remove("visible");
    resumePrompt.hidden = true;
  }

  function tryResumeLock() {
    if (!ready || !started) return;
    if (!player.isLocked()) player.requestLock();
  }

  player.onLockLost = () => {
    if (started) showResumePrompt();
  };
  player.onLockAcquired = hideResumePrompt;

  renderer.domElement.addEventListener("click", tryResumeLock);
  resumePrompt?.addEventListener("click", tryResumeLock);

  const pipeline = createBloomPipeline(renderer, scene, camera);

  let started = false;
  let ready = false;
  const hint = document.querySelector("#overlay .hint");
  const defaultHint =
    "Click to start<br />WASD · Move &nbsp; Shift · Run &nbsp; Space · Jump &nbsp; Mouse · Look";

  if (hint) hint.textContent = "Building nearby rooms… (one-time)";
  overlay.style.cursor = "wait";

  world
    .preloadAround(camera, (done, total) => {
      if (hint && !ready) {
        hint.innerHTML = `Building nearby rooms… ${done}/${total}<br/>Preparing the area within view distance`;
      }
    })
    .then(() => {
      player.setColliders(world.syncColliders());
      ready = true;
      renderer.domElement.style.visibility = "visible";
      syncCrosshair();
      overlay.style.cursor = "pointer";
      if (hint) hint.innerHTML = defaultHint;
    })
    .catch((err) => {
      console.error(err);
      player.setColliders(world.syncColliders());
      ready = true;
      renderer.domElement.style.visibility = "visible";
      overlay.style.cursor = "pointer";
      if (hint) hint.textContent = "Load error — please refresh.";
    });

  overlay.addEventListener("click", () => {
    if (!ready) return;
    player.requestLock();
    if (!started) {
      started = true;
      overlay.classList.add("hidden");
      hud.classList.add("visible");
      vignette.classList.add("visible");
      crosshair?.classList.add("visible");
      syncCrosshair();
      buildBadge?.classList.add("visible");
      if (ENABLE_FLUORESCENT_HUM) hum.start();
    }
  });

  const clock = new THREE.Clock();
  let lightT = 0;

  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    lightT += dt;

    world.tick(dt);
    tickChairGlitchVisuals(scene, lightT);

    if (!world.preloading) {
      world.update(player.position);
      world.processLoadQueue(player.position);
    }

    if (started) {
      player.setColliders(world.syncColliders());
      player.update(dt);
      if (ENABLE_FLUORESCENT_HUM) hum.tick(lightT);
    }

    if (ready) {
      pipeline.render(lightT);
    } else {
      renderer.render(scene, camera);
    }
  }

  animate();

  window.addEventListener("resize", () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    resizeBloomPipeline(renderer, pipeline, w, h);
    syncCrosshair();
  });
}

init().catch((err) => {
  console.error(err);
  const hint = document.querySelector("#overlay .hint");
  if (hint) hint.textContent = "Load error — please refresh.";
});
