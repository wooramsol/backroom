import * as THREE from "three";
import { CHUNK } from "./room.js";
import {
  WALL_T,
  DOOR_H,
  PANEL_W,
  PANEL_H,
  CEILING_TILE_FACE_M,
} from "./constants.js";
import { chunkTileRange, tileCenterLocal } from "./ceilingGrid.js";
import { getCeilingLayers } from "./ceilingLayers.js";
import { tiledAt, CEILING_TILE_M, WALL_TILE_W } from "./textures.js";
import { createChunkFloorMaterial } from "./gameMaterials.js";
import { buildMergedWallGeometry } from "./wallBuilder.js";
import { bakePlaneWallUV } from "./geometryPool.js";

const _tileGeo = new THREE.PlaneGeometry(CEILING_TILE_FACE_M, CEILING_TILE_FACE_M);
_tileGeo.userData.shared = true;
const _cellBackingGeo = new THREE.PlaneGeometry(PANEL_W, PANEL_H);
_cellBackingGeo.userData.shared = true;
const _panelGeo = new THREE.PlaneGeometry(PANEL_W, PANEL_H);
_panelGeo.userData.shared = true;
const _chunkPlane = new THREE.PlaneGeometry(CHUNK, CHUNK);
_chunkPlane.userData.shared = true;
const _jambSideGeo = new THREE.PlaneGeometry(WALL_T, DOOR_H);
_jambSideGeo.userData.shared = true;
const _ceilRot = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));
const _panelRot = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));
const _pos = new THREE.Vector3();
const _scale = new THREE.Vector3(1, 1, 1);
const _mat4 = new THREE.Matrix4();
const JAMB_INSET = 0.01;

function addDoorJambTrim(group, wallMat, wallTex, axis, pos, mid, dw, roomWx, roomWz) {
  const lo = mid - dw;
  const hi = mid + dw;
  const doorW = dw * 2;
  const yMid = DOOR_H * 0.5;
  const tileW = wallTex.userData?.tileW ?? WALL_TILE_W;
  const tileH = wallTex.userData?.tileH ?? WALL_TILE_W;

  const placeSide = (along, rotY, worldU0, worldV0) => {
    const geo = _jambSideGeo.clone();
    bakePlaneWallUV(geo, WALL_T, DOOR_H, tileW, tileH, worldU0, worldV0);
    const m = new THREE.Mesh(geo, wallMat);
    m.rotation.y = rotY;
    m.renderOrder = 1;
    if (axis === "z") m.position.set(along, yMid, pos);
    else m.position.set(pos, yMid, along);
    group.add(m);
  };

  const topGeo = new THREE.PlaneGeometry(doorW, WALL_T);
  if (axis === "z") {
    bakePlaneWallUV(topGeo, doorW, WALL_T, tileW, tileH, roomWx + lo, DOOR_H - JAMB_INSET);
  } else {
    bakePlaneWallUV(topGeo, doorW, WALL_T, tileW, tileH, roomWz + lo, DOOR_H - JAMB_INSET);
  }
  const top = new THREE.Mesh(topGeo, wallMat);
  top.rotation.x = -Math.PI / 2;
  top.renderOrder = 1;
  if (axis === "z") top.position.set(mid, DOOR_H - JAMB_INSET, pos);
  else top.position.set(pos, DOOR_H - JAMB_INSET, mid);
  group.add(top);

  if (axis === "z") {
    const wz = roomWz + pos;
    placeSide(lo + JAMB_INSET, Math.PI / 2, wz - WALL_T * 0.5, 0);
    placeSide(hi - JAMB_INSET, -Math.PI / 2, wz - WALL_T * 0.5, 0);
  } else {
    const wx = roomWx + pos;
    placeSide(lo + JAMB_INSET, 0, wx - WALL_T * 0.5, 0);
    placeSide(hi - JAMB_INSET, Math.PI, wx - WALL_T * 0.5, 0);
  }
}

function addMergedWalls(group, room, materials, h, roomWx, roomWz) {
  const { geometry, jambs } = buildMergedWallGeometry(room, materials.wallTex, h, roomWx, roomWz);
  if (geometry) {
    group.add(new THREE.Mesh(geometry, materials.wall));
  }
  for (const j of jambs) {
    addDoorJambTrim(group, materials.wall, materials.wallTex, j.axis, j.pos, j.mid, j.dw, roomWx, roomWz);
  }
}

function addFloor(group, materials, worldX, worldZ) {
  const floor = new THREE.Mesh(_chunkPlane, createChunkFloorMaterial(materials, worldX, worldZ));
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

function panelTileSet(panels) {
  const keys = new Set();
  for (const panel of panels) {
    keys.add(`${panel.tx},${panel.tz}`);
  }
  return keys;
}

function addCeilingTiles(group, h, materials, worldX, worldZ, panels) {
  const { gapY, tileY } = getCeilingLayers(h);
  const tileM = CEILING_TILE_M;
  const lightCells = panelTileSet(panels);

  const { tx0, tx1, tz0, tz1 } = chunkTileRange(worldX, worldZ, CHUNK, tileM);
  const backingTransforms = [];
  const tileTransforms = [];

  for (let tx = tx0; tx <= tx1; tx++) {
    for (let tz = tz0; tz <= tz1; tz++) {
      if (lightCells.has(`${tx},${tz}`)) continue;

      const { x: px, z: pz } = tileCenterLocal(tx, tz, worldX, worldZ, tileM);

      _pos.set(px, gapY, pz);
      _mat4.compose(_pos, _ceilRot, _scale);
      backingTransforms.push(_mat4.clone());

      _pos.set(px, tileY, pz);
      _mat4.compose(_pos, _ceilRot, _scale);
      tileTransforms.push(_mat4.clone());
    }
  }

  addInstancedCeiling(group, _cellBackingGeo, materials.ceilingGroove, backingTransforms);
  addInstancedCeiling(group, _tileGeo, materials.ceilingTile, tileTransforms, 2);
}

function addLightPanels(group, materials, h, panels) {
  const n = panels.length;
  if (!n) return;
  const { panelY } = getCeilingLayers(h);
  const mesh = new THREE.InstancedMesh(_panelGeo, materials.lightPanelOn, n);
  for (let i = 0; i < n; i++) {
    const p = panels[i];
    _pos.set(p.x, panelY, p.z);
    _mat4.compose(_pos, _panelRot, _scale);
    mesh.setMatrixAt(i, _mat4);
  }
  mesh.instanceMatrix.needsUpdate = true;
  mesh.renderOrder = 1;
  group.add(mesh);
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
  addCeilingTiles(group, h, materials, state.worldX, state.worldZ, room.panels);
  addMergedWalls(group, room, materials, h, state.worldX, state.worldZ);
  addLightPanels(group, materials, h, room.panels);
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
