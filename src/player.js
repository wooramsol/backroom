import * as THREE from "three";
import {
  EYE_H,
  PLAYER_R,
  CHUNK,
  MOUSE_SENS,
  PITCH_LIMIT,
  JUMP_V,
  GRAVITY,
  BODY_WALL_CLEAR,
} from "./constants.js";

const WALK = 3.2;
const RUN = 5.8;
const BOB_SPEED = 9;
const BOB_AMOUNT = 0.035;
const BODY_R = PLAYER_R + BODY_WALL_CLEAR;
const MOVE_STEP = 0.008;
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
    this.bob = 0;
    this.vy = 0;
    this.grounded = true;

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

  _unstuck() {
    this.position.set(CHUNK / 2, EYE_H, CHUNK / 2);
    this.vy = 0;
    this.grounded = true;
  }

  _applyLook() {
    this.camera.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch;
    this.camera.rotation.z = 0;
  }

  /** Walk axes = camera center ray projected onto the floor (matches crosshair) */
  _syncMoveAxes() {
    this.camera.getWorldDirection(_fwd);
    _fwd.y = 0;
    if (_fwd.lengthSq() < 1e-10) _fwd.set(0, 0, -1);
    else _fwd.normalize();
    _right.crossVectors(_fwd, _up).normalize();
  }

  _hitsWall(px, pz, y) {
    for (const c of this.colliders) {
      if (y < c.minY - 0.2 || y > c.maxY + 0.2) continue;
      const cx = THREE.MathUtils.clamp(px, c.minX, c.maxX);
      const cz = THREE.MathUtils.clamp(pz, c.minZ, c.maxZ);
      const dx = px - cx;
      const dz = pz - cz;
      if (dx * dx + dz * dz < BODY_R * BODY_R) return true;
    }
    return false;
  }

  _pushOut(px, pz) {
    const y = this.position.y;

    for (let n = 0; n < 12; n++) {
      let hit = false;
      for (const c of this.colliders) {
        if (y < c.minY - 0.2 || y > c.maxY + 0.2) continue;

        const cx = THREE.MathUtils.clamp(px, c.minX, c.maxX);
        const cz = THREE.MathUtils.clamp(pz, c.minZ, c.maxZ);
        const dx = px - cx;
        const dz = pz - cz;
        const distSq = dx * dx + dz * dz;
        if (distSq >= BODY_R * BODY_R) continue;

        if (distSq < 1e-8) {
          const oL = px - c.minX;
          const oR = c.maxX - px;
          const oF = pz - c.minZ;
          const oB = c.maxZ - pz;
          const m = Math.min(oL, oR, oF, oB);
          if (m === oL) px += BODY_R - oL;
          else if (m === oR) px -= BODY_R - oR;
          else if (m === oF) pz += BODY_R - oF;
          else pz -= BODY_R - oB;
        } else {
          const dist = Math.sqrt(distSq);
          const push = (BODY_R - dist) / dist;
          px += dx * push;
          pz += dz * push;
        }
        hit = true;
      }
      if (!hit) break;
    }

    return { px, pz };
  }

  _tryMove(px, pz, dx, dz) {
    const target = this._pushOut(px + dx, pz + dz);
    if (!this._hitsWall(target.px, target.pz, this.position.y)) return target;

    const xOnly = this._pushOut(px + dx, pz);
    if (!this._hitsWall(xOnly.px, xOnly.pz, this.position.y)) {
      const xz = this._pushOut(xOnly.px, pz + dz);
      if (!this._hitsWall(xz.px, xz.pz, this.position.y)) return xz;
      return xOnly;
    }

    const zOnly = this._pushOut(px, pz + dz);
    if (!this._hitsWall(zOnly.px, zOnly.pz, this.position.y)) return zOnly;

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

  resolvePenetration() {
    const prevX = this.position.x;
    const prevZ = this.position.z;
    const out = this._pushOut(this.position.x, this.position.z);
    if (this._hitsWall(out.px, out.pz, this.position.y)) {
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
    this._applyLook();
    this._syncMoveAxes();

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
    if (this.position.y <= EYE_H) {
      this.position.y = EYE_H;
      this.vy = 0;
      this.grounded = true;
    } else {
      this.grounded = false;
    }

    this.resolvePenetration();

    const bobY = this.grounded ? Math.sin(this.bob) * BOB_AMOUNT : 0;
    this.camera.position.set(this.position.x, this.position.y + bobY, this.position.z);
    this._applyLook();
  }
}
