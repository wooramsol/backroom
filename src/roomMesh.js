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

/** One tiled plane per chunk — avoids ~256 geometry allocations + merge per room */
function addCeilingPlane(group, h, materials, worldX, worldZ) {
  const { tileY } = getCeilingLayers(h);
  const ceilGeo = _chunkPlane.clone();
  bakeSurfaceUV(ceilGeo, CEILING_TILE_M, worldX, worldZ);
  const ceiling = new THREE.Mesh(ceilGeo, materials.ceilingTile);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = tileY;
  group.add(ceiling);
}

export function createRoomBuildState(room, materials) {
  const group = new THREE.Group();
  group.position.set(room.cx * CHUNK, 0, room.cz * CHUNK);
  return {
    room,
    group,
    materials,
    shellPhase: 0,
    shellDone: false,
    worldX: room.cx * CHUNK,
    worldZ: room.cz * CHUNK,
  };
}

/** Spread shell work: floor+ceiling one frame, merged walls the next */
export function advanceRoomShell(state) {
  if (state.shellPhase >= 2) return false;

  const { room, group, materials } = state;
  const h = room.height;

  if (state.shellPhase === 0) {
    addFloor(group, materials, state.worldX, state.worldZ);
    addCeilingPlane(group, h, materials, state.worldX, state.worldZ);
    state.shellPhase = 1;
    return true;
  }

  addMergedWalls(group, room, materials, h, state.worldX, state.worldZ);
  state.shellPhase = 2;
  state.shellDone = true;
  return true;
}

/** @deprecated kept for world load queue API */
export function buildPanelBatch(state, _maxPanels) {
  return state.shellPhase >= 2;
}

export function finalizeRoomBuild(state) {
  const { group, room } = state;
  group.userData.room = room;
  return group;
}

export function buildRoomMesh(room, materials) {
  const state = createRoomBuildState(room, materials);
  while (state.shellPhase < 2) advanceRoomShell(state);
  return finalizeRoomBuild(state);
}
