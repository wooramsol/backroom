import * as THREE from "three";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";
import { CAMERA_FOV, CHUNK } from "./constants.js";
import { generateRoom, isWalkableLocal } from "./room.js";
import { createRng } from "./rng.js";

const VANISH_DIST = 10;
const CHUNK_RADIUS = 2;
const MIN_SPAWN_DIST = 4.5;
const INITIAL_MIN_DIST = 3;
const CORRIDOR_INSET = 1.0;
const RESPAWN_COOLDOWN = 0.8;
const SPAWN_GRACE = 4;
const AHEAD_RELOCATE_WALK = 12;
const MAX_BEHIND_DIST = 22;

const _fwd = new THREE.Vector3();
const _to = new THREE.Vector3();

function pickClip(clips, patterns) {
  for (const re of patterns) {
    const hit = clips.find((c) => re.test(c.name));
    if (hit) return hit;
  }
  return clips[0] || null;
}

function chunkOrigin(playerX, playerZ) {
  return {
    cx: Math.floor(playerX / CHUNK),
    cz: Math.floor(playerZ / CHUNK),
  };
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

function bearingDot(player, wx, wz) {
  lookForward(player);
  _to.set(wx - player.position.x, 0, wz - player.position.z);
  const dist = _to.length();
  if (dist < 0.01) return 1;
  _to.multiplyScalar(1 / dist);
  return _fwd.dot(_to);
}

function inPlayerView(player, wx, wz) {
  const dot = bearingDot(player, wx, wz);
  const limit = Math.cos(THREE.MathUtils.degToRad(CAMERA_FOV * 0.5));
  return dot > limit;
}

/** Door mouths and passage openings — walkable spots only */
function collectCorridorLocals(room) {
  const spots = [];
  const doors = room.doors;
  const h = CHUNK / 2;
  const inner = room.innerWalls;

  const add = (x, z) => {
    if (isWalkableLocal(x, z, inner)) spots.push({ x, z });
  };

  const northX = h + doors.north.offset;
  for (let z = CORRIDOR_INSET; z <= 3.6; z += 0.45) add(northX, z);

  const southX = h + doors.south.offset;
  for (let z = CHUNK - CORRIDOR_INSET; z >= CHUNK - 3.6; z -= 0.45) add(southX, z);

  const westZ = h + doors.west.offset;
  for (let x = CORRIDOR_INSET; x <= 3.6; x += 0.45) add(x, westZ);

  const eastZ = h + doors.east.offset;
  for (let x = CHUNK - CORRIDOR_INSET; x >= CHUNK - 3.6; x -= 0.45) add(x, eastZ);

  for (const wall of inner) {
    if (!wall.door) continue;
    const mid = (wall.span0 + wall.span1) / 2 + wall.door.offset;
    if (wall.axis === "z") {
      for (const dz of [-0.9, 0.9, -1.6, 1.6, -2.3, 2.3]) {
        add(mid, wall.pos + dz);
      }
    } else {
      for (const dx of [-0.9, 0.9, -1.6, 1.6, -2.3, 2.3]) {
        add(wall.pos + dx, mid);
      }
    }
  }

  return spots;
}

function collectCorridorCandidates(player, minDist, maxDist, chunkRadius) {
  const { cx: pcx, cz: pcz } = chunkOrigin(player.position.x, player.position.z);
  const px = player.position.x;
  const pz = player.position.z;
  const out = [];

  for (let cz = pcz - chunkRadius; cz <= pcz + chunkRadius; cz++) {
    for (let cx = pcx - chunkRadius; cx <= pcx + chunkRadius; cx++) {
      const room = generateRoom(cx, cz);
      for (const local of collectCorridorLocals(room)) {
        const wx = cx * CHUNK + local.x;
        const wz = cz * CHUNK + local.z;
        const d = Math.hypot(wx - px, wz - pz);
        if (d < minDist || d > maxDist) continue;
        out.push({ wx, wz });
      }
    }
  }

  return out;
}

function pickSpawnSpot(player, rng, minDist, maxDist, chunkRadius, opts = {}) {
  const { offScreenOnly = false, forwardOnly = false } = opts;
  let candidates = collectCorridorCandidates(player, minDist, maxDist, chunkRadius);
  if (!candidates.length) return null;

  if (forwardOnly) {
    const ahead = candidates.filter((c) => bearingDot(player, c.wx, c.wz) > 0.1);
    if (ahead.length) candidates = ahead;
  }

  const hidden = candidates.filter((c) => !inPlayerView(player, c.wx, c.wz));
  if (offScreenOnly) {
    return rng.pick(hidden) ?? null;
  }
  return rng.pick(hidden.length ? hidden : candidates);
}

function hasLineOfSight(px, pz, tx, tz, colliders, probeY) {
  const dx = tx - px;
  const dz = tz - pz;
  const dist = Math.hypot(dx, dz);
  if (dist < 0.15) return true;

  const steps = Math.max(2, Math.ceil(dist / 0.32));
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const x = px + dx * t;
    const z = pz + dz * t;
    for (const c of colliders) {
      if (c.isCeiling) continue;
      if (probeY < c.minY - 0.2 || probeY > c.maxY + 0.2) continue;
      if (x >= c.minX && x <= c.maxX && z >= c.minZ && z <= c.maxZ) return false;
    }
  }
  return true;
}

