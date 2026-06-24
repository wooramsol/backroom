import * as THREE from "three";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";
import { CAMERA_FOV, FOG_NEAR, CHUNK } from "./constants.js";
import { createRng } from "./rng.js";

const SPAWN_CHANCE = 0.5;
const CORRIDOR_MIN_DEPTH = 9;
const SPAWN_AHEAD_MIN = FOG_NEAR + 1.5;
const VANISH_DIST = 7;
const SPAWN_COOLDOWN = 6;
const MOVE_MIN = 0.35;

const _fwd = new THREE.Vector3();
const _to = new THREE.Vector3();

function pickClip(clips, patterns) {
  for (const re of patterns) {
    const hit = clips.find((c) => re.test(c.name));
    if (hit) return hit;
  }
  return clips[0] || null;
}

function isBlockedAt(x, z, colliders, probeY) {
  for (const c of colliders) {
    if (c.isCeiling) continue;
    if (probeY < c.minY - 0.2 || probeY > c.maxY + 0.2) continue;
    if (x >= c.minX && x <= c.maxX && z >= c.minZ && z <= c.maxZ) return true;
  }
  return false;
}

function probeCorridor(px, pz, dirX, dirZ, colliders, probeY, maxDist = 22) {
  const points = [];
  const step = 0.42;
  for (let d = step; d <= maxDist; d += step) {
    const x = px + dirX * d;
    const z = pz + dirZ * d;
    if (isBlockedAt(x, z, colliders, probeY)) break;
    points.push({ x, z, d });
  }
  return points;
}

function inPlayerView(player, wx, wz, extraMargin = 0.1) {
  player.camera.getWorldDirection(_fwd);
  _fwd.y = 0;
  if (_fwd.lengthSq() < 1e-10) return true;
  _fwd.normalize();

  _to.set(wx - player.position.x, 0, wz - player.position.z);
  const dist = _to.length();
  if (dist < 0.6) return true;

  _to.multiplyScalar(1 / dist);
  const dot = _fwd.dot(_to);
  const limit = Math.cos(THREE.MathUtils.degToRad(CAMERA_FOV * 0.5 + extraMargin * 60));
  return dot > limit;
}

/**
 * Hidden until player walks into a dark corridor (50% chance).
 * Spawns off-screen far ahead; vanishes when approached.
 */
export class LibraryEntity {
  constructor(data, scene) {
    this.data = data;
    this.scene = scene;
    this.root = null;
    this.model = null;
    this.mixer = null;
    this.visible = false;
    this.worldX = 0;
    this.worldZ = 0;
    this.groundY = 0;
    this._cooldown = 0;
    this._seed = 1307;
    this._lastPx = 0;
    this._lastPz = 0;
    this._hasLast = false;
  }

  begin(player) {
    this._ensureModel();
    this._hide();
    this._lastPx = player.position.x;
    this._lastPz = player.position.z;
    this._hasLast = true;
  }

  _ensureModel() {
    if (!this.data?.model || this.root) return;

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
    this.root.visible = false;
  }

  _hide() {
    this.visible = false;
    if (this.root) this.root.visible = false;
  }

  _show(wx, wz, groundY) {
    this._ensureModel();
    this.worldX = wx;
    this.worldZ = wz;
    this.groundY = groundY;
    this.root.position.set(wx, groundY - (this.data.footOffset ?? 0), wz);
    this.root.visible = true;
    this.visible = true;
  }

  _tryCorridorSpawn(player, colliders) {
    if (this.visible || this._cooldown > 0) return;

    const px = player.position.x;
    const pz = player.position.z;
    if (!this._hasLast) {
      this._lastPx = px;
      this._lastPz = pz;
      this._hasLast = true;
      return;
    }

    const moved = Math.hypot(px - this._lastPx, pz - this._lastPz);
    this._lastPx = px;
    this._lastPz = pz;
    if (moved < MOVE_MIN) return;

    player.camera.getWorldDirection(_fwd);
    _fwd.y = 0;
    if (_fwd.lengthSq() < 1e-10) return;
    _fwd.normalize();

    const probeY = player.groundY + 1.1;
    const corridor = probeCorridor(px, pz, _fwd.x, _fwd.z, colliders, probeY);
    if (corridor.length < 3) return;

    const depth = corridor[corridor.length - 1].d;
    if (depth < CORRIDOR_MIN_DEPTH) return;

    const far = corridor.filter((p) => p.d >= SPAWN_AHEAD_MIN);
    if (!far.length) return;

    this._seed += 1;
    const rng = createRng(Math.floor(px), Math.floor(pz), this._seed);
    if (!rng.chance(SPAWN_CHANCE)) return;

    const pickFrom = far.slice(Math.floor(far.length * 0.55));
    const spot = rng.pick(pickFrom.length ? pickFrom : far);
    if (!spot) return;
    if (inPlayerView(player, spot.x, spot.z)) return;

    this._show(spot.x, spot.z, player.groundY);
    this._cooldown = SPAWN_COOLDOWN * 0.35;
  }

  update(dt, player, colliders) {
    if (!this.data?.model) return;

    if (this._cooldown > 0) this._cooldown -= dt;

    if (this.visible) {
      const px = player.position.x;
      const pz = player.position.z;
      const dx = px - this.worldX;
      const dz = pz - this.worldZ;
      this.root.rotation.y = Math.atan2(dx, dz);

      if (Math.hypot(dx, dz) <= VANISH_DIST) {
        this._hide();
        this._cooldown = SPAWN_COOLDOWN;
      }
    } else {
      this._tryCorridorSpawn(player, colliders);
    }

    this.mixer?.update(dt);
  }
}
