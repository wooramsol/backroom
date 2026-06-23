/**
 * Multi-chunk player tour — zone boundary transitions in world space.
 * ?chunks=0,0;1,0&camX=&camY=&camZ=&lookX=&lookY=&lookZ=  (world metres)
 */
import * as THREE from "three";
import { CAMERA_FOV, CAMERA_NEAR, CAMERA_FAR, CHUNK, EYE_H } from "../constants.js";
import { generateRoom } from "../room.js";
import { buildRoomMesh } from "../roomMesh.js";
import { createGameMaterials } from "../gameMaterials.js";
import {
  configureGameLikeRenderer,
  configureGameLikeScene,
  loadGameTextures,
} from "./gameLikeScene.js";
import { zoneMetaAt } from "../zones/ZoneTransitionPath.js";

const params = new URLSearchParams(location.search);

function parseChunks(raw) {
  if (!raw) return [{ cx: 0, cz: 0 }];
  return raw.split(";").map((pair) => {
    const [cx, cz] = pair.split(",").map(Number);
    return { cx, cz };
  });
}

const chunks = parseChunks(params.get("chunks"));

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(1280, 720);
configureGameLikeRenderer(renderer);
document.body.appendChild(renderer.domElement);
renderer.domElement.id = "player-zone-tour-ready";

const scene = new THREE.Scene();
configureGameLikeScene(scene);

const camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1280 / 720, CAMERA_NEAR, CAMERA_FAR);

const { wallpaper, surfaceTex, floorTex } = await loadGameTextures();
const materials = createGameMaterials(wallpaper, surfaceTex, floorTex);

const zoneLabels = [];
for (const { cx, cz } of chunks) {
  const room = generateRoom(cx, cz);
  const group = buildRoomMesh(room, materials);
  group.position.set(cx * CHUNK, 0, cz * CHUNK);
  scene.add(group);
  zoneLabels.push({ cx, cz, ...zoneMetaAt(cx, cz) });
}

const camX = Number(params.get("camX") ?? CHUNK / 2);
const camY = Number(params.get("camY") ?? EYE_H);
const camZ = Number(params.get("camZ") ?? CHUNK / 2);
const lookX = Number(params.get("lookX") ?? camX + 3);
const lookY = Number(params.get("lookY") ?? 1.35);
const lookZ = Number(params.get("lookZ") ?? camZ);

camera.position.set(camX, camY, camZ);
camera.lookAt(lookX, lookY, lookZ);

window.__PLAYER_ZONE_TOUR__ = {
  chunks,
  zones: zoneLabels,
  camera: { camX, camY, camZ, lookX, lookY, lookZ },
  ready: true,
};

renderer.render(scene, camera);
