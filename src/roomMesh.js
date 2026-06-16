import * as THREE from "three";
import { CHUNK } from "./room.js";
import {
  WALL_T,
  DOOR_H,
  LIGHT_PANEL_COLOR,
  LIGHT_PANEL_INTENSITY,
  PANEL_LIGHT_INTENSITY,
  PANEL_W,
  PANEL_H,
  CEILING_WASH_W,
  CEILING_WASH_H,
  CEILING_WASH_OPACITY,
} from "./constants.js";
import { claimPanelLight } from "./lightBudget.js";
import { createTiledMaterial, tiledAt, CARPET_TILE_M } from "./textures.js";

const _down = new THREE.Euler(-Math.PI / 2, 0, 0);
const _panelGeo = new THREE.PlaneGeometry(PANEL_W, PANEL_H);
const _washGeo = new THREE.PlaneGeometry(CEILING_WASH_W, CEILING_WASH_H);
const _chunkPlane = new THREE.PlaneGeometry(CHUNK, CHUNK);
const _onColor = new THREE.Color(LIGHT_PANEL_COLOR);

function wallSeg(group, wallTex, h, axis, pos, a0, a1, door) {
  const mid = (a0 + a1) / 2 + (door?.offset || 0);
  const dw = door ? door.width / 2 : 0;

  const add = (s0, s1, segH, segY) => {
    const slen = s1 - s0;
    if (slen < 0.1) return;
    const smid = (s0 + s1) / 2;
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
    add(a0, mid - dw, DOOR_H, 0);
    add(mid + dw, a1, DOOR_H, 0);
    add(a0, a1, h - DOOR_H, DOOR_H);
  } else {
    add(a0, a1, h, 0);
  }
}

function addWalls(group, room, wallTex, h) {
  wallSeg(group, wallTex, h, "z", 0, 0, CHUNK, room.doors.north);
  wallSeg(group, wallTex, h, "z", CHUNK, 0, CHUNK, room.doors.south);
  wallSeg(group, wallTex, h, "x", 0, 0, CHUNK, room.doors.west);
  wallSeg(group, wallTex, h, "x", CHUNK, 0, CHUNK, room.doors.east);
  if (room.doors.innerWest) {
    wallSeg(group, wallTex, h, "x", room.westOff, room.northOff, CHUNK, room.doors.innerWest);
  }
  if (room.doors.innerNorth) {
    wallSeg(group, wallTex, h, "z", room.northOff, room.westOff, CHUNK, room.doors.innerNorth);
  }
}

function addOnePanel(group, room, materials, h, panel, fixtures) {
  const y = h - 0.05;
  const gotLight = panel.on && claimPanelLight();
  const face = new THREE.Mesh(
    _panelGeo,
    gotLight ? materials.lightPanel.clone() : materials.lightPanelOff
  );
  face.rotation.x = Math.PI / 2;
  face.position.set(panel.x, y, panel.z);
  face.userData.fluorescent = true;
  face.userData.panel = panel;
  panel.face = face;
  group.add(face);

  if (gotLight) {
    face.material.color.copy(_onColor).multiplyScalar(LIGHT_PANEL_INTENSITY * panel.bright);
    const washMat = materials.ceilingWash.clone();
    washMat.opacity = CEILING_WASH_OPACITY * panel.bright;
    const wash = new THREE.Mesh(_washGeo, washMat);
    wash.rotation.x = Math.PI / 2;
    wash.position.set(panel.x, h - 0.04, panel.z);
    wash.renderOrder = 1;
    group.add(wash);

    const light = new THREE.RectAreaLight(
      0xfff4d8,
      PANEL_LIGHT_INTENSITY * panel.bright,
      PANEL_W,
      PANEL_H
    );
    group.add(light);
    light.position.set(panel.x, y, panel.z);
    light.rotation.copy(_down);
    panel.light = light;
    fixtures.push({ light, panel, face, wash });
  }
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
    lightCount: 0,
  };
}

export function buildRoomShell(state) {
  if (state.shellDone) return;
  const { room, group, materials } = state;
  const h = room.height;

  const floor = new THREE.Mesh(_chunkPlane, materials.carpet);
  floor.rotation.x = -Math.PI / 2;
  group.add(floor);

  const worldX = room.cx * CHUNK;
  const worldZ = room.cz * CHUNK;
  const ceilingMap = tiledAt(materials.carpetTex, CARPET_TILE_M, CHUNK, CHUNK, worldX, worldZ);
  const ceilingMat = materials.carpet.clone();
  ceilingMat.map = ceilingMap;
  // No per-chunk emissive — avoids brightness seams at chunk edges; darkness from fixtures only
  ceilingMat.emissive.setHex(0x000000);
  ceilingMat.emissiveIntensity = 0;
  const ceiling = new THREE.Mesh(_chunkPlane, ceilingMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = h;
  group.add(ceiling);

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
    addOnePanel(group, room, materials, h, panel, state.fixtures);
    if (panel.light) state.lightCount++;
    state.panelIdx++;
    added++;
  }

  return state.panelIdx >= room.panels.length;
}

export function finalizeRoomBuild(state) {
  const { group, room, fixtures, lightCount } = state;
  group.userData.room = room;
  group.userData.fixtures = fixtures;
  group.userData.lightCount = lightCount;
  return group;
}

/** Synchronous full build — startup chunk only */
export function buildRoomMesh(room, materials) {
  const state = createRoomBuildState(room, materials);
  buildRoomShell(state);
  buildPanelBatch(state, room.panels.length);
  return finalizeRoomBuild(state);
}
