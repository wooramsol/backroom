import * as THREE from "three";
import { MAX_PANEL_LIGHTS, LIGHT_KEEP_RADIUS } from "./lightBudget.js";
import {
  FOG_FAR,
  FLUORESCENT_COLOR,
  PANEL_LIGHT_INTENSITY,
  CEILING_PLENUM_INTENSITY,
  PANEL_W,
  PANEL_H,
} from "./constants.js";

const _down = new THREE.Euler(-Math.PI / 2, 0, 0);
const _up = new THREE.Euler(Math.PI / 2, 0, 0);
const _frustum = new THREE.Frustum();
const _projScreen = new THREE.Matrix4();
const _point = new THREE.Vector3();
const _lastPos = new THREE.Vector3();
const _lastQuat = new THREE.Quaternion();
const _viewDistSq = FOG_FAR * FOG_FAR;
const _keepDistSq = LIGHT_KEEP_RADIUS * LIGHT_KEEP_RADIUS;
const _nearby = [];
const _visible = [];

/** Rectangular troffers — down + up area lights, both panel-sized squares */
export class PanelLightPool {
  constructor(scene) {
    this.scene = scene;
    this.lights = [];
    this.plenumLights = [];
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

      const plenum = new THREE.RectAreaLight(
        FLUORESCENT_COLOR,
        0,
        PANEL_W,
        PANEL_H,
      );
      plenum.rotation.copy(_up);
      plenum.visible = false;
      scene.add(plenum);
      this.plenumLights.push(plenum);
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
    for (const fixture of this.prevAssigned) {
      fixture.light = null;
      fixture.plenumLight = null;
    }
    this.prevAssigned.length = 0;
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

    const picks = this._selectPanels(fixtures, camera, this.lights.length);
    for (let i = 0; i < picks.length; i++) {
      const fixture = picks[i];
      const light = this.lights[i];
      const plenum = this.plenumLights[i];
      const lit = PANEL_LIGHT_INTENSITY * fixture.panel.bright;
      fixture.light = light;
      fixture.plenumLight = plenum;
      light.intensity = lit;
      plenum.intensity = lit * CEILING_PLENUM_INTENSITY;
      light.position.set(fixture.wx, fixture.wy, fixture.wz);
      plenum.position.set(fixture.wx, fixture.wCeiling, fixture.wz);
      light.visible = true;
      plenum.visible = true;
      this.assigned.push(fixture);
      this.prevAssigned.push(fixture);
    }

    for (let i = picks.length; i < this.lights.length; i++) {
      this.lights[i].visible = false;
      this.plenumLights[i].visible = false;
    }
  }
}
