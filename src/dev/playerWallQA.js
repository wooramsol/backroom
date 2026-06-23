/**
 * Player-perspective wall QA — game-equivalent room shell + eye-level camera.
 * ?cx=&cz=&camX=&camY=&camZ=&lookX=&lookY=&lookZ=
 */
import * as THREE from "three";
import { CAMERA_FOV, CAMERA_NEAR, CAMERA_FAR, CHUNK, EYE_H } from "../constants.js";
import { generateRoom } from "../room.js";
import { buildRoomMesh } from "../roomMesh.js";
import { inspectRoomPlayerWalls } from "../mapgen/walls/WallPlayerQA.js";
import { createGameMaterials } from "../gameMaterials.js";
import {
  configureGameLikeRenderer,
  configureGameLikeScene,
  loadGameTextures,
} from "./gameLikeScene.js";

const params = new URLSearchParams(location.search);
const cx = Number(params.get("cx") ?? 0);
const cz = Number(params.get("cz") ?? 0);

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(1280, 720);
configureGameLikeRenderer(renderer);
document.body.appendChild(renderer.domElement);
renderer.domElement.id = "player-wall-qa-ready";

const scene = new THREE.Scene();
configureGameLikeScene(scene);

const camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1280 / 720, CAMERA_NEAR, CAMERA_FAR);

const { wallpaper, surfaceTex, floorTex } = await loadGameTextures();
const materials = createGameMaterials(wallpaper, surfaceTex, floorTex);

const room = generateRoom(cx, cz);
const roomGroup = buildRoomMesh(room, materials);
scene.add(roomGroup);

const wx = cx * CHUNK;
const wz = cz * CHUNK;

const camX = Number(params.get("camX") ?? 7.5);
const camY = Number(params.get("camY") ?? EYE_H);
const camZ = Number(params.get("camZ") ?? 2.5);
const lookX = Number(params.get("lookX") ?? 7.0);
const lookY = Number(params.get("lookY") ?? 1.32);
const lookZ = Number(params.get("lookZ") ?? 2.0);

camera.position.set(wx + camX, camY, wz + camZ);
camera.lookAt(wx + lookX, lookY, wz + lookZ);

const inspection = inspectRoomPlayerWalls(room, cx, cz);

window.__PLAYER_WALL_QA__ = {
  cx,
  cz,
  camera: { camX, camY, camZ, lookX, lookY, lookZ },
  inspection,
  ready: true,
};

renderer.render(scene, camera);
