import * as THREE from "three";
import {
  createCarpetTexture,
  createBasementFloorTexture,
  createCeilingTexture,
  loadWallpaperTexture,
} from "./textures.js";
import { InfiniteWorld } from "./world.js";
import { Player } from "./player.js";

const overlay = document.getElementById("overlay");
const hud = document.getElementById("hud");
const vignette = document.getElementById("vignette");

const renderer = new THREE.WebGLRenderer({
  antialias: false,
  powerPreference: "high-performance",
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xc4b47a);
scene.fog = new THREE.Fog(0xc4b47a, 8, 32);

const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 45);
camera.position.set(0, 1.62, 0);

scene.add(new THREE.AmbientLight(0xb0a880, 0.85));
scene.add(new THREE.HemisphereLight(0xfff4d0, 0x5a4a30, 0.35));

async function loadWallpaperOrFallback(loader) {
  try {
    return await loadWallpaperTexture(loader);
  } catch {
    return createCarpetTexture();
  }
}

async function init() {
  const loader = new THREE.TextureLoader();
  const wallpaperTex = await loadWallpaperOrFallback(loader);
  const carpetTex = createCarpetTexture();
  const basementFloorTex = createBasementFloorTexture();
  const ceilingTex = createCeilingTexture();

  const materials = {
    wallTex: wallpaperTex,
    carpetTex,
    basementFloorTex,
    ceilingTex,
    stair: new THREE.MeshLambertMaterial({ color: 0x7a6a50 }),
    stairSign: new THREE.MeshBasicMaterial({ color: 0xfff0c0 }),
    lightPanel: new THREE.MeshBasicMaterial({ color: 0xfff6d0 }),
  };

  const world = new InfiniteWorld(scene, materials);
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
    }
  });

  const clock = new THREE.Clock();
  let lastFloor = 0;

  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);

    if (started) {
      world.update(player.position, player.floor);
      player.setWalls(world.getWallsForFloor(player.floor));
      player.setStairs(world.getStairs());
      player.update(dt);

      const hint = world.getStairHint(world.getStairs(), player.position, player.floor);
      hud.textContent = hint || world.getFloorLabel(player.floor);

      if (player.floor !== lastFloor) {
        lastFloor = player.floor;
        const t = Math.max(0, Math.min(1, (player.floor + 1) / 6));
        const r = Math.floor(106 + (196 - 106) * t);
        const g = Math.floor(100 + (180 - 100) * t);
        const b = Math.floor(80 + (122 - 80) * t);
        const col = (r << 16) | (g << 8) | b;
        scene.fog.color.setHex(col);
        scene.background.setHex(col);
        scene.fog.near = player.floor < 0 ? 6 : 8;
        scene.fog.far = player.floor < 0 ? 22 : 30 + player.floor * 2;
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
  if (hint) hint.textContent = "로딩 오류가 발생했습니다. 페이지를 새로고침해 주세요.";
});
