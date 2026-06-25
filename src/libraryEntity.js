import * as THREE from "three";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";
import { CAMERA_FOV } from "./constants.js";
import { createRng } from "./rng.js";

const IDLE_SPAWN = 10;
const SPAWN_NEAR = 1.4;
const SPAWN_PROBE_STEP = 0.25;
const SPAWN_PROBE_MAX = 14;
const SPAWN_BODY_R = 0.42;
const SPAWN_WALL_MARGIN = 0.35;
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

function lookForward(player) {
  player.camera.getWorldDirection(_fwd);
  _fwd.y = 0;
  if (_fwd.lengthSq() < 1e-10) {
    _fwd.set(Math.sin(player.yaw), 0, Math.cos(player.yaw));
  } else {
    _fwd.normalize();
  }
}

function isBlockedAt(x, z, colliders, probeY) {
  for (const c of colliders) {
    if (c.isCeiling) continue;
    if (probeY < c.minY - 0.2 || probeY > c.maxY + 0.2) continue;
    if (x >= c.minX && x <= c.maxX && z >= c.minZ && z <= c.maxZ) return true;
  }
  return false;
}

const _footprintSamples = [
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

function isClearFootprint(x, z, colliders, probeY) {
  for (const [ox, oz] of _footprintSamples) {
    if (isBlockedAt(x + ox, z + oz, colliders, probeY)) return false;
  }
  return true;
}

/** March along a direction until a blocker; return last clear floor point in view */
function probeAlong(player, dirX, dirZ, colliders, rng, minD = SPAWN_NEAR, maxD = SPAWN_PROBE_MAX) {
  const px = player.position.x;
  const pz = player.position.z;
  const probeY = player.groundY + 1.1;

  let furthest = null;
  for (let d = minD; d <= maxD; d += SPAWN_PROBE_STEP) {
    const wx = px + dirX * d;
    const wz = pz + dirZ * d;
    if (!isClearFootprint(wx, wz, colliders, probeY)) break;
    furthest = d;
  }

  if (furthest === null) return null;

  const safeMax = Math.max(minD, furthest - SPAWN_WALL_MARGIN);
  const preferMax = Math.min(safeMax, 10);
  const preferMin = Math.max(SPAWN_NEAR, Math.min(3.5, preferMax * 0.55));
  const dist = preferMax <= preferMin ? preferMax : rng.range(preferMin, preferMax);
  const wx = px + dirX * dist;
  const wz = pz + dirZ * dist;
  if (!isClearFootprint(wx, wz, colliders, probeY)) return null;

  return {
    wx,
    wz,
    dist,
  };
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
  lookForward(player);
  const halfFov = THREE.MathUtils.degToRad(CAMERA_FOV * 0.45);
  const angles = [0];

  for (let i = 0; i < 8; i++) {
    angles.push(rng.range(-halfFov, halfFov));
  }
  for (let i = 0; i < 4; i++) {
    const side = rng.chance(0.5) ? 1 : -1;
    angles.push(side * rng.range(halfFov * 1.05, halfFov * 1.65));
  }

  for (const offset of angles) {
    const { x, z } = dirFromOffset(offset);
    const spot = probeAlong(player, x, z, colliders, rng);
    if (spot) return spot;
  }

  return null;
}

/** Library — appears in view after 10s idle; vanishes closer than spawn distance */
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
      if (this._idleT >= IDLE_SPAWN) {
        if (!this.active) {
          this._spawnInView(player, colliders);
        } else {
          this._hide();
          this._spawnInView(player, colliders);
          this._idleT = 0;
        }
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