/** Library — corridor spawn; shifts ahead if player walks away */
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
    this._respawnCooldown = 0;
    this._vanishGrace = 0;
    this._seed = 1307;
    this._trailPx = NaN;
    this._trailPz = NaN;
    this._behindWalk = 0;
  }

  _pickCorridorSpot(player, minDist, opts = {}) {
    const maxDist = CHUNK_RADIUS * CHUNK * 1.05;
    const tiers = [
      opts,
      { ...opts, forwardOnly: false },
      { forwardOnly: false, offScreenOnly: false },
    ];

    for (let attempt = 0; attempt < 16; attempt++) {
      const rng = createRng(
        Math.floor(player.position.x),
        Math.floor(player.position.z),
        this._seed + attempt * 31,
      );
      for (const tier of tiers) {
        const spot = pickSpawnSpot(player, rng, minDist, maxDist, CHUNK_RADIUS, tier);
        if (spot) return spot;
      }
    }

    return null;
  }

  spawnInitial(player) {
    if (!this.data?.model) {
      console.warn("Library entity: model not loaded");
      return;
    }
    this._seed = 1307;
    const spot =
      this._pickCorridorSpot(player, INITIAL_MIN_DIST, {
        forwardOnly: true,
        offScreenOnly: false,
      }) ??
      this._pickCorridorSpot(player, 1.5, {
        forwardOnly: false,
        offScreenOnly: false,
      });
    if (!spot) {
      console.warn("Library entity: no corridor spawn spot found at start");
      return;
    }
    this._placeAt(spot.wx, spot.wz, player.groundY, SPAWN_GRACE);
    const dx = player.position.x - spot.wx;
    const dz = player.position.z - spot.wz;
    if (this.root) this.root.rotation.y = Math.atan2(dx, dz);
  }

  _placeAt(wx, wz, groundY, vanishGrace = 0) {
    if (!this.data?.model) return;

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

    this.worldX = wx;
    this.worldZ = wz;
    this.groundY = groundY;
    this.root.position.set(wx, groundY - (this.data.footOffset ?? 0), wz);
    this.root.visible = true;
    this.active = true;
    this._respawnCooldown = 0.6;
    this._vanishGrace = vanishGrace;
    this._trailPx = NaN;
    this._trailPz = NaN;
    this._behindWalk = 0;
  }

  _respawn(player, forwardOnly = true) {
    this._seed += 1;
    const spot =
      this._pickCorridorSpot(player, MIN_SPAWN_DIST, {
        forwardOnly,
        offScreenOnly: true,
      }) ??
      this._pickCorridorSpot(player, MIN_SPAWN_DIST, {
        forwardOnly: false,
        offScreenOnly: false,
      });
    if (!spot) {
      this._respawnCooldown = RESPAWN_COOLDOWN;
      return;
    }
    this._placeAt(spot.wx, spot.wz, player.groundY, SPAWN_GRACE);
    this._respawnCooldown = RESPAWN_COOLDOWN;
  }

  _relocateIfLeftBehind(player) {
    const px = player.position.x;
    const pz = player.position.z;
    const dist = Math.hypot(px - this.worldX, pz - this.worldZ);
    const behind = bearingDot(player, this.worldX, this.worldZ) < -0.05;
    const hidden = !inPlayerView(player, this.worldX, this.worldZ);

    if (!behind || !hidden) {
      this._behindWalk = 0;
      this._trailPx = px;
      this._trailPz = pz;
      return false;
    }

    if (Number.isFinite(this._trailPx)) {
      const step = Math.hypot(px - this._trailPx, pz - this._trailPz);
      if (step > 0.04) this._behindWalk += step;
    }
    this._trailPx = px;
    this._trailPz = pz;

    if (this._behindWalk < AHEAD_RELOCATE_WALK && dist < MAX_BEHIND_DIST) return false;

    this._respawn(player, true);
    return true;
  }

  update(dt, player, colliders) {
    if (!this.data?.model) return;

    if (this._respawnCooldown > 0) {
      this._respawnCooldown -= dt;
      this.mixer?.update(dt);
      return;
    }

    if (!this.active || !this.root) {
      this._respawn(player, true);
      this.mixer?.update(dt);
      return;
    }

    if (this._relocateIfLeftBehind(player)) {
      this.mixer?.update(dt);
      return;
    }

    const px = player.position.x;
    const pz = player.position.z;
    const dx = px - this.worldX;
    const dz = pz - this.worldZ;
    this.root.rotation.y = Math.atan2(dx, dz);

    const dist = Math.hypot(dx, dz);
    const probeY = this.groundY + (this.data.height ?? 1.5) * 0.55;

    if (this._vanishGrace > 0) {
      this._vanishGrace -= dt;
    } else if (
      dist <= VANISH_DIST &&
      hasLineOfSight(px, pz, this.worldX, this.worldZ, colliders, probeY)
    ) {
      this._respawn(player, true);
    }

    this.mixer?.update(dt);
  }
}
