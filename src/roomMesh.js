import * as THREE from "three";
import { CHUNK } from "./room.js";
import {
  WALL_T,
  DOOR_H,
  PANEL_W,
  PANEL_H,
} from "./constants.js";
import { createCarpetSurfaceMaterial, createTiledMaterial, tiledAt, CARPET_TILE_M } from "./textures.js";

const _panelGeo = new THREE.PlaneGeometry(PANEL_W, PANEL_H);
const _chunkPlane = new THREE.PlaneGeometry(CHUNK, CHUNK);
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

function addFlatPlatform(group, surf, mat) {
  const w = surf.x1 - surf.x0;
  const d = surf.z1 - surf.z0;
  if (w < 0.2 || d < 0.2) return;
  const geo = new THREE.PlaneGeometry(w, d);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  mesh.position.set(surf.x0 + w / 2, surf.y + 0.01, surf.z0 + d / 2);
  group.add(mesh);
}

function addRampMesh(group, surf, mat) {
  const run = surf.axis === "x" ? surf.x1 - surf.x0 : surf.z1 - surf.z0;
  const span = surf.axis === "x" ? surf.z1 - surf.z0 : surf.x1 - surf.x0;
  const rise = surf.y1 - surf.y0;
  if (run < 0.4 || span < 0.4) return;

  const geo = new THREE.BoxGeometry(run, 0.09, span);
  const mesh = new THREE.Mesh(geo, mat);
  const cx = (surf.x0 + surf.x1) / 2;
  const cz = (surf.z0 + surf.z1) / 2;
  const cy = (surf.y0 + surf.y1) / 2 + 0.045;
  mesh.position.set(cx, cy, cz);
  if (surf.axis === "x") mesh.rotation.z = -Math.atan2(rise, run);
  else mesh.rotation.x = Math.atan2(rise, run);
  group.add(mesh);
}

function addFloorFeatures(group, room, materials) {
  const surfaces = room.floorSurfaces ?? [];
  for (const s of surfaces) {
    if (s.type === "flat" && s.y <= 0.001) continue;
    if (s.type === "flat") addFlatPlatform(group, s, materials.carpet);
    else if (s.type === "ramp") addRampMesh(group, s, materials.carpet);
  }
}

/** On panel = bright rectangle; RectAreaLight comes from the shared pool */
function addOnePanel(group, materials, h, panel, fixtures, roomCx, roomCz) {
  const y = h - 0.012;
  const face = new THREE.Mesh(
    _panelGeo,
    panel.on ? materials.lightPanelOn : materials.lightPanelOff,
  );
  face.rotation.x = Math.PI / 2;
  face.position.set(panel.x, y, panel.z);
  face.userData.panel = panel;
  panel.face = face;
  group.add(face);

  if (!panel.on) return;

  face.userData.fluorescent = true;

  fixtures.push({
    panel,
    face,
    light: null,
    wx: roomCx * CHUNK + panel.x,
    wy: y,
    wz: roomCz * CHUNK + panel.z,
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

  const floor = new THREE.Mesh(_chunkPlane, materials.carpet);
  floor.rotation.x = -Math.PI / 2;
  group.add(floor);

  addFloorFeatures(group, room, materials);

  const ceilingMap = tiledAt(materials.carpetTex, CARPET_TILE_M, CHUNK, CHUNK, state.worldX, state.worldZ);
  const ceilingMat = createCarpetSurfaceMaterial(ceilingMap);
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
