import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { CHUNK } from "./room.js";
import {
  PANEL_W,
  PANEL_H,
  CEILING_TILE_FACE_M,
} from "./constants.js";
import { chunkTileRange, tileCenterLocal } from "./ceilingGrid.js";
import { getCeilingLayers } from "./ceilingLayers.js";
import { CEILING_TILE_M, bakeSurfaceUV, FLOOR_TILE_M } from "./textures.js";
import { createChunkFloorMaterial } from "./gameMaterials.js";
import { buildMergedWallGeometry } from "./wallBuilder.js";

const _cellBackingGeo = new THREE.PlaneGeometry(PANEL_W, PANEL_H);
_cellBackingGeo.userData.shared = true;
const _chunkPlane = new THREE.PlaneGeometry(CHUNK, CHUNK);
_chunkPlane.translate(CHUNK / 2, CHUNK / 2, 0);
_chunkPlane.userData.shared = true;
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
  const floor = new THREE.Mesh(floorGeo, createChunkFloorMaterial(materials));
  floor.rotation.x = -Math.PI / 2;
  group.add(floor);
}

function addInstancedCeiling(group, geometry, material, transforms, renderOrder = 0) {
  if (!transforms.length) return;
  const mesh = new THREE.InstancedMesh(geometry, material, transforms.length);
  for (let i = 0; i < transforms.length; i++) {
    mesh.setMatrixAt(i, transforms[i]);
  }
  mesh.instanceMatrix.needsUpdate = true;
  if (renderOrder) mesh.renderOrder = renderOrder;
  group.add(mesh);
}

function prepareCeilingBuild(state, h) {
  const { gapY, tileY } = getCeilingLayers(h);
  const tileM = CEILING_TILE_M;
  const { tx0, tx1, tz0, tz1 } = chunkTileRange(state.worldX, state.worldZ, CHUNK, tileM);
  const backingTransforms = [];
  const tileQueue = [];

  for (let tx = tx0; tx <= tx1; tx++) {
    for (let tz = tz0; tz <= tz1; tz++) {
      const { x: px, z: pz } = tileCenterLocal(tx, tz, state.worldX, state.worldZ, tileM);
      _pos.set(px, gapY, pz);
      _mat4.compose(_pos, _ceilRot, _scale);
      backingTransforms.push(_mat4.clone());
      tileQueue.push({ px, pz });
    }
  }

  state.ceilingGapY = gapY;
  state.ceilingTileY = tileY;
  state.ceilingTileM = tileM;
  state.ceilingBackingTransforms = backingTransforms;
  state.ceilingTileQueue = tileQueue;
  state.ceilingTileIdx = 0;
  state.ceilingTileParts = [];
  state.ceilingBackingDone = false;
  state.ceilingComplete = tileQueue.length === 0;
}

function finalizeCeilingTiles(state) {
  const parts = state.ceilingTileParts;
  if (!parts?.length) {
    state.ceilingComplete = true;
    return;
  }
  const merged = mergeGeometries(parts, false);
  for (const g of parts) g.dispose();
  const ceiling = new THREE.Mesh(merged, state.materials.ceilingTile);
  ceiling.renderOrder = 2;
  state.group.add(ceiling);
  state.ceilingTileParts = [];
  state.ceilingComplete = true;
}

export function createRoomBuildState(room, materials) {
  const group = new THREE.Group();
  group.position.set(room.cx * CHUNK, 0, room.cz * CHUNK);
  return {
    room,
    group,
    materials,
    shellDone: false,
    worldX: room.cx * CHUNK,
    worldZ: room.cz * CHUNK,
  };
}

export function buildRoomShell(state) {
  if (state.shellDone) return;
  const { room, group, materials } = state;
  const h = room.height;

  addFloor(group, materials, state.worldX, state.worldZ);
  addMergedWalls(group, room, materials, h, state.worldX, state.worldZ);
  prepareCeilingBuild(state, h);
  state.shellDone = true;
}

/** Build ceiling groove backing + a batch of tile faces per call */
export function buildPanelBatch(state, maxPanels = 8) {
  if (!state.shellDone) {
    buildRoomShell(state);
    return false;
  }
  if (state.ceilingComplete) return true;

  if (!state.ceilingBackingDone) {
    addInstancedCeiling(
      state.group,
      _cellBackingGeo,
      state.materials.ceilingGroove,
      state.ceilingBackingTransforms,
    );
    state.ceilingBackingDone = true;
  }

  const queue = state.ceilingTileQueue;
  const end = Math.min(state.ceilingTileIdx + maxPanels, queue.length);
  for (let i = state.ceilingTileIdx; i < end; i++) {
    const { px, pz } = queue[i];
    const tileGeo = new THREE.PlaneGeometry(CEILING_TILE_FACE_M, CEILING_TILE_FACE_M);
    tileGeo.rotateX(Math.PI / 2);
    tileGeo.translate(px, state.ceilingTileY, pz);
    bakeSurfaceUV(tileGeo, state.ceilingTileM, state.worldX, state.worldZ);
    state.ceilingTileParts.push(tileGeo);
  }
  state.ceilingTileIdx = end;

  if (state.ceilingTileIdx < queue.length) return false;
  finalizeCeilingTiles(state);
  return true;
}

export function finalizeRoomBuild(state) {
  const { group, room } = state;
  group.userData.room = room;
  return group;
}

export function buildRoomMesh(room, materials) {
  const state = createRoomBuildState(room, materials);
  buildRoomShell(state);
  while (!buildPanelBatch(state, 64)) {
    /* preload / sync path — drain ceiling queue */
  }
  return finalizeRoomBuild(state);
}
