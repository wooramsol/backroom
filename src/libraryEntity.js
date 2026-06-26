import * as THREE from "three";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";
import { CAMERA_FOV } from "./constants.js";
import { createRng } from "./rng.js";

const IDLE_SPAWN = 10;
const SPAWN_NEAR = 1.4;
const SPAWN_PROBE_STEP = 0.35;
const SPAWN_PROBE_MAX = 52;
const SPAWN_BODY_R = 0.42;
const SPAWN_WALL_CLEAR = 0.24;
const LOS_SAMPLE_STEP = 0.28;
const VANISH_MARGIN = 1.5;
const VANISH_MIN = 1.2;
const LOOK_TURN_SPEED = 5.5;

const _fwd = new THREE.Vector3();

function lerpYaw(current, target, t) {
  let delta = target - current;
  if (delta > Math.PI) delta -= Math.PI * 2;
  if (delta < -Math.PI) delta += Math.PI * 2;
  return current + delta * t;
}

function pickClip(clips, patterns) {
  for (const re of patterns) {
    const hit = clips.find((c) => re.test(c.name));
    if (hit) return hit;
  }
  return clips[0] || null;
}

function isBlockedAt(x, z, colliders, probeY, wallsOnly = false) {
  for (const c of colliders) {
    if (c.isCeiling) continue;
    if (wallsOnly && c.isFurniture) continue;
    if (probeY < c.minY - 0.2 || probeY > c.maxY + 0.2) continue;
    if (x >= c.minX && x <= c.maxX && z >= c.minZ && z <= c.maxZ) return true;
  }
  return false;
}

function isWallBlockedAt(x, z, colliders, probeY) {
  return isBlockedAt(x, z, colliders, probeY, true);
}

const _bodyFootprintSamples = [
  [0, 0],
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [0.75, 0.75],
  [0.75, -0.75],
  [-0.75, 0.75],
  [-0.75, -0.75],
].map(([x, z]) => [x * SPAWN_BODY_R, z * SPAWN_BODY_R]);

function distToWallBoxXZ(x, z, box) {
  const dx = Math.max(box.minX - x, 0, x - box.maxX);
  const dz = Math.max(box.minZ - z, 0, z - box.maxZ);
  return Math.hypot(dx, dz);
}

function isClearOfWalls(x, z, colliders, probeY, clearance) {
  for (const c of colliders) {
    if (c.isCeiling || c.isFurniture) continue;
    if (probeY < c.minY - 0.15 || probeY > c.maxY + 0.15) continue;
    if (distToWallBoxXZ(x, z, c) < clearance) return false;
  }
  return true;
}

function isClearSpawnSite(x, z, colliders, groundY) {
  const probeYs = [groundY + 0.55, groundY + 1.1, groundY + 1.55];
  const centerClear = SPAWN_BODY_R + SPAWN_WALL_CLEAR;
  const ringClear = 0.16;

  for (const probeY of probeYs) {
    if (!isClearOfWalls(x, z, colliders, probeY, centerClear)) return false;
    for (const [ox, oz] of _bodyFootprintSamples) {
      const sx = x + ox;
      const sz = z + oz;
      if (isBlockedAt(sx, sz, colliders, probeY, false)) return false;
      if (!isClearOfWalls(sx, sz, colliders, probeY, ringClear)) return false;
    }
  }
  return true;
}

/** Wall gaps (doorways) only — lets probes reach into the next room */
function hasWallClearPath(ax, az, bx, bz, colliders, probeY) {
  const dx = bx - ax;
  const dz = bz - az;
  const len = Math.hypot(dx, dz);
  if (len < 0.05) return true;
  const steps = Math.max(2, Math.ceil(len / LOS_SAMPLE_STEP));
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    if (isWallBlockedAt(ax + dx * t, az + dz * t, colliders, probeY)) return false;
  }
  return true;
}

/** March along camera view — visible floor only, not player walk path */
function probeAlongView(player, dirX, dirZ, colliders, minD = SPAWN_NEAR, maxD = SPAWN_PROBE_MAX) {
  const cam = player.camera.position;
  const camX = cam.x;
  const camZ = cam.z;
  const probeY = player.groundY + 1.1;
  const groundY = player.groundY;
  const px = player.position.x;
  const pz = player.position.z;

  let best = null;
  for (let d = minD; d <= maxD; d += SPAWN_PROBE_STEP) {
    const wx = camX + dirX * d;
    const wz = camZ + dirZ * d;
    if (!hasWallClearPath(camX, camZ, wx, wz, colliders, probeY)) break;
    if (!isClearSpawnSite(wx, wz, colliders, groundY)) continue;
    best = {
      wx,
      wz,
      viewDist: d,
      dist: Math.hypot(wx - px, wz - pz),
    };
  }

  return best;
}

