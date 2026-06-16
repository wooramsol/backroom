import * as THREE from "three";
import { CHUNK } from "./room.js";
import {
  PANEL_LIGHT_INTENSITY,
  PANEL_W,
  PANEL_H,
  LIGHT_POOL_SIZE,
  PANEL_LIGHTS_PER_ROOM,
} from "./constants.js";

/** Evenly pick ON panels across a room ceiling grid (not player-distance biased). */
function pickSpreadPanels(room, max) {
  const on = room.panels.filter((p) => p.on && p.face);
  on.sort((a, b) => a.z - b.z || a.x - b.x);
  if (on.length <= max) return on;
  const picked = [];
  for (let i = 0; i < max; i++) {
    picked.push(on[Math.floor((i * on.length) / max)]);
  }
  return picked;
}

function releaseSlot(slot) {
  if (slot.light.parent) slot.light.parent.remove(slot.light);
  if (slot.panel) slot.panel.light = null;
  slot.panel = null;
  slot.roomMesh = null;
  slot.light.intensity = 0;
  slot.light.visible = false;
}

/** RectAreaLights parented to ceiling panel meshes — fixed to each fixture, not walls. */
export class PanelLightPool {
  constructor() {
    this.slots = [];
    for (let i = 0; i < LIGHT_POOL_SIZE; i++) {
      const light = new THREE.RectAreaLight(0xfff4d8, 0, PANEL_W, PANEL_H);
      light.visible = false;
      this.slots.push({ light, panel: null, roomMesh: null });
    }
  }

  update(playerPos, chunks, time) {
    const pcx = Math.floor(playerPos.x / CHUNK);
    const pcz = Math.floor(playerPos.z / CHUNK);

    const current = chunks.get(`${pcx},${pcz}`);
    const target = [];
    const seen = new Set();

    const pushPanel = (entry, panel) => {
      if (seen.has(panel)) return;
      seen.add(panel);
      target.push({ panel, mesh: entry.mesh, room: entry.room });
    };

    // Current room: light every ON ceiling panel (up to pool size).
    if (current) {
      for (const panel of pickSpreadPanels(current.room, LIGHT_POOL_SIZE)) {
        if (target.length >= LIGHT_POOL_SIZE) break;
        pushPanel(current, panel);
      }
    }

    // Neighbors: spread remaining slots across adjacent rooms.
    if (target.length < LIGHT_POOL_SIZE) {
      const neighbors = [];
      for (const entry of chunks.values()) {
        const dx = Math.abs(entry.room.cx - pcx);
        const dz = Math.abs(entry.room.cz - pcz);
        if (dx > 1 || dz > 1) continue;
        if (dx === 0 && dz === 0) continue;
        neighbors.push(entry);
      }
      neighbors.sort(
        (a, b) =>
          a.room.cz - b.room.cz ||
          a.room.cx - b.room.cx
      );

      for (const entry of neighbors) {
        if (target.length >= LIGHT_POOL_SIZE) break;
        const left = LIGHT_POOL_SIZE - target.length;
        const perRoom = Math.min(
          PANEL_LIGHTS_PER_ROOM,
          Math.max(1, Math.ceil(left / neighbors.length))
        );
        for (const panel of pickSpreadPanels(entry.room, perRoom)) {
          if (target.length >= LIGHT_POOL_SIZE) break;
          pushPanel(entry, panel);
        }
      }
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
      const { panel, mesh } = need[i];
      panel.face.add(slot.light);
      slot.light.position.set(0, 0, 0);
      slot.light.rotation.set(0, 0, 0);
      slot.panel = panel;
      slot.roomMesh = mesh;
      panel.light = slot.light;
      slot.light.visible = true;
    }

    for (const slot of this.slots) {
      if (!slot.panel) continue;
      const flicker = 0.94 + Math.sin(time * 8 + slot.panel.phase) * 0.04;
      slot.light.intensity = PANEL_LIGHT_INTENSITY * slot.panel.bright * flicker;
    }
  }
}
