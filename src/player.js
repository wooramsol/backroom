import * as THREE from "three";
import { FLOOR_STEP } from "./roomGen.js";

const PLAYER_RADIUS = 0.32;
const EYE_HEIGHT = 1.62;
const WALK_SPEED = 3.4;
const RUN_SPEED = 6;

export class Player {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;
    this.position = new THREE.Vector3(0, EYE_HEIGHT, 0);
    this.floor = 0;
    this.yaw = 0;
    this.pitch = 0;
    this.keys = {};
    this.locked = false;
    this.colliders = [];

    this._onKeyDown = (e) => {
      this.keys[e.code] = true;
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

  setColliders(colliders) {
    this.colliders = colliders;
  }

  _activeColliders() {
    const y = this.position.y;
    return this.colliders.filter((c) => y >= c.minY - 0.15 && y <= c.maxY + 0.15);
  }

  _inside(px, pz, c) {
    const r = PLAYER_RADIUS;
    return px + r > c.minX && px - r < c.maxX && pz + r > c.minZ && pz - r < c.maxZ;
  }

  _pushOut(px, pz) {
    const walls = this._activeColliders();
    for (let iter = 0; iter < 8; iter++) {
      let moved = false;
      for (const c of walls) {
        if (!this._inside(px, pz, c)) continue;
        const r = PLAYER_RADIUS;
        const overlapL = px + r - c.minX;
        const overlapR = c.maxX - (px - r);
        const overlapF = pz + r - c.minZ;
        const overlapB = c.maxZ - (pz - r);
        const min = Math.min(overlapL, overlapR, overlapF, overlapB);
        if (min === overlapL) px -= overlapL;
        else if (min === overlapR) px += overlapR;
        else if (min === overlapF) pz -= overlapF;
        else pz += overlapB;
        moved = true;
      }
      if (!moved) break;
    }
    return { px, pz };
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
      const steps = Math.max(1, Math.ceil(move.length() / 0.12));
      const step = move.clone().divideScalar(steps);
      for (let i = 0; i < steps; i++) {
        let px = this.position.x + step.x;
        let pz = this.position.z + step.z;
        const pushed = this._pushOut(px, pz);
        this.position.x = pushed.px;
        this.position.z = pushed.pz;
      }
    }

    this.position.y = this.floor * FLOOR_STEP + EYE_HEIGHT;

    this.camera.position.copy(this.position);
    this.camera.rotation.order = "YXZ";
    this.camera.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch;
  }
}
