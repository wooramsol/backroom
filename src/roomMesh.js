import * as THREE from "three";
import { CHUNK } from "./room.js";
import {
  WALL_T,
  DOOR_H,
  PANEL_W,
  PANEL_H,
} from "./constants.js";
import { createTiledMaterial, tiledAt, CEILING_TILE_M } from "./textures.js";

const _panelGeo = new THREE.PlaneGeometry(PANEL_W, PANEL_H);
const _chunkPlane = new THREE.PlaneGeometry(CHUNK, CHUNK);
const CEILING_TILE_GAP = 0.034;
const CEILING_TILE_THICK = 0.02;
const _tileMatrix = new THREE.Matrix4();
const _tilePos = new THREE.Vector3();
const _tileRot = new THREE.Quaternion().setFromEuler(
  new THREE.Euler(Math.PI / 2, 0, 0, "XYZ"),
);
const _tileScale = new THREE.Vector3(1, 1, 1);
const _ceilingTileGeo = new THREE.PlaneGeometry(
  CEILING_TILE_M - CEILING_TILE_GAP,
  CEILING_TILE_M - CEILING_TILE_GAP,
);

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

function addCeilingTiles(group, h, materials, worldX, worldZ) {
  const backingMap = tiledAt(
    materials.ceilingBackingTex,
    CEILING_TILE_M,
    CHUNK,
    CHUNK,
    worldX,
    worldZ,
  );
  const backingMat = materials.ceilingBacking.clone();
  backingMat.map = backingMap;
  const backing = new THREE.Mesh(_chunkPlane, backingMat);
  backing.rotation.x = Math.PI / 2;
  backing.position.y = h - CEILING_TILE_THICK - 0.004;
  group.add(backing);

  const geo = _ceilingTileGeo;
  const nx = Math.ceil(CHUNK / CEILING_TILE_M);
  const nz = Math.ceil(CHUNK / CEILING_TILE_M);
  const mesh = new THREE.InstancedMesh(geo, materials.ceilingTile, nx * nz);
  const ox = (CHUNK - nx * CEILING_TILE_M) / 2 + CEILING_TILE_M / 2;
  const oz = (CHUNK - nz * CEILING_TILE_M) / 2 + CEILING_TILE_M / 2;
  const y = h - 0.002;
  let i = 0;
  for (let iz = 0; iz < nz; iz++) {
    for (let ix = 0; ix < nx; ix++) {
      _tilePos.set(ox + ix * CEILING_TILE_M, y, oz + iz * CEILING_TILE_M);
      _tileMatrix.compose(_tilePos, _tileRot, _tileScale);
      mesh.setMatrixAt(i++, _tileMatrix);
    }
  }
  mesh.instanceMatrix.needsUpdate = true;
  group.add(mesh);
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

/** On panel = bright rectangle; RectAreaLight comes from the shared pool */
function addOnePanel(group, materials, h, panel, fixtures, roomCx, roomCz) {
  const y = h - CEILING_TILE_THICK - 0.006;
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

  addCeilingTiles(group, h, materials, state.worldX, state.worldZ);

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
