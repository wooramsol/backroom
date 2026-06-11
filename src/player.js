import * as THREE from "three";
import { FLOOR_STEP } from "./roomGen.js";

const PLAYER_RADIUS = 0.32;
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
  }

  _resolveAxis(pos, axis, delta) {
    if (delta === 0) return 0;
    const next = pos[axis] + delta;
    const r = PLAYER_RADIUS;

    for (const c of this.walls) {
      const minA = axis === "x" ? c.minX : c.minZ;
      const maxA = axis === "x" ? c.maxX : c.maxZ;
      const minB = axis === "x" ? c.minZ : c.minX;
      const maxB = axis === "x" ? c.maxZ : c.maxX;
      const posA = next;
      const posB = axis === "x" ? pos.z : pos.x;

      if (posB + r > minB && posB - r < maxB && posA + r > minA && posA - r < maxA) {
        return delta > 0 ? minA - r - pos[axis] : maxA + r - pos[axis];
      }
    }
    return delta;
  }

  _tryStairs(dt) {
    const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    const moving = this.keys["KeyW"] || this.keys["ArrowUp"];

    for (const s of this.stairs) {
      if (s.sourceFloor !== this.floor) continue;

      const lx = this.position.x - s.cx;
      const lz = this.position.z - s.cz;
      const along = lx * s.dirX + lz * s.dirZ;
      const across = Math.abs(lx * s.dirZ - lz * s.dirX);

      if (across < s.width * 0.5 && along > -0.3 && along < s.depth) {
        const dot = forward.x * s.dirX + forward.z * s.dirZ;
        if (moving && dot > 0.15) {
          this.stairT += dt * 0.65;
          this.position.y = s.fromY + EYE_HEIGHT + this.stairT * FLOOR_STEP;
          if (this.stairT >= 1) {
            this.floor = s.targetFloor;
            this.stairT = 0;
            this.position.x = s.cx;
            this.position.z = s.cz + s.dirZ * 1.5;
          }
          return true;
        }
      }
    }

    this.stairT = 0;
    return false;
  }

  update(dt) {
    const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    const move = new THREE.Vector3();

    if (this.keys["KeyW"] || this.keys["ArrowUp"]) move.add(forward);
    if (this.keys["KeyS"] || this.keys["ArrowDown"]) move.sub(forward);
    if (this.keys["KeyA"] || this.keys["ArrowLeft"]) move.sub(right);
    if (this.keys["KeyD"] || this.keys["ArrowRight"]) move.add(right);

    const speed = this.keys["ShiftLeft"] || this.keys["ShiftRight"] ? RUN_SPEED : WALK_SPEED;

    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(speed * dt);
      this.position.x += this._resolveAxis(this.position, "x", move.x);
      this.position.z += this._resolveAxis(this.position, "z", move.z);
    }

    if (!this._tryStairs(dt)) {
      this.position.y = this.floor * FLOOR_STEP + EYE_HEIGHT;
    }

    this.camera.position.copy(this.position);
    this.camera.rotation.order = "YXZ";
    this.camera.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch;
  }
}
