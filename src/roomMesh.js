import * as THREE from "three";
import { CHUNK } from "./room.js";
import { getCeilingLayers } from "./ceilingLayers.js";
import { CEILING_TILE_M, bakeSurfaceUV, FLOOR_TILE_M } from "./textures.js";
import { createChunkFloorMaterial } from "./gameMaterials.js";
import { buildMergedWallGeometry } from "./wallBuilder.js";

const _chunkPlane = new THREE.PlaneGeometry(CHUNK, CHUNK);
_chunkPlane.translate(CHUNK / 2, CHUNK / 2, 0);
_chunkPlane.userData.shared = true;

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

/** One plane per chunk — seam texture keeps tile grooves via baked UVs */
function addCeiling(group, h, materials, worldX, worldZ) {
  const { tileY } = getCeilingLayers(h);
  const ceilGeo = _chunkPlane.clone();
  bakeSurfaceUV(ceilGeo, CEILING_TILE_M, worldX, worldZ);
  const ceiling = new THREE.Mesh(ceilGeo, materials.ceilingTile);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = tileY;
  ceiling.renderOrder = 2;
  group.add(ceiling);
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
  addCeiling(group, h, materials, state.worldX, state.worldZ);
  addMergedWalls(group, room, materials, h, state.worldX, state.worldZ);
  state.shellDone = true;
}

/** @deprecated panels build in shell — kept for world load queue API */
export function buildPanelBatch(state, _maxPanels) {
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
  return finalizeRoomBuild(state);
}
