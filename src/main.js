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
  wallpaperTex.repeat.set(2, 2);

  const carpetTex = createCarpetTexture();
  carpetTex.repeat.set(3, 3);

  const basementFloorTex = createBasementFloorTexture();
  basementFloorTex.repeat.set(3, 3);

  const ceilingTex = createCeilingTexture();
  ceilingTex.repeat.set(2, 2);

  const materials = {
    wall: new THREE.MeshLambertMaterial({ map: wallpaperTex, side: THREE.DoubleSide }),
    basementWall: new THREE.MeshLambertMaterial({
      map: wallpaperTex,
      color: 0x9a9078,
      side: THREE.DoubleSide,
    }),
    floor: new THREE.MeshLambertMaterial({ map: carpetTex, side: THREE.DoubleSide }),
    basementFloor: new THREE.MeshLambertMaterial({ map: basementFloorTex, side: THREE.DoubleSide }),
    ceiling: new THREE.MeshLambertMaterial({ map: ceilingTex, side: THREE.DoubleSide }),
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
      hud.textContent = world.getFloorLabel();
    }
  });

  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);

    if (started) {
      world.update(player.position, player.floor);
      player.setColliders(world.getCollidersForFloor(player.floor));
      player.update(dt);
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
