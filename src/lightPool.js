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
  LIGHT_LOOK_INTERVAL_MS,
  LIGHT_PREWARM_DOT,
  LIGHT_GRACE_MS,
} from "./constants.js";

const _down = new THREE.Euler(-Math.PI / 2, 0, 0);
const _frustum = new THREE.Frustum();
const _projScreen = new THREE.Matrix4();
const _point = new THREE.Vector3();
const _forward = new THREE.Vector3();
const _toFixture = new THREE.Vector3();
const _lastPos = new THREE.Vector3();
const _lastQuat = new THREE.Quaternion();
const _moveThresholdSq = LIGHT_POOL_MOVE_THRESHOLD * LIGHT_POOL_MOVE_THRESHOLD;
const _lookThreshold = 0.12;
const _viewDistSq = FOG_FAR * FOG_FAR;
const _keepDistSq = LIGHT_KEEP_RADIUS * LIGHT_KEEP_RADIUS;
const _inView = [];
const _prewarm = [];
const _grace = [];
const _nearby = [];

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
    this._recentlyLit = new Map();
    this.dirty = true;
    this._lastMoveUpdateAt = 0;
    this._lastLookUpdateAt = 0;
    _lastPos.set(NaN, NaN, NaN);
    _lastQuat.set(NaN, NaN, NaN, NaN);
  }

  dropFixtures(removed) {
    if (!removed.length) return;
    const drop = new Set(removed);
    this.prevAssigned = this.prevAssigned.filter((f) => !drop.has(f));
    for (const fixture of removed) this._recentlyLit.delete(fixture);
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

  _aheadOfView(camera, fixture) {
    camera.getWorldDirection(_forward);
    _forward.y = 0;
    if (_forward.lengthSq() < 1e-6) return false;
    _forward.normalize();

    _toFixture.set(fixture.wx - camera.position.x, 0, fixture.wz - camera.position.z);
    const len = _toFixture.length();
    if (len < 0.35) return true;
    _toFixture.multiplyScalar(1 / len);
    return _forward.dot(_toFixture) >= LIGHT_PREWARM_DOT;
  }

  _pushPicks(picks, picked, list, k) {
    for (let i = 0; i < list.length && picks.length < k; i++) {
      const { fixture } = list[i];
      if (picked.has(fixture)) continue;
      picks.push(fixture);
      picked.add(fixture);
    }
  }

  _selectPanels(fixtures, camera, k, now) {
    camera.updateMatrixWorld(true);
    _projScreen.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    _frustum.setFromProjectionMatrix(_projScreen);

    _inView.length = 0;
    _prewarm.length = 0;
    _grace.length = 0;
    _nearby.length = 0;

    for (let i = 0; i < fixtures.length; i++) {
      const fixture = fixtures[i];
      const dist = this._distSqTo(camera, fixture);
      if (dist > _viewDistSq) continue;

      const entry = { fixture, dist };
      _point.set(fixture.wx, fixture.wy, fixture.wz);
      const inFrustum = _frustum.containsPoint(_point);
      const ahead = this._aheadOfView(camera, fixture);
      const litAt = this._recentlyLit.get(fixture);
      const inGrace = litAt != null && now - litAt < LIGHT_GRACE_MS;

      if (inFrustum) {
        _inView.push(entry);
      } else if (ahead) {
        _prewarm.push(entry);
      } else if (inGrace) {
        _grace.push(entry);
      } else if (dist <= _keepDistSq) {
        _nearby.push(entry);
      }
    }

    const byDist = (a, b) => a.dist - b.dist;
    _inView.sort(byDist);
    _prewarm.sort(byDist);
    _grace.sort(byDist);
    _nearby.sort(byDist);

    const picks = [];
    const picked = new Set();
    this._pushPicks(picks, picked, _inView, k);
    this._pushPicks(picks, picked, _prewarm, k);
    this._pushPicks(picks, picked, _grace, k);
    this._pushPicks(picks, picked, _nearby, k);
    return picks;
  }

  _applyLight(slot, fixture, lit, now) {
    const light = this.lights[slot];
    fixture.light = light;
    fixture.lightSlot = slot;
    light.intensity = lit;
    light.position.set(fixture.wx, fixture.lightY, fixture.wz);
    light.rotation.copy(_down);
    light.visible = true;
    this._recentlyLit.set(fixture, now);
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

  _pruneGrace(now) {
    const cutoff = now - LIGHT_GRACE_MS;
    for (const [fixture, litAt] of this._recentlyLit) {
      if (litAt < cutoff) this._recentlyLit.delete(fixture);
    }
  }

  update(fixtures, camera) {
    const now = performance.now();
    const posMoved =
      Number.isNaN(_lastPos.x) ||
      _lastPos.distanceToSquared(camera.position) > _moveThresholdSq;
    const looked =
      Number.isNaN(_lastQuat.x) ||
      1 - Math.abs(_lastQuat.dot(camera.quaternion)) > _lookThreshold;
    const moveDue = now - this._lastMoveUpdateAt >= LIGHT_POOL_MIN_INTERVAL_MS;
    const lookDue = now - this._lastLookUpdateAt >= LIGHT_LOOK_INTERVAL_MS;

    if (!this.dirty && !((posMoved && moveDue) || (looked && lookDue))) return;

    this.dirty = false;
    if (posMoved) this._lastMoveUpdateAt = now;
    if (looked) this._lastLookUpdateAt = now;
    _lastPos.copy(camera.position);
    _lastQuat.copy(camera.quaternion);
    this._pruneGrace(now);

    for (const fixture of this.prevAssigned) {
      this._clearFixture(fixture);
    }
    this.prevAssigned.length = 0;

    const picks = this._selectPanels(fixtures, camera, this.lights.length, now);
    const assignments = this._assignSticky(camera, picks);

    for (let slot = 0; slot < assignments.length; slot++) {
      const fixture = assignments[slot];
      if (!fixture) {
        this.lights[slot].visible = false;
        continue;
      }
      const lit = PANEL_LIGHT_INTENSITY * fixture.panel.bright;
      this._applyLight(slot, fixture, lit, now);
      this.prevAssigned.push(fixture);
    }
  }
}
