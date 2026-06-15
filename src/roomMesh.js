import * as THREE from "three";
import { CHUNK } from "./room.js";
import {
  WALL_T,
  DOOR_H,
  LIGHT_PANEL_COLOR,
  LIGHT_PANEL_OFF_COLOR,
  LIGHT_PANEL_INTENSITY,
  ROOM_POINT_INTENSITY,
  ROOM_POINT_DISTANCE,
  ROOM_POINT_DECAY,
} from "./constants.js";
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

/** Glowing panel mesh — visual only; room PointLights do the actual illumination */
function addCeilingPanels(group, room, lightMat) {
  const h = room.height;
  const hash = (x) => fract(Math.sin(x * 12.9898 + room.lightSeed) * 43758.5453);
  const spacing = room.lightSpacing || 2.5;
  const on = room.lightsOn;
  const panelColor = new THREE.Color(on ? LIGHT_PANEL_COLOR : LIGHT_PANEL_OFF_COLOR);

  for (let x = room.westOff + spacing / 2; x < CHUNK; x += spacing) {
    for (let z = room.northOff + spacing / 2; z < CHUNK; z += spacing) {
      if (hash(x * 3.1 + z) < 0.1) continue;

      const panel = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 0.42), lightMat.clone());
      const bright = on ? LIGHT_PANEL_INTENSITY * (0.92 + hash(z) * 0.12) : 1;
      panel.material.color.copy(panelColor);
      if (on) panel.material.color.multiplyScalar(bright);
      panel.userData.fluorescent = true;
      panel.rotation.x = Math.PI / 2;
      panel.position.set(x, h - 0.05, z);
      group.add(panel);
    }
  }
}

/** A few ceiling fixtures per lit room — stays within WebGL light limits */
function addRoomPointLights(group, room, h) {
  if (!room.lightsOn) return;

  const x0 = room.westOff + 2;
  const x1 = CHUNK - 2;
  const z0 = room.northOff + 2;
  const z1 = CHUNK - 2;
  const spots = [
    [(x0 + x1) * 0.5, (z0 + z1) * 0.5],
    [x0 + 1.2, z1 - 1.2],
  ];

  for (const [x, z] of spots) {
    const bulb = new THREE.PointLight(
      0xfff4d8,
      ROOM_POINT_INTENSITY,
      ROOM_POINT_DISTANCE,
      ROOM_POINT_DECAY
    );
    bulb.position.set(x, h - 0.12, z);
    bulb.userData.roomLight = true;
    bulb.userData.baseIntensity = ROOM_POINT_INTENSITY;
    group.add(bulb);
  }
}

export function buildRoomMesh(room, materials) {
  const group = new THREE.Group();
  const h = room.height;

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(CHUNK, CHUNK), materials.carpet.clone());
  floor.rotation.x = -Math.PI / 2;
  group.add(floor);

  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(CHUNK, CHUNK), materials.ceiling.clone());
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = h;
  group.add(ceiling);

  addCeilingPanels(group, room, materials.lightPanel);
  addRoomPointLights(group, room, h);

  const wt = materials.wallTex;
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
