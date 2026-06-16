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
} from "./constants.js";

const WALK = 3.2;
const RUN = 5.8;
const BOB_SPEED = 9;
const BOB_AMOUNT = 0.035;
const CORNER_R = 0.12;
const BODY_HW = PLAYER_R * 0.95;
const _lookEuler = new THREE.Euler(0, 0, 0, "YXZ");

const _fwd = new THREE.Vector3();
const _right = new THREE.Vector3();
const _move = new THREE.Vector3();
const _step = new THREE.Vector3();
const _bodyPts = [
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

  _unstuck() {
    this.position.set(CHUNK / 2, EYE_H, CHUNK / 2);
    this.vy = 0;
    this.grounded = true;
  }

  _fillBodyPoints(px, pz) {
    const c = Math.cos(this.yaw);
    const s = Math.sin(this.yaw);
    const hw = BODY_HW;
    const hd = PLAYER_DEPTH;
    // Front-left, front-right, back-left, back-right — virtual torso width
    _bodyPts[0][0] = px + c * hd + s * hw;
    _bodyPts[0][1] = pz + s * hd - c * hw;
    _bodyPts[1][0] = px + c * hd - s * hw;
    _bodyPts[1][1] = pz + s * hd + c * hw;
    _bodyPts[2][0] = px - c * hd + s * hw;
    _bodyPts[2][1] = pz - s * hd - c * hw;
    _bodyPts[3][0] = px - c * hd - s * hw;
    _bodyPts[3][1] = pz - s * hd + c * hw;
    // Mid-shoulder samples — catch door jambs when center still fits the gap
    _bodyPts[4][0] = px + s * hw;
    _bodyPts[4][1] = pz - c * hw;
    _bodyPts[5][0] = px - s * hw;
    _bodyPts[5][1] = pz + c * hw;
  }

  _pushOut(px, pz) {
    const y = this.position.y;
    const r = CORNER_R;

    for (let n = 0; n < 32; n++) {
      this._fillBodyPoints(px, pz);
      let hit = false;

      for (let i = 0; i < 6; i++) {
        const sx = _bodyPts[i][0];
        const sz = _bodyPts[i][1];

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
          break;
        }
        if (hit) break;
      }
      if (!hit) break;
    }

    return { px, pz };
  }

  _moveSlide(px, pz, dx, dz) {
    let x = px + dx;
    let out = this._pushOut(x, pz);
    let z = out.pz + dz;
    out = this._pushOut(out.px, z);
    return out;
  }

  resolvePenetration() {
    const out = this._pushOut(this.position.x, this.position.z);
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
      const steps = Math.max(1, Math.ceil(_move.length() / 0.03));
      _step.copy(_move).divideScalar(steps);
      for (let i = 0; i < steps; i++) {
        const out = this._moveSlide(this.position.x, this.position.z, _step.x, _step.z);
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

    const bobY = this.grounded ? Math.sin(this.bob) * BOB_AMOUNT : 0;
    this.camera.position.set(this.position.x, this.position.y + bobY, this.position.z);
    this.camera.up.set(0, 1, 0);
    _lookEuler.set(this.pitch, this.yaw, 0);
    this.camera.quaternion.setFromEuler(_lookEuler);

    this.resolvePenetration();
  }
}
