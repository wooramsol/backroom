import * as THREE from "three";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";
import { CAMERA_FOV, CHUNK } from "./constants.js";
import { generateRoom, isWalkableLocal } from "./room.js";
import { createRng } from "./rng.js";

const VANISH_DIST = 10;
const CHUNK_RADIUS = 2;
const MIN_SPAWN_DIST = 4.5;
const INITIAL_AHEAD_DIST = 5;
const CORRIDOR_INSET = 1.0;
const SPAWN_GRACE = 8;
const RESPAWN_COOLDOWN = 1.0;

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

function inPlayerView(player, wx, wz) {
  lookForward(player);

  _to.set(wx - player.position.x, 0, wz - player.position.z);
  const dist = _to.length();
  if (dist < 0.6) return true;

  _to.multiplyScalar(1 / dist);
  const dot = _fwd.dot(_to);
  const limit = Math.cos(THREE.MathUtils.degToRad(CAMERA_FOV * 0.5));
  return dot > limit;
}

function collectCorridorLocals(room) {
  const spots = [];
  const doors = room.doors;
  const h = CHUNK / 2;
  const inner = room.innerWalls;

  const add = (x, z) => {
    if (isWalkableLocal(x, z, inner)) spots.push({ x, z });
  };

  for (const z of [CORRIDOR_INSET, CORRIDOR_INSET + 0.85]) {
    add(h + doors.north.offset, z);
  }
  for (const z of [CHUNK - CORRIDOR_INSET, CHUNK - CORRIDOR_INSET - 0.85]) {
    add(h + doors.south.offset, z);
  }
  for (const x of [CORRIDOR_INSET, CORRIDOR_INSET + 0.85]) {
    add(x, h + doors.west.offset);
  }
  for (const x of [CHUNK - CORRIDOR_INSET, CHUNK - CORRIDOR_INSET - 0.85]) {
    add(x, h + doors.east.offset);
  }

  for (const wall of inner) {
    if (!wall.door) continue;
    const mid = (wall.span0 + wall.span1) / 2 + wall.door.offset;
    if (wall.axis === "z") {
      for (const dz of [-CORRIDOR_INSET, CORRIDOR_INSET, -1.75, 1.75]) {
        add(mid, wall.pos + dz);
      }
    } else {
      for (const dx of [-CORRIDOR_INSET, CORRIDOR_INSET, -1.75, 1.75]) {
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

  for (const dist of [INITIAL_AHEAD_DIST, 4, 6, 3.5, 7]) {
    const wx = px + _fwd.x * dist;
    const wz = pz + _fwd.z * dist;
    if (!isBlockedAt(wx, wz, colliders, probeY)) return { wx, wz };
  }

  return {
    wx: px + _fwd.x * INITIAL_AHEAD_DIST,
    wz: pz + _fwd.z * INITIAL_AHEAD_DIST,
  };
}

function spotCorridorAhead(player, colliders) {
  lookForward(player);

  const px = player.position.x;
  const pz = player.position.z;
  const probeY = player.groundY + 1.1;
  const maxDist = CHUNK_RADIUS * CHUNK * 1.05;

  const corridors = collectCorridorCandidates(player, 1.5, maxDist, CHUNK_RADIUS).filter(
    (c) => !isBlockedAt(c.wx, c.wz, colliders, probeY),
  );

  let best = null;
  let bestScore = -Infinity;
  for (const c of corridors) {
    const dx = c.wx - px;
    const dz = c.wz - pz;
    const dist = Math.hypot(dx, dz);
    if (dist < 0.5) continue;
    const dot = (dx / dist) * _fwd.x + (dz / dist) * _fwd.z;
    if (dot < 0.15) continue;
    const score = dot * 4 - Math.abs(dist - INITIAL_AHEAD_DIST) * 0.35;
    if (score > bestScore) {
      bestScore = score;
      best = c;
    }
  }
  if (best) return best;

  if (corridors.length) {
    corridors.sort(
      (a, b) =>
        Math.hypot(a.wx - px, a.wz - pz) - Math.hypot(b.wx - px, b.wz - pz),
    );
    return corridors[0];
  }

  return spotAheadOfPlayer(player, colliders);
}

function pickSpawnSpot(player, rng, minDist, maxDist, chunkRadius) {
  const candidates = collectCorridorCandidates(player, minDist, maxDist, chunkRadius);
  if (!candidates.length) return null;

  const hidden = candidates.filter((c) => !inPlayerView(player, c.wx, c.wz));
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

/** Library — spawns in corridors; vanishes within 10m when seen */
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
  }

  spawnInitial(player, colliders = []) {
    if (!this.data?.model) return;
    const spot = spotCorridorAhead(player, colliders);
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
  }

  _respawn(player) {
    this._seed += 1;
    const maxDist = CHUNK_RADIUS * CHUNK * 1.05;

    for (let attempt = 0; attempt < 12; attempt++) {
      const rng = createRng(
        Math.floor(player.position.x),
        Math.floor(player.position.z),
        this._seed + attempt * 31,
      );
      const spot = pickSpawnSpot(player, rng, MIN_SPAWN_DIST, maxDist, CHUNK_RADIUS);
      if (!spot) continue;
      if (inPlayerView(player, spot.wx, spot.wz)) continue;
      this._placeAt(spot.wx, spot.wz, player.groundY);
      this._respawnCooldown = RESPAWN_COOLDOWN;
      return;
    }

    if (this.root) this.root.visible = false;
    this.active = false;
    this._respawnCooldown = RESPAWN_COOLDOWN;
  }

  update(dt, player, colliders) {
    if (!this.data?.model) return;

    if (this._respawnCooldown > 0) {
      this._respawnCooldown -= dt;
      this.mixer?.update(dt);
      return;
    }

    if (!this.active || !this.root) {
      this._respawn(player);
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
      this._respawn(player);
    }

    this.mixer?.update(dt);
  }
}
