import * as THREE from "three";
import { CHUNK, roomLitStrength } from "./room.js";
import {
  ROOM_POINT_INTENSITY,
  ROOM_POINT_DISTANCE,
  PANEL_POINT_INTENSITY,
  PANEL_POINT_DISTANCE,
  PANEL_RECESS_DEPTH,
  ROOM_LIGHT_POOL,
  PANEL_LIGHT_POOL,
} from "./constants.js";

const ROOM_RADIUS = 1;

/** PointLight pools — nearby rooms + nearest ON panels only */
export class PanelLightPool {
  constructor(scene) {
    this.roomLights = [];
    this.panelLights = [];
    for (let i = 0; i < ROOM_LIGHT_POOL; i++) {
      const l = new THREE.PointLight(0xfff8e8, 0, ROOM_POINT_DISTANCE, 2);
      l.visible = false;
      scene.add(l);
      this.roomLights.push(l);
    }
    for (let i = 0; i < PANEL_LIGHT_POOL; i++) {
      const l = new THREE.PointLight(0xfffdf5, 0, PANEL_POINT_DISTANCE, 2);
      l.visible = false;
      scene.add(l);
      this.panelLights.push(l);
    }
  }

  update(playerPos, chunks, time) {
    const pcx = Math.floor(playerPos.x / CHUNK);
    const pcz = Math.floor(playerPos.z / CHUNK);

    const nearRooms = [];
    for (const chunk of chunks.values()) {
      const { room } = chunk;
      if (Math.abs(room.cx - pcx) > ROOM_RADIUS || Math.abs(room.cz - pcz) > ROOM_RADIUS) {
        continue;
      }
      const strength = roomLitStrength(room);
      if (strength < 0.06) continue;
      const ox = room.cx * CHUNK + CHUNK / 2;
      const oz = room.cz * CHUNK + CHUNK / 2;
      const dx = ox - playerPos.x;
      const dz = oz - playerPos.z;
      nearRooms.push({ ox, oz, y: room.height - 0.02, strength, dist: dx * dx + dz * dz });
    }
    nearRooms.sort((a, b) => a.dist - b.dist);

    for (let i = 0; i < this.roomLights.length; i++) {
      const light = this.roomLights[i];
      const hit = nearRooms[i];
      if (!hit) {
        light.intensity = 0;
        light.visible = false;
        continue;
      }
      light.position.set(hit.ox, hit.y, hit.oz);
      light.intensity = hit.strength * ROOM_POINT_INTENSITY;
      light.visible = true;
    }

    const nearby = [];
    for (const { room } of chunks.values()) {
      if (Math.abs(room.cx - pcx) > ROOM_RADIUS || Math.abs(room.cz - pcz) > ROOM_RADIUS) {
        continue;
      }
      const ox = room.cx * CHUNK;
      const oz = room.cz * CHUNK;
      const y = room.height - PANEL_RECESS_DEPTH;
      for (const panel of room.panels) {
        if (!panel.on) continue;
        const wx = ox + panel.x;
        const wz = oz + panel.z;
        const dx = wx - playerPos.x;
        const dz = wz - playerPos.z;
        nearby.push({ wx, y, wz, dist: dx * dx + dz * dz, panel });
      }
    }
    nearby.sort((a, b) => a.dist - b.dist);

    for (let i = 0; i < this.panelLights.length; i++) {
      const light = this.panelLights[i];
      const hit = nearby[i];
      if (!hit) {
        light.intensity = 0;
        light.visible = false;
        continue;
      }
      const flicker = 0.95 + Math.sin(time * 8 + hit.panel.phase) * 0.03;
      light.position.set(hit.wx, hit.y, hit.wz);
      light.intensity = PANEL_POINT_INTENSITY * hit.panel.bright * flicker;
      light.visible = true;
    }
  }
}
