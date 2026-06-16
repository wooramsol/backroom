import * as THREE from "three";
import {
  PANEL_LIGHT_INTENSITY,
  PANEL_W,
  PANEL_H,
  LIGHT_POOL_SIZE,
} from "./constants.js";

const _down = new THREE.Euler(-Math.PI / 2, 0, 0);

function spreadPick(sorted, count) {
  if (count >= sorted.length) return sorted;
  const picked = [];
  for (let i = 0; i < count; i++) {
    picked.push(sorted[Math.floor((i * sorted.length) / count)]);
  }
  return picked;
}

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

/** RectAreaLights bound to ceiling panel fixtures — never stolen between rooms. */
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

  _onPanels(room) {
    return room.panels
      .filter((p) => p.on && p.face)
      .sort((a, b) => a.z - b.z || a.x - b.x);
  }

  _bind(slot, panel, mesh, room) {
    const y = room.height - 0.05;
    mesh.add(slot.light);
    slot.light.position.set(panel.x, y, panel.z);
    slot.light.rotation.copy(_down);
    slot.panel = panel;
    slot.mesh = mesh;
    panel.light = slot.light;
    slot.light.visible = true;
  }

  /** One-time fair spread when the world boots (all chunks known upfront). */
  distributeFair(entries) {
    const all = [];
    for (const { room, mesh } of entries) {
      for (const panel of this._onPanels(room)) {
        all.push({ panel, mesh, room });
      }
    }

    all.sort(
      (a, b) =>
        a.room.cz - b.room.cz ||
        a.room.cx - b.room.cx ||
        a.panel.z - b.panel.z ||
        a.panel.x - b.panel.x
    );

    const free = this.slots.filter((s) => !s.panel);
    const picked = spreadPick(all, Math.min(LIGHT_POOL_SIZE, all.length, free.length));
    for (let i = 0; i < picked.length; i++) {
      this._bind(free[i], picked[i].panel, picked[i].mesh, picked[i].room);
    }
  }

  /** New chunk only — uses free slots, never reassigns lights from other rooms. */
  attachRoom(room, mesh) {
    const need = this._onPanels(room).filter((p) => !p.light);
    const free = this.slots.filter((s) => !s.panel);
    const picked = spreadPick(need, Math.min(need.length, free.length));
    for (let i = 0; i < picked.length; i++) {
      this._bind(free[i], picked[i], mesh, room);
    }
  }

  detachRoom(room) {
    for (const panel of room.panels) {
      if (!panel.light) continue;
      const slot = this.slots.find((s) => s.panel === panel);
      if (slot) releaseSlot(slot);
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
