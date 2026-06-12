import * as THREE from "three";
import { CELL, HW, DOOR_H, FLOOR_STEP } from "./roomGen.js";
import {
  createTiledMaterial,
  setSurfaceRepeat,
  CARPET_TILE_M,
  CEILING_TILE_M,
} from "./textures.js";

function wallBox(w, h, d, x, y, z, mat, group) {
  const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
  m.position.set(x, y, z);
  group.add(m);
}

function wallAlongZ(group, z, x0, x1, y0, h, mat) {
  const w = x1 - x0;
  if (w < 0.08) return;
  wallBox(w, h, 0.12, (x0 + x1) / 2, y0 + h / 2, z, mat, group);
}

function wallAlongX(group, x, z0, z1, y0, h, mat) {
  const d = z1 - z0;
  if (d < 0.08) return;
  wallBox(0.12, h, d, x, y0 + h / 2, (z0 + z1) / 2, mat, group);
}

function wallSegment(group, wallTex, matOpts, y0, roomH, v0, v1, door, open) {
  if (open) return;
  const x0 = v0[0];
  const z0 = v0[1];
  const x1 = v1[0];
  const z1 = v1[1];
  const off = door?.offset || 0;

  if (Math.abs(z1 - z0) < 0.05) {
    const z = z0;
    const xa = Math.min(x0, x1);
    const xb = Math.max(x0, x1);
    const mid = (xa + xb) / 2 + off;
    const dw = door ? door.width / 2 : 0;
    if (door) {
      wallAlongZ(group, z, xa, mid - dw, y0, DOOR_H, createTiledMaterial(wallTex, mid - dw - xa, DOOR_H, matOpts));
      wallAlongZ(group, z, mid + dw, xb, y0, DOOR_H, createTiledMaterial(wallTex, xb - mid - dw, DOOR_H, matOpts));
      wallAlongZ(group, z, xa, xb, y0 + DOOR_H, roomH - DOOR_H, createTiledMaterial(wallTex, xb - xa, roomH - DOOR_H, matOpts));
    } else {
      wallAlongZ(group, z, xa, xb, y0, roomH, createTiledMaterial(wallTex, xb - xa, roomH, matOpts));
    }
  } else if (Math.abs(x1 - x0) < 0.05) {
    const x = x0;
    const za = Math.min(z0, z1);
    const zb = Math.max(z0, z1);
    const mid = (za + zb) / 2 + off;
    const dw = door ? door.width / 2 : 0;
    if (door) {
      wallAlongX(group, x, za, mid - dw, y0, DOOR_H, createTiledMaterial(wallTex, mid - dw - za, DOOR_H, matOpts));
      wallAlongX(group, x, mid + dw, zb, y0, DOOR_H, createTiledMaterial(wallTex, zb - mid - dw, DOOR_H, matOpts));
      wallAlongX(group, x, za, zb, y0 + DOOR_H, roomH - DOOR_H, createTiledMaterial(wallTex, zb - za, roomH - DOOR_H, matOpts));
    } else {
      wallAlongX(group, x, za, zb, y0, roomH, createTiledMaterial(wallTex, zb - za, roomH, matOpts));
    }
  }
}

function buildWalls(group, room, wallTex, matOpts, y0, h) {
  const doorFor = (b) =>
    b === "n" ? room.doors.north : b === "s" ? room.doors.south : b === "e" ? room.doors.east : room.doors.west;

  const openFor = (b) => doorFor(b)?.open || false;

  for (const edge of room.edges) {
    const door = edge.boundary ? doorFor(edge.boundary) : null;
    wallSegment(group, wallTex, matOpts, y0, h, edge.v0, edge.v1, door, openFor(edge.boundary));
  }
}

