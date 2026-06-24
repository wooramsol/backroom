import * as THREE from "three";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";
import { CAMERA_FOV, FOG_FAR } from "./constants.js";
import { createRng } from "./rng.js";

const IDLE_SPAWN = 10;
const MOVE_EPS = 0.035;
const SPAWN_DIST_MIN = 6;
const SPAWN_DIST_MAX = 26;
const VANISH_MARGIN = 1.8;
const VANISH_MIN = 2;

const _fwd = new THREE.Vector3();

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

function spotInView(player, colliders, rng) {
  lookForward(player);
  const px = player.position.x;
  const pz = player.position.z;
  const probeY = player.groundY + 1.1;
  const halfFov = THREE.MathUtils.degToRad(CAMERA_FOV * 0.46);
  const maxDist = Math.min(SPAWN_DIST_MAX, FOG_FAR - 2);

  for (let attempt = 0; attempt < 20; attempt++) {
    const offset = rng.range(-halfFov, halfFov);
    const cos = Math.cos(offset);
    const sin = Math.sin(offset);
    const nx = _fwd.x * cos - _fwd.z * sin;
    const nz = _fwd.x * sin + _fwd.z * cos;
    const dist = rng.range(SPAWN_DIST_MIN, maxDist);

    const wx = px + nx * dist;
    const wz = pz + nz * dist;
    if (!isBlockedAt(wx, wz, colliders, probeY)) {
      return { wx, wz, dist };
    }
  }

  const dist = rng.range(SPAWN_DIST_MIN, maxDist);
  return {
    wx: px + _fwd.x * dist,
    wz: pz + _fwd.z * dist,
    dist,
  };
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
    this._lastPx = NaN;
    this._lastPz = NaN;
    this._seed = 1307;
  }

  begin(player) {
    this._idleT = 0;
    this._lastPx = player.position.x;
    this._lastPz = player.position.z;
    this._hide();
  }

  _hide() {
    this.active = false;
    if (this.root) this.root.visible = false;
  }

  _spawnInView(player, colliders) {
    if (!this.data?.model) return;

    const rng = createRng(
      Math.floor(player.position.x),
      Math.floor(player.position.z),
      this._seed,
    );
    this._seed += 1;

    const spot = spotInView(player, colliders, rng);
    const vanishMax = Math.max(VANISH_MIN + 0.5, spot.dist - VANISH_MARGIN);
    const vanishMin = Math.min(VANISH_MIN, vanishMax * 0.45);
    this._vanishDist = rng.range(vanishMin, vanishMax);

    if (!this.root) {
      this.root = new THREE.Group();
      this.model = SkeletonUtils.clone(this.data.model);
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
  }

  update(dt, player, colliders) {
    if (!this.data?.model) return;

    const px = player.position.x;
    const pz = player.position.z;

    if (Number.isFinite(this._lastPx)) {
      const moved = Math.hypot(px - this._lastPx, pz - this._lastPz);
      if (moved > MOVE_EPS) this._idleT = 0;
    }
    this._lastPx = px;
    this._lastPz = pz;

    if (!this.active) {
      this._idleT += dt;
      if (this._idleT >= IDLE_SPAWN) {
        this._spawnInView(player, colliders);
        this._idleT = 0;
      }
    } else {
      const dx = px - this.worldX;
      const dz = pz - this.worldZ;
      this.root.rotation.y = Math.atan2(dx, dz);

      if (Math.hypot(dx, dz) <= this._vanishDist) {
        this._hide();
        this._idleT = 0;
      }
    }

    this.mixer?.update(dt);
  }
}
