import * as THREE from "three";
import { CHUNK } from "./room.js";
import { MAX_PANEL_LIGHTS } from "./lightBudget.js";
import { PANEL_LIGHT_COLOR, PANEL_LIGHT_INTENSITY, PANEL_W, PANEL_H } from "./constants.js";

const _down = new THREE.Euler(-Math.PI / 2, 0, 0);
const _heap = [];

/** Shared RectAreaLights — nearest on-panels only, reassigned on chunk moves */
export class PanelLightPool {
  constructor(scene) {
    this.scene = scene;
    this.lights = [];
    for (let i = 0; i < MAX_PANEL_LIGHTS; i++) {
      const light = new THREE.RectAreaLight(PANEL_LIGHT_COLOR, 0, PANEL_W, PANEL_H);
      light.rotation.copy(_down);
      light.visible = false;
      scene.add(light);
      this.lights.push(light);
    }
    this.assigned = [];
    this.prevAssigned = [];
    this.dirty = true;
    this.lastCcx = NaN;
    this.lastCcz = NaN;
    this.lastPx = NaN;
    this.lastPz = NaN;
  }

  dropFixtures(removed) {
    if (!removed.length) return;
    const drop = new Set(removed);
    this.prevAssigned = this.prevAssigned.filter((f) => !drop.has(f));
    this.assigned = this.assigned.filter((f) => !drop.has(f));
    this.dirty = true;
  }

  markDirty() {
    this.dirty = true;
  }

  _clearAssignments() {
    for (const fixture of this.prevAssigned) fixture.light = null;
    this.prevAssigned.length = 0;
  }

  _selectNearest(fixtures, px, pz, k) {
    _heap.length = 0;
    for (let i = 0; i < fixtures.length; i++) {
      const fixture = fixtures[i];
      const dx = fixture.wx - px;
      const dz = fixture.wz - pz;
      const dist = dx * dx + dz * dz;
      if (_heap.length < k) {
        _heap.push({ fixture, dist });
        continue;
      }
      let worst = 0;
      for (let j = 1; j < _heap.length; j++) {
        if (_heap[j].dist > _heap[worst].dist) worst = j;
      }
      if (dist < _heap[worst].dist) _heap[worst] = { fixture, dist };
    }
    return _heap;
  }

  update(fixtures, playerPos) {
    const px = playerPos.x;
    const pz = playerPos.z;
    const ccx = Math.floor(px / CHUNK);
    const ccz = Math.floor(pz / CHUNK);
    const moved =
      (px - this.lastPx) ** 2 + (pz - this.lastPz) ** 2 > 3.5 ** 2;
    if (!this.dirty && ccx === this.lastCcx && ccz === this.lastCcz && !moved) {
      return;
    }

    this.dirty = false;
    this.lastCcx = ccx;
    this.lastCcz = ccz;
    this.lastPx = px;
    this.lastPz = pz;

    this._clearAssignments();
    this.assigned.length = 0;

    const picks = this._selectNearest(fixtures, px, pz, this.lights.length);
    for (let i = 0; i < picks.length; i++) {
      const { fixture } = picks[i];
      const light = this.lights[i];
      fixture.light = light;
      light.intensity = PANEL_LIGHT_INTENSITY * fixture.panel.bright;
      light.position.set(fixture.wx, fixture.wy, fixture.wz);
      light.visible = true;
      this.assigned.push(fixture);
      this.prevAssigned.push(fixture);
    }

    for (let i = picks.length; i < this.lights.length; i++) {
      this.lights[i].visible = false;
    }
  }
}
