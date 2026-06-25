import * as THREE from "three";
import {
  loadWallpaperOrFallback,
  loadSurfaceOrFallback,
  loadCarpetFloor,
} from "./textures.js";
import { createGameMaterials } from "./gameMaterials.js";
import { loadFurnitureModels } from "./furnitureModels.js";
import { loadSpecialAssets } from "./specialAssets.js";
import { LibraryEntity } from "./libraryEntity.js";
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
import { isMobileDevice, isLandscapeOrientation, getLayoutSize, getViewportShellRect, applyFixedShell, syncViewportCssVars, scheduleViewportRelayout } from "./device.js";
import { MobileControls } from "./mobileControls.js";

const mobileMode = isMobileDevice();
document.documentElement.classList.toggle("mobile", mobileMode);

if (mobileMode) {
  const hintControls = document.querySelector("#overlay .hint-controls");
  if (hintControls) {
    hintControls.innerHTML =
      "Move: left stick (tilt to run)<br />Look: drag right<br />Jump: button";
  }
}

const overlay = document.getElementById("overlay");
const hud = document.getElementById("hud");
const vignette = document.getElementById("vignette");
const crosshair = document.getElementById("crosshair");
const buildLabel = document.getElementById("build-label");
const buildBadge = document.getElementById("build-badge");
const buildVersion = document.getElementById("build-version");
const resumePrompt = document.getElementById("resume-prompt");
const mobileControlsRoot = document.getElementById("mobile-controls");
const portraitPrompt = document.getElementById("portrait-prompt");
const mobileControls = mobileMode && mobileControlsRoot ? new MobileControls(mobileControlsRoot) : null;
if (mobileControls) mobileControls.mount();

const buildText = formatBuildLabel();
if (buildLabel) buildLabel.textContent = buildText;
if (buildVersion) buildVersion.textContent = buildText;

const initialLayout = getLayoutSize();

const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1));
renderer.setSize(initialLayout.width, initialLayout.height, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = TONE_MAPPING_EXPOSURE;
document.body.appendChild(renderer.domElement);

function layoutFixedShells() {
  const rect = syncViewportCssVars();
  if (overlay) overlay.scrollTop = 0;
  applyFixedShell(portraitPrompt, rect);
  applyFixedShell(mobileControlsRoot, rect);
  applyFixedShell(resumePrompt, rect);
}

layoutFixedShells();
window.addEventListener("resize", () => scheduleViewportRelayout(layoutFixedShells));
window.addEventListener("orientationchange", () => scheduleViewportRelayout(layoutFixedShells));
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", () => scheduleViewportRelayout(layoutFixedShells));
  window.visualViewport.addEventListener("scroll", () => scheduleViewportRelayout(layoutFixedShells));
}

function applyCanvasFullscreen(canvas) {
  canvas.style.position = "fixed";
  canvas.style.inset = "0";
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";
  canvas.style.zIndex = "1";
  canvas.style.touchAction = "none";
}

applyCanvasFullscreen(renderer.domElement);
renderer.domElement.style.visibility = "hidden";

function layoutViewport(camera, pipeline) {
  const { width: w, height: h } = getLayoutSize();
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  resizeBloomPipeline(renderer, pipeline, w, h);
  applyCanvasFullscreen(renderer.domElement);
  layoutFixedShells();
}

