import * as THREE from "three";
import { CHUNK } from "./room.js";
import { WALL_T, DOOR_H } from "./constants.js";
import { createTiledMaterial } from "./textures.js";

function wallSeg(group, wallTex, y0, h, axis, pos, a0, a1, door) {
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
  const flicker = 0.88 + Math.sin(time * 8 + room.flicker) * 0.06;
  const x0 = room.westOff - CHUNK / 2;
  const z0 = room.northOff - CHUNK / 2;
  const x1 = CHUNK / 2;
  const z1 = CHUNK / 2;
  const spacing = 2.5;

  for (let x = x0 + spacing / 2; x < x1; x += spacing) {
    for (let z = z0 + spacing / 2; z < z1; z += spacing) {
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
  const ox = room.westOff - CHUNK / 2;
  const oz = room.northOff - CHUNK / 2;
  const w = room.width;
  const d = room.depth;
  const cx = ox + w / 2;
  const cz = oz + d / 2;

  // Full chunk floor — flat through doorways (no threshold)
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
  const hw = CHUNK / 2;

  // Chunk boundary walls (neighbor connections)
  wallSeg(group, wt, 0, h, "z", -hw, -hw, hw, room.doors.north);
  wallSeg(group, wt, 0, h, "z", hw, -hw, hw, room.doors.south);
  wallSeg(group, wt, 0, h, "x", -hw, -hw, hw, room.doors.west);
  wallSeg(group, wt, 0, h, "x", hw, -hw, hw, room.doors.east);

  // Inner walls — vary effective room size
  if (room.doors.innerWest) {
    const zA = oz;
    const zB = oz + d;
    wallSeg(group, wt, 0, h, "x", ox, zA, zB, room.doors.innerWest);
  }
  if (room.doors.innerNorth) {
    const xA = ox;
    const xB = ox + w;
    wallSeg(group, wt, 0, h, "z", oz, xA, xB, room.doors.innerNorth);
  }

  group.position.set(room.cx * CHUNK, 0, room.cz * CHUNK);
  group.userData.room = room;
  return group;
}
