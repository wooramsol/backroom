import * as THREE from "three";
import { CELL, HW } from "./room.js";
import { WALL_T, DOOR_H } from "./constants.js";
import { createTiledMaterial } from "./textures.js";

function wallSeg(group, wallTex, y0, h, axis, pos, a0, a1, door) {
  const len = a1 - a0;
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
    add(a0, mid - dw, DOOR_H, y0);
    add(mid + dw, a1, DOOR_H, y0);
    add(a0, a1, h - DOOR_H, y0 + DOOR_H);
  } else {
    add(a0, a1, h, y0);
  }
}

function fract(n) {
  return n - Math.floor(n);
}

function addCeilingLights(group, room, lightMat, time) {
  const h = room.height;
  const hash = (x) => fract(Math.sin(x * 12.9898 + room.lightSeed) * 43758.5453);
  const spacing = 2.4;
  const flicker = 0.88 + Math.sin(time * 8 + room.flicker) * 0.06 + Math.sin(time * 13.7) * 0.03;

  for (let x = -HW + spacing / 2; x < HW; x += spacing) {
    for (let z = -HW + spacing / 2; z < HW; z += spacing) {
      if (hash(x * 3.1 + z) < 0.12) continue;
      const panel = new THREE.Mesh(
        new THREE.PlaneGeometry(1.15, 0.42),
        lightMat.clone()
      );
      panel.material.emissiveIntensity = flicker * (0.9 + hash(z) * 0.15);
      panel.rotation.x = Math.PI / 2;
      panel.position.set(x, h - 0.06, z);
      group.add(panel);
    }
  }
}

export function buildRoomMesh(room, materials, time = 0) {
  const group = new THREE.Group();
  const h = room.height;
  const y0 = 0;
  const span = HW;

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(CELL, CELL),
    materials.carpet
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = y0;
  group.add(floor);

  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(CELL, CELL),
    materials.ceiling
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = h;
  group.add(ceiling);

  addCeilingLights(group, room, materials.lightPanel, time);

  const wt = materials.wallTex;
  wallSeg(group, wt, y0, h, "z", -span, -span, span, room.doors.north);
  wallSeg(group, wt, y0, h, "z", span, -span, span, room.doors.south);
  wallSeg(group, wt, y0, h, "x", -span, -span, span, room.doors.west);
  wallSeg(group, wt, y0, h, "x", span, -span, span, room.doors.east);

  const baseboardH = 0.12;
  const baseGeo = new THREE.BoxGeometry(CELL, baseboardH, 0.06);
  const baseMat = materials.baseboard;
  for (const z of [-span + 0.04, span - 0.04]) {
    const b = new THREE.Mesh(baseGeo, baseMat);
    b.position.set(0, baseboardH / 2, z);
    group.add(b);
  }
  const baseGeoZ = new THREE.BoxGeometry(0.06, baseboardH, CELL);
  for (const x of [-span + 0.04, span - 0.04]) {
    const b = new THREE.Mesh(baseGeoZ, baseMat);
    b.position.set(x, baseboardH / 2, 0);
    group.add(b);
  }

  group.position.set(room.cx * CELL, 0, room.cz * CELL);
  group.userData.room = room;
  return group;
}
