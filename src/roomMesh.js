import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { CHUNK } from "./room.js";
import {
  PANEL_W,
  PANEL_H,
  CEILING_TILE_FACE_M,
  BLOOM_LAYER,
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

function isLitPanelCell(room, px, pz) {
  const panel = room.panels?.[0];
  if (!panel?.on) return false;
  return Math.abs(panel.x - px) < 0.05 && Math.abs(panel.z - pz) < 0.05;
}

function addCeilingTiles(group, h, materials, worldX, worldZ, room) {
  const { gapY, tileY, lightY } = getCeilingLayers(h);
  const tileM = CEILING_TILE_M;

  const { tx0, tx1, tz0, tz1 } = chunkTileRange(worldX, worldZ, CHUNK, tileM);
  const backingTransforms = [];
  const tileParts = [];
  room.lightFixture = null;

  for (let tx = tx0; tx <= tx1; tx++) {
    for (let tz = tz0; tz <= tz1; tz++) {
      const { x: px, z: pz } = tileCenterLocal(tx, tz, worldX, worldZ, tileM);

      _pos.set(px, gapY, pz);
      _mat4.compose(_pos, _ceilRot, _scale);
      backingTransforms.push(_mat4.clone());

      if (isLitPanelCell(room, px, pz)) {
        const litGeo = new THREE.PlaneGeometry(CEILING_TILE_FACE_M, CEILING_TILE_FACE_M);
        litGeo.rotateX(Math.PI / 2);
        litGeo.translate(px, tileY, pz);
        const litMesh = new THREE.Mesh(litGeo, materials.lightPanelOn);
        litMesh.layers.enable(BLOOM_LAYER);
        litMesh.renderOrder = 3;
        group.add(litMesh);
        room.lightFixture = {
          wx: worldX + px,
          wy: lightY,
          wz: worldZ + pz,
          lightY,
          panel: room.panels[0],
        };
        continue;
      }

      const tileGeo = new THREE.PlaneGeometry(CEILING_TILE_FACE_M, CEILING_TILE_FACE_M);
      tileGeo.rotateX(Math.PI / 2);
      tileGeo.translate(px, tileY, pz);
      bakeSurfaceUV(tileGeo, tileM, worldX, worldZ);
      tileParts.push(tileGeo);
    }
  }

  addInstancedCeiling(group, _cellBackingGeo, materials.ceilingGroove, backingTransforms);

  if (tileParts.length) {
    const merged = mergeGeometries(tileParts, false);
    for (const g of tileParts) g.dispose();
    const ceiling = new THREE.Mesh(merged, materials.ceilingTile);
    ceiling.renderOrder = 2;
    group.add(ceiling);
  }
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
  addCeilingTiles(group, h, materials, state.worldX, state.worldZ, room);
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
