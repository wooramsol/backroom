import * as THREE from "three";
import { CHUNK } from "./room.js";
import {
  WALL_T,
  WALL_FLOOR_OVERLAP,
  WALL_CEILING_OVERLAP,
  DOOR_H,
  LIGHT_PANEL_COLOR,
  LIGHT_PANEL_INTENSITY,
  PANEL_LIGHT_COLOR,
  PANEL_LIGHT_INTENSITY,
  PANEL_W,
  PANEL_H,
} from "./constants.js";
import { claimPanelLight, zoneLightLayer } from "./lightBudget.js";
import { createCarpetSurfaceMaterial, createTiledMaterial, tiledAt, CARPET_TILE_M } from "./textures.js";

const _down = new THREE.Euler(-Math.PI / 2, 0, 0);
const _panelGeo = new THREE.PlaneGeometry(PANEL_W, PANEL_H);
const _onColor = new THREE.Color(LIGHT_PANEL_COLOR);

function wallSeg(group, wallTex, h, axis, pos, a0, a1, door) {
  const mid = (a0 + a1) / 2 + (door?.offset || 0);
  const dw = door ? door.width / 2 : 0;

  const add = (s0, s1, segH, segY) => {
    const slen = s1 - s0;
    if (slen < 0.1) return;
    const smid = (s0 + s1) / 2;
    const extendBot = segY <= 0.001 ? WALL_FLOOR_OVERLAP : 0;
    const extendTop = segY + segH >= h - 0.001 ? WALL_CEILING_OVERLAP : 0;
    const totalH = segH + extendBot + extendTop;
    const centerY = segY + segH / 2 + (extendTop - extendBot) / 2;
    const geo =
      axis === "z"
        ? new THREE.BoxGeometry(slen, totalH, WALL_T)
        : new THREE.BoxGeometry(WALL_T, totalH, slen);
    const mat = createTiledMaterial(wallTex, slen, totalH);
    const m = new THREE.Mesh(geo, mat);
    if (axis === "z") m.position.set(smid, centerY, pos);
    else m.position.set(pos, centerY, smid);
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

function addInnerWall(group, wallTex, h, wall) {
  if (wall.axis === "x") {
    wallSeg(group, wallTex, h, "x", wall.pos, wall.span0, wall.span1, wall.door);
  } else {
    wallSeg(group, wallTex, h, "z", wall.pos, wall.span0, wall.span1, wall.door);
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

function addZoneSurfaces(group, room, materials, state) {
  for (let zi = 0; zi < room.zones.length; zi++) {
    const zone = room.zones[zi];
    const w = zone.x1 - zone.x0;
    const d = zone.z1 - zone.z0;
    if (w < 0.08 || d < 0.08) continue;

    const cx = (zone.x0 + zone.x1) / 2;
    const cz = (zone.z0 + zone.z1) / 2;
    const layer = zoneLightLayer(room.cx, room.cz, zi);

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(w, d), materials.carpet);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(cx, 0.003, cz);
    floor.layers.set(layer);
    group.add(floor);

    const ceilingMap = tiledAt(
      materials.carpetTex,
      CARPET_TILE_M,
      w,
      d,
      state.worldX + zone.x0,
      state.worldZ + zone.z0,
    );
    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(w, d),
      createCarpetSurfaceMaterial(ceilingMap),
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(cx, room.height, cz);
    ceiling.layers.set(layer);
    group.add(ceiling);
  }
}

/** Lit panel = bright rectangle + matching RectAreaLight at the same spot */
function addOnePanel(group, materials, h, panel, fixtures, room) {
  const y = h - 0.012;
  const gotLight = panel.on && claimPanelLight();
  const layer = zoneLightLayer(room.cx, room.cz, panel.zoneIdx ?? 0);
  const face = new THREE.Mesh(
    _panelGeo,
    gotLight ? materials.lightPanelOn.clone() : materials.lightPanelOff
  );
  face.rotation.x = Math.PI / 2;
  face.position.set(panel.x, y, panel.z);
  face.layers.set(layer);
  face.userData.panel = panel;
  panel.face = face;
  group.add(face);

  if (!gotLight) return;

  face.userData.fluorescent = true;
  face.material.color.copy(_onColor).multiplyScalar(LIGHT_PANEL_INTENSITY * panel.bright);

  const light = new THREE.RectAreaLight(
    PANEL_LIGHT_COLOR,
    PANEL_LIGHT_INTENSITY * panel.bright,
    PANEL_W,
    PANEL_H
  );
  light.position.set(panel.x, y, panel.z);
  light.rotation.copy(_down);
  light.layers.set(layer);
  group.add(light);
  panel.light = light;
  fixtures.push({ light, panel, face });
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
    worldX: room.cx * CHUNK,
    worldZ: room.cz * CHUNK,
  };
}

export function buildRoomShell(state) {
  if (state.shellDone) return;
  const { room, group, materials } = state;
  const h = room.height;

  const baseFloor = new THREE.Mesh(new THREE.PlaneGeometry(CHUNK, CHUNK), materials.carpet);
  baseFloor.rotation.x = -Math.PI / 2;
  baseFloor.position.y = -0.002;
  group.add(baseFloor);

  addZoneSurfaces(group, room, materials, state);
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
    addOnePanel(group, materials, h, panel, state.fixtures, room);
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
