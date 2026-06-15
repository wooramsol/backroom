import * as THREE from "three";
import { CHUNK, roomLitStrength } from "./room.js";
import {
  PANEL_LIGHT_INTENSITY,
  ROOM_FILL_INTENSITY,
  ROOM_FILL_SIZE,
  PANEL_W,
  PANEL_H,
  PANEL_RECESS_DEPTH,
  PANEL_LIGHT_POOL,
} from "./constants.js";

const _down = new THREE.Euler(-Math.PI / 2, 0, 0);
const MAX_ROOMS = 30;

/** Room-wide soft fill + per-panel recessed area lights */
export class PanelLightPool {
  constructor(scene) {
    this.roomFills = [];
    this.panelDown = [];
    for (let i = 0; i < MAX_ROOMS; i++) {
      const fill = new THREE.RectAreaLight(0xfff8e8, 0, ROOM_FILL_SIZE, ROOM_FILL_SIZE);
      fill.rotation.copy(_down);
      fill.visible = false;
      scene.add(fill);
      this.roomFills.push(fill);
    }
    for (let i = 0; i < PANEL_LIGHT_POOL; i++) {
      const d = new THREE.RectAreaLight(0xfffdf5, 0, PANEL_W, PANEL_H);
      d.rotation.copy(_down);
      d.visible = false;
      scene.add(d);
      this.panelDown.push(d);
    }
  }

  update(playerPos, chunks, time) {
    const nearby = [];
    const rooms = [...chunks.values()];
    rooms.sort((a, b) => {
      const ax = a.room.cx * CHUNK + CHUNK / 2 - playerPos.x;
      const az = a.room.cz * CHUNK + CHUNK / 2 - playerPos.z;
      const bx = b.room.cx * CHUNK + CHUNK / 2 - playerPos.x;
      const bz = b.room.cz * CHUNK + CHUNK / 2 - playerPos.z;
      return ax * ax + az * az - (bx * bx + bz * bz);
    });

    for (let i = 0; i < this.roomFills.length; i++) {
      const fill = this.roomFills[i];
      const chunk = rooms[i];
      if (!chunk) {
        fill.intensity = 0;
        fill.visible = false;
        continue;
      }
      const { room } = chunk;
      const strength = roomLitStrength(room);
      const ox = room.cx * CHUNK;
      const oz = room.cz * CHUNK;
      fill.position.set(ox + CHUNK / 2, room.height - 0.008, oz + CHUNK / 2);
      fill.intensity = strength * ROOM_FILL_INTENSITY;
      fill.visible = strength > 0.06;
    }

    for (const { room } of chunks.values()) {
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

    for (let i = 0; i < this.panelDown.length; i++) {
      const light = this.panelDown[i];
      const hit = nearby[i];
      if (!hit) {
        light.intensity = 0;
        light.visible = false;
        continue;
      }
      const flicker = 0.95 + Math.sin(time * 8 + hit.panel.phase) * 0.03;
      light.position.set(hit.wx, hit.y, hit.wz);
      light.intensity = PANEL_LIGHT_INTENSITY * hit.panel.bright * flicker;
      light.visible = true;
    }
  }
}
