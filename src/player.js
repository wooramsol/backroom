import * as THREE from "three";
import { FLOOR_STEP, MIN_FLOOR, MAX_FLOOR } from "./roomGen.js";

const PLAYER_RADIUS = 0.28;
const EYE_HEIGHT = 1.62;
const WALK_SPEED = 3.5;
const RUN_SPEED = 6;

export class Player {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;
    this.position = new THREE.Vector3(0, EYE_HEIGHT, 0);
    this.floor = 0;
    this.stairT = 0;
    this.activeStair = null;
    this.climbingUp = true;
    this.yaw = 0;
    this.pitch = 0;
    this.keys = {};
    this.locked = false;
    this.walls = [];
    this.stairs = [];

    this._onKeyDown = (e) => {
      this.keys[e.code] = true;
      if (e.code === "KeyR") this._unstuck();
    };
    this._onKeyUp = (e) => {
      this.keys[e.code] = false;
    };
    this._onMouseMove = (e) => {
      if (!this.locked) return;
      this.yaw -= e.movementX * 0.002;
      this.pitch -= e.movementY * 0.002;
      this.pitch = Math.max(-Math.PI / 2 + 0.05, Math.min(Math.PI / 2 - 0.05, this.pitch));
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

  setWalls(walls) {
    this.walls = walls;
  }

  setStairs(stairs) {
    this.stairs = stairs;
  }

  _unstuck() {
    this.position.set(0, this.floor * FLOOR_STEP + EYE_HEIGHT, 0);
    this.stairT = 0;
    this.activeStair = null;
  }

  _insideWall(px, pz, c) {
    const r = PLAYER_RADIUS;
    return px + r > c.minX && px - r < c.maxX && pz + r > c.minZ && pz - r < c.maxZ;
  }

  _pushOut(px, pz) {
    for (let iter = 0; iter < 4; iter++) {
      for (const c of this.walls) {
        if (this.position.y < c.minY - 0.2 || this.position.y > c.maxY + 0.2) continue;
        if (!this._insideWall(px, pz, c)) continue;
        const overlapL = px + PLAYER_RADIUS - c.minX;
        const overlapR = c.maxX - (px - PLAYER_RADIUS);
        const overlapF = pz + PLAYER_RADIUS - c.minZ;
        const overlapB = c.maxZ - (pz - PLAYER_RADIUS);
        const min = Math.min(overlapL, overlapR, overlapF, overlapB);
        if (min === overlapL) px -= overlapL;
        else if (min === overlapR) px += overlapR;
        else if (min === overlapF) pz -= overlapF;
        else pz += overlapB;
      }
    }
    return { px, pz };
  }

  _inStairZone(s) {
    return (
      Math.abs(this.position.x - s.cx) < s.width / 2 + 0.35 &&
      Math.abs(this.position.z - s.cz) < s.depth / 2 + 0.35
    );
  }

  _moveDir() {
    const f = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    const move = new THREE.Vector3();
    if (this.keys["KeyW"] || this.keys["ArrowUp"]) move.add(f);
    if (this.keys["KeyS"] || this.keys["ArrowDown"]) move.sub(f);
    if (this.keys["KeyA"] || this.keys["ArrowLeft"]) move.add(new THREE.Vector3(f.z, 0, -f.x));
    if (this.keys["KeyD"] || this.keys["ArrowRight"]) move.sub(new THREE.Vector3(f.z, 0, -f.x));
    if (move.lengthSq() < 1e-6) return null;
    return move.normalize();
  }

  _dotMove(s, dx, dz) {
    const m = this._moveDir();
    if (!m) return this.keys["KeyE"] || this.keys["KeyW"] || this.keys["ArrowUp"];
    return m.x * dx + m.z * dz > 0.15;
  }

  _tryStairs(dt) {
    let shaft = this.activeStair;

    if (!shaft) {
      for (const s of this.stairs) {
        if (!this._inStairZone(s)) continue;
        if (this.floor === s.lowerFloor || this.floor === s.upperFloor) {
          shaft = s;
          break;
        }
      }
    }

    if (!shaft) {
      this.stairT = 0;
      return false;
    }

    const onLower = this.floor === shaft.lowerFloor;
    const onUpper = this.floor === shaft.upperFloor;
    if (!onLower && !onUpper) return false;

    const upDx = shaft.dirX;
    const upDz = shaft.dirZ;
    const wantUp = onLower && this._dotMove(shaft, upDx, upDz);
    const wantDown = onUpper && this._dotMove(shaft, -upDx, -upDz);

    if (!wantUp && !wantDown && this.stairT <= 0) {
      this.activeStair = null;
      return false;
    }

    this.activeStair = shaft;
    this.climbingUp = wantUp || (!wantDown && this.climbingUp);

    if (wantDown && onUpper) this.climbingUp = false;
    if (wantUp && onLower) this.climbingUp = true;

    this.stairT += dt * 0.95;

    if (this.climbingUp) {
      this.position.y = shaft.fromY + EYE_HEIGHT + this.stairT * FLOOR_STEP;
      if (this.stairT >= 1) {
        this.floor = shaft.upperFloor;
        this.stairT = 0;
        this.activeStair = null;
        this.position.set(
          shaft.cx + upDx * 0.5,
          this.floor * FLOOR_STEP + EYE_HEIGHT,
          shaft.cz + upDz * 0.5
        );
      }
    } else {
      this.position.y = shaft.toY + EYE_HEIGHT - this.stairT * FLOOR_STEP;
      if (this.stairT >= 1) {
        this.floor = shaft.lowerFloor;
        this.stairT = 0;
        this.activeStair = null;
        this.position.set(
          shaft.cx - upDx * 0.5,
          this.floor * FLOOR_STEP + EYE_HEIGHT,
          shaft.cz - upDz * 0.5
        );
      }
    }

    return true;
  }

  update(dt) {
    const onStairs = this._tryStairs(dt);

    if (!onStairs) {
      const move = new THREE.Vector3();
      const f = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
      const r = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
      if (this.keys["KeyW"] || this.keys["ArrowUp"]) move.add(f);
      if (this.keys["KeyS"] || this.keys["ArrowDown"]) move.sub(f);
      if (this.keys["KeyA"] || this.keys["ArrowLeft"]) move.sub(r);
      if (this.keys["KeyD"] || this.keys["ArrowRight"]) move.add(r);

      const speed = this.keys["ShiftLeft"] || this.keys["ShiftRight"] ? RUN_SPEED : WALK_SPEED;
      if (move.lengthSq() > 0) {
        move.normalize().multiplyScalar(speed * dt);
        let px = this.position.x + move.x;
        let pz = this.position.z + move.z;
        const pushed = this._pushOut(px, pz);
        this.position.x = pushed.px;
        this.position.z = pushed.pz;
      }
      this.position.y = this.floor * FLOOR_STEP + EYE_HEIGHT;
    }

    this.floor = Math.max(MIN_FLOOR, Math.min(MAX_FLOOR, this.floor));

    this.camera.position.copy(this.position);
    this.camera.rotation.order = "YXZ";
    this.camera.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch;
  }
}
