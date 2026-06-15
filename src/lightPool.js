import * as THREE from "three";
import { CHUNK } from "./room.js";
import {
  PANEL_LIGHT_INTENSITY,
  PANEL_W,
  PANEL_H,
  LIGHT_POOL_SIZE,
} from "./constants.js";

const _down = new THREE.Euler(-Math.PI / 2, 0, 0);

/** RectAreaLights on the nearest ON panels — light shines from the panel face down */
export class PanelLightPool {
  constructor(scene) {
    this.lights = [];
    for (let i = 0; i < LIGHT_POOL_SIZE; i++) {
      const light = new THREE.RectAreaLight(0xfff4d8, 0, PANEL_W, PANEL_H);
      light.rotation.copy(_down);
      light.visible = false;
      scene.add(light);
      this.lights.push(light);
    }
  }

  update(playerPos, chunks, time) {
    const nearby = [];

    for (const { room } of chunks.values()) {
      const ox = room.cx * CHUNK;
      const oz = room.cz * CHUNK;
      const y = room.height - 0.05;

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

    for (let i = 0; i < this.lights.length; i++) {
      const light = this.lights[i];
      const hit = nearby[i];
      if (!hit) {
        light.intensity = 0;
        light.visible = false;
        continue;
      }
      const flicker = 0.94 + Math.sin(time * 8 + hit.panel.phase) * 0.04;
      light.position.set(hit.wx, hit.y, hit.wz);
      light.intensity = PANEL_LIGHT_INTENSITY * hit.panel.bright * flicker;
      light.visible = true;
    }
  }
}
