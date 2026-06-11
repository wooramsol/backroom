import * as THREE from "three";

const PLAYER_RADIUS = 0.35;
const EYE_HEIGHT = 1.65;
const WALK_SPEED = 3.2;
const RUN_SPEED = 5.8;

export class Player {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;
    this.position = new THREE.Vector3(0, EYE_HEIGHT, 2);
    this.velocity = new THREE.Vector3();
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

  disconnect() {
    window.removeEventListener("keydown", this._onKeyDown);
    window.removeEventListener("keyup", this._onKeyUp);
    document.removeEventListener("mousemove", this._onMouseMove);
    document.removeEventListener("pointerlockchange", this._onLockChange);
  }

  requestLock() {
    this.domElement.requestPointerLock();
  }

  setColliders(colliders) {
    this.colliders = colliders;
  }

  _resolveAxis(pos, axis, delta) {
    if (delta === 0) return 0;

    const next = pos[axis] + delta;
    const r = PLAYER_RADIUS;

    for (const c of this.colliders) {
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

  update(dt) {
    const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));
    const move = new THREE.Vector3();

    if (this.keys["KeyW"] || this.keys["ArrowUp"]) move.add(forward);
    if (this.keys["KeyS"] || this.keys["ArrowDown"]) move.sub(forward);
    if (this.keys["KeyA"] || this.keys["ArrowLeft"]) move.sub(right);
    if (this.keys["KeyD"] || this.keys["ArrowRight"]) move.add(right);

    const running = this.keys["ShiftLeft"] || this.keys["ShiftRight"];
    const speed = running ? RUN_SPEED : WALK_SPEED;

    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(speed * dt);
      const dx = this._resolveAxis(this.position, "x", move.x);
      this.position.x += dx;
      const dz = this._resolveAxis(this.position, "z", move.z);
      this.position.z += dz;
    }

    this.camera.position.copy(this.position);
    this.camera.rotation.order = "YXZ";
    this.camera.rotation.y = this.yaw;
    this.camera.rotation.x = this.pitch;
  }
}
