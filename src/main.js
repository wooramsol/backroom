import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import {
  createProceduralMaterials,
  loadAssetMaterials,
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
  AMBIENT_COLOR,
  AMBIENT_INTENSITY,
  HEMI_SKY_COLOR,
  HEMI_GROUND_COLOR,
  HEMI_INTENSITY,
  LIGHT_PANEL_COLOR,
  LIGHT_PANEL_OFF_COLOR,
  LIGHT_PANEL_INTENSITY,
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
RectAreaLightUniformsLib.init();
renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.NoToneMapping;
renderer.domElement.style.cssText = "position:fixed;inset:0;z-index:1;visibility:hidden";
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(FOG_COLOR);
scene.fog = new THREE.Fog(FOG_COLOR, FOG_NEAR, FOG_FAR);

scene.add(new THREE.AmbientLight(AMBIENT_COLOR, AMBIENT_INTENSITY));
scene.add(new THREE.HemisphereLight(HEMI_SKY_COLOR, HEMI_GROUND_COLOR, HEMI_INTENSITY));

const camera = new THREE.PerspectiveCamera(CAMERA_FOV, window.innerWidth / window.innerHeight, CAMERA_NEAR, 50);
camera.position.set(CHUNK / 2, EYE_H, CHUNK / 2);

window.addEventListener("unhandledrejection", (event) => {
  const target = event.reason?.target;
  if (target?.tagName === "IMG") {
    console.warn("[textures] suppressed image load rejection");
    event.preventDefault();
  }
});

async function init() {
  const hint = document.querySelector("#overlay .hint");
  const defaultHint =
    "Click to start<br />WASD · Move &nbsp; Shift · Run &nbsp; Space · Jump &nbsp; Mouse · Look";

  let started = false;
  const panelOnColor = new THREE.Color(LIGHT_PANEL_COLOR).multiplyScalar(LIGHT_PANEL_INTENSITY);
  let materials = createProceduralMaterials();
  materials.lightPanelOn = new THREE.MeshBasicMaterial({
    color: panelOnColor,
    depthWrite: false,
  });
  materials.lightPanelOff = new THREE.MeshBasicMaterial({
    color: LIGHT_PANEL_OFF_COLOR,
    depthWrite: false,
  });
  const world = new World(scene, materials);
  const player = new Player(camera, renderer.domElement);
  world.init(player.position);
  player.connect();

  function markReady(message) {
    renderer.domElement.style.visibility = "visible";
    overlay.style.cursor = "pointer";
    if (hint) hint.innerHTML = message || defaultHint;
    syncCrosshair();
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
    if (!started) return;
    if (!player.isLocked()) player.requestLock();
  }

  player.onLockLost = () => {
    if (started) showResumePrompt();
  };
  player.onLockAcquired = hideResumePrompt;

  renderer.domElement.addEventListener("click", tryResumeLock);
  resumePrompt?.addEventListener("click", tryResumeLock);

  overlay.addEventListener("click", () => {
    player.requestLock();
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

  if (hint) hint.textContent = "Building nearby rooms… (one-time)";
  overlay.style.cursor = "wait";
  markReady(defaultHint);

  const loader = new THREE.TextureLoader();
  loadAssetMaterials(loader)
    .then((assetMaterials) => {
      assetMaterials.lightPanelOn = materials.lightPanelOn;
      assetMaterials.lightPanelOff = materials.lightPanelOff;
      materials = assetMaterials;
      world.materials = materials;
    })
    .catch((err) => console.warn("[textures] asset upgrade skipped", err));

  try {
    await world.preloadAround(camera, (done, total) => {
      if (hint && !started) {
        hint.innerHTML = `Building nearby rooms… ${done}/${total}<br/>Preparing the area within view distance`;
      }
    });
    renderer.render(scene, camera);
    player.setColliders(world.getColliders());
    markReady(defaultHint);
  } catch (err) {
    console.error(err);
    markReady(
      `${defaultHint}<br/><span style="opacity:0.55;font-size:0.9em">Room build warning — click to play anyway</span>`,
    );
  }

  function syncCrosshairIfPlaying() {
    if (started) syncCrosshair();
  }

  const clock = new THREE.Clock();
  const TARGET_FRAME_MS = 16.7;

  function animate() {
    requestAnimationFrame(animate);
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

    world.updateLights(camera);
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
  const hint = document.querySelector("#overlay .hint");
  if (hint) {
    hint.innerHTML =
      'Click to start<br /><span style="opacity:0.55">Startup error — refresh the page</span>';
  }
  overlay.style.cursor = "pointer";
  renderer.domElement.style.visibility = "visible";
});
