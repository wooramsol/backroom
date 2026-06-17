import * as THREE from "three";
import {
  EYE_H,
  PLAYER_R,
  PLAYER_DEPTH,
  CHUNK,
  MOUSE_SENS,
  PITCH_LIMIT,
  JUMP_V,
  GRAVITY,
  CAMERA_WALL_CLEAR,
  CAMERA_MAX_OFFSET,
  BODY_WALL_CLEAR,
} from "./constants.js";
import { sampleFloorHeight } from "./floorSampling.js";

const WALK = 3.2;
const RUN = 5.8;
const BOB_SPEED = 9;
const BOB_AMOUNT = 0.035;
const BODY_HW = PLAYER_R * 0.98;
const MOVE_STEP = 0.008;
const _lookEuler = new THREE.Euler(0, 0, 0, "YXZ");

const _fwd = new THREE.Vector3();
const _right = new THREE.Vector3();
const _move = new THREE.Vector3();
const _camFwd = new THREE.Vector3();
const _camOff = new THREE.Vector3();
const _bodyPts = [
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
];

export class Player {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;
    this.position = new THREE.Vector3(CHUNK / 2, EYE_H, CHUNK / 2);
    this.yaw = 0;
    this.pitch = 0;
    this.keys = {};
    this.locked = false;
    this.colliders = [];
    this.floorSurfaces = [];
    this.bob = 0;
    this.vy = 0;
    this.grounded = true;

