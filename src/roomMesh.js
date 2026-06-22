import * as THREE from "three";
import { CHUNK } from "./room.js";
import { CEILING_TILE_FACE_M } from "./constants.js";
import { getCeilingLayers } from "./ceilingLayers.js";
import { CEILING_TILE_M, bakeSurfaceUV, FLOOR_TILE_M } from "./textures.js";
import { buildMergedWallGeometry } from "./wallBuilder.js";
import { addChunkFurniture } from "./furniturePlacement.js";

const _chunkPlane = new THREE.PlaneGeometry(CHUNK, CHUNK);
_chunkPlane.translate(CHUNK / 2, CHUNK / 2, 0);
_chunkPlane.userData.shared = true;

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

/** Single ceiling sheet — reliable underside facing (no instanced cull gaps) */
function addCeiling(group, h, materials, worldX, worldZ) {
  const { tileY } = getCeilingLayers(h);
  const ceilGeo = _chunkPlane.clone();
  bakeSurfaceUV(ceilGeo, CEILING_TILE_M, worldX, worldZ);
  const ceiling = new THREE.Mesh(ceilGeo, materials.ceilingTile);
  ceiling.position.y = tileY;
  ceiling.rotation.x = Math.PI / 2;
  ceiling.frustumCulled = false;
  ceiling.renderOrder = 2;
  group.add(ceiling);
}

function finalizeChunkBounds(group) {
  group.traverse((obj) => {
    obj.frustumCulled = false;
    if (!obj.isMesh && !obj.isInstancedMesh) return;
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
