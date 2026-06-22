/**
 * Dev-only wall preview for Step 1 QA screenshots (not shipped in game).
 */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ROOM_H, CHUNK } from "../constants.js";
import { generateRoom } from "../room.js";
import { buildRoomWallGeometry } from "../mapgen/walls/WallMeshBuilder.js";
import { collectRoomWallSegments } from "../mapgen/walls/wallSegments.js";
import { segmentsToFootprint } from "../mapgen/walls/WallFootprint.js";
import { validateWallMesh } from "../mapgen/walls/WallQuality.js";
import {
  WALLPAPER_URL,
  applyWallpaperTileSize,
  createBakedWallMaterial,
  FLOOR_TILE_M,
  bakeSurfaceUV,
} from "../textures.js";

const params = new URLSearchParams(location.search);
const cx = Number(params.get("cx") ?? 0);
const cz = Number(params.get("cz") ?? 0);
const view = params.get("view") ?? "corner";

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(1280, 720);
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.appendChild(renderer.domElement);
renderer.domElement.id = "wall-preview-ready";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x3a3428);
scene.fog = new THREE.Fog(0x3a3428, 18, 42);

const camera = new THREE.PerspectiveCamera(58, 1280 / 720, 0.05, 80);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(CHUNK * 0.45, ROOM_H * 0.42, CHUNK * 0.52);

const hemi = new THREE.HemisphereLight(0xfff0d0, 0x4a4030, 0.55);
scene.add(hemi);
const key = new THREE.DirectionalLight(0xfff4dc, 0.85);
key.position.set(6, 10, 4);
scene.add(key);

const loader = new THREE.TextureLoader();
const wallpaper = await loader.loadAsync(WALLPAPER_URL);
applyWallpaperTileSize(wallpaper);
const wallMat = createBakedWallMaterial(wallpaper);

const room = generateRoom(cx, cz);
const wx = cx * CHUNK;
const wz = cz * CHUNK;
const geo = buildRoomWallGeometry(room, wallpaper, ROOM_H, wx, wz);

if (!geo) {
  document.body.innerHTML = "<p style='color:#fff'>No wall geometry</p>";
  throw new Error("no geometry");
}

const segs = collectRoomWallSegments(room);
const cells = segmentsToFootprint(segs);
const issues = validateWallMesh(room, segs, cells).filter(
  (i) => i.kind === "protrusion" || i.kind === "short_segment",
);

const walls = new THREE.Mesh(geo, wallMat);
walls.position.set(wx, 0, wz);
scene.add(walls);

const floorGeo = new THREE.PlaneGeometry(CHUNK, CHUNK);
bakeSurfaceUV(floorGeo, FLOOR_TILE_M, wx, wz);
const floor = new THREE.Mesh(
  floorGeo,
  new THREE.MeshBasicMaterial({ color: 0x9a7d52 }),
);
floor.rotation.x = -Math.PI / 2;
floor.position.set(wx + CHUNK / 2, 0.01, wz + CHUNK / 2);
scene.add(floor);

geo.computeBoundingBox();
const center = geo.boundingBox.getCenter(new THREE.Vector3()).add(new THREE.Vector3(wx, 0, wz));

if (view === "corner") {
  camera.position.set(wx + 3.2, 1.55, wz + 8.8);
} else if (view === "jamb") {
  camera.position.set(wx + 7.0, 1.62, wz + 0.6);
} else {
  camera.position.set(center.x + 5, 4.5, center.z + 7);
}

window.__WALL_PREVIEW__ = {
  cx,
  cz,
  segments: segs.length,
  cells: cells.length,
  tris: geo.index ? geo.index.count / 3 : 0,
  issues,
  ready: true,
};

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
