import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
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
import { createWallMaterial, applyWallWorldUVs, applyFakeWallShadows, applyFakeFloorShadows, tiledAt, CEILING_TILE_M } from "./textures.js";

const _tileGeo = new THREE.PlaneGeometry(CEILING_TILE_FACE_M, CEILING_TILE_FACE_M);
const _cellBackingGeo = new THREE.PlaneGeometry(PANEL_W, PANEL_H);
const _floorGeo = new THREE.PlaneGeometry(CHUNK, CHUNK, 12, 12);
const _ceilRot = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));
const _identQuat = new THREE.Quaternion();
const _pos = new THREE.Vector3();
const _scale = new THREE.Vector3(1, 1, 1);
const _mat4 = new THREE.Matrix4();

function wallSegCollect(geos, wallTex, wallMat, originX, originZ, h, axis, pos, a0, a1, door) {
  const tileW = wallTex.userData?.tileW ?? 0.76;
  const tileH = wallTex.userData?.tileH ?? tileW;
  const mid = (a0 + a1) / 2 + (door?.offset || 0);
  const dw = door ? door.width / 2 : 0;

  const cap = WALL_T * 0.5;
  const add = (s0, s1, segH, segY, capStart = true, capEnd = true) => {
    const es0 = capStart ? s0 - cap : s0;
    const es1 = capEnd ? s1 + cap : s1;
    const slen = es1 - es0;
    if (slen < 0.1) return;
    const smid = (es0 + es1) / 2;
    const geo =
      axis === "z"
        ? new THREE.BoxGeometry(slen, segH, WALL_T)
        : new THREE.BoxGeometry(WALL_T, segH, slen);
    if (axis === "z") _pos.set(smid, segY + segH / 2, pos);
    else _pos.set(pos, segY + segH / 2, smid);
    _mat4.compose(_pos, _identQuat, _scale);
    geo.applyMatrix4(_mat4);
    applyWallWorldUVs(geo, tileW, tileH, originX, originZ);
    geos.push(geo);
  };

  if (door) {
    add(a0, mid - dw, DOOR_H, 0, true, false);
    add(mid + dw, a1, DOOR_H, 0, false, true);
    add(a0, a1, h - DOOR_H, DOOR_H, true, true);
  } else {
    add(a0, a1, h, 0, true, true);
  }
}

function addInnerWall(geos, wallTex, wallMat, originX, originZ, h, wall) {
  if (wall.axis === "x") {
    wallSegCollect(geos, wallTex, wallMat, originX, originZ, h, "x", wall.pos, wall.span0, wall.span1, wall.door);
  } else {
    wallSegCollect(geos, wallTex, wallMat, originX, originZ, h, "z", wall.pos, wall.span0, wall.span1, wall.door);
  }
}

function flushWallMeshes(group, geos, wallMat, roomH, originX, originZ, innerWalls) {
  if (!geos.length) return;
  for (const geo of geos) {
    applyFakeWallShadows(geo, roomH, originX, originZ, innerWalls);
  }
  const merged = mergeGeometries(geos, false);
  for (const geo of geos) geo.dispose();
  if (merged) group.add(new THREE.Mesh(merged, wallMat));
  geos.length = 0;
}

function addFloor(group, materials, worldX, worldZ) {
  const floorMap = tiledAt(
    materials.ceilingTileTex,
    CEILING_TILE_FACE_M,
    CHUNK,
    CHUNK,
    worldX,
    worldZ,
  );
  const mat = materials.floor.clone();
  mat.map = floorMap;
  mat.side = THREE.DoubleSide;
  const floorGeo = _floorGeo.clone();
  applyFakeFloorShadows(floorGeo);
  const floor = new THREE.Mesh(floorGeo, mat);
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

function addCeilingTiles(group, h, materials, worldX, worldZ) {
  const { gapY, tileY } = getCeilingLayers(h);
  const tileM = CEILING_TILE_M;

  const { tx0, tx1, tz0, tz1 } = chunkTileRange(worldX, worldZ, CHUNK, tileM);
  const backingTransforms = [];
  const tileTransforms = [];

  for (let tx = tx0; tx <= tx1; tx++) {
    for (let tz = tz0; tz <= tz1; tz++) {
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

function addWalls(group, room, materials, h, originX, originZ) {
  const geos = [];
  const wallMat = materials.wall;
  wallSegCollect(geos, materials.wallTex, wallMat, originX, originZ, h, "z", 0, 0, CHUNK, room.doors.north);
  wallSegCollect(geos, materials.wallTex, wallMat, originX, originZ, h, "z", CHUNK, 0, CHUNK, room.doors.south);
  wallSegCollect(geos, materials.wallTex, wallMat, originX, originZ, h, "x", 0, 0, CHUNK, room.doors.west);
  wallSegCollect(geos, materials.wallTex, wallMat, originX, originZ, h, "x", CHUNK, 0, CHUNK, room.doors.east);
  for (const wall of room.innerWalls) {
    addInnerWall(geos, materials.wallTex, wallMat, originX, originZ, h, wall);
  }
  flushWallMeshes(group, geos, wallMat, h, originX, originZ, room.innerWalls);
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
  addCeilingTiles(group, h, materials, state.worldX, state.worldZ);
  addWalls(group, room, materials, h, state.worldX, state.worldZ);
  state.shellDone = true;
}

/** @deprecated troffer panels removed — shell build is complete */
export function buildPanelBatch() {
  return true;
}

export function finalizeRoomBuild(state) {
  const { group, room } = state;
  group.userData.room = room;
  return group;
}

/** Synchronous full build — startup chunk only */
export function buildRoomMesh(room, materials) {
  const state = createRoomBuildState(room, materials);
  buildRoomShell(state);
  return finalizeRoomBuild(state);
}
