import * as THREE from "three";
import { MAX_PANEL_LIGHTS, LIGHT_KEEP_RADIUS } from "./lightBudget.js";
import {
  FOG_FAR,
  FLUORESCENT_COLOR,
  PANEL_LIGHT_INTENSITY,
  CEILING_PLENUM_INTENSITY,
  PLENUM_LIGHT_SCALE,
  PANEL_W,
  PANEL_H,
  LIGHT_POOL_MOVE_THRESHOLD,
  LIGHT_POOL_MIN_INTERVAL_MS,
  LAYER_LIT,
} from "./constants.js";

const _down = new THREE.Euler(-Math.PI / 2, 0, 0);
const _up = new THREE.Euler(Math.PI / 2, 0, 0);
const _frustum = new THREE.Frustum();
const _projScreen = new THREE.Matrix4();
const _point = new THREE.Vector3();
const _lastPos = new THREE.Vector3();
const _lastQuat = new THREE.Quaternion();
const _moveThresholdSq = LIGHT_POOL_MOVE_THRESHOLD * LIGHT_POOL_MOVE_THRESHOLD;
const _lookThreshold = 0.12;
const _viewDistSq = FOG_FAR * FOG_FAR;
const _keepDistSq = LIGHT_KEEP_RADIUS * LIGHT_KEEP_RADIUS;
const _nearby = [];
const _visible = [];
const _plenumW = PANEL_W * PLENUM_LIGHT_SCALE;
const _plenumH = PANEL_H * PLENUM_LIGHT_SCALE;

/** Pooled troffer RectAreaLights — downward room fill + upward ceiling plenum wash */
export class PanelLightPool {
  constructor(scene) {
    this.scene = scene;
    this.lights = [];
    this.plenumLights = [];
    for (let i = 0; i < MAX_PANEL_LIGHTS; i++) {
      const light = new THREE.RectAreaLight(FLUORESCENT_COLOR, 0, PANEL_W, PANEL_H);
      light.rotation.copy(_down);
      light.visible = false;
      light.layers.set(LAYER_LIT);
      scene.add(light);
      this.lights.push(light);

      const plenum = new THREE.RectAreaLight(FLUORESCENT_COLOR, 0, _plenumW, _plenumH);
      plenum.rotation.copy(_up);
      plenum.visible = false;
      plenum.layers.set(LAYER_LIT);
      scene.add(plenum);
      this.plenumLights.push(plenum);
    }
    this.prevAssigned = [];
    this.dirty = true;
    this._lastUpdateAt = 0;
    _lastPos.set(NaN, NaN, NaN);
    _lastQuat.set(NaN, NaN, NaN, NaN);
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
    fixture.plenumLight = null;
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

  _applyLight(slot, fixture, downLit, upLit) {
    const light = this.lights[slot];
    const plenum = this.plenumLights[slot];
    fixture.light = light;
    fixture.plenumLight = plenum;
    fixture.lightSlot = slot;
    light.intensity = downLit;
    light.position.set(fixture.wx, fixture.lightY, fixture.wz);
    light.rotation.copy(_down);
    light.visible = true;
    plenum.intensity = upLit;
    plenum.position.set(fixture.wx, fixture.plenumY, fixture.wz);
    plenum.rotation.copy(_up);
    plenum.visible = true;
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
    const posMoved =
      Number.isNaN(_lastPos.x) ||
      _lastPos.distanceToSquared(camera.position) > _moveThresholdSq;
    const looked =
      Number.isNaN(_lastQuat.x) ||
      1 - Math.abs(_lastQuat.dot(camera.quaternion)) > _lookThreshold;
    const due = now - this._lastUpdateAt >= LIGHT_POOL_MIN_INTERVAL_MS;
    if (!this.dirty && !((posMoved || looked) && due)) return;

    this.dirty = false;
    this._lastUpdateAt = now;
    _lastPos.copy(camera.position);
    _lastQuat.copy(camera.quaternion);

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
        this.plenumLights[slot].visible = false;
        continue;
      }
      const bright = fixture.panel.bright;
      const downLit = PANEL_LIGHT_INTENSITY * bright;
      const upLit = CEILING_PLENUM_INTENSITY * bright;
      this._applyLight(slot, fixture, downLit, upLit);
      this.prevAssigned.push(fixture);
    }
  }
}
