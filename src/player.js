import * as THREE from "three";
import {
  EYE_H,
  CROUCH_EYE_H,
  CROUCH_PLAYER_R,
  CROUCH_BODY_H,
  CROUCH_SPEED,
  CROUCH_BLEND_SPEED,
  PLAYER_R,
  CHUNK,
  MOUSE_SENS,
  MOBILE_LOOK_SENS,
  MOBILE_RUN_THRESHOLD,
  PITCH_LIMIT,
  JUMP_V,
  GRAVITY,
  ROOM_H,
  MAX_EYE_Y,
  MAX_STAND_HEIGHT,
} from "./constants.js";

const WALK = 3.2;
const RUN = 5.8;
const BOB_SPEED = 9;
const BOB_AMOUNT = 0.035;
const CROUCH_BOB_AMOUNT = 0.018;
const LAND_EPS = 0.09;
const CLIMB_SNAP = 0.44;
const LAND_SNAP_BELOW = 0.26;
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
    this.mobileMode = false;
    this.mobileActive = false;
    this.mobileMove = { x: 0, y: 0 };
    this.mobileControls = null;
    this.colliders = [];
    this.bob = 0;
    this.vy = 0;
    this.grounded = true;
    this.groundY = 0;
    this._jumpFromY = 0;
    this.crouchBlend = 0;
    this.onMove = null;
    this.onJump = null;
    this.onLand = null;
    this.onLockLost = null;
    this.onLockAcquired = null;

    this.camera.rotation.order = "YXZ";

    this._onKeyDown = (e) => {
      if (e.code === "Space") {
        e.preventDefault();
        if (this.locked && this.grounded && !this.crouching) {
          this.vy = JUMP_V;
          this.grounded = false;
          this._jumpFromY = this.groundY;
          this.onJump?.();
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

  get crouching() {
    return this.inputActive && Boolean(this.keys.KeyC);
  }

  get inputActive() {
    return this.locked || (this.mobileMode && this.mobileActive);
  }

  isLocomoting() {
    if (!this.inputActive) return false;
    if (this.mobileMode && this.mobileActive) {
      const move = this.mobileControls?.move ?? this.mobileMove;
      return (move.strength ?? Math.hypot(move.x, move.y)) > 0.08;
    }
    return Boolean(
      this.keys.KeyW ||
        this.keys.KeyS ||
        this.keys.KeyA ||
        this.keys.KeyD ||
        this.keys.ArrowUp ||
        this.keys.ArrowDown ||
        this.keys.ArrowLeft ||
        this.keys.ArrowRight,
    );
  }

  _eyeHeight() {
    return THREE.MathUtils.lerp(EYE_H, CROUCH_EYE_H, this.crouchBlend);
  }

  _collisionRadius() {
    return THREE.MathUtils.lerp(PLAYER_R, CROUCH_PLAYER_R, this.crouchBlend);
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

  setMobileMode(enabled, controls = null) {
    this.mobileMode = enabled;
    this.mobileControls = controls;
  }

  startMobile() {
    this.mobileActive = true;
    this.onLockAcquired?.();
  }

  requestLock() {
    if (this.mobileMode || this.locked) return;
    this.domElement.requestPointerLock();
  }

  isLocked() {
    return this.locked;
  }

  setColliders(colliders) {
    this.colliders = colliders;
  }

  _unstuck() {
    this.crouchBlend = 0;
    this.position.set(CHUNK / 2, EYE_H, CHUNK / 2);
    this.vy = 0;
    this.grounded = true;
    this.groundY = 0;
    this._jumpFromY = 0;
  }

  _feetY() {
    return this.position.y - this._eyeHeight();
  }

  _eyeOnSupport(supportY) {
    return supportY + this._eyeHeight();
  }

  /** Eye-level probe for wall/furniture sides — matches pre-crouch behavior when standing */
  _horizontalProbeY() {
    return THREE.MathUtils.lerp(
      this.position.y,
      this._feetY() + CROUCH_BODY_H * 0.42,
      this.crouchBlend,
    );
  }

  _overlapsXZ(px, pz, c, r = this._collisionRadius()) {
    return !(px + r <= c.minX || px - r >= c.maxX || pz + r <= c.minZ || pz - r >= c.maxZ);
  }

  _maxJumpFeet() {
    return (JUMP_V * JUMP_V) / (2 * GRAVITY);
  }

  /** Can jump onto this surface from the takeoff floor */
  _canClimbTo(top, fromY = this.grounded ? this.groundY : this._jumpFromY) {
    const rise = top - fromY;
    if (rise <= LAND_EPS) return true;
    if (top > MAX_STAND_HEIGHT + 0.01) return false;
    return rise <= this._maxJumpFeet() + CLIMB_SNAP;
  }

  /** Can the player settle on this support height right now? */
  _feetAtSupport(supportY, feetY) {
    const rise = supportY - this._jumpFromY;
    if (rise <= LAND_EPS) return feetY <= supportY + LAND_EPS;
    if (feetY >= supportY - LAND_EPS) return true;

    const jumpPeakFeet = this._jumpFromY + this._maxJumpFeet();
    if (rise > this._maxJumpFeet() + LAND_EPS) {
      return (
        feetY >= jumpPeakFeet - LAND_SNAP_BELOW &&
        feetY <= jumpPeakFeet + LAND_EPS &&
        feetY < supportY + LAND_EPS
      );
    }

    return false;
  }

  /** Highest standable surface under the player feet */
  _findSupportY(px, pz, feetY, vy, dt) {
    let best = 0;
    const nextFeet = feetY + vy * dt;
    const r = PLAYER_R;
    const jumpPeakFeet = this._jumpFromY + this._maxJumpFeet();

    for (const c of this.colliders) {
      if (!c.standable || c.standTopY === undefined) continue;
      if (!this._overlapsXZ(px, pz, c, r)) continue;

      const top = c.standTopY;
      const rise = top - this._jumpFromY;
      const onTop = Math.abs(feetY - top) < LAND_EPS;

      if (onTop && !(vy > 0.35 && rise > LAND_EPS)) {
        best = Math.max(best, top);
        continue;
      }

      if (!this._canClimbTo(top, this._jumpFromY)) continue;

      const crossing =
        vy <= 0 && feetY >= top - LAND_EPS && nextFeet <= top + LAND_EPS;
      if (crossing) {
        best = Math.max(best, top);
        continue;
      }

      const needsAssist = rise > this._maxJumpFeet() + LAND_EPS;
      const nearJumpPeak =
        vy <= 0.5 &&
        vy >= -1.8 &&
        feetY >= jumpPeakFeet - LAND_SNAP_BELOW &&
        feetY <= jumpPeakFeet + LAND_EPS;
      if (needsAssist && nearJumpPeak && feetY < top - LAND_EPS) {
        best = Math.max(best, top);
      }
    }

    return best;
  }

  _applyLook(bobY = 0) {
    this.camera.position.set(this.position.x, this.position.y + bobY, this.position.z);
    this.camera.up.set(0, 1, 0);
    _lookEuler.set(this.pitch, this.yaw, 0);
    this.camera.quaternion.setFromEuler(_lookEuler);
    this.camera.updateMatrixWorld(true);
  }

  _syncWalkFromCamera() {
    this.camera.getWorldDirection(_fwd);
    _fwd.y = 0;
    if (_fwd.lengthSq() < 1e-10) _fwd.set(0, 0, -1);
    else _fwd.normalize();
    _right.crossVectors(_fwd, _up).normalize();
  }

  _blocksHorizontal(c, y) {
    if (c.isCeiling) return false;

    const top = c.standTopY ?? c.maxY;
    if (c.isFurniture && top !== undefined) {
      const feetY = this._feetY();
      if (feetY < top - LAND_EPS) {
        const fromY = this.grounded ? this.groundY : this._jumpFromY;
        if (!this._canClimbTo(top, fromY) && feetY >= c.minY - 0.2 && feetY <= top + 0.15) {
          return true;
        }
      }
    }

    if (y < c.minY - 0.2 || y > c.maxY + 0.2) return false;
    return true;
  }

  _insideWall(px, pz) {
    const y = this._horizontalProbeY();
    const r = this._collisionRadius();
    for (const c of this.colliders) {
      if (!this._blocksHorizontal(c, y)) continue;
      if (px + r <= c.minX || px - r >= c.maxX || pz + r <= c.minZ || pz - r >= c.maxZ) {
        continue;
      }
      return true;
    }
    return false;
  }

  _pushOut(px, pz) {
    const y = this._horizontalProbeY();
    const r = this._collisionRadius();

    for (let n = 0; n < 14; n++) {
      let hit = false;
      for (const c of this.colliders) {
        if (!this._blocksHorizontal(c, y)) continue;
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
    if (!this._insideWall(this.position.x, this.position.z)) return;
    const out = this._pushOut(this.position.x, this.position.z);
    this.position.x = out.px;
    this.position.z = out.pz;
  }

  _applyMobileLook() {
    if (!this.mobileMode || !this.mobileActive || !this.mobileControls) return;
    const { dx, dy } = this.mobileControls.consumeLook();
    if (dx === 0 && dy === 0) return;
    this.yaw -= dx * MOBILE_LOOK_SENS;
    this.pitch -= dy * MOBILE_LOOK_SENS;
    this.pitch = THREE.MathUtils.clamp(this.pitch, -PITCH_LIMIT, PITCH_LIMIT);
  }

  _tryMobileJump() {
    if (!this.mobileMode || !this.mobileActive || !this.mobileControls) return;
    if (!this.mobileControls.consumeJump()) return;
    if (this.grounded && !this.crouching) {
      this.vy = JUMP_V;
      this.grounded = false;
      this._jumpFromY = this.groundY;
      this.onJump?.();
    }
  }

  update(dt) {
    if (!this.inputActive) return;

    this._applyMobileLook();
    this._tryMobileJump();

    const crouchTarget = this.crouching ? 1 : 0;
    this.crouchBlend += (crouchTarget - this.crouchBlend) * Math.min(1, CROUCH_BLEND_SPEED * dt);

    this._applyLook(0);
    this._syncWalkFromCamera();

    _move.set(0, 0, 0);
    let mobileStickStrength = 0;
    if (this.mobileMode && this.mobileActive) {
      const move = this.mobileControls?.move ?? this.mobileMove;
      const { x, y } = move;
      mobileStickStrength = move.strength ?? Math.hypot(x, y);
      _move.addScaledVector(_fwd, -y);
      _move.addScaledVector(_right, x);
    } else {
      if (this.keys.KeyW || this.keys.ArrowUp) _move.add(_fwd);
      if (this.keys.KeyS || this.keys.ArrowDown) _move.sub(_fwd);
      if (this.keys.KeyA || this.keys.ArrowLeft) _move.sub(_right);
      if (this.keys.KeyD || this.keys.ArrowRight) _move.add(_right);
    }

    const shiftRun = this.keys.ShiftLeft || this.keys.ShiftRight;
    const mobileRun =
      this.mobileMode && this.mobileActive && mobileStickStrength >= MOBILE_RUN_THRESHOLD;
    const running = !this.crouching && (shiftRun || mobileRun);
    const speed = this.crouching ? CROUCH_SPEED : running ? RUN : WALK;

    const px0 = this.position.x;
    const pz0 = this.position.z;
    let moved = 0;

    if (_move.lengthSq() > 0) {
      _move.normalize().multiplyScalar(speed * dt);
      const nx = this.position.x + _move.x;
      const nz = this.position.z + _move.z;
      if (!this._insideWall(nx, nz)) {
        this.position.x = nx;
        this.position.z = nz;
      } else {
        const out = this._pushOut(nx, nz);
        this.position.x = out.px;
        this.position.z = out.pz;
      }
      moved = Math.hypot(this.position.x - px0, this.position.z - pz0);
      if (this.grounded) this.bob += dt * BOB_SPEED * (this.crouching ? 0.75 : running ? 1.3 : 1);
    } else if (this.grounded) {
      this.bob *= 0.85;
    }

    if (moved > 0 && this.grounded) this.onMove?.(moved, running, this.crouching, speed);

    const wasGrounded = this.grounded;

    const feetY = this._feetY();
    const supportY = this._findSupportY(this.position.x, this.position.z, feetY, this.vy, dt);
    const targetEyeY = Math.min(this._eyeOnSupport(supportY), MAX_EYE_Y);

    this.vy -= GRAVITY * dt;
    let nextEyeY = this.position.y + this.vy * dt;

    if (nextEyeY > MAX_EYE_Y) {
      nextEyeY = MAX_EYE_Y;
      this.vy = 0;
    }

    if (nextEyeY <= targetEyeY && this.vy <= 0 && this._feetAtSupport(supportY, feetY)) {
      const impactVy = Math.abs(this.vy);
      const justLanded = !wasGrounded;
      this.position.y = targetEyeY;
      this.vy = 0;
      this.grounded = true;
      this.groundY = supportY;
      if (justLanded) this.onLand?.(impactVy);
    } else {
      this.position.y = nextEyeY;
      this.grounded = false;
    }

    this.resolvePenetration();

    const bobAmt = THREE.MathUtils.lerp(BOB_AMOUNT, CROUCH_BOB_AMOUNT, this.crouchBlend);
    const bobY = this.grounded ? Math.sin(this.bob) * bobAmt : 0;
    this._applyLook(bobY);
  }
}