function buildDecor(group, room, wallTex, matOpts, y0, h) {
  const d = room.shape.decor;
  if (!d || d.type === "none") return;

  if (d.type === "pillars") {
    for (const p of d.posts) {
      wallBox(0.45, h, 0.45, p.x, y0 + h / 2, p.z, createTiledMaterial(wallTex, 0.45, h, matOpts), group);
    }
  }
  if (d.type === "mat") {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(d.size, d.size),
      new THREE.MeshLambertMaterial({ color: 0x6a5a42 })
    );
    m.rotation.x = -Math.PI / 2;
    m.position.set(0, y0 + 0.02, 0);
    group.add(m);
  }
  if (d.type === "corner") {
    const hw = d.w / 2;
    const hd = d.d / 2;
    wallAlongZ(group, d.z - hd, d.x - hw, d.x + hw, y0, h * 0.5, createTiledMaterial(wallTex, d.w, h * 0.5, matOpts));
    wallAlongX(group, d.x - hw, d.z - hd, d.z + hd, y0, h * 0.5, createTiledMaterial(wallTex, d.d, h * 0.5, matOpts));
  }
  if (d.type === "cross") {
    wallAlongZ(group, 0, -d.len, d.len, y0, h * 0.35, createTiledMaterial(wallTex, d.len * 2, h * 0.35, matOpts));
    wallAlongX(group, 0, -d.len, d.len, y0, h * 0.35, createTiledMaterial(wallTex, d.len * 2, h * 0.35, matOpts));
  }
  if (d.type === "island") {
    wallAlongZ(group, d.z, d.x - d.w / 2, d.x + d.w / 2, y0, h * 0.85, createTiledMaterial(wallTex, d.w, h * 0.85, matOpts));
    wallAlongZ(group, d.z + d.d, d.x - d.w / 2, d.x + d.w / 2, y0, h * 0.85, createTiledMaterial(wallTex, d.w, h * 0.85, matOpts));
    wallAlongX(group, d.x - d.w / 2, d.z, d.z + d.d, y0, h * 0.85, createTiledMaterial(wallTex, d.d, h * 0.85, matOpts));
    wallAlongX(group, d.x + d.w / 2, d.z, d.z + d.d, y0, h * 0.85, createTiledMaterial(wallTex, d.d, h * 0.85, matOpts));
  }
}

function buildStairs(room, materials, group, y0) {
  if (!room.stair) return;
  const steps = 7;
  const rise = FLOOR_STEP / steps;
  const run = 2.8 / steps;
  const dir = room.stair.dir;

  for (let i = 0; i < steps; i++) {
    const m = new THREE.Mesh(new THREE.BoxGeometry(3, rise, run + 0.02), materials.stair);
    let x = 0;
    let z = 0;
    if (dir === "south") z = 1.2 + i * run;
    else if (dir === "north") z = -(1.2 + i * run);
    else if (dir === "east") x = 1.2 + i * run;
    else if (dir === "west") x = -(1.2 + i * run);
    m.position.set(x, y0 + rise * (i + 0.5), z);
    group.add(m);
  }

  const arrow = new THREE.Mesh(new THREE.PlaneGeometry(0.8, 0.25), materials.stairSign);
  arrow.position.set(0, y0 + 1.5, 0);
  if (dir === "south") {
    arrow.position.z = 2.6;
  } else if (dir === "north") {
    arrow.position.z = -2.6;
    arrow.rotation.y = Math.PI;
  } else if (dir === "east") {
    arrow.position.set(2.6, y0 + 1.5, 0);
    arrow.rotation.y = -Math.PI / 2;
  } else {
    arrow.position.set(-2.6, y0 + 1.5, 0);
    arrow.rotation.y = Math.PI / 2;
  }
  group.add(arrow);
}

export function buildRoomMesh(room, materials) {
  const group = new THREE.Group();
  const y0 = room.floorLevel * FLOOR_STEP;
  const h = room.height;
  const wallTex = materials.wallTex;
  const matOpts = room.isBasement ? { color: 0x9a9078 } : {};

  const floorTex = room.isBasement ? materials.basementFloorTex : materials.carpetTex;
  const floorMat = new THREE.MeshLambertMaterial({
    map: setSurfaceRepeat(floorTex.clone(), CARPET_TILE_M, CELL, CELL),
    side: THREE.DoubleSide,
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(CELL + 0.04, CELL + 0.04), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = y0;
  group.add(floor);

  const ceilMat = new THREE.MeshLambertMaterial({
    map: setSurfaceRepeat(materials.ceilingTex.clone(), CEILING_TILE_M, CELL, CELL),
    side: THREE.DoubleSide,
  });
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(CELL + 0.04, CELL + 0.04), ceilMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = y0 + h;
  group.add(ceiling);

  const light = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.35), materials.lightPanel);
  light.rotation.x = -Math.PI / 2;
  light.position.set(0, y0 + h - 0.04, 0);
  group.add(light);

  buildWalls(group, room, wallTex, matOpts, y0, h);
  buildDecor(group, room, wallTex, matOpts, y0, h);
  buildStairs(room, materials, group, y0);

  group.position.set(room.cx * CELL, 0, room.cz * CELL);
  return group;
}
