import { CHUNK, generateRoom, appendRoomWalls } from "./room.js";
import { buildRoomMesh } from "./roomMesh.js";
import { releasePanelLights, resetPanelLightBudget } from "./lightBudget.js";

/** 3×3 loaded rooms — keeps per-panel RectAreaLights within GPU cap */
const GRID_RADIUS = 1;
/** Spread heavy mesh builds across frames to avoid walk hitches */
const MAX_MESH_BUILDS_PER_FRAME = 1;
const FRAME_BUDGET_MS = 10;
const EDGE_PREFETCH = 0.5;

export class World {
  constructor(scene, materials) {
    this.scene = scene;
    this.materials = materials;
    this.chunks = new Map();
    this.wallMap = new Map();
    this.colliders = [];
    this.collidersDirty = false;
    this.time = 0;
    this.loadQueue = [];
    this.pendingKeys = new Set();
    this.disposeQueue = [];
  }

  key(cx, cz) {
    return `${cx},${cz}`;
  }

  distToPlayer(cx, cz, playerPos) {
    const wx = cx * CHUNK + CHUNK / 2 - playerPos.x;
    const wz = cz * CHUNK + CHUNK / 2 - playerPos.z;
    return wx * wx + wz * wz;
  }

  computeNeed(cx, cz, playerPos) {
    const need = new Set();

    const addRing = (ccx, ccz) => {
      for (let z = ccz - GRID_RADIUS; z <= ccz + GRID_RADIUS; z++) {
        for (let x = ccx - GRID_RADIUS; x <= ccx + GRID_RADIUS; x++) {
          need.add(this.key(x, z));
        }
      }
    };

    addRing(cx, cz);

    const lx = playerPos.x - cx * CHUNK;
    const lz = playerPos.z - cz * CHUNK;
    if (lx > CHUNK * EDGE_PREFETCH) addRing(cx + 1, cz);
    if (lx < CHUNK * (1 - EDGE_PREFETCH)) addRing(cx - 1, cz);
    if (lz > CHUNK * EDGE_PREFETCH) addRing(cx, cz + 1);
    if (lz < CHUNK * (1 - EDGE_PREFETCH)) addRing(cx, cz - 1);

    return need;
  }

  insertJob(job) {
    const dist = job.dist;
    let lo = 0;
    let hi = this.loadQueue.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.loadQueue[mid].dist < dist) lo = mid + 1;
      else hi = mid;
    }
    this.loadQueue.splice(lo, 0, job);
  }

  addCollidersForRoom(room) {
    const added = appendRoomWalls(this.wallMap, room);
    if (added.length) {
      this.colliders.push(...added);
      this.collidersDirty = true;
    }
  }

  rebuildColliders() {
    this.wallMap.clear();
    this.colliders = [];
    for (const { room } of this.chunks.values()) {
      this.colliders.push(...appendRoomWalls(this.wallMap, room));
    }
    this.collidersDirty = true;
  }

  consumeColliderRebuild() {
    const v = this.collidersDirty;
    this.collidersDirty = false;
    return v;
  }

  finishSpawn(cx, cz, room) {
    const mesh = buildRoomMesh(room, this.materials);
    this.scene.add(mesh);
    this.chunks.set(this.key(cx, cz), { mesh, room });
  }

  spawnComplete(cx, cz) {
    const room = generateRoom(cx, cz);
    this.addCollidersForRoom(room);
    this.finishSpawn(cx, cz, room);
  }

  despawn(k) {
    const entry = this.chunks.get(k);
    if (!entry) return;
    const { mesh } = entry;
    if (mesh) {
      releasePanelLights(mesh.userData.lightCount || 0);
      this.scene.remove(mesh);
      this.disposeQueue.push(mesh);
    }
    this.chunks.delete(k);
    this.rebuildColliders();
  }

  enqueue(cx, cz, playerPos) {
    const k = this.key(cx, cz);
    if (this.chunks.has(k) || this.pendingKeys.has(k)) return;
    this.pendingKeys.add(k);
    this.insertJob({ cx, cz, dist: this.distToPlayer(cx, cz, playerPos), room: null, meshBuilt: false });
  }

  init(playerPos) {
    resetPanelLightBudget();
    const cx = Math.floor(playerPos.x / CHUNK);
    const cz = Math.floor(playerPos.z / CHUNK);
    this.spawnComplete(cx, cz);

    const need = this.computeNeed(cx, cz, playerPos);
    for (const k of need) {
      if (this.chunks.has(k)) continue;
      const [x, z] = k.split(",").map(Number);
      this.enqueue(x, z, playerPos);
    }
  }

  update(playerPos) {
    const cx = Math.floor(playerPos.x / CHUNK);
    const cz = Math.floor(playerPos.z / CHUNK);
    const need = this.computeNeed(cx, cz, playerPos);
    const prevQueueLen = this.loadQueue.length;

    for (const k of [...this.chunks.keys()]) {
      if (!need.has(k)) this.despawn(k);
    }

    this.loadQueue = this.loadQueue.filter((job) => need.has(this.key(job.cx, job.cz)));
    if (this.loadQueue.length < prevQueueLen) this.rebuildColliders();

    for (const k of this.pendingKeys) {
      if (!need.has(k) && !this.chunks.has(k)) this.pendingKeys.delete(k);
    }

    for (const k of need) {
      if (!this.chunks.has(k)) {
        const [x, z] = k.split(",").map(Number);
        this.enqueue(x, z, playerPos);
      }
    }
  }

  processLoadQueue(playerPos) {
    if (this.disposeQueue.length) {
      const mesh = this.disposeQueue.shift();
      mesh.traverse((o) => o.geometry?.dispose());
    }

    if (!this.loadQueue.length) return;

    const t0 = performance.now();
    let meshBuilt = 0;

    while (this.loadQueue.length && performance.now() - t0 < FRAME_BUDGET_MS) {
      const job = this.loadQueue[0];
      const k = this.key(job.cx, job.cz);

      if (this.chunks.has(k)) {
        this.loadQueue.shift();
        this.pendingKeys.delete(k);
        continue;
      }

      if (!job.room) {
        job.room = generateRoom(job.cx, job.cz);
        this.addCollidersForRoom(job.room);
        job.dist = this.distToPlayer(job.cx, job.cz, playerPos);
        continue;
      }

      if (!job.meshBuilt) {
        if (meshBuilt >= MAX_MESH_BUILDS_PER_FRAME) break;
        this.finishSpawn(job.cx, job.cz, job.room);
        this.loadQueue.shift();
        this.pendingKeys.delete(k);
        job.meshBuilt = true;
        meshBuilt++;
      }
    }
  }

  tick(dt) {
    this.time += dt;
  }

  getColliders() {
    return this.colliders;
  }
}
