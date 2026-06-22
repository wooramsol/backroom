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
import { addChunkFurniture } from "./furniturePlacement.js";

const _chunkPlane = new THREE.PlaneGeometry(CHUNK, CHUNK);
_chunkPlane.translate(CHUNK / 2, CHUNK / 2, 0);
_chunkPlane.userData.shared = true;

const _tileFaceGeo = new THREE.PlaneGeometry(CEILING_TILE_FACE_M, CEILING_TILE_FACE_M);
_tileFaceGeo.userData.shared = true;

const _cellBackingGeo = new THREE.PlaneGeometry(PANEL_W, PANEL_H);
_cellBackingGeo.userData.shared = true;

const _ceilRot = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));
const _pos = new THREE.Vector3();
const _scale = new THREE.Vector3(1, 1, 1);
const _mat4 = new THREE.Matrix4();

function addMergedWalls(group, room, materials, h, roomWx, roomWz) {
  const { geometry } = buildMergedWallGeometry(room, materials.wallTex, h, roomWx, roomWz);
  if (geometry) {
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    const wall = new THREE.Mesh(geometry, materials.wall);
    wall.frustumCulled = false;
    group.add(wall);
  }
}

function addFloor(group, materials, worldX, worldZ) {
  const floorGeo = _chunkPlane.clone();
  bakeSurfaceUV(floorGeo, FLOOR_TILE_M, worldX, worldZ);
  const floor = new THREE.Mesh(floorGeo, materials.floor);
  floor.rotation.x = -Math.PI / 2;
  floor.frustumCulled = false;
  group.add(floor);
}

function addCeiling(group, h, materials, worldX, worldZ) {
  const { gapY, tileY } = getCeilingLayers(h);
  const tileM = CEILING_TILE_M;
  const { tx0, tx1, tz0, tz1 } = chunkTileRange(worldX, worldZ, CHUNK, tileM);
  const tiles = [];
  for (let tx = tx0; tx <= tx1; tx++) {
    for (let tz = tz0; tz <= tz1; tz++) {
      const { x: px, z: pz } = tileCenterLocal(tx, tz, worldX, worldZ, tileM);
      tiles.push(px, pz);
    }
  }

  const count = tiles.length / 2;

  const backingMesh = new THREE.InstancedMesh(_cellBackingGeo, materials.ceilingGroove, count);
  const tileMesh = new THREE.InstancedMesh(_tileFaceGeo, materials.ceilingTile, count);
  backingMesh.frustumCulled = false;
  tileMesh.frustumCulled = false;
  tileMesh.renderOrder = 2;

  for (let i = 0; i < count; i++) {
    const px = tiles[i * 2];
    const pz = tiles[i * 2 + 1];
    _pos.set(px, gapY, pz);
    _mat4.compose(_pos, _ceilRot, _scale);
    backingMesh.setMatrixAt(i, _mat4);

    _pos.set(px, tileY, pz);
    _mat4.compose(_pos, _ceilRot, _scale);
    tileMesh.setMatrixAt(i, _mat4);
  }

  backingMesh.instanceMatrix.needsUpdate = true;
  tileMesh.instanceMatrix.needsUpdate = true;
  backingMesh.computeBoundingSphere();
  tileMesh.computeBoundingSphere();

  group.add(backingMesh);
  group.add(tileMesh);
}

function finalizeChunkBounds(group) {
  group.traverse((obj) => {
    obj.frustumCulled = false;
    if (obj.isInstancedMesh) {
      obj.computeBoundingSphere();
      return;
    }
    if (!obj.isMesh) return;
    const geo = obj.geometry;
    if (geo && !geo.userData?.shared) {
      geo.computeBoundingBox();
      geo.computeBoundingSphere();
    }
  });
}

export function createRoomBuildState(room, materials, furnitureModels = null) {
  const group = new THREE.Group();
  group.position.set(room.cx * CHUNK, 0, room.cz * CHUNK);
  return {
    room,
    group,
    materials,
    furnitureModels,
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
  addCeiling(group, h, materials, state.worldX, state.worldZ);
  addMergedWalls(group, room, materials, h, state.worldX, state.worldZ);
  if (state.furnitureModels) addChunkFurniture(group, room, state.furnitureModels);
  state.shellDone = true;
}

/** @deprecated kept for world load queue API */
export function buildPanelBatch(state, _maxTiles) {
  if (state.shellDone) return true;
  buildRoomShell(state);
  return true;
}

export function finalizeRoomBuild(state) {
  const { group, room } = state;
  finalizeChunkBounds(group);
  group.frustumCulled = false;
  group.userData.room = room;
  return group;
}

export function buildRoomMesh(room, materials, furnitureModels = null) {
  const state = createRoomBuildState(room, materials, furnitureModels);
  buildRoomShell(state);
  return finalizeRoomBuild(state);
}
