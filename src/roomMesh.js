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
const WALL_CORNER = WALL_T * 0.55;

function addCornerFill(group, wallTex, h, x, z, sx, sz) {
  const mx = x + sx * WALL_CORNER;
  const mz = z + sz * WALL_CORNER;
  const geo = new THREE.BoxGeometry(WALL_T, h, WALL_T);
  const mat = createTiledMaterial(wallTex, WALL_T, h);
  const m = new THREE.Mesh(geo, mat);
  m.position.set(mx, h / 2, mz);
  group.add(m);
}

function addCornerPost(group, wallTex, h, x, z) {
  const ox = x <= 0 ? -WALL_CORNER : WALL_CORNER;
  const oz = z <= 0 ? -WALL_CORNER : WALL_CORNER;
  addCornerFill(group, wallTex, h, x, z, ox > 0 ? 1 : -1, oz > 0 ? 1 : -1);
}

function wallLineSegments(room) {
  const segs = [
    { axis: "z", pos: 0, a0: 0, a1: CHUNK },
    { axis: "z", pos: CHUNK, a0: 0, a1: CHUNK },
    { axis: "x", pos: 0, a0: 0, a1: CHUNK },
    { axis: "x", pos: CHUNK, a0: 0, a1: CHUNK },
  ];
  for (const wall of room.innerWalls) {
    segs.push({ axis: wall.axis, pos: wall.pos, a0: wall.span0, a1: wall.span1 });
  }
  return segs;
}

function wallJunction(zWall, xWall) {
  const x = xWall.pos;
  const z = zWall.pos;
  const eps = 0.02;
  if (x < zWall.a0 - eps || x > zWall.a1 + eps) return null;
  if (z < xWall.a0 - eps || z > xWall.a1 + eps) return null;
  return { x, z };
}

function addWallJunctions(group, room, wallTex, h) {
  const segs = wallLineSegments(room);
  const seen = new Set();
  const fills = [
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ];

  for (let i = 0; i < segs.length; i++) {
    for (let j = i + 1; j < segs.length; j++) {
      const a = segs[i];
      const b = segs[j];
      if (a.axis === b.axis) continue;

      const zWall = a.axis === "z" ? a : b;
      const xWall = a.axis === "x" ? a : b;
      const hit = wallJunction(zWall, xWall);
      if (!hit) continue;

      const key = `${Math.round(hit.x * 40)}:${Math.round(hit.z * 40)}`;
      if (seen.has(key)) continue;
      seen.add(key);

      for (const [sx, sz] of fills) {
        addCornerFill(group, wallTex, h, hit.x, hit.z, sx, sz);
      }
    }
  }
}

function wallSeg(group, wallTex, h, axis, pos, a0, a1, door) {
  const mid = (a0 + a1) / 2 + (door?.offset || 0);
  const dw = door ? door.width / 2 : 0;

  const add = (s0, s1, segH, segY, capStart = true, capEnd = true) => {
    const es0 = capStart ? s0 - WALL_CORNER : s0;
    const es1 = capEnd ? s1 + WALL_CORNER : s1;
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

function addWalls(group, room, wallTex, h) {
  wallSeg(group, wallTex, h, "z", 0, 0, CHUNK, room.doors.north);
  wallSeg(group, wallTex, h, "z", CHUNK, 0, CHUNK, room.doors.south);
  wallSeg(group, wallTex, h, "x", 0, 0, CHUNK, room.doors.west);
  wallSeg(group, wallTex, h, "x", CHUNK, 0, CHUNK, room.doors.east);
  for (const wall of room.innerWalls) {
    addInnerWall(group, wallTex, h, wall);
  }
  addCornerPost(group, wallTex, h, 0, 0);
  addCornerPost(group, wallTex, h, CHUNK, 0);
  addCornerPost(group, wallTex, h, 0, CHUNK);
  addCornerPost(group, wallTex, h, CHUNK, CHUNK);
  addWallJunctions(group, room, wallTex, h);
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
