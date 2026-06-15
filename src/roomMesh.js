import * as THREE from "three";
import { CHUNK } from "./room.js";
import { WALL_T, DOOR_H } from "./constants.js";
import { createTiledMaterial } from "./textures.js";

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

function fract(n) {
  return n - Math.floor(n);
}

function addCeilingLights(group, room, lightMat, time) {
  const h = room.height;
  const hash = (x) => fract(Math.sin(x * 12.9898 + room.lightSeed) * 43758.5453);
  const flicker = 0.88 + Math.sin(time * 8 + room.flicker) * 0.06;
  const spacing = 2.5;

  for (let x = room.westOff + spacing / 2; x < CHUNK; x += spacing) {
    for (let z = room.northOff + spacing / 2; z < CHUNK; z += spacing) {
      if (hash(x * 3.1 + z) < 0.1) continue;
      const panel = new THREE.Mesh(
        new THREE.PlaneGeometry(1.15, 0.42),
        lightMat.clone()
      );
      panel.material.emissiveIntensity = flicker * (0.9 + hash(z) * 0.15);
      panel.rotation.x = Math.PI / 2;
      panel.position.set(x, h - 0.05, z);
      group.add(panel);
    }
  }
}

export function buildRoomMesh(room, materials, time = 0) {
  const group = new THREE.Group();
  const h = room.height;

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(CHUNK, CHUNK),
    materials.carpet
  );
  floor.rotation.x = -Math.PI / 2;
  group.add(floor);

  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(CHUNK, CHUNK),
    materials.ceiling
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = h;
  group.add(ceiling);

  addCeilingLights(group, room, materials.lightPanel, time);

  const wt = materials.wallTex;

  // Local coords 0 … CHUNK — matches collision exactly
  wallSeg(group, wt, h, "z", 0, 0, CHUNK, room.doors.north);
  wallSeg(group, wt, h, "z", CHUNK, 0, CHUNK, room.doors.south);
  wallSeg(group, wt, h, "x", 0, 0, CHUNK, room.doors.west);
  wallSeg(group, wt, h, "x", CHUNK, 0, CHUNK, room.doors.east);

  if (room.doors.innerWest) {
    wallSeg(group, wt, h, "x", room.westOff, room.northOff, CHUNK, room.doors.innerWest);
  }
  if (room.doors.innerNorth) {
    wallSeg(group, wt, h, "z", room.northOff, room.westOff, CHUNK, room.doors.innerNorth);
  }

  group.position.set(room.cx * CHUNK, 0, room.cz * CHUNK);
  group.userData.room = room;
  return group;
}
