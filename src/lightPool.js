import * as THREE from "three";
import { CHUNK } from "./room.js";
import {
  PANEL_LIGHT_INTENSITY,
  PANEL_CEILING_INTENSITY,
  PANEL_CEILING_SPREAD,
  PANEL_W,
  PANEL_H,
  PANEL_RECESS_DEPTH,
  LIGHT_POOL_SIZE,
} from "./constants.js";

const _down = new THREE.Euler(-Math.PI / 2, 0, 0);
const _up = new THREE.Euler(Math.PI / 2, 0, 0);
const HALF = LIGHT_POOL_SIZE / 2;

/** Downward panel area lights + upward ceiling bounce per ON fixture */
export class PanelLightPool {
  constructor(scene) {
    this.down = [];
    this.ceil = [];
    for (let i = 0; i < HALF; i++) {
      const d = new THREE.RectAreaLight(0xfff4d8, 0, PANEL_W, PANEL_H);
      d.rotation.copy(_down);
      d.visible = false;
      scene.add(d);
      this.down.push(d);

      const c = new THREE.RectAreaLight(
        0xfff4d8,
        0,
        PANEL_W + PANEL_CEILING_SPREAD,
        PANEL_H + PANEL_CEILING_SPREAD
      );
      c.rotation.copy(_up);
      c.visible = false;
      scene.add(c);
      this.ceil.push(c);
    }
  }

  update(playerPos, chunks, time) {
    const nearby = [];

    for (const { room } of chunks.values()) {
      const ox = room.cx * CHUNK;
      const oz = room.cz * CHUNK;
      const yDown = room.height - PANEL_RECESS_DEPTH;
      const yCeil = room.height - 0.006;

      for (const panel of room.panels) {
        if (!panel.on) continue;
        const wx = ox + panel.x;
        const wz = oz + panel.z;
        const dx = wx - playerPos.x;
        const dz = wz - playerPos.z;
        nearby.push({ wx, yDown, yCeil, wz, dist: dx * dx + dz * dz, panel });
      }
    }

    nearby.sort((a, b) => a.dist - b.dist);

    for (let i = 0; i < HALF; i++) {
      const hit = nearby[i];
      const down = this.down[i];
      const ceil = this.ceil[i];
      if (!hit) {
        down.intensity = 0;
        down.visible = false;
        ceil.intensity = 0;
        ceil.visible = false;
        continue;
      }
      const flicker = 0.94 + Math.sin(time * 8 + hit.panel.phase) * 0.04;
      const mul = hit.panel.bright * flicker;

      down.position.set(hit.wx, hit.yDown, hit.wz);
      down.intensity = PANEL_LIGHT_INTENSITY * mul;
      down.visible = true;

      ceil.position.set(hit.wx, hit.yCeil, hit.wz);
      ceil.intensity = PANEL_CEILING_INTENSITY * mul;
      ceil.visible = true;
    }
  }
}
