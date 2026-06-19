import * as THREE from "three";
import { MAX_PANEL_LIGHTS, LIGHT_KEEP_RADIUS } from "./lightBudget.js";
import {
  FOG_FAR,
  FLUORESCENT_COLOR,
  PANEL_LIGHT_INTENSITY,
  PANEL_W,
  PANEL_H,
  LIGHT_POOL_MOVE_THRESHOLD,
  LIGHT_POOL_MIN_INTERVAL_MS,
} from "./constants.js";

const _down = new THREE.Euler(-Math.PI / 2, 0, 0);
const _frustum = new THREE.Frustum();
const _projScreen = new THREE.Matrix4();
const _point = new THREE.Vector3();
const _lastPos = new THREE.Vector3();
const _moveThresholdSq = LIGHT_POOL_MOVE_THRESHOLD * LIGHT_POOL_MOVE_THRESHOLD;
const _viewDistSq = FOG_FAR * FOG_FAR;
const _keepDistSq = LIGHT_KEEP_RADIUS * LIGHT_KEEP_RADIUS;
const _nearby = [];
const _visible = [];

/** Pooled square troffer RectAreaLights — sticky assignment, downward only */
export class PanelLightPool {
  constructor(scene) {
    this.scene = scene;
    this.lights = [];
    for (let i = 0; i < MAX_PANEL_LIGHTS; i++) {
      const light = new THREE.RectAreaLight(
        FLUORESCENT_COLOR,
        0,
        PANEL_W,
        PANEL_H,
      );
      light.rotation.copy(_down);
      light.visible = false;
      scene.add(light);
      this.lights.push(light);
    }
    this.prevAssigned = [];
    this.dirty = true;
    this._lastUpdateAt = 0;
    _lastPos.set(NaN, NaN, NaN);
  }

  dropFixtures(removed) {
    if (!removed.length) return;
    const drop = new Set(removed);
    this.prevAssigned = this.prevAssigned.filter((f) => !drop.has(f));
    this.dirty = true;
  }

  markDirty() {
    this.dirty = true;
  }

  _clearFixture(fixture) {
    fixture.light = null;
    fixture.lightSlot = -1;
  }

  _distSqTo(camera, fixture) {
    const dx = fixture.wx - camera.position.x;
    const dy = fixture.wy - camera.position.y;
    const dz = fixture.wz - camera.position.z;
    return dx * dx + dy * dy + dz * dz;
  }

  _selectPanels(fixtures, camera, k) {
    camera.updateMatrixWorld(true);
    _projScreen.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    _frustum.setFromProjectionMatrix(_projScreen);

    _nearby.length = 0;
    _visible.length = 0;

    for (let i = 0; i < fixtures.length; i++) {
      const fixture = fixtures[i];
      const dist = this._distSqTo(camera, fixture);
      if (dist > _viewDistSq) continue;

      if (dist <= _keepDistSq) {
        _nearby.push({ fixture, dist });
        continue;
      }

      _point.set(fixture.wx, fixture.wy, fixture.wz);
      if (_frustum.containsPoint(_point)) {
        _visible.push({ fixture, dist });
      }
    }

    _nearby.sort((a, b) => a.dist - b.dist);
    _visible.sort((a, b) => a.dist - b.dist);

    const picks = [];
    const picked = new Set();

    for (let i = 0; i < _nearby.length && picks.length < k; i++) {
      const { fixture } = _nearby[i];
      picks.push(fixture);
      picked.add(fixture);
    }

    for (let i = 0; i < _visible.length && picks.length < k; i++) {
      const { fixture } = _visible[i];
      if (picked.has(fixture)) continue;
      picks.push(fixture);
      picked.add(fixture);
    }

    return picks;
  }

  _applyLight(slot, fixture, lit) {
    const light = this.lights[slot];
    fixture.light = light;
    fixture.lightSlot = slot;
    light.intensity = lit;
    light.position.set(fixture.wx, fixture.lightY, fixture.wz);
    light.rotation.copy(_down);
    light.visible = true;
  }

  _assignSticky(camera, picks) {
    const desired = new Set(picks);
    const assignments = new Array(this.lights.length).fill(null);
    const assignedFixtures = new Set();

    for (const fixture of this.prevAssigned) {
      if (!desired.has(fixture)) continue;
      const slot = fixture.lightSlot;
      if (slot < 0 || slot >= this.lights.length || assignments[slot] !== null) continue;
      assignments[slot] = fixture;
      assignedFixtures.add(fixture);
    }

    const remaining = picks.filter((fixture) => !assignedFixtures.has(fixture));
    const freeSlots = [];
    for (let i = 0; i < assignments.length; i++) {
      if (assignments[i] === null) freeSlots.push(i);
    }

    remaining.sort((a, b) => this._distSqTo(camera, a) - this._distSqTo(camera, b));
    for (let i = 0; i < remaining.length && i < freeSlots.length; i++) {
      assignments[freeSlots[i]] = remaining[i];
    }

    return assignments;
  }

  update(fixtures, camera) {
    const now = performance.now();
    const posMoved = _lastPos.distanceToSquared(camera.position) > _moveThresholdSq;
    const due = now - this._lastUpdateAt >= LIGHT_POOL_MIN_INTERVAL_MS;
    if (!this.dirty && !(posMoved && due)) return;

    this.dirty = false;
    this._lastUpdateAt = now;
    _lastPos.copy(camera.position);

    for (const fixture of this.prevAssigned) {
      this._clearFixture(fixture);
    }
    this.prevAssigned.length = 0;

    const picks = this._selectPanels(fixtures, camera, this.lights.length);
    const assignments = this._assignSticky(camera, picks);

    for (let slot = 0; slot < assignments.length; slot++) {
      const fixture = assignments[slot];
      if (!fixture) {
        this.lights[slot].visible = false;
        continue;
      }
      const lit = PANEL_LIGHT_INTENSITY * fixture.panel.bright;
      this._applyLight(slot, fixture, lit);
      this.prevAssigned.push(fixture);
    }
  }
}
