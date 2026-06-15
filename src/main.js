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
import { CHUNK, FOG_COLOR, FOG_NEAR, FOG_FAR, AMBIENT_COLOR } from "./constants.js";

const overlay = document.getElementById("overlay");
const hud = document.getElementById("hud");
const vignette = document.getElementById("vignette");

const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.domElement.style.cssText = "position:fixed;inset:0;z-index:1";
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(FOG_COLOR);
scene.fog = new THREE.Fog(FOG_COLOR, FOG_NEAR, FOG_FAR);

const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.08, 50);
camera.position.set(0, 1.62, 0);

scene.add(new THREE.AmbientLight(AMBIENT_COLOR, 0.55));
scene.add(new THREE.HemisphereLight(0xfff0c8, 0x4a3a28, 0.35));

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
      side: THREE.DoubleSide,
    }),
    ceiling: new THREE.MeshLambertMaterial({
      map: tiled(ceilingTex, CEILING_TILE_M, CHUNK, CHUNK),
      side: THREE.DoubleSide,
    }),
    lightPanel: new THREE.MeshStandardMaterial({
      color: 0xfff8d8,
      emissive: 0xfff0b0,
      emissiveIntensity: 0.95,
      roughness: 0.9,
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
      vignette.classList.add("visible");
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
          if (obj.isMesh && obj.material?.emissive) {
            const room = mesh.userData.room;
            if (!room) return;
            const f = 0.88 + Math.sin(lightT * 8 + room.flicker) * 0.07;
            obj.material.emissiveIntensity = f;
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
