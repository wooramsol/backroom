import * as THREE from "three";
import { CHUNK } from "./room.js";
import {
  WALL_T,
  DOOR_H,
  LIGHT_PANEL_COLOR,
  LIGHT_PANEL_OFF_COLOR,
  LIGHT_PANEL_INTENSITY,
  PANEL_LIGHT_INTENSITY,
  PANEL_W,
  PANEL_H,
  CEILING_EMISSIVE_INTENSITY,
  CARPET_COLOR,
} from "./constants.js";
import { createTiledMaterial, tiledAt, CARPET_TILE_M } from "./textures.js";

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

const _down = new THREE.Euler(-Math.PI / 2, 0, 0);

function addCeilingPanels(group, room, lightMat, h) {
  const offColor = new THREE.Color(LIGHT_PANEL_OFF_COLOR);
  const onColor = new THREE.Color(LIGHT_PANEL_COLOR);
  const y = h - 0.05;
  const panelLights = [];

  for (const panel of room.panels) {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(PANEL_W, PANEL_H), lightMat.clone());
    if (panel.on) {
      mesh.material.color.copy(onColor).multiplyScalar(LIGHT_PANEL_INTENSITY * panel.bright);
      const light = new THREE.RectAreaLight(
        0xfff4d8,
        PANEL_LIGHT_INTENSITY * panel.bright,
        PANEL_W,
        PANEL_H
      );
      light.position.set(panel.x, y, panel.z);
      light.rotation.copy(_down);
      light.userData.panel = panel;
      panel.light = light;
      group.add(light);
      panelLights.push(light);
    } else {
      mesh.material.color.copy(offColor);
    }
    mesh.userData.fluorescent = true;
    mesh.userData.panel = panel;
    panel.face = mesh;
    mesh.rotation.x = Math.PI / 2;
    mesh.position.set(panel.x, y, panel.z);
    group.add(mesh);
  }

  return panelLights;
}

export function buildRoomMesh(room, materials) {
  const group = new THREE.Group();
  const h = room.height;

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(CHUNK, CHUNK), materials.carpet.clone());
  floor.rotation.x = -Math.PI / 2;
  group.add(floor);

  const worldX = room.cx * CHUNK;
  const worldZ = room.cz * CHUNK;
  const ceilingMap = tiledAt(materials.carpetTex, CARPET_TILE_M, CHUNK, CHUNK, worldX, worldZ);
  const ceilingMat = materials.carpet.clone();
  ceilingMat.map = ceilingMap;
  ceilingMat.emissive = new THREE.Color(CARPET_COLOR);
  ceilingMat.emissiveMap = ceilingMap;
  ceilingMat.emissiveIntensity = CEILING_EMISSIVE_INTENSITY;
  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(CHUNK, CHUNK), ceilingMat);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = h;
  group.add(ceiling);

  const panelLights = addCeilingPanels(group, room, materials.lightPanel, h);

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
  group.userData.panelLights = panelLights;
  return group;
}
