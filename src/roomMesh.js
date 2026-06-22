import * as THREE from "three";
import { CHUNK } from "./room.js";
import {
  PANEL_W,
  PANEL_H,
  CEILING_TILE_FACE_M,
} from "./constants.js";
import { chunkTileRange, tileCenterLocal } from "./ceilingGrid.js";
import { getCeilingLayers } from "./ceilingLayers.js";
import { CEILING_TILE_M, bakeSurfaceUV, FLOOR_TILE_M } from "./textures.js";
import { buildMergedWallGeometry } from "./wallBuilder.js";

const _chunkPlane = new THREE.PlaneGeometry(CHUNK, CHUNK);
_chunkPlane.translate(CHUNK / 2, CHUNK / 2, 0);
_chunkPlane.userData.shared = true;

const _tileFaceGeo = new THREE.PlaneGeometry(CEILING_TILE_FACE_M, CEILING_TILE_FACE_M);
_tileFaceGeo.rotateX(Math.PI / 2);
_tileFaceGeo.userData.shared = true;

const _cellBackingGeo = new THREE.PlaneGeometry(PANEL_W, PANEL_H);
_cellBackingGeo.rotateX(Math.PI / 2);
_cellBackingGeo.userData.shared = true;

const _ceilRot = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));
const _pos = new THREE.Vector3();
const _scale = new THREE.Vector3(1, 1, 1);
const _mat4 = new THREE.Matrix4();

function addMergedWalls(group, room, materials, h, roomWx, roomWz) {
  const { geometry } = buildMergedWallGeometry(room, materials.wallTex, h, roomWx, roomWz);
  if (geometry) {
    group.add(new THREE.Mesh(geometry, materials.wall));
  }
}

function addFloor(group, materials, worldX, worldZ) {
  const floorGeo = _chunkPlane.clone();
  bakeSurfaceUV(floorGeo, FLOOR_TILE_M, worldX, worldZ);
  const floor = new THREE.Mesh(floorGeo, materials.floor);
  floor.rotation.x = -Math.PI / 2;
  group.add(floor);
}

function initCeilingBuild(state) {
  const { room, group, materials } = state;
  const { gapY, tileY } = getCeilingLayers(room.height);
  state.ceilingGapY = gapY;
  state.ceilingTileY = tileY;

  const tileM = CEILING_TILE_M;
  const { tx0, tx1, tz0, tz1 } = chunkTileRange(state.worldX, state.worldZ, CHUNK, tileM);
  const tiles = [];
  for (let tx = tx0; tx <= tx1; tx++) {
    for (let tz = tz0; tz <= tz1; tz++) {
      const { x: px, z: pz } = tileCenterLocal(tx, tz, state.worldX, state.worldZ, tileM);
      tiles.push(px, pz);
    }
  }

  const count = tiles.length / 2;
  state.ceilingTiles = tiles;
  state.ceilingTileCount = count;
  state.ceilingIndex = 0;

  state.backingMesh = new THREE.InstancedMesh(_cellBackingGeo, materials.ceilingGroove, count);
  state.tileMesh = new THREE.InstancedMesh(_tileFaceGeo, materials.ceilingTile, count);
  state.tileMesh.renderOrder = 2;
  group.add(state.backingMesh);
  group.add(state.tileMesh);
}

function fillCeilingInstances(state, from, to) {
  const tiles = state.ceilingTiles;
  const gapY = state.ceilingGapY;
  const tileY = state.ceilingTileY;

  for (let i = from; i < to; i++) {
    const px = tiles[i * 2];
    const pz = tiles[i * 2 + 1];
    _pos.set(px, gapY, pz);
    _mat4.compose(_pos, _ceilRot, _scale);
    state.backingMesh.setMatrixAt(i, _mat4);
    _pos.set(px, tileY, pz);
    _mat4.compose(_pos, _ceilRot, _scale);
    state.tileMesh.setMatrixAt(i, _mat4);
  }
  state.backingMesh.instanceMatrix.needsUpdate = true;
  state.tileMesh.instanceMatrix.needsUpdate = true;
}

export function createRoomBuildState(room, materials) {
  const group = new THREE.Group();
  group.position.set(room.cx * CHUNK, 0, room.cz * CHUNK);
  return {
    room,
    group,
    materials,
    floorWallsDone: false,
    shellDone: false,
    worldX: room.cx * CHUNK,
    worldZ: room.cz * CHUNK,
  };
}

/** Floor + walls only — ceiling is spread across buildPanelBatch */
export function buildRoomShell(state) {
  if (state.floorWallsDone) return;
  const { room, group, materials } = state;
  const h = room.height;

  addFloor(group, materials, state.worldX, state.worldZ);
  addMergedWalls(group, room, materials, h, state.worldX, state.worldZ);
  state.floorWallsDone = true;
}

/** Instanced ceiling tiles — maxTiles per call to spread work across frames */
export function buildPanelBatch(state, maxTiles) {
  if (state.shellDone) return true;

  if (!state.floorWallsDone) {
    buildRoomShell(state);
    return false;
  }

  if (!state.ceilingTiles) {
    initCeilingBuild(state);
  }

  const from = state.ceilingIndex;
  const to = Math.min(from + maxTiles, state.ceilingTileCount);
  fillCeilingInstances(state, from, to);
  state.ceilingIndex = to;

  if (to >= state.ceilingTileCount) {
    state.shellDone = true;
    return true;
  }
  return false;
}

export function finalizeRoomBuild(state) {
  const { group, room } = state;
  group.userData.room = room;
  return group;
}

export function buildRoomMesh(room, materials) {
  const state = createRoomBuildState(room, materials);
  while (!buildPanelBatch(state, Infinity)) {}
  return finalizeRoomBuild(state);
}
