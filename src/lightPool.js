import * as THREE from "three";
import {
  PANEL_LIGHT_INTENSITY,
  PANEL_W,
  PANEL_H,
  LIGHT_POOL_SIZE,
} from "./constants.js";

const _down = new THREE.Euler(-Math.PI / 2, 0, 0);

function releaseSlot(slot) {
  if (slot.light.parent) slot.light.parent.remove(slot.light);
  if (slot.panel) {
    slot.panel.light = null;
    slot.panel = null;
  }
  slot.mesh = null;
  slot.light.intensity = 0;
  slot.light.visible = false;
}

/** Fixed RectAreaLight pool — assigned at chunk load, never by player distance. */
export class PanelLightPool {
  constructor() {
    this.slots = [];
    for (let i = 0; i < LIGHT_POOL_SIZE; i++) {
      const light = new THREE.RectAreaLight(0xfff4d8, 0, PANEL_W, PANEL_H);
      light.rotation.copy(_down);
      light.visible = false;
      this.slots.push({ light, panel: null, mesh: null });
    }
  }

  /** Spread pool slots across all ON panels in loaded chunks (stable sort, not player distance). */
  sync(chunks) {
    const candidates = [];
    for (const { room, mesh } of chunks.values()) {
      for (const panel of room.panels) {
        if (panel.on && panel.face) {
          candidates.push({ panel, mesh, room });
        }
      }
    }

    candidates.sort(
      (a, b) =>
        a.room.cz - b.room.cz ||
        a.room.cx - b.room.cx ||
        a.panel.z - b.panel.z ||
        a.panel.x - b.panel.x
    );

    const target = [];
    const n = candidates.length;
    const slots = Math.min(LIGHT_POOL_SIZE, n);
    for (let i = 0; i < slots; i++) {
      target.push(candidates[Math.floor((i * n) / slots)]);
    }

    const targetSet = new Set(target.map((t) => t.panel));

    for (const slot of this.slots) {
      if (slot.panel && (!targetSet.has(slot.panel) || !slot.panel.face?.parent)) {
        releaseSlot(slot);
      }
    }

    const free = this.slots.filter((s) => !s.panel);
    const need = target.filter((t) => !t.panel.light);

    for (let i = 0; i < free.length && i < need.length; i++) {
      const slot = free[i];
      const { panel, mesh, room } = need[i];
      const y = room.height - 0.05;
      mesh.add(slot.light);
      slot.light.position.set(panel.x, y, panel.z);
      slot.light.rotation.copy(_down);
      slot.panel = panel;
      slot.mesh = mesh;
      panel.light = slot.light;
      slot.light.visible = true;
    }
  }

  tick(time) {
    for (const slot of this.slots) {
      if (!slot.panel) continue;
      const flicker = 0.94 + Math.sin(time * 8 + slot.panel.phase) * 0.04;
      slot.light.intensity = PANEL_LIGHT_INTENSITY * slot.panel.bright * flicker;
    }
  }
}
