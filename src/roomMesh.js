import * as THREE from "three";
import { CELL, DOOR_W, DOOR_H, FLOOR_STEP, WALL_THICK } from "./roomGen.js";

const HW = CELL / 2;
const DW = DOOR_W / 2;

function wallBox(w, h, d, x, y, z, mat, group) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  group.add(m);
}

function wallAlongZ(z, x0, x1, y0, h, mat, group) {
  const w = x1 - x0;
  if (w < 0.1) return;
  wallBox(w, h, WALL_THICK, (x0 + x1) / 2, y0 + h / 2, z, mat, group);
}

function wallAlongX(x, z0, z1, y0, h, mat, group) {
  const d = z1 - z0;
  if (d < 0.1) return;
  wallBox(WALL_THICK, h, d, x, y0 + h / 2, (z0 + z1) / 2, mat, group);
}

function buildWallSide(mat, group, y0, roomH, axis, fixed, range0, range1, skipDoor) {
  if (skipDoor) return;
  wallAlong(axis, range0, -DW, y0, DOOR_H, mat, group, fixed);
  wallAlong(axis, DW, range1, y0, DOOR_H, mat, group, fixed);
  wallAlong(axis, range0, range1, y0 + DOOR_H, roomH - DOOR_H, mat, group, fixed);
}

function wallAlong(axis, a0, a1, y0, h, mat, group, fixed) {
  if (axis === "z") wallAlongZ(fixed, a0, a1, y0, h, mat, group);
  else wallAlongX(fixed, a0, a1, y0, h, mat, group);
}

function buildStairs(room, materials, group, y0) {
  const steps = 5;
  const rise = FLOOR_STEP / steps;
  const run = 2.6 / steps;
  const zStart = room.feature === "stairs_down" ? HW - 2.8 : -HW + 0.4;

  for (let i = 0; i < steps; i++) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(DOOR_W - 0.2, rise, run), materials.stair);
    m.position.set(0, y0 + rise * (i + 0.5), zStart + i * run);
    group.add(m);
  }
}

export function buildRoomMesh(room, materials) {
  const group = new THREE.Group();
  const y0 = room.floorLevel * FLOOR_STEP;
  const h = room.height;
  const mat = room.isBasement ? materials.basementWall : materials.wall;
  const openSouth = room.feature === "stairs_down";
  const openNorth = room.feature === "stairs_up";

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(CELL + 0.02, CELL + 0.02),
    room.isBasement ? materials.basementFloor : materials.floor
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = y0;
  group.add(floor);

  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(CELL + 0.02, CELL + 0.02),
    materials.ceiling
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = y0 + h;
  group.add(ceiling);

  const light = new THREE.Mesh(
    new THREE.PlaneGeometry(1.4, 0.35),
    materials.lightPanel
  );
  light.rotation.x = -Math.PI / 2;
  light.position.set(0, y0 + h - 0.04, 0);
  group.add(light);

  // North
  buildWallSide(mat, group, y0, h, "z", -HW, -HW, HW, openNorth);
  // South
  buildWallSide(mat, group, y0, h, "z", HW, -HW, HW, openSouth);
  // West
  buildWallSide(mat, group, y0, h, "x", -HW, -HW, HW, false);
  // East
  buildWallSide(mat, group, y0, h, "x", HW, -HW, HW, false);

  if (room.feature) buildStairs(room, materials, group, y0);

  group.position.set(room.cx * CELL, 0, room.cz * CELL);
  group.userData.room = room;
  return group;
}
