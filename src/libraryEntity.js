import * as THREE from "three";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";
import { CHUNK } from "./constants.js";
import { generateRoom, isWalkableLocal, reachableCellsFrom } from "./room.js";
import { createRng } from "./rng.js";

const RELOCATE_DIST = 10;
const CHUNK_RADIUS = 2;
const MIN_RELOCATE_DIST = 11.5;
const INITIAL_MIN_DIST = 8;

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

function collectCandidates(player, minDist, maxDist) {
  const { cx: pcx, cz: pcz } = chunkOrigin(player.position.x, player.position.z);
  const px = player.position.x;
  const pz = player.position.z;
  const out = [];

  for (let cz = pcz - CHUNK_RADIUS; cz <= pcz + CHUNK_RADIUS; cz++) {
    for (let cx = pcx - CHUNK_RADIUS; cx <= pcx + CHUNK_RADIUS; cx++) {
      const room = generateRoom(cx, cz);
      const startX = CHUNK / 2;
      const startZ = CHUNK / 2;
      const origin = isWalkableLocal(startX, startZ, room.innerWalls)
        ? { x: startX, z: startZ }
        : null;

      const cells = origin
        ? reachableCellsFrom(room.innerWalls, origin.x, origin.z)
        : [];

      if (!cells.length) {
        for (let iz = 0; iz < Math.ceil(CHUNK / 0.5); iz++) {
          for (let ix = 0; ix < Math.ceil(CHUNK / 0.5); ix++) {
            const x = ix * 0.5 + 0.25;
            const z = iz * 0.5 + 0.25;
            if (isWalkableLocal(x, z, room.innerWalls)) cells.push({ x, z });
          }
        }
      }

      for (const cell of cells) {
        const wx = cx * CHUNK + cell.x;
        const wz = cz * CHUNK + cell.z;
        const d = Math.hypot(wx - px, wz - pz);
        if (d < minDist || d > maxDist) continue;
        out.push({ wx, wz });
      }
    }
  }

  return out;
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

/** Library — random within 2 chunks, faces player, relocates when seen within ~10m */
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
    this._relocateCooldown = 0;
    this._seed = 1307;
  }

  spawnInitial(player) {
    if (!this.data?.model) return;
    this._seed = 1307;
    const rng = createRng(0, 0, this._seed);
    const maxDist = CHUNK_RADIUS * CHUNK * 1.05;
    const spot = rng.pick(collectCandidates(player, INITIAL_MIN_DIST, maxDist));
    if (!spot) return;
    this._placeAt(spot.wx, spot.wz, player.groundY);
  }

  _placeAt(wx, wz, groundY) {
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
    this._relocateCooldown = 0.6;
  }

  _relocate(player) {
    this._seed += 1;
    const rng = createRng(
      Math.floor(player.position.x),
      Math.floor(player.position.z),
      this._seed,
    );
    const maxDist = CHUNK_RADIUS * CHUNK * 1.05;
    const candidates = collectCandidates(player, MIN_RELOCATE_DIST, maxDist);
    const spot = rng.pick(candidates);
    if (!spot) return;
    this._placeAt(spot.wx, spot.wz, player.groundY);
  }

  update(dt, player, colliders) {
    if (!this.active || !this.root) return;

    if (this._relocateCooldown > 0) this._relocateCooldown -= dt;

    const px = player.position.x;
    const pz = player.position.z;
    const dx = px - this.worldX;
    const dz = pz - this.worldZ;
    this.root.rotation.y = Math.atan2(dx, dz);

    const dist = Math.hypot(dx, dz);
    const probeY = this.groundY + (this.data.height ?? 1.5) * 0.55;
    if (
      this._relocateCooldown <= 0 &&
      dist <= RELOCATE_DIST &&
      hasLineOfSight(px, pz, this.worldX, this.worldZ, colliders, probeY)
    ) {
      this._relocate(player);
    }

    this.mixer?.update(dt);
  }
}
