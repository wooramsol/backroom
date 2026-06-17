import * as THREE from "three";
import { MAX_PANEL_LIGHTS } from "./lightBudget.js";
import {
  FOG_FAR,
  PANEL_LIGHT_COLOR,
  PANEL_LIGHT_INTENSITY,
  PANEL_W,
  PANEL_H,
} from "./constants.js";

const _down = new THREE.Euler(-Math.PI / 2, 0, 0);
const _heap = [];
const _frustum = new THREE.Frustum();
const _projScreen = new THREE.Matrix4();
const _point = new THREE.Vector3();
const _lastPos = new THREE.Vector3();
const _lastQuat = new THREE.Quaternion();
const _viewDistSq = FOG_FAR * FOG_FAR;

/** Shared RectAreaLights — assigned to on-panels visible in the camera frustum */
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
    _lastPos.set(NaN, NaN, NaN);
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

  _selectVisible(fixtures, camera, k) {
    camera.updateMatrixWorld(true);
    _projScreen.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    _frustum.setFromProjectionMatrix(_projScreen);

    const px = camera.position.x;
    const py = camera.position.y;
    const pz = camera.position.z;

    _heap.length = 0;
    for (let i = 0; i < fixtures.length; i++) {
      const fixture = fixtures[i];
      _point.set(fixture.wx, fixture.wy, fixture.wz);
      if (!_frustum.containsPoint(_point)) continue;

      const dx = fixture.wx - px;
      const dy = fixture.wy - py;
      const dz = fixture.wz - pz;
      const dist = dx * dx + dy * dy + dz * dz;
      if (dist > _viewDistSq) continue;

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

  update(fixtures, camera) {
    const moved =
      this.dirty ||
      !_lastPos.equals(camera.position) ||
      !_lastQuat.equals(camera.quaternion);
    if (!moved) return;

    this.dirty = false;
    _lastPos.copy(camera.position);
    _lastQuat.copy(camera.quaternion);

    this._clearAssignments();
    this.assigned.length = 0;

    const picks = this._selectVisible(fixtures, camera, this.lights.length);
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