function dirFromOffset(offset) {
  const cos = Math.cos(offset);
  const sin = Math.sin(offset);
  return {
    x: _fwd.x * cos - _fwd.z * sin,
    z: _fwd.x * sin + _fwd.z * cos,
  };
}

function findSpawnSpot(player, colliders, rng) {
  player.camera.getWorldDirection(_fwd);
  _fwd.y = 0;
  if (_fwd.lengthSq() < 1e-10) {
    _fwd.set(Math.sin(player.yaw), 0, Math.cos(player.yaw));
  } else {
    _fwd.normalize();
  }

  const halfFov = THREE.MathUtils.degToRad(CAMERA_FOV * 0.48);
  const angles = [];

  for (let i = 0; i <= 14; i++) {
    angles.push(-halfFov + ((halfFov * 2) * i) / 14);
  }
  angles.push(0);
  for (let i = 0; i < 6; i++) {
    angles.push(rng.range(-halfFov * 0.35, halfFov * 0.35));
  }
  for (let i = 0; i < 4; i++) {
    const side = rng.chance(0.5) ? 1 : -1;
    angles.push(side * rng.range(halfFov * 1.02, halfFov * 1.55));
  }

  let best = null;
  for (const offset of angles) {
    const { x, z } = dirFromOffset(offset);
    const spot = probeAlongView(player, x, z, colliders);
    if (spot && (!best || spot.viewDist > best.viewDist)) best = spot;
  }

  return best;
}

/** Library — appears far in view after 10s idle; stays until approached */
export class LibraryEntity {
  constructor(data, scene) {
    this.data = data;
    this.scene = scene;
    this.root = null;
    this.model = null;
    this.mixer = null;
    this.active = false;
    this.worldX = 0;
    this.worldZ = 0;
    this.groundY = 0;
    this._vanishDist = VANISH_MIN;
    this._idleT = 0;
    this._seed = 1307;
  }

  begin(player) {
    this._idleT = 0;
    this._hide();
  }

  _hide() {
    this.active = false;
    if (this.root) this.root.visible = false;
  }

  _facePlayer(player, dt) {
    if (!this.root) return;
    const dx = player.position.x - this.worldX;
    const dz = player.position.z - this.worldZ;
    const targetYaw = Math.atan2(dx, dz);
    const blend = 1 - Math.exp(-LOOK_TURN_SPEED * dt);
    this.root.rotation.y = lerpYaw(this.root.rotation.y, targetYaw, blend);
  }

  _spawnInView(player, colliders) {
    if (!this.data?.model) return false;

    const rng = createRng(
      Math.floor(player.position.x),
      Math.floor(player.position.z),
      this._seed,
    );
    this._seed += 1;

    const spot = findSpawnSpot(player, colliders, rng);
    if (!spot) return false;

    const vanishMax = Math.max(VANISH_MIN + 0.3, spot.dist - VANISH_MARGIN);
    const vanishMin = Math.min(VANISH_MIN, vanishMax * 0.5);
    this._vanishDist = Math.min(rng.range(vanishMin, vanishMax), spot.dist - 0.7);

    if (!this.root) {
      this.root = new THREE.Group();
      this.model = SkeletonUtils.clone(this.data.model);
      this.model.traverse((obj) => {
        if (obj.isMesh) obj.frustumCulled = false;
      });
      this.root.add(this.model);
      this.scene.add(this.root);

      this.mixer = new THREE.AnimationMixer(this.model);
      const clip = pickClip(this.data.animations || [], [/idle/i]);
      if (clip) {
        const action = this.mixer.clipAction(clip);
        action.setLoop(THREE.LoopRepeat);
        action.play();
      }
    }

    this.worldX = spot.wx;
    this.worldZ = spot.wz;
    this.groundY = player.groundY;
    this.root.position.set(spot.wx, player.groundY - (this.data.footOffset ?? 0), spot.wz);
    this.root.visible = true;
    this.active = true;

    const dx = player.position.x - spot.wx;
    const dz = player.position.z - spot.wz;
    this.root.rotation.y = Math.atan2(dx, dz);
    return true;
  }

  update(dt, player, colliders) {
    if (!this.data?.model) return;

    if (player.isLocomoting()) {
      this._idleT = 0;
    } else {
      this._idleT += dt;
      if (this._idleT >= IDLE_SPAWN && !this.active) {
        this._spawnInView(player, colliders);
      }
    }

    if (this.active) {
      this._facePlayer(player, dt);

      const dx = player.position.x - this.worldX;
      const dz = player.position.z - this.worldZ;
      if (Math.hypot(dx, dz) <= this._vanishDist) {
        this._hide();
        this._idleT = 0;
      }
    }

    this.mixer?.update(dt);
  }
}
