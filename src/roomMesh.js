import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { CHUNK } from "./room.js";
import {
  PANEL_W,
  PANEL_H,
  CEILING_TILE_FACE_M,
  BLOOM_LAYER,
  FLUORESCENT_COLOR,
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

const _floorWashGeo = new THREE.PlaneGeometry(1, 1);
_floorWashGeo.rotateX(-Math.PI / 2);
_floorWashGeo.userData.shared = true;

let _floorWashMaterial = null;

function getFloorWashMaterial() {
  if (_floorWashMaterial) return _floorWashMaterial;
  const size = 128;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255, 224, 184, 0.16)");
  g.addColorStop(0.42, "rgba(255, 224, 184, 0.05)");
  g.addColorStop(1, "rgba(255, 224, 184, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  _floorWashMaterial = new THREE.MeshBasicMaterial({
    map: tex,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    color: new THREE.Color(FLUORESCENT_COLOR),
  });
  return _floorWashMaterial;
}

function addFloorLightWash(group, px, pz) {
  const wash = new THREE.Mesh(getFloorWashMaterial(), _floorWashGeo);
  const span = PANEL_W * 1.55;
  wash.scale.set(span, span, 1);
  wash.position.set(px, 0.012, pz);
  wash.renderOrder = 1;
  group.add(wash);
}

function isLitPanelCell(room, px, pz) {
  if (!room.panels?.length) return null;
  for (const panel of room.panels) {
    if (!panel.on) continue;
    if (Math.abs(panel.x - px) < 0.05 && Math.abs(panel.z - pz) < 0.05) return panel;
  }
  return null;
}

function addCeilingTiles(group, h, materials, worldX, worldZ, room) {
  const { gapY, tileY, lightY } = getCeilingLayers(h);
  const tileM = CEILING_TILE_M;

  const { tx0, tx1, tz0, tz1 } = chunkTileRange(worldX, worldZ, CHUNK, tileM);
  const backingTransforms = [];
  const tileParts = [];
  room.lightFixtures = [];

  for (let tx = tx0; tx <= tx1; tx++) {
    for (let tz = tz0; tz <= tz1; tz++) {
      const { x: px, z: pz } = tileCenterLocal(tx, tz, worldX, worldZ, tileM);

      _pos.set(px, gapY, pz);
      _mat4.compose(_pos, _ceilRot, _scale);
      backingTransforms.push(_mat4.clone());

      const litPanel = isLitPanelCell(room, px, pz);
      if (litPanel) {
        const litGeo = new THREE.PlaneGeometry(CEILING_TILE_FACE_M, CEILING_TILE_FACE_M);
        litGeo.rotateX(Math.PI / 2);
        litGeo.translate(px, tileY, pz);
        const litMesh = new THREE.Mesh(litGeo, materials.lightPanelOn);
        litMesh.layers.enable(BLOOM_LAYER);
        litMesh.renderOrder = 3;
        group.add(litMesh);
        room.lightFixtures.push({
          wx: worldX + px,
          wy: lightY,
          wz: worldZ + pz,
          lightY,
          panel: litPanel,
        });
        addFloorLightWash(group, px, pz);
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
