import * as THREE from "three";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";
import { CAMERA_FOV } from "./constants.js";
import { createRng } from "./rng.js";

const IDLE_SPAWN = 10;
const SPAWN_NEAR = 1.2;
const SPAWN_PROBE_STEP = 0.22;
const SPAWN_PROBE_MAX = 55;
const SPAWN_FOOTPRINT_R = 0.3;
const LOS_SAMPLE_STEP = 0.24;
const LOS_WALL_INSET = 0.11;
const LOS_TUNNEL_HALF = 0.34;
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

function isBlockedAt(x, z, colliders, probeY, wallsOnly = false, wallInset = 0) {
  for (const c of colliders) {
    if (c.isCeiling) continue;
    if (wallsOnly && c.isFurniture) continue;
    if (probeY < c.minY - 0.2 || probeY > c.maxY + 0.2) continue;
    const minX = c.minX + wallInset;
    const maxX = c.maxX - wallInset;
    const minZ = c.minZ + wallInset;
    const maxZ = c.maxZ - wallInset;
    if (minX > maxX || minZ > maxZ) continue;
    if (x >= minX && x <= maxX && z >= minZ && z <= maxZ) return true;
  }
  return false;
}

function isWallBlockedAt(x, z, colliders, probeY, inset = 0) {
  return isBlockedAt(x, z, colliders, probeY, true, inset);
}

const _spawnFootprintSamples = [
  [0, 0],
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
].map(([x, z]) => [x * SPAWN_FOOTPRINT_R, z * SPAWN_FOOTPRINT_R]);

function isClearFootprint(x, z, colliders, probeY) {
  for (const [ox, oz] of _spawnFootprintSamples) {
    if (isBlockedAt(x + ox, z + oz, colliders, probeY, false, 0)) return false;
  }
  return true;
}

/** Doorways: centerline can graze jambs — require full tunnel width blocked */
function isTunnelWallBlocked(x, z, dirX, dirZ, colliders, probeY) {
  if (!isWallBlockedAt(x, z, colliders, probeY, LOS_WALL_INSET)) return false;
  const len = Math.hypot(dirX, dirZ) || 1;
  const px = (-dirZ / len) * LOS_TUNNEL_HALF;
  const pz = (dirX / len) * LOS_TUNNEL_HALF;
  return (
    isWallBlockedAt(x + px, z + pz, colliders, probeY, LOS_WALL_INSET) &&
    isWallBlockedAt(x - px, z - pz, colliders, probeY, LOS_WALL_INSET)
  );
}

function hasTunnelClearPath(ax, az, bx, bz, colliders, probeY) {
  const dx = bx - ax;
  const dz = bz - az;
  const len = Math.hypot(dx, dz);
  if (len < 0.05) return true;
  const dirX = dx / len;
  const dirZ = dz / len;
  const steps = Math.max(2, Math.ceil(len / LOS_SAMPLE_STEP));
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    if (isTunnelWallBlocked(ax + dx * t, az + dz * t, dirX, dirZ, colliders, probeY)) return false;
  }
  return true;
}

/** Scan every distance — pick furthest camera-visible standable floor in this lane */
function probeLane(player, dirX, dirZ, laneOff, colliders, minD, maxD) {
  const cam = player.camera.position;
  const camX = cam.x;
  const camZ = cam.z;
  const probeY = player.groundY + 1.1;
  const px = player.position.x;
  const pz = player.position.z;
  const perpX = -dirZ;
  const perpZ = dirX;
  const laneX = perpX * laneOff;
  const laneZ = perpZ * laneOff;

  let best = null;
  for (let d = minD; d <= maxD; d += SPAWN_PROBE_STEP) {
    const wx = camX + dirX * d + laneX;
    const wz = camZ + dirZ * d + laneZ;
    const toX = wx - camX;
    const toZ = wz - camZ;
    if (toX * dirX + toZ * dirZ < 0.05) continue;
    if (!hasTunnelClearPath(camX, camZ, wx, wz, colliders, probeY)) continue;
    if (!isClearFootprint(wx, wz, colliders, probeY)) continue;
    const viewDist = Math.hypot(toX, toZ);
    if (!best || viewDist > best.viewDist) {
      best = {
        wx,
        wz,
        viewDist,
        dist: Math.hypot(wx - px, wz - pz),
      };
    }
  }

  return best;
}

function probeAlongView(player, dirX, dirZ, colliders) {
  const lanes = [-0.38, -0.2, 0, 0.2, 0.38];
  let best = null;
  for (const lane of lanes) {
    const spot = probeLane(player, dirX, dirZ, lane, colliders, SPAWN_NEAR, SPAWN_PROBE_MAX);
    if (spot && (!best || spot.viewDist > best.viewDist)) best = spot;
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

  const halfFov = THREE.MathUtils.degToRad(CAMERA_FOV * 0.5);
  const angles = [];

  for (let i = 0; i <= 22; i++) {
    angles.push(-halfFov + ((halfFov * 2) * i) / 22);
  }
  for (let i = 0; i < 4; i++) {
    angles.push(rng.range(-halfFov * 0.4, halfFov * 0.4));
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
