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
const MOVE_STEP = 0.05;
const _lookEuler = new THREE.Euler(0, 0, 0, "YXZ");

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

  /** Horizontal walk axes from yaw — same basis as camera look (crosshair center) */
  _walkBasis(fwd, right) {
    fwd.set(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    right.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
  }

  _applyLook(bobY = 0) {
    this.camera.position.set(this.position.x, this.position.y + bobY, this.position.z);
    this.camera.up.set(0, 1, 0);
    _lookEuler.set(this.pitch, this.yaw, 0);
    this.camera.quaternion.setFromEuler(_lookEuler);
  }

  _pushOut(px, pz) {
    const r = PLAYER_R;
    const y = this.position.y;

    for (let n = 0; n < 14; n++) {
      let hit = false;
      for (const c of this.colliders) {
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
    const out = this._pushOut(this.position.x, this.position.z);
    this.position.x = out.px;
    this.position.z = out.pz;
  }

  update(dt) {
    const fwd = new THREE.Vector3();
    const right = new THREE.Vector3();
    const move = new THREE.Vector3();
    this._walkBasis(fwd, right);

    if (this.keys.KeyW || this.keys.ArrowUp) move.add(fwd);
    if (this.keys.KeyS || this.keys.ArrowDown) move.sub(fwd);
    if (this.keys.KeyA || this.keys.ArrowLeft) move.sub(right);
    if (this.keys.KeyD || this.keys.ArrowRight) move.add(right);

    const running = this.keys.ShiftLeft || this.keys.ShiftRight;
    const speed = running ? RUN : WALK;

    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(speed * dt);
      const steps = Math.max(1, Math.ceil(move.length() / MOVE_STEP));
      const step = move.clone().divideScalar(steps);
      for (let i = 0; i < steps; i++) {
        const out = this._pushOut(this.position.x + step.x, this.position.z + step.z);
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
