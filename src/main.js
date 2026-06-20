import * as THREE from "three";
import {
  loadWallpaperOrFallback,
  loadSurfaceOrFallback,
  createWallMaterial,
  createFloorMaterial,
  createCeilingGapMaterial,
  createCeilingTileFaceTexture,
  createCeilingTileMaterial,
} from "./textures.js";
import { World } from "./world.js";
import { Player } from "./player.js";
import {
  CHUNK,
  EYE_H,
  FOG_COLOR,
  FOG_NEAR,
  FOG_FAR,
  CAMERA_FOV,
  CAMERA_NEAR,
  MAX_PIXEL_RATIO,
} from "./constants.js";
import { formatBuildLabel, formatBuildTime } from "./version.js";

const overlay = document.getElementById("overlay");
const hud = document.getElementById("hud");
const vignette = document.getElementById("vignette");
const crosshair = document.getElementById("crosshair");
const buildLabel = document.getElementById("build-label");
const buildBadge = document.getElementById("build-badge");
const resumePrompt = document.getElementById("resume-prompt");

const buildText = formatBuildLabel();
const buildTimeText = formatBuildTime();
if (buildLabel) buildLabel.textContent = `Build ${buildTimeText}`;
if (buildBadge) buildBadge.textContent = buildText;

function syncCrosshair() {
  if (!crosshair) return;
  const rect = renderer.domElement.getBoundingClientRect();
  crosshair.style.left = `${rect.left + rect.width / 2}px`;
  crosshair.style.top = `${rect.top + rect.height / 2}px`;
}

const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NoToneMapping;
renderer.domElement.style.cssText = "position:fixed;inset:0;z-index:1;visibility:hidden";
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(FOG_COLOR);
scene.fog = new THREE.Fog(FOG_COLOR, FOG_NEAR, FOG_FAR);

const camera = new THREE.PerspectiveCamera(CAMERA_FOV, window.innerWidth / window.innerHeight, CAMERA_NEAR, 50);
camera.position.set(CHUNK / 2, EYE_H, CHUNK / 2);

let startupReady = false;

async function init() {
  const hint = document.querySelector("#overlay .hint");
  const defaultHint =
    "Click to start<br />WASD · Move &nbsp; Shift · Run &nbsp; Space · Jump &nbsp; Mouse · Look";

  let started = false;
  let world;
  let player;

  function markReady(message) {
    if (startupReady) return;
    startupReady = true;
    renderer.domElement.style.visibility = "visible";
    overlay.style.cursor = "pointer";
    if (hint) hint.innerHTML = message || defaultHint;
    syncCrosshair();
  }

  if (hint) hint.textContent = "Building nearby rooms… (one-time)";
  overlay.style.cursor = "wait";

  overlay.addEventListener("click", () => {
    if (!startupReady) return;
    player?.requestLock();
    if (!started) {
      started = true;
      overlay.classList.add("hidden");
      hud.classList.add("visible");
      vignette?.classList.remove("visible");
      crosshair?.classList.add("visible");
      syncCrosshair();
      buildBadge?.classList.add("visible");
    }
  });

  try {
    const loader = new THREE.TextureLoader();
    const wallpaper = await loadWallpaperOrFallback(loader);
    const surfaceTex = await loadSurfaceOrFallback(loader);
    const ceilingTileTex = createCeilingTileFaceTexture(surfaceTex);
    const ceilingTile = createCeilingTileMaterial(ceilingTileTex);

    const materials = {
      wallTex: wallpaper,
      wall: createWallMaterial(wallpaper),
      surfaceTex,
      ceilingTileTex,
      floor: createFloorMaterial(ceilingTileTex),
      ceilingGroove: createCeilingGapMaterial(),
      ceilingTile,
    };

    world = new World(scene, materials);
    player = new Player(camera, renderer.domElement);
    world.init(player.position);
    player.connect();

    await world.preloadAround(camera, (done, total) => {
      if (hint && !startupReady) {
        hint.innerHTML = `Building nearby rooms… ${done}/${total}<br/>Preparing the area within view distance`;
      }
    });

    renderer.render(scene, camera);
    player.setColliders(world.getColliders());
    markReady(defaultHint);
  } catch (err) {
    console.error(err);
    markReady(
      `${defaultHint}<br/><span style="opacity:0.55;font-size:0.9em">Load warning — click to play anyway</span>`,
    );
  }

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
    if (!startupReady || !started) return;
    if (player && !player.isLocked()) player.requestLock();
  }

  if (player) {
    player.onLockLost = () => {
      if (started) showResumePrompt();
    };
    player.onLockAcquired = hideResumePrompt;
  }

  renderer.domElement.addEventListener("click", tryResumeLock);
  resumePrompt?.addEventListener("click", tryResumeLock);

  function syncCrosshairIfPlaying() {
    if (started) syncCrosshair();
  }

  const clock = new THREE.Clock();
  const TARGET_FRAME_MS = 16.7;

  function animate() {
    requestAnimationFrame(animate);
    if (!world || !player) return;

    const frameStart = performance.now();
    const dt = Math.min(clock.getDelta(), 0.05);

    world.tick(dt);
    if (!world.preloading) {
      world.update(player.position);
      if (world.consumeColliderRebuild()) {
        world.flushColliders();
        player.setColliders(world.getColliders());
        player.resolvePenetration();
      }
    }
    if (started) player.update(dt);

    syncCrosshairIfPlaying();
    renderer.render(scene, camera);

    if (!world.preloading) {
      const elapsed = performance.now() - frameStart;
      const loadBudget = Math.max(2, Math.min(6, TARGET_FRAME_MS - elapsed));
      world.processLoadQueue(player.position, loadBudget);
    }
  }

  animate();

  window.addEventListener("resize", () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
    syncCrosshair();
  });
}

init().catch((err) => {
  console.error(err);
  startupReady = true;
  const hint = document.querySelector("#overlay .hint");
  if (hint) {
    hint.innerHTML =
      'Click to start<br /><span style="opacity:0.55">Startup error — refresh or check public/assets/</span>';
  }
  overlay.style.cursor = "pointer";
  renderer.domElement.style.visibility = "visible";
});
