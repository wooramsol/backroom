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
import { createTiledMaterial, tiledAt, CEILING_TILE_M } from "./textures.js";

const _tileGeo = new THREE.PlaneGeometry(CEILING_TILE_FACE_M, CEILING_TILE_FACE_M);
const _cellBackingGeo = new THREE.PlaneGeometry(PANEL_W, PANEL_H);
const _panelGeo = new THREE.PlaneGeometry(PANEL_W, PANEL_H);
const _chunkPlane = new THREE.PlaneGeometry(CHUNK, CHUNK);
const _jambSideGeo = new THREE.PlaneGeometry(WALL_T, DOOR_H);
const _jambTopGeo = new THREE.PlaneGeometry(1, WALL_T);
const _ceilRot = new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.PI / 2, 0, 0));
const _pos = new THREE.Vector3();
const _scale = new THREE.Vector3(1, 1, 1);
const _mat4 = new THREE.Matrix4();
const _jambSide = new THREE.Mesh(_jambSideGeo);
const _jambTop = new THREE.Mesh(_jambTopGeo);
/** Pull trim slightly into the opening so it does not z-fight wall boxes */
const JAMB_INSET = 0.01;

/** Left, right, top — three planes only, one shared material */
function addDoorJambTrim(group, jambMat, axis, pos, mid, dw) {
  const lo = mid - dw;
  const hi = mid + dw;
  const yMid = DOOR_H * 0.5;

  const placeSide = (along, rotY) => {
    const m = _jambSide.clone();
    m.material = jambMat;
    m.rotation.y = rotY;
    m.renderOrder = 1;
    if (axis === "z") m.position.set(along, yMid, pos);
    else m.position.set(pos, yMid, along);
    group.add(m);
  };

  const top = _jambTop.clone();
  top.material = jambMat;
  top.scale.x = dw * 2;
  top.rotation.x = -Math.PI / 2;
  top.renderOrder = 1;
  if (axis === "z") top.position.set(mid, DOOR_H - JAMB_INSET, pos);
  else top.position.set(pos, DOOR_H - JAMB_INSET, mid);
  group.add(top);

  if (axis === "z") {
    placeSide(lo + JAMB_INSET, Math.PI / 2);
    placeSide(hi - JAMB_INSET, -Math.PI / 2);
  } else {
    placeSide(lo + JAMB_INSET, 0);
    placeSide(hi - JAMB_INSET, Math.PI);
  }
}

function wallSeg(group, wallTex, h, axis, pos, a0, a1, door, jambMat) {
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
    const m = new THREE.Mesh(geo, createTiledMaterial(wallTex, slen, segH));
    if (axis === "z") m.position.set(smid, segY + segH / 2, pos);
    else m.position.set(pos, segY + segH / 2, smid);
    group.add(m);
  };

  if (door) {
    add(a0, mid - dw, DOOR_H, 0, true, false);
    add(mid + dw, a1, DOOR_H, 0, false, true);
    add(a0, a1, h - DOOR_H, DOOR_H, true, true);
    addDoorJambTrim(group, jambMat, axis, pos, mid, dw);
  } else {
    add(a0, a1, h, 0, true, true);
  }
}

function addInnerWall(group, wallTex, h, wall, jambMat) {
  if (wall.axis === "x") {
    wallSeg(group, wallTex, h, "x", wall.pos, wall.span0, wall.span1, wall.door, jambMat);
  } else {
    wallSeg(group, wallTex, h, "z", wall.pos, wall.span0, wall.span1, wall.door, jambMat);
  }
}

function addFloor(group, materials, worldX, worldZ) {
  const floorMap = tiledAt(
    materials.carpetTileTex,
    CEILING_TILE_M,
    CHUNK,
    CHUNK,
    worldX,
    worldZ,
  );
  const mat = materials.carpet.clone();
  mat.map = floorMap;
  mat.side = THREE.FrontSide;
  const floor = new THREE.Mesh(_chunkPlane, mat);
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

function addWalls(group, room, materials, h) {
  const { wallTex, jamb } = materials;
  wallSeg(group, wallTex, h, "z", 0, 0, CHUNK, room.doors.north, jamb);
  wallSeg(group, wallTex, h, "z", CHUNK, 0, CHUNK, room.doors.south, jamb);
  wallSeg(group, wallTex, h, "x", 0, 0, CHUNK, room.doors.west, jamb);
  wallSeg(group, wallTex, h, "x", CHUNK, 0, CHUNK, room.doors.east, jamb);
  for (const wall of room.innerWalls) {
    addInnerWall(group, wallTex, h, wall, jamb);
  }
}

function addOnePanel(group, materials, h, panel, fixtures, roomCx, roomCz) {
  const { panelY, lightY } = getCeilingLayers(h);
  const face = new THREE.Mesh(_panelGeo, materials.lightPanelOn);
  face.rotation.x = Math.PI / 2;
  face.position.set(panel.x, panelY, panel.z);
  face.renderOrder = 1;
  face.userData.panel = panel;
  face.userData.fluorescent = true;
  panel.face = face;
  group.add(face);

  fixtures.push({
    panel,
    face,
    light: null,
    lightSlot: -1,
    wx: roomCx * CHUNK + panel.x,
    wy: panelY,
    wz: roomCz * CHUNK + panel.z,
    lightY,
  });
}

export function createRoomBuildState(room, materials) {
  const group = new THREE.Group();
  group.position.set(room.cx * CHUNK, 0, room.cz * CHUNK);
  return {
    room,
    group,
    materials,
    panelIdx: 0,
    shellDone: false,
    fixtures: [],
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
  addWalls(group, room, materials, h);
  state.shellDone = true;
}

/** @returns whether all panels are built */
export function buildPanelBatch(state, maxPanels) {
  const { room, group, materials } = state;
  const h = room.height;
  let added = 0;

  while (state.panelIdx < room.panels.length && added < maxPanels) {
    const panel = room.panels[state.panelIdx];
    addOnePanel(group, materials, h, panel, state.fixtures, room.cx, room.cz);
    state.panelIdx++;
    added++;
  }

  return state.panelIdx >= room.panels.length;
}

export function finalizeRoomBuild(state) {
  const { group, room, fixtures } = state;
  group.userData.room = room;
  group.userData.fixtures = fixtures;
  return group;
}

/** Synchronous full build — startup chunk only */
export function buildRoomMesh(room, materials) {
  const state = createRoomBuildState(room, materials);
  buildRoomShell(state);
  buildPanelBatch(state, room.panels.length);
  return finalizeRoomBuild(state);
}
