import * as THREE from "three";
import {
  createCarpetTexture,
  createCeilingTexture,
  loadWallpaperOrFallback,
  tiled,
  CARPET_TILE_M,
  CEILING_TILE_M,
} from "./textures.js";
import { World } from "./world.js";
import { Player } from "./player.js";
import { FluorescentHum } from "./audio.js";
import { CHUNK, EYE_H, FOG_COLOR, FOG_DENSITY, AMBIENT_COLOR, AMBIENT_INTENSITY, HEMI_SKY, HEMI_GROUND, HEMI_INTENSITY, LIGHT_PANEL_COLOR, LIGHT_PANEL_INTENSITY, TONE_MAPPING_EXPOSURE, CAMERA_FOV, CARPET_COLOR, CEILING_COLOR, BASEBOARD_COLOR, CROWN_COLOR, WAINSCOT_COLOR, FLOOR_SHADOW_COLOR, BUILD_TAG } from "./constants.js";

const overlay = document.getElementById("overlay");
const hud = document.getElementById("hud");
const vignette = document.getElementById("vignette");
const grade = document.getElementById("grade");

const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = TONE_MAPPING_EXPOSURE;
renderer.domElement.style.cssText = "position:fixed;inset:0;z-index:1";
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(FOG_COLOR);
scene.fog = new THREE.FogExp2(FOG_COLOR, FOG_DENSITY);

const camera = new THREE.PerspectiveCamera(CAMERA_FOV, window.innerWidth / window.innerHeight, 0.08, 50);
camera.position.set(CHUNK / 2, EYE_H, CHUNK / 2);

scene.add(new THREE.AmbientLight(AMBIENT_COLOR, AMBIENT_INTENSITY));
scene.add(new THREE.HemisphereLight(HEMI_SKY, HEMI_GROUND, HEMI_INTENSITY));

const hum = new FluorescentHum();

async function init() {
  const loader = new THREE.TextureLoader();
  const wallpaper = await loadWallpaperOrFallback(loader);
  const carpetTex = createCarpetTexture();
  const ceilingTex = createCeilingTexture();

  const materials = {
    wallTex: wallpaper,
    carpet: new THREE.MeshLambertMaterial({
      map: tiled(carpetTex, CARPET_TILE_M, CHUNK, CHUNK),
      color: CARPET_COLOR,
    }),
    ceiling: new THREE.MeshLambertMaterial({
      map: tiled(ceilingTex, CEILING_TILE_M, CHUNK, CHUNK),
      color: CEILING_COLOR,
    }),
    baseboard: new THREE.MeshLambertMaterial({ color: BASEBOARD_COLOR }),
    wainscot: new THREE.MeshLambertMaterial({ color: WAINSCOT_COLOR }),
    crown: new THREE.MeshLambertMaterial({ color: CROWN_COLOR }),
    floorShadow: new THREE.MeshLambertMaterial({ color: FLOOR_SHADOW_COLOR }),
    lightPanel: new THREE.MeshBasicMaterial({
      color: LIGHT_PANEL_COLOR,
    }),
  };

  const world = new World(scene, materials);
  world.init();

  const player = new Player(camera, renderer.domElement);
  player.connect();

  let started = false;

  overlay.addEventListener("click", () => {
    player.requestLock();
    if (!started) {
      started = true;
      overlay.classList.add("hidden");
      hud.classList.add("visible");
      hud.textContent = `LEVEL 0 · ${BUILD_TAG}`;
      vignette.classList.add("visible");
      grade.classList.add("visible");
      hum.start();
    }
  });

  const clock = new THREE.Clock();
  let lightT = 0;

  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    lightT += dt;

    if (started) {
      world.tick(dt);
      world.update(player.position);
      player.setColliders(world.getColliders());
      player.update(dt);
      hum.tick(lightT);

      for (const { mesh } of world.chunks.values()) {
        mesh.traverse((obj) => {
          if (!obj.userData?.fluorescent) return;
          const room = mesh.userData.room;
          if (!room) return;
          const wave = 0.92 + Math.sin(lightT * 8 + room.flicker) * 0.06;
          if (obj.isLight) {
            obj.intensity = obj.userData.baseIntensity * wave;
          } else if (obj.material?.color) {
            obj.material.color.set(LIGHT_PANEL_COLOR).multiplyScalar(LIGHT_PANEL_INTENSITY * wave);
          }
        });
      }
    }

    renderer.render(scene, camera);
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
