import * as THREE from "three";
import { CHUNK, roomLitStrength } from "./room.js";
import {
  WALL_T,
  DOOR_H,
  LIGHT_PANEL_COLOR,
  LIGHT_PANEL_OFF_COLOR,
  PANEL_EMISSIVE_INTENSITY,
  PANEL_W,
  PANEL_H,
  PANEL_RECESS_DEPTH,
  CEILING_COLOR,
  CEILING_EMISSIVE_MIN,
  CEILING_EMISSIVE_MAX,
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

function addFlushPanel(group, panel, h) {
  const emissive = new THREE.Color(LIGHT_PANEL_COLOR);
  const y = h - PANEL_RECESS_DEPTH;

  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(PANEL_W, PANEL_H),
    new THREE.MeshStandardMaterial({
      color: panel.on ? LIGHT_PANEL_COLOR : LIGHT_PANEL_OFF_COLOR,
      emissive,
      emissiveIntensity: panel.on ? PANEL_EMISSIVE_INTENSITY * panel.bright : 0,
      roughness: 0.12,
      metalness: 0,
    })
  );
  face.rotation.x = Math.PI / 2;
  face.position.set(panel.x, y, panel.z);
  face.renderOrder = 1;
  face.userData.panel = panel;
  group.add(face);
}

export function buildRoomMesh(room, materials) {
  const group = new THREE.Group();
  const h = room.height;
  const strength = roomLitStrength(room);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(CHUNK, CHUNK), materials.carpet.clone());
  floor.rotation.x = -Math.PI / 2;
  group.add(floor);

  const ceilingMat = materials.ceiling.clone();
  ceilingMat.emissive = new THREE.Color(CEILING_COLOR);
  ceilingMat.emissiveIntensity =
    CEILING_EMISSIVE_MIN + strength * (CEILING_EMISSIVE_MAX - CEILING_EMISSIVE_MIN);
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(CHUNK, CHUNK), ceilingMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = h;
  ceiling.userData.ceiling = true;
  group.add(ceiling);

  for (const panel of room.panels) {
    addFlushPanel(group, panel, h);
  }

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