    this._onKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (this.locked && this.grounded) {
          this.vy = JUMP_V;
          this.grounded = false;
        }
      }
      this.keys[e.code] = true;
      if (e.code === "KeyR") this._unstuck();
    };
    this._onKeyUp = (e) => {
      this.keys[e.code] = false;
    };
    this._onMouseMove = (e) => {
      if (!this.locked) return;
      this.yaw -= e.movementX * MOUSE_SENS;
      this.pitch -= e.movementY * MOUSE_SENS;
      this.pitch = THREE.MathUtils.clamp(this.pitch, -PITCH_LIMIT, PITCH_LIMIT);
    };
    this._onLockChange = () => {
      this.locked = document.pointerLockElement === this.domElement;
    };
  }

  connect() {
    window.addEventListener("keydown", this._onKeyDown);
    window.addEventListener("keyup", this._onKeyUp);
    document.addEventListener("mousemove", this._onMouseMove);
    document.addEventListener("pointerlockchange", this._onLockChange);
  }

  requestLock() {
    this.domElement.requestPointerLock();
  }

  setColliders(colliders) {
    this.colliders = colliders;
  }

  setFloorSurfaces(surfaces) {
    this.floorSurfaces = surfaces;
  }

  _eyeHeightAt(wx, wz) {
    return sampleFloorHeight(this.floorSurfaces, wx, wz) + EYE_H;
  }

  _unstuck() {
    const y = this._eyeHeightAt(CHUNK / 2, CHUNK / 2);
    this.position.set(CHUNK / 2, y, CHUNK / 2);
    this.vy = 0;
    this.grounded = true;
  }

  _fillBodyPoints(px, pz) {
    const c = Math.cos(this.yaw);
    const s = Math.sin(this.yaw);
    const hw = BODY_HW;
    const hd = PLAYER_DEPTH;
    _bodyPts[0][0] = px + c * hd + s * hw;
    _bodyPts[0][1] = pz + s * hd - c * hw;
    _bodyPts[1][0] = px + c * hd - s * hw;
    _bodyPts[1][1] = pz + s * hd + c * hw;
    _bodyPts[2][0] = px - c * hd + s * hw;
    _bodyPts[2][1] = pz - s * hd - c * hw;
    _bodyPts[3][0] = px - c * hd - s * hw;
    _bodyPts[3][1] = pz - s * hd + c * hw;
    _bodyPts[4][0] = px + s * hw;
    _bodyPts[4][1] = pz - c * hw;
    _bodyPts[5][0] = px - s * hw;
    _bodyPts[5][1] = pz + c * hw;
    _bodyPts[6][0] = px + c * hd;
    _bodyPts[6][1] = pz + s * hd;
    _bodyPts[7][0] = px - c * hd;
    _bodyPts[7][1] = pz - s * hd;
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI * 2;
      const ca = Math.cos(a);
      const sa = Math.sin(a);
      _bodyPts[8 + i][0] = px + c * (hd * 0.55 * ca + 0.01) + s * (hw * sa);
      _bodyPts[8 + i][1] = pz + s * (hd * 0.55 * ca + 0.01) - c * (hw * sa);
    }
  }

  _sampleHitsWall(sx, sz, y, r) {
    for (const c of this.colliders) {
      if (y < c.minY - 0.2 || y > c.maxY + 0.2) continue;
      if (sx + r > c.minX && sx - r < c.maxX && sz + r > c.minZ && sz - r < c.maxZ) {
        return true;
      }
    }
    return false;
  }

  _bodyOverlaps(px, pz) {
    const y = this.position.y;
    const r = BODY_WALL_CLEAR;
    this._fillBodyPoints(px, pz);
    for (let i = 0; i < 12; i++) {
      if (this._sampleHitsWall(_bodyPts[i][0], _bodyPts[i][1], y, r)) return true;
    }
    return this._sampleHitsWall(px, pz, y, BODY_WALL_CLEAR * 0.5);
  }

  _pushSample(sx, sz, px, pz, y, r) {
    let hit = false;
    for (const c of this.colliders) {
      if (y < c.minY - 0.2 || y > c.maxY + 0.2) continue;
      if (sx + r <= c.minX || sx - r >= c.maxX || sz + r <= c.minZ || sz - r >= c.maxZ) {
        continue;
      }

      const oL = sx + r - c.minX;
      const oR = c.maxX - (sx - r);
      const oF = sz + r - c.minZ;
      const oB = c.maxZ - (sz - r);
      const m = Math.min(oL, oR, oF, oB);

      if (m === oL) px -= oL;
      else if (m === oR) px += oR;
      else if (m === oF) pz -= oF;
      else pz += oB;

      hit = true;
    }
    return { px, pz, hit };
  }

  _pushOut(px, pz) {
    const y = this.position.y;
    const r = BODY_WALL_CLEAR;

    for (let n = 0; n < 48; n++) {
      this._fillBodyPoints(px, pz);
      let hit = false;

      for (let i = 0; i < 12; i++) {
        const out = this._pushSample(_bodyPts[i][0], _bodyPts[i][1], px, pz, y, r);
        px = out.px;
        pz = out.pz;
        if (out.hit) hit = true;
      }

      if (!hit) break;
    }

    return { px, pz };
  }

  _tryMove(px, pz, dx, dz) {
    const target = this._pushOut(px + dx, pz + dz);
    if (!this._bodyOverlaps(target.px, target.pz)) return target;

    const xOnly = this._pushOut(px + dx, pz);
    if (!this._bodyOverlaps(xOnly.px, xOnly.pz)) {
      const xz = this._pushOut(xOnly.px, pz + dz);
      if (!this._bodyOverlaps(xz.px, xz.pz)) return xz;
      return xOnly;
    }

    const zOnly = this._pushOut(px, pz + dz);
    if (!this._bodyOverlaps(zOnly.px, zOnly.pz)) return zOnly;

    return { px, pz };
  }

  _moveSlide(px, pz, dx, dz) {
    const len = Math.hypot(dx, dz);
    const steps = Math.max(1, Math.ceil(len / MOVE_STEP));
    const sx = dx / steps;
    const sz = dz / steps;
    for (let i = 0; i < steps; i++) {
      const next = this._tryMove(px, pz, sx, sz);
      px = next.px;
      pz = next.pz;
    }
    return { px, pz };
  }

  _pointInsideCollider(x, y, z, pad = 0) {
    for (const c of this.colliders) {
      if (y < c.minY - pad || y > c.maxY + pad) continue;
      if (
        x >= c.minX - pad &&
        x <= c.maxX + pad &&
        z >= c.minZ - pad &&
        z <= c.maxZ + pad
      ) {
        return true;
      }
    }
    return false;
  }

  /** Pull eye away from nearby wall surfaces and out of the view frustum */
  _adjustCameraForWalls(eyeX, eyeY, eyeZ, yaw, pitch) {
    const clear = CAMERA_WALL_CLEAR;
    let x = eyeX;
    let y = eyeY;
    let z = eyeZ;

    for (let pass = 0; pass < 6; pass++) {
      let moved = false;
      for (const c of this.colliders) {
        if (y < c.minY - 0.2 || y > c.maxY + 0.2) continue;

        const cx = THREE.MathUtils.clamp(x, c.minX, c.maxX);
        const cz = THREE.MathUtils.clamp(z, c.minZ, c.maxZ);
        const dx = x - cx;
        const dz = z - cz;
        const distSq = dx * dx + dz * dz;
        if (distSq >= clear * clear) continue;

        if (distSq < 1e-8) {
          const oL = x - c.minX;
          const oR = c.maxX - x;
          const oF = z - c.minZ;
          const oB = c.maxZ - z;
          const m = Math.min(oL, oR, oF, oB);
          if (m === oL) x += clear - oL;
          else if (m === oR) x -= clear - oR;
          else if (m === oF) z += clear - oF;
          else z -= clear - oB;
        } else {
          const dist = Math.sqrt(distSq);
          const push = (clear - dist) / dist;
          x += dx * push;
          z += dz * push;
        }
        moved = true;
      }
      if (!moved) break;
    }

    _camFwd.set(
      -Math.sin(yaw) * Math.cos(pitch),
      Math.sin(pitch),
      -Math.cos(yaw) * Math.cos(pitch)
    ).normalize();

    for (let t = 0.04; t <= 0.45; t += 0.04) {
      const px = x + _camFwd.x * t;
      const py = y + _camFwd.y * t;
      const pz = z + _camFwd.z * t;
      if (this._pointInsideCollider(px, py, pz, 0.03)) {
        x -= _camFwd.x * (t + 0.03);
        y -= _camFwd.y * (t + 0.03);
        z -= _camFwd.z * (t + 0.03);
        break;
      }
    }

    this._fillBodyPoints(x, z);
    for (let i = 0; i < 12; i++) {
      const sx = _bodyPts[i][0];
      const sz = _bodyPts[i][1];
      for (const c of this.colliders) {
        if (y < c.minY - 0.2 || y > c.maxY + 0.2) continue;
        const cx = THREE.MathUtils.clamp(sx, c.minX, c.maxX);
        const cz = THREE.MathUtils.clamp(sz, c.minZ, c.maxZ);
        const dx = sx - cx;
        const dz = sz - cz;
        const distSq = dx * dx + dz * dz;
        if (distSq >= clear * clear) continue;
        if (distSq < 1e-8) continue;
        const dist = Math.sqrt(distSq);
        const push = (clear - dist) / dist;
        x += dx * push;
        z += dz * push;
      }
    }

    _camOff.set(x - eyeX, y - eyeY, z - eyeZ);
    if (_camOff.lengthSq() > CAMERA_MAX_OFFSET * CAMERA_MAX_OFFSET) {
      _camOff.setLength(CAMERA_MAX_OFFSET);
    }

    return {
      x: eyeX + _camOff.x,
      y: eyeY + _camOff.y,
      z: eyeZ + _camOff.z,
    };
  }

  resolvePenetration() {
    const prevX = this.position.x;
    const prevZ = this.position.z;
    const out = this._pushOut(this.position.x, this.position.z);
    if (this._bodyOverlaps(out.px, out.pz)) {
      this.position.x = prevX;
      this.position.z = prevZ;
      const safe = this._pushOut(prevX, prevZ);
      this.position.x = safe.px;
      this.position.z = safe.pz;
      return;
    }
    this.position.x = out.px;
    this.position.z = out.pz;
  }

  update(dt) {
    _fwd.set(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    _right.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    _move.set(0, 0, 0);

    if (this.keys.KeyW || this.keys.ArrowUp) _move.add(_fwd);
    if (this.keys.KeyS || this.keys.ArrowDown) _move.sub(_fwd);
    if (this.keys.KeyA || this.keys.ArrowLeft) _move.sub(_right);
    if (this.keys.KeyD || this.keys.ArrowRight) _move.add(_right);

    const running = this.keys.ShiftLeft || this.keys.ShiftRight;
    const speed = running ? RUN : WALK;

    if (_move.lengthSq() > 0) {
      _move.normalize().multiplyScalar(speed * dt);
      const out = this._moveSlide(this.position.x, this.position.z, _move.x, _move.z);
      this.position.x = out.px;
      this.position.z = out.pz;
      if (this.grounded) this.bob += dt * BOB_SPEED * (running ? 1.3 : 1);
    } else if (this.grounded) {
      this.bob *= 0.85;
    }

    this.vy -= GRAVITY * dt;
    this.position.y += this.vy * dt;

    const groundY = this._eyeHeightAt(this.position.x, this.position.z);
    if (this.position.y <= groundY) {
      this.position.y = groundY;
      this.vy = 0;
      this.grounded = true;
    } else {
      this.grounded = false;
    }

    if (this.grounded) {
      this.position.y = this._eyeHeightAt(this.position.x, this.position.z);
    }

    const bobY = this.grounded ? Math.sin(this.bob) * BOB_AMOUNT : 0;
    const eyeY = this.position.y + bobY;
    const cam = this._adjustCameraForWalls(this.position.x, eyeY, this.position.z, this.yaw, this.pitch);
    this.camera.position.set(cam.x, cam.y, cam.z);
    this.camera.up.set(0, 1, 0);
    _lookEuler.set(this.pitch, this.yaw, 0);
    this.camera.quaternion.setFromEuler(_lookEuler);

    this.resolvePenetration();
  }
}
