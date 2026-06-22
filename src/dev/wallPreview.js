/**
 * Dev-only wall preview for Step 1 QA screenshots (not shipped in game).
 */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ROOM_H, CHUNK } from "../constants.js";
import { generateRoom } from "../room.js";
import { buildRoomWallGeometry } from "../mapgen/walls/WallMeshBuilder.js";
import { collectRoomWallSegments } from "../mapgen/walls/wallSegments.js";
import { segmentsToFootprint, footprintExtrudeOutlines } from "../mapgen/walls/WallFootprint.js";
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
const outlines = footprintExtrudeOutlines(segs);
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
  // L-corner at inner walls (x=7, z=2)
  camera.position.set(wx + 8.6, 1.55, wz + 3.4);
  controls.target.set(wx + 7.0, 1.25, wz + 2.0);
} else if (view === "endcap") {
  // Open end of z-wall at x=2 (span 2→7)
  camera.position.set(wx + 1.15, 1.45, wz + 2.0);
  controls.target.set(wx + 2.05, 1.3, wz + 2.0);
} else if (view === "jamb") {
  // Opening in x-wall at x=7 (gap z=2…11)
  camera.position.set(wx + 6.35, 1.55, wz + 5.8);
  controls.target.set(wx + 7.15, 1.3, wz + 6.5);
} else {
  camera.position.set(wx + 9.5, 3.2, wz + 10.5);
  controls.target.set(wx + 6.5, 1.2, wz + 6.5);
}

window.__WALL_PREVIEW__ = {
  cx,
  cz,
  segments: segs.length,
  islands: outlines.length,
  cells: cells.length,
  tris: geo.index ? geo.index.count / 3 : geo.attributes.position.count / 3,
  verts: geo.attributes.position.count,
  issues,
  ready: true,
};

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
