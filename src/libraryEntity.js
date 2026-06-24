import * as THREE from "three";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";
import { createRng } from "./rng.js";

const IDLE_SPAWN = 30;
const MOVE_EPS = 0.035;
const SPAWN_AHEAD = 4.5;
const VANISH_MIN = 5;
const VANISH_MAX = 12;

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

function spotAheadOfPlayer(player, colliders) {
  lookForward(player);
  const px = player.position.x;
  const pz = player.position.z;
  const probeY = player.groundY + 1.1;

  for (const dist of [SPAWN_AHEAD, 3.5, 5.5, 3, 6, 7]) {
    const wx = px + _fwd.x * dist;
    const wz = pz + _fwd.z * dist;
    if (!isBlockedAt(wx, wz, colliders, probeY)) return { wx, wz };
  }

  return { wx: px + _fwd.x * SPAWN_AHEAD, wz: pz + _fwd.z * SPAWN_AHEAD };
}

/** Library — appears ahead after 30s idle; vanishes at random close range */
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

  _spawnAhead(player, colliders) {
    if (!this.data?.model) return;

    const spot = spotAheadOfPlayer(player, colliders);
    const rng = createRng(
      Math.floor(player.position.x),
      Math.floor(player.position.z),
      this._seed,
    );
    this._seed += 1;
    this._vanishDist = rng.range(VANISH_MIN, VANISH_MAX);

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
        this._spawnAhead(player, colliders);
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
