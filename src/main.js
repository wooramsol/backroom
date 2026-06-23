import * as THREE from "three";
import {
  loadWallpaperOrFallback,
  loadSurfaceOrFallback,
} from "./textures.js";
import { createGameMaterials } from "./gameMaterials.js";
import { loadFurnitureModels } from "./furnitureModels.js";
import { World } from "./world.js";
import { Player } from "./player.js";
import { GameAudio } from "./audio.js";
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
  ENABLE_BACKGROUND_MUSIC,
} from "./constants.js";
import { formatBuildLabel } from "./version.js";
import { findSpawnPosition } from "./spawnPosition.js";

const overlay = document.getElementById("overlay");
const hud = document.getElementById("hud");
const vignette = document.getElementById("vignette");
const crosshair = document.getElementById("crosshair");
const buildLabel = document.getElementById("build-label");
const buildBadge = document.getElementById("build-badge");
const buildVersion = document.getElementById("build-version");
const resumePrompt = document.getElementById("resume-prompt");

const buildText = formatBuildLabel();
if (buildLabel) buildLabel.textContent = buildText;
if (buildVersion) buildVersion.textContent = buildText;

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

const audio = new GameAudio();

async function init() {
  const hintStatus = document.getElementById("hint-status");
  const waitHint = "Loading… please wait";
  const clickHint = "Click to start";

  if (hintStatus) hintStatus.textContent = waitHint;
  overlay.style.cursor = "wait";

  const loader = new THREE.TextureLoader();
  const [wallpaper, surfaceTex, furnitureModels] = await Promise.all([
    loadWallpaperOrFallback(loader),
    loadSurfaceOrFallback(loader),
    loadFurnitureModels(),
  ]);
  const floorTex = surfaceTex.clone();
  floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
  floorTex.userData = { ...surfaceTex.userData };
  const materials = createGameMaterials(wallpaper, surfaceTex, floorTex);
  if (ENABLE_BACKGROUND_MUSIC) void audio.preload();

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

  player.onMove = (distance, running, crouching, speed) => {
    if (started) audio.onMove(distance, running, crouching, speed);
  };
  player.onJump = () => {
    if (started) audio.onJump();
  };
  player.onLand = (impactVy) => {
    if (started) audio.onLand(impactVy);
  };

  renderer.domElement.addEventListener("click", () => {
    if (audio.ctx?.state === "suspended") void audio.ctx.resume();
  });
  renderer.domElement.addEventListener("click", tryResumeLock);
  resumePrompt?.addEventListener("click", tryResumeLock);

  const pipeline = createBloomPipeline(renderer, scene, camera);

  let started = false;
  let ready = false;

  function placePlayerAtStart() {
    const entry = world.chunks.get("0,0");
    if (!entry?.room) return;
    const furn = entry.mesh?.userData?.furnitureColliders ?? [];
    const spawn = findSpawnPosition(entry.room, furn);
    if (!spawn) return;
    player.setPosition(spawn.x, EYE_H, spawn.z);
    camera.position.set(spawn.x, EYE_H, spawn.z);
    player.resolvePenetration();
  }

  function markPlayable() {
    if (ready) return;
    ready = true;
    player.setColliders(world.getColliders());
    placePlayerAtStart();
    renderer.domElement.style.visibility = "visible";
    syncCrosshair();
    overlay.style.cursor = "pointer";
    if (hintStatus) {
      hintStatus.innerHTML = `Click to start<br /><span style="opacity:0.55;font-size:0.85em">Play area is ready — distant rooms load at boundaries</span>`;
    }
  }

  world
    .preloadAround(camera, {
      onProgress: (done, total) => {
        if (hintStatus && !ready) {
          hintStatus.innerHTML = `Building play area… ${done}/${total}<br /><span style="opacity:0.55;font-size:0.85em">Please wait — smooth movement needs a full landing zone</span>`;
        }
      },
      onBootstrapReady: markPlayable,
      onComplete: () => {
        player.setColliders(world.getColliders());
      },
    })
    .catch((err) => {
      console.error(err);
      markPlayable();
      if (hintStatus) hintStatus.textContent = "Load error — click to retry view.";
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
      if (ENABLE_BACKGROUND_MUSIC) audio.start();
    }
  });

  const clock = new THREE.Clock();
  let lightT = 0;

  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    lightT += dt;

    world.tick(dt);

    if (world.preloading) {
      world.tickLandingPreload(camera.position);
    } else if (started) {
      world.update(player.position);
      if (world.shouldStream(player.position)) {
        world.processLoadQueue(player.position);
      }
      if (world.consumeColliderRebuild()) {
        player.setColliders(world.getColliders());
        player.resolvePenetration();
      }
    }

    if (started && !world.isStreaming()) {
      tickChairGlitchVisuals(scene, lightT);
    }

    if (started) {
      player.update(dt);
    }

    if (ready) {
      if (started && world.isStreaming()) {
        renderer.render(scene, camera);
      } else {
        pipeline.render(lightT);
      }
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
  const hintStatus = document.getElementById("hint-status");
  if (hintStatus) hintStatus.textContent = "Load error — please refresh.";
});
