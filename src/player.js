import * as THREE from "three";
import {
  EYE_H,
  PLAYER_R,
  CHUNK,
  MOUSE_SENS,
  PITCH_LIMIT,
  JUMP_V,
  GRAVITY,
} from "./constants.js";

const WALK = 3.2;
const RUN = 5.8;
const BOB_SPEED = 9;
const BOB_AMOUNT = 0.035;
const _lookEuler = new THREE.Euler(0, 0, 0, "YXZ");
const _up = new THREE.Vector3(0, 1, 0);
const _fwd = new THREE.Vector3();
const _right = new THREE.Vector3();
const _move = new THREE.Vector3();

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
    this._active = [];
    this.bob = 0;
    this.vy = 0;
    this.grounded = true;
    this.onLockLost = null;
    this.onLockAcquired = null;

    this.camera.rotation.order = "YXZ";

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
      const wasLocked = this.locked;
      this.locked = document.pointerLockElement === this.domElement;
      if (wasLocked && !this.locked) {
        this._clearKeys();
        this.onLockLost?.();
      } else if (!wasLocked && this.locked) {
        this.onLockAcquired?.();
      }
    };
    this._onVisibility = () => {
      if (document.hidden) this._clearKeys();
    };
    this._onBlur = () => {
      this._clearKeys();
    };
  }

  _clearKeys() {
    this.keys = {};
  }

  connect() {
    window.addEventListener("keydown", this._onKeyDown);
    window.addEventListener("keyup", this._onKeyUp);
    document.addEventListener("mousemove", this._onMouseMove);
    document.addEventListener("pointerlockchange", this._onLockChange);
    document.addEventListener("visibilitychange", this._onVisibility);
    window.addEventListener("blur", this._onBlur);
  }

  requestLock() {
    if (this.locked) return;
    this.domElement.requestPointerLock();
  }

  isLocked() {
    return this.locked;
  }

  setColliders(colliders) {
    this.colliders = colliders;
    this._active = [];
  }

  _unstuck() {
    this.position.set(CHUNK / 2, EYE_H, CHUNK / 2);
    this.vy = 0;
    this.grounded = true;
  }

  _applyLook(bobY = 0) {
    this.camera.position.set(this.position.x, this.position.y + bobY, this.position.z);
    this.camera.up.set(0, 1, 0);
    _lookEuler.set(this.pitch, this.yaw, 0);
    this.camera.quaternion.setFromEuler(_lookEuler);
  }

  /** Walk axes = horizontal center-ray of the camera (matches crosshair) */
  _syncWalkFromCamera() {
    this.camera.getWorldDirection(_fwd);
    _fwd.y = 0;
    if (_fwd.lengthSq() < 1e-10) _fwd.set(0, 0, -1);
    else _fwd.normalize();
    _right.crossVectors(_fwd, _up).normalize();
  }

  _activeColliders(px, pz) {
    const out = this._active;
    out.length = 0;
    const pad = CHUNK * 1.1;
    for (const c of this.colliders) {
      if (px + pad < c.minX || px - pad > c.maxX || pz + pad < c.minZ || pz - pad > c.maxZ) {
        continue;
      }
      out.push(c);
    }
    return out;
  }

  _insideWall(px, pz, y) {
    const r = PLAYER_R;
    const nearby = this._activeColliders(px, pz);
    for (const c of nearby) {
      if (y < c.minY - 0.2 || y > c.maxY + 0.2) continue;
      if (px + r <= c.minX || px - r >= c.maxX || pz + r <= c.minZ || pz - r >= c.maxZ) {
        continue;
      }
      return true;
    }
    return false;
  }

  _pushOut(px, pz) {
    const r = PLAYER_R;
    const y = this.position.y;
    for (let n = 0; n < 10; n++) {
      let hit = false;
      const nearby = this._activeColliders(px, pz);
      for (const c of nearby) {
        if (y < c.minY - 0.2 || y > c.maxY + 0.2) continue;
        if (px + r <= c.minX || px - r >= c.maxX || pz + r <= c.minZ || pz - r >= c.maxZ) {
          continue;
        }
        const oL = px + r - c.minX;
        const oR = c.maxX - (px - r);
        const oF = pz + r - c.minZ;
        const oB = c.maxZ - (pz - r);
        const m = Math.min(oL, oR, oF, oB);
        if (m === oL) px -= oL;
        else if (m === oR) px += oR;
        else if (m === oF) pz -= oF;
        else pz += oB;
        hit = true;
      }
      if (!hit) break;
    }

    return { px, pz };
  }

  resolvePenetration() {
    if (!this._insideWall(this.position.x, this.position.z, this.position.y)) return;
    const out = this._pushOut(this.position.x, this.position.z);
    this.position.x = out.px;
    this.position.z = out.pz;
  }

  update(dt) {
    this._applyLook(0);
    this._syncWalkFromCamera();

    _move.set(0, 0, 0);
    if (this.keys.KeyW || this.keys.ArrowUp) _move.add(_fwd);
    if (this.keys.KeyS || this.keys.ArrowDown) _move.sub(_fwd);
    if (this.keys.KeyA || this.keys.ArrowLeft) _move.sub(_right);
    if (this.keys.KeyD || this.keys.ArrowRight) _move.add(_right);

    const running = this.keys.ShiftLeft || this.keys.ShiftRight;
    const speed = running ? RUN : WALK;

    if (_move.lengthSq() > 0) {
      _move.normalize().multiplyScalar(speed * dt);
      const nx = this.position.x + _move.x;
      const nz = this.position.z + _move.z;
      if (!this._insideWall(nx, nz, this.position.y)) {
        this.position.x = nx;
        this.position.z = nz;
      } else {
        const out = this._pushOut(nx, nz);
        this.position.x = out.px;
        this.position.z = out.pz;
      }
      if (this.grounded) this.bob += dt * BOB_SPEED * (running ? 1.3 : 1);
    } else if (this.grounded) {
      this.bob *= 0.85;
    }

    this.vy -= GRAVITY * dt;
    this.position.y += this.vy * dt;
    if (this.position.y <= EYE_H) {
      this.position.y = EYE_H;
      this.vy = 0;
      this.grounded = true;
    } else {
      this.grounded = false;
    }

    this.resolvePenetration();

    const bobY = this.grounded ? Math.sin(this.bob) * BOB_AMOUNT : 0;
    this._applyLook(bobY);
  }
}