function syncCrosshair() {
  if (!crosshair) return;
  const rect = renderer.domElement.getBoundingClientRect();
  crosshair.style.left = `${rect.left + rect.width / 2}px`;
  crosshair.style.top = `${rect.top + rect.height / 2}px`;
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(FOG_COLOR);
scene.fog = new THREE.Fog(FOG_COLOR, FOG_NEAR, FOG_FAR);

const camera = new THREE.PerspectiveCamera(
  CAMERA_FOV,
  initialLayout.width / initialLayout.height,
  CAMERA_NEAR,
  CAMERA_FAR,
);
camera.position.set(CHUNK / 2, EYE_H, CHUNK / 2);

scene.add(new THREE.AmbientLight(AMBIENT_COLOR, AMBIENT_INTENSITY));
scene.add(new THREE.HemisphereLight(HEMI_SKY_COLOR, HEMI_GROUND_COLOR, HEMI_INTENSITY));

const audio = new GameAudio();

async function init() {
  const hintStatus = document.getElementById("hint-status");
  const waitHint = "Loading… please wait";
  const clickHint = mobileMode ? "Tap to start" : "Click to start";
  const rotateHint = "Please rotate your device";

  function syncTitleHint() {
    if (!hintStatus || !ready) return;
    hintStatus.classList.remove("loading", "ready", "rotate");
    if (mobileMode && !isLandscapeOrientation()) {
      hintStatus.textContent = rotateHint;
      hintStatus.classList.add("rotate");
      return;
    }
    hintStatus.textContent = clickHint;
    hintStatus.classList.add("ready");
  }

  if (hintStatus) {
    hintStatus.textContent = waitHint;
    hintStatus.classList.add("loading");
  }
  overlay.style.cursor = "wait";

  const loader = new THREE.TextureLoader();
  const wallpaper = await loadWallpaperOrFallback(loader);
  const surfaceTex = await loadSurfaceOrFallback(loader);
  const floorTex = await loadCarpetFloor(loader);
  const materials = createGameMaterials(wallpaper, surfaceTex, floorTex);
  const furnitureModels = await loadFurnitureModels();
  const specialAssets = await loadSpecialAssets();
  if (ENABLE_BACKGROUND_MUSIC) await audio.preload();

  const world = new World(scene, materials, furnitureModels, specialAssets);
  const libraryEntity = new LibraryEntity(specialAssets?.entities?.library, scene);
  const player = new Player(camera, renderer.domElement);
  let syncMobileOrientation = () => true;

  if (mobileMode && mobileControls) {
    player.setMobileMode(true, mobileControls);
    if (resumePrompt) resumePrompt.hidden = true;

    syncMobileOrientation = (gameStarted) => {
      const landscape = isLandscapeOrientation();
      document.documentElement.classList.toggle("portrait-blocked", !landscape);

      if (!landscape) {
        mobileControls.hide();
        player.mobileActive = false;
        if (gameStarted && portraitPrompt) {
          portraitPrompt.hidden = false;
          portraitPrompt.classList.add("visible");
        }
        return false;
      }

      if (portraitPrompt) {
        portraitPrompt.classList.remove("visible");
        portraitPrompt.hidden = true;
      }

      if (gameStarted) {
        mobileControls.show();
        player.startMobile();
      } else {
        syncTitleHint();
      }
      return true;
    };

    window.addEventListener("orientationchange", () => {
      scheduleViewportRelayout(() => {
        layoutViewport(camera, pipeline);
        syncCrosshair();
        syncMobileOrientation(started);
        if (!started) syncTitleHint();
      });
    });
  }
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
    if (!ready || !started || mobileMode) return;
    if (!player.isLocked()) player.requestLock();
  }

  player.onLockLost = () => {
    if (started && !mobileMode) showResumePrompt();
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
  layoutViewport(camera, pipeline);

  let started = false;
  let ready = false;

  world
    .preloadAround(camera, (done, total) => {
      if (hintStatus && !ready) {
        hintStatus.classList.add("loading");
        hintStatus.innerHTML = `Building nearby rooms… ${done}/${total}<br /><span class="hint-wait">Please wait</span>`;
      }
    })
    .then(() => {
      player.setColliders(world.getColliders());
      ready = true;
      renderer.domElement.style.visibility = "visible";
      syncCrosshair();
      overlay.style.cursor = "pointer";
      syncTitleHint();
    })
    .catch((err) => {
      console.error(err);
      ready = true;
      renderer.domElement.style.visibility = "visible";
      overlay.style.cursor = "pointer";
      if (hintStatus) {
        hintStatus.classList.remove("loading");
        hintStatus.textContent = "Load error — please refresh.";
      }
    });

  overlay.addEventListener("click", () => {
    if (audio.ctx?.state === "suspended") void audio.ctx.resume();
    if (!ready) return;
    if (mobileMode && !syncMobileOrientation(started)) return;
    if (!mobileMode) player.requestLock();
    if (!started) {
      started = true;
      if (mobileMode && mobileControls) {
        player.startMobile();
        mobileControls.show();
      }
      overlay.classList.add("hidden");
      hud.classList.add("visible");
      vignette.classList.add("visible");
      if (!mobileMode) crosshair?.classList.add("visible");
      syncCrosshair();
      buildBadge?.classList.add("visible");
      if (ENABLE_BACKGROUND_MUSIC) audio.start();
      libraryEntity.begin(player);
    }
  });
  overlay.addEventListener(
    "touchstart",
    () => {
      if (audio.ctx?.state === "suspended") void audio.ctx.resume();
    },
    { passive: true },
  );

  const clock = new THREE.Clock();
  let lightT = 0;

  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    lightT += dt;

    world.tick(dt);
    if (started) tickChairGlitchVisuals(scene, lightT);

    if (!world.preloading) {
      world.update(player.position);
      if (started && world.hasPendingLoads()) {
        world.processLoadQueue(player.position);
      }
      if (world.consumeColliderRebuild()) {
        player.setColliders(world.getColliders());
        player.resolvePenetration();
      }
    }

    if (started) {
      if (!mobileMode || syncMobileOrientation(true)) {
        player.update(dt);
        libraryEntity.update(dt, player, world.getColliders());
      }
    }

    if (ready) {
      pipeline.render(lightT);
    } else {
      renderer.render(scene, camera);
    }
  }

  animate();

  const onViewportResize = () => {
    layoutViewport(camera, pipeline);
    syncCrosshair();
    if (mobileMode) {
      syncMobileOrientation(started);
      if (!started) syncTitleHint();
    }
  };

  window.addEventListener("resize", () => scheduleViewportRelayout(onViewportResize));
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", () => scheduleViewportRelayout(onViewportResize));
    window.visualViewport.addEventListener("scroll", () => scheduleViewportRelayout(onViewportResize));
  }
  if (mobileMode) {
    onViewportResize();
  }
}

init().catch((err) => {
  console.error(err);
  const hintStatus = document.getElementById("hint-status");
  if (hintStatus) {
    hintStatus.classList.remove("loading");
    hintStatus.textContent = "Load error — please refresh.";
  }
});
