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
import { createTiledMaterial, tiledAt, SURFACE_TILE_M, CEILING_TILE_M } from "./textures.js";

const _tileGeo = new THREE.PlaneGeometry(CEILING_TILE_FACE_M, CEILING_TILE_FACE_M);
const _panelGeo = new THREE.PlaneGeometry(PANEL_W, PANEL_H);
const _chunkPlane = new THREE.PlaneGeometry(CHUNK, CHUNK);

function wallSeg(group, wallTex, h, axis, pos, a0, a1, door) {
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
    const mat = createTiledMaterial(wallTex, slen, segH);
    const m = new THREE.Mesh(geo, mat);
    if (axis === "z") m.position.set(smid, segY + segH / 2, pos);
    else m.position.set(pos, segY + segH / 2, smid);
    group.add(m);
  };

  if (door) {
    add(a0, mid - dw, DOOR_H, 0, true, false);
    add(mid + dw, a1, DOOR_H, 0, false, true);
    add(a0, a1, h - DOOR_H, DOOR_H, true, true);
  } else {
    add(a0, a1, h, 0, true, true);
  }
}

function addInnerWall(group, wallTex, h, wall) {
  if (wall.axis === "x") {
    wallSeg(group, wallTex, h, "x", wall.pos, wall.span0, wall.span1, wall.door);
  } else {
    wallSeg(group, wallTex, h, "z", wall.pos, wall.span0, wall.span1, wall.door);
  }
}

function addFloor(group, materials, worldX, worldZ) {
  const floorMap = tiledAt(
    materials.surfaceTex,
    SURFACE_TILE_M,
    CHUNK,
    CHUNK,
    worldX,
    worldZ,
  );
  const mat = materials.carpet.clone();
  mat.map = floorMap;
  const floor = new THREE.Mesh(_chunkPlane, mat);
  floor.rotation.x = -Math.PI / 2;
  group.add(floor);
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
  const halfFace = CEILING_TILE_FACE_M / 2;
  const lightCells = panelTileSet(panels);

  const { tx0, tx1, tz0, tz1 } = chunkTileRange(worldX, worldZ, CHUNK, tileM);

  for (let tx = tx0; tx <= tx1; tx++) {
    for (let tz = tz0; tz <= tz1; tz++) {
      if (lightCells.has(`${tx},${tz}`)) continue;

      const { x: px, z: pz } = tileCenterLocal(tx, tz, worldX, worldZ, tileM);
      if (px - halfFace < 0 || px + halfFace > CHUNK || pz - halfFace < 0 || pz + halfFace > CHUNK) {
        continue;
      }

      const backing = new THREE.Mesh(_tileGeo, materials.ceilingGap);
      backing.rotation.x = Math.PI / 2;
      backing.position.set(px, gapY, pz);
      backing.renderOrder = 0;
      group.add(backing);

      const tile = new THREE.Mesh(_tileGeo, materials.ceilingTile);
      tile.rotation.x = Math.PI / 2;
      tile.position.set(px, tileY, pz);
      tile.renderOrder = 1;
      group.add(tile);
    }
  }
}

function addWalls(group, room, wallTex, h) {
  wallSeg(group, wallTex, h, "z", 0, 0, CHUNK, room.doors.north);
  wallSeg(group, wallTex, h, "z", CHUNK, 0, CHUNK, room.doors.south);
  wallSeg(group, wallTex, h, "x", 0, 0, CHUNK, room.doors.west);
  wallSeg(group, wallTex, h, "x", CHUNK, 0, CHUNK, room.doors.east);
  for (const wall of room.innerWalls) {
    addInnerWall(group, wallTex, h, wall);
  }
}

function addOnePanel(group, materials, h, panel, fixtures, roomCx, roomCz) {
  const { gapY, panelY, lightY } = getCeilingLayers(h);
  const recess = new THREE.Mesh(_panelGeo, materials.lightPanelOff);
  recess.rotation.x = Math.PI / 2;
  recess.position.set(panel.x, gapY + 0.001, panel.z);
  recess.renderOrder = 0;
  group.add(recess);

  const face = new THREE.Mesh(
    _panelGeo,
    panel.on ? materials.lightPanelOn : materials.lightPanelOff,
  );
  face.rotation.x = Math.PI / 2;
  face.position.set(panel.x, panelY, panel.z);
  face.renderOrder = 2;
  face.userData.panel = panel;
  panel.face = face;
  group.add(face);

  if (!panel.on) return;

  face.userData.fluorescent = true;

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
  addWalls(group, room, materials.wallTex, h);
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
