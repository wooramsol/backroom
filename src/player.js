import * as THREE from "three";
import { FLOOR_STEP } from "./roomGen.js";

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

  _insideWall(px, pz, c) {
    const r = PLAYER_RADIUS;
    return (
      px + r > c.minX &&
      px - r < c.maxX &&
      pz + r > c.minZ &&
      pz - r < c.maxZ
    );
  }

  _pushOut(px, pz) {
    const r = PLAYER_RADIUS;
    for (let iter = 0; iter < 4; iter++) {
      for (const c of this.walls) {
        if (this.position.y < c.minY - 0.2 || this.position.y > c.maxY + 0.2) continue;
        if (!this._insideWall(px, pz, c)) continue;

        const overlapL = px + r - c.minX;
        const overlapR = c.maxX - (px - r);
        const overlapF = pz + r - c.minZ;
        const overlapB = c.maxZ - (pz - r);
        const min = Math.min(overlapL, overlapR, overlapF, overlapB);

        if (min === overlapL) px -= overlapL;
        else if (min === overlapR) px += overlapR;
        else if (min === overlapF) pz -= overlapF;
        else pz += overlapB;
      }
    }
    return { px, pz };
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

      if (across < s.width * 0.5 && along > -0.5 && along < s.depth) {
        const dot = forward.x * s.dirX + forward.z * s.dirZ;
        if (moving && dot > 0.1) {
          this.stairT += dt * 0.65;
          this.position.y = s.fromY + EYE_HEIGHT + this.stairT * FLOOR_STEP;
          if (this.stairT >= 1) {
            this.floor = s.targetFloor;
            this.stairT = 0;
            this.position.set(s.cx, this.floor * FLOOR_STEP + EYE_HEIGHT, s.cz + s.dirZ * 2);
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
      let px = this.position.x + move.x;
      let pz = this.position.z + move.z;
      const pushed = this._pushOut(px, pz);
      this.position.x = pushed.px;
      this.position.z = pushed.pz;
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
