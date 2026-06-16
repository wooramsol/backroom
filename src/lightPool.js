import * as THREE from "three";
import { MAX_PANEL_LIGHTS } from "./lightBudget.js";
import { PANEL_LIGHT_COLOR, PANEL_W, PANEL_H } from "./constants.js";

const _down = new THREE.Euler(-Math.PI / 2, 0, 0);
const _scratch = [];

/** Shared RectAreaLights — reassigned each update to nearest on-panels */
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
    this.dirty = true;
    this.lastPx = NaN;
    this.lastPz = NaN;
  }

  markDirty() {
    this.dirty = true;
  }

  update(fixtures, playerPos) {
    const px = playerPos.x;
    const pz = playerPos.z;
    const moved = (px - this.lastPx) ** 2 + (pz - this.lastPz) ** 2 > 0.35 ** 2;
    if (!this.dirty && !moved) return;

    this.dirty = false;
    this.lastPx = px;
    this.lastPz = pz;

    for (const fixture of fixtures) fixture.light = null;

    _scratch.length = 0;
    for (const fixture of fixtures) {
      const dx = fixture.wx - px;
      const dz = fixture.wz - pz;
      _scratch.push({ fixture, dist: dx * dx + dz * dz });
    }
    _scratch.sort((a, b) => a.dist - b.dist);

    for (let i = 0; i < this.lights.length; i++) {
      const light = this.lights[i];
      const entry = _scratch[i];
      if (!entry) {
        light.visible = false;
        continue;
      }
      const { fixture } = entry;
      fixture.light = light;
      light.position.set(fixture.wx, fixture.wy, fixture.wz);
      light.visible = true;
    }

    for (let i = this.lights.length; i < _scratch.length; i++) {
      _scratch[i].fixture.light = null;
    }
  }
}
