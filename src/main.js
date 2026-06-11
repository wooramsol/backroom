import * as THREE from "three";
import {
  createCarpetTexture,
  createCeilingTexture,
  loadWallpaperTexture,
} from "./textures.js";
import { InfiniteWorld } from "./world.js";
import { Player } from "./player.js";
import { ROOM_W, ROOM_D } from "./chunk.js";

const overlay = document.getElementById("overlay");
const hud = document.getElementById("hud");
const vignette = document.getElementById("vignette");

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.85;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xc4b47a);
scene.fog = new THREE.Fog(0xc4b47a, 6, 28);

const camera = new THREE.PerspectiveCamera(72, window.innerWidth / window.innerHeight, 0.05, 50);
camera.position.set(0, 1.65, 2);

scene.add(new THREE.AmbientLight(0x9a9a78, 0.45));
const hemi = new THREE.HemisphereLight(0xfff8d8, 0x6a5a3a, 0.25);
scene.add(hemi);

async function init() {
  const loader = new THREE.TextureLoader();
  const wallpaperTex = await loadWallpaperTexture(loader);

  const carpetTex = createCarpetTexture();
  carpetTex.repeat.set(ROOM_W * 2, ROOM_D * 2);

  const ceilingTex = createCeilingTexture();
  ceilingTex.repeat.set(ROOM_W / 2, ROOM_D / 2);

  wallpaperTex.repeat.set(ROOM_W / 1.2, ROOM_D / 1.2);

  const materials = {
    wall: new THREE.MeshStandardMaterial({
      map: wallpaperTex,
      roughness: 0.92,
      metalness: 0,
    }),
    floor: new THREE.MeshStandardMaterial({
      map: carpetTex,
      roughness: 1,
      metalness: 0,
    }),
    ceiling: new THREE.MeshStandardMaterial({
      map: ceilingTex,
      roughness: 0.85,
      metalness: 0,
    }),
  };

  const world = new InfiniteWorld(scene, materials);
  world.init();

  const player = new Player(camera, renderer.domElement);
  player.connect();

  let started = false;
  let time = 0;

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

  function animate() {
    requestAnimationFrame(animate);
    const dt = Math.min(clock.getDelta(), 0.05);
    time += dt;

    if (started) {
      world.update(player.position);
      player.setColliders(world.getColliders());
      player.update(dt);
      world.updateLights(time);
    }

    const breathe = 0.84 + Math.sin(time * 0.4) * 0.02;
    renderer.toneMappingExposure = breathe;

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

init();
