import * as THREE from "three";
import { CELL, HW, DOOR_H, FLOOR_STEP, WALL_THICK } from "./roomGen.js";

function wallBox(w, h, d, x, y, z, mat, group) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  group.add(m);
}

function wallAlongZ(group, z, x0, x1, y0, h, mat) {
  const w = x1 - x0;
  if (w < 0.08) return;
  wallBox(w, h, WALL_THICK, (x0 + x1) / 2, y0 + h / 2, z, mat, group);
}

function wallAlongX(group, x, z0, z1, y0, h, mat) {
  const d = z1 - z0;
  if (d < 0.08) return;
  wallBox(WALL_THICK, h, d, x, y0 + h / 2, (z0 + z1) / 2, mat, group);
}

function buildOuterWall(group, mat, y0, roomH, axis, fixed, center, span, door, open) {
  if (open) return;
  const dw = door.width / 2;
  const c = center + (door.offset || 0);
  const g0 = Math.max(center - span, c - dw);
  const g1 = Math.min(center + span, c + dw);

  if (axis === "z") {
    wallAlongZ(group, fixed, center - span, g0, y0, DOOR_H, mat);
    wallAlongZ(group, fixed, g1, center + span, y0, DOOR_H, mat);
    wallAlongZ(group, fixed, center - span, center + span, y0 + DOOR_H, roomH - DOOR_H, mat);
  } else {
    wallAlongX(group, fixed, center - span, g0, y0, DOOR_H, mat);
    wallAlongX(group, fixed, g1, center + span, y0, DOOR_H, mat);
    wallAlongX(group, fixed, center - span, center + span, y0 + DOOR_H, roomH - DOOR_H, mat);
  }
}

function buildInterior(group, room, mat, y0, h) {
  const interior = room.interior;
  if (!interior) return;

  if (interior.type === "columns" && interior.posts) {
    for (const p of interior.posts) {
      wallBox(0.5, h, 0.5, p.x, y0 + h / 2, p.z, mat, group);
    }
  }

  if (interior.type === "mat") {
    const matMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(interior.size, interior.size),
      new THREE.MeshLambertMaterial({ color: 0x6a5a42 })
    );
    matMesh.rotation.x = -Math.PI / 2;
    matMesh.position.set(0, y0 + 0.02, 0);
    group.add(matMesh);
  }

  for (const p of interior.walls || []) {
    if (p.axis === "z") {
      const z = p.z1;
      const x0 = Math.min(p.x1, p.x2);
      const x1 = Math.max(p.x1, p.x2);
      if (p.door) {
        const mid = (x0 + x1) / 2;
        wallAlongZ(group, z, x0, mid - 0.9, y0, DOOR_H, mat);
        wallAlongZ(group, z, mid + 0.9, x1, y0, DOOR_H, mat);
        wallAlongZ(group, z, x0, x1, y0 + DOOR_H, h - DOOR_H, mat);
      } else {
        wallAlongZ(group, z, x0, x1, y0, h, mat);
      }
    } else {
      const x = p.x1;
      const z0 = Math.min(p.z1, p.z2);
      const z1 = Math.max(p.z1, p.z2);
      if (p.door) {
        const mid = (z0 + z1) / 2;
        wallAlongX(group, x, z0, mid - 0.9, y0, DOOR_H, mat);
        wallAlongX(group, x, mid + 0.9, z1, y0, DOOR_H, mat);
        wallAlongX(group, x, z0, z1, y0 + DOOR_H, h - DOOR_H, mat);
      } else {
        wallAlongX(group, x, z0, z1, y0, h, mat);
      }
    }
  }
}

function buildStairs(room, materials, group, y0) {
  const steps = 5;
  const rise = FLOOR_STEP / steps;
  const run = 2.8 / steps;
  const south = room.feature === "stairs_south";
  const zStart = south ? HW - 3 : -HW + 0.5;

  for (let i = 0; i < steps; i++) {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, rise, run),
      materials.stair
    );
    m.position.set(0, y0 + rise * (i + 0.5), zStart + (south ? i : -i) * run);
    group.add(m);
  }
}

export function buildRoomMesh(room, materials) {
  const group = new THREE.Group();
  const y0 = room.floorLevel * FLOOR_STEP;
  const h = room.height;
  const mat = room.isBasement ? materials.basementWall : materials.wall;
  const ox = 0;
  const oz = 0;

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(CELL + 0.04, CELL + 0.04),
    room.isBasement ? materials.basementFloor : materials.floor
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = y0;
  group.add(floor);

  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(CELL + 0.04, CELL + 0.04),
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

  buildOuterWall(group, mat, y0, h, "z", oz - HW, ox, HW, room.doors.north, room.doors.north.open);
  buildOuterWall(group, mat, y0, h, "z", oz + HW, ox, HW, room.doors.south, room.doors.south.open);
  buildOuterWall(group, mat, y0, h, "x", ox - HW, oz, HW, room.doors.west, room.doors.west.open);
  buildOuterWall(group, mat, y0, h, "x", ox + HW, oz, HW, room.doors.east, room.doors.east.open);

  buildInterior(group, room, mat, y0, h);

  if (room.feature) buildStairs(room, materials, group, y0);

  group.position.set(room.cx * CELL, 0, room.cz * CELL);
  group.userData.room = room;
  return group;
}
