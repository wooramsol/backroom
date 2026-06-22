import { CHUNK, generateRoom, appendRoomWalls, removeRoomWalls } from "./room.js";
import {
  GRID_RADIUS,
  PRELOAD_RADIUS,
  EDGE_PREFETCH,
} from "./constants.js";
import {
  createRoomBuildState,
  buildRoomShell,
  buildPanelBatch,
  finalizeRoomBuild,
  buildRoomMesh,
} from "./roomMesh.js";
import { disposeChunkRoot } from "./sceneDispose.js";

const DESPAWN_PER_FRAME = 2;
const PRELOAD_BATCH = 2;

export class World {
  constructor(scene, materials, furnitureModels = null) {
    this.scene = scene;
    this.materials = materials;
    this.furnitureModels = furnitureModels;
    this.chunks = new Map();
    this.wallMap = new Map();
    this.colliders = [];
    this.collidersDirty = false;
    this.chairs = [];
    this.time = 0;
    this.loadQueue = [];
    this.pendingKeys = new Set();
    this.disposeQueue = [];
    this.despawnPending = [];
    this.cellCx = NaN;
    this.cellCz = NaN;
    this.lastPrefetchEdge = false;
    this.preloading = false;
  }

  key(cx, cz) {
    return `${cx},${cz}`;
  }

  distToPlayer(cx, cz, playerPos) {
    const wx = cx * CHUNK + CHUNK / 2 - playerPos.x;
    const wz = cz * CHUNK + CHUNK / 2 - playerPos.z;
    return wx * wx + wz * wz;
  }

  nearPrefetchEdge(playerPos, cx, cz) {
    const lx = playerPos.x - cx * CHUNK;
    const lz = playerPos.z - cz * CHUNK;
    const t = CHUNK * EDGE_PREFETCH;
    return lx > t || lx < CHUNK - t || lz > t || lz < CHUNK - t;
  }

  ringKeys(ccx, ccz, radius) {
    const need = new Set();
    for (let z = ccz - radius; z <= ccz + radius; z++) {
      for (let x = ccx - radius; x <= ccx + radius; x++) {
        need.add(this.key(x, z));
      }
    }
    return need;
  }

  computeNeed(cx, cz, playerPos, radius = GRID_RADIUS) {
    const need = this.ringKeys(cx, cz, radius);

    const lx = playerPos.x - cx * CHUNK;
    const lz = playerPos.z - cz * CHUNK;
    if (lx > CHUNK * EDGE_PREFETCH) {
      for (const k of this.ringKeys(cx + 1, cz, radius)) need.add(k);
    }
    if (lx < CHUNK * (1 - EDGE_PREFETCH)) {
      for (const k of this.ringKeys(cx - 1, cz, radius)) need.add(k);
    }
    if (lz > CHUNK * EDGE_PREFETCH) {
      for (const k of this.ringKeys(cx, cz + 1, radius)) need.add(k);
    }
    if (lz < CHUNK * (1 - EDGE_PREFETCH)) {
      for (const k of this.ringKeys(cx, cz - 1, radius)) need.add(k);
    }

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

  removeCollidersForRoom(room) {
    if (removeRoomWalls(this.wallMap, this.colliders, room)) {
      this.collidersDirty = true;
    }
  }

  addFurnitureForChunk(mesh, room) {
    const fc = mesh.userData.furnitureColliders || [];
    const ch = mesh.userData.furnitureChairs || [];
    if (fc.length) {
      this.colliders.push(...fc);
      this.collidersDirty = true;
    }
    if (ch.length) this.chairs.push(...ch);
    return { furnitureColliders: fc, furnitureChairs: ch };
  }

  removeFurnitureForChunk(entry) {
    const fc = entry.furnitureColliders;
    if (fc?.length) {
      for (const box of fc) {
        const idx = this.colliders.indexOf(box);
        if (idx !== -1) this.colliders.splice(idx, 1);
      }
      this.collidersDirty = true;
    }
    const ch = entry.furnitureChairs;
    if (ch?.length) {
      for (const c of ch) {
        const idx = this.chairs.indexOf(c);
        if (idx !== -1) this.chairs.splice(idx, 1);
      }
    }
  }

  getChairs() {
    return this.chairs;
  }

  consumeColliderRebuild() {
    const v = this.collidersDirty;
    this.collidersDirty = false;
    return v;
  }

  attachChunk(cx, cz, room, build) {
    const k = this.key(cx, cz);
    finalizeRoomBuild(build);
    const mesh = build.group;
    const furniture = this.addFurnitureForChunk(mesh, room);
    this.chunks.set(k, { mesh, room, ...furniture });
  }

  spawnComplete(cx, cz) {
    const room = generateRoom(cx, cz);
    this.addCollidersForRoom(room);
    const mesh = buildRoomMesh(room, this.materials, this.furnitureModels);
    const furniture = this.addFurnitureForChunk(mesh, room);
    this.scene.add(mesh);
    this.chunks.set(this.key(cx, cz), { mesh, room, ...furniture });
  }

  despawn(k) {
    const entry = this.chunks.get(k);
    if (!entry) return;
    const { mesh, room } = entry;
    this.removeFurnitureForChunk(entry);
    if (mesh) {
      this.scene.remove(mesh);
      this.disposeQueue.push(mesh);
    }
    this.chunks.delete(k);
    if (room) this.removeCollidersForRoom(room);
  }

  enqueue(cx, cz, playerPos) {
    const k = this.key(cx, cz);
    if (this.chunks.has(k) || this.pendingKeys.has(k)) return;
    this.pendingKeys.add(k);
    this.insertJob({ cx, cz, dist: this.distToPlayer(cx, cz, playerPos), room: null, build: null });
  }

  init(playerPos) {
    const cx = Math.floor(playerPos.x / CHUNK);
    const cz = Math.floor(playerPos.z / CHUNK);
    this.cellCx = cx;
    this.cellCz = cz;
    this.lastPrefetchEdge = this.nearPrefetchEdge(playerPos, cx, cz);
    this.spawnComplete(cx, cz);
  }

  update(playerPos) {
    if (this.preloading) return;

    const cx = Math.floor(playerPos.x / CHUNK);
    const cz = Math.floor(playerPos.z / CHUNK);
    const atEdge = this.nearPrefetchEdge(playerPos, cx, cz);

    if (
      cx === this.cellCx &&
      cz === this.cellCz &&
      atEdge === this.lastPrefetchEdge &&
      !this.loadQueue.length &&
      !this.despawnPending.length
    ) {
      return;
    }

    this.cellCx = cx;
    this.cellCz = cz;
    this.lastPrefetchEdge = atEdge;

    const need = this.computeNeed(cx, cz, playerPos);
    const pending = new Set(this.despawnPending);

    for (const k of this.chunks.keys()) {
      if (!need.has(k) && !pending.has(k)) this.despawnPending.push(k);
    }

    this.loadQueue = this.loadQueue.filter((job) => {
      if (need.has(this.key(job.cx, job.cz))) return true;
      if (job.room) this.removeCollidersForRoom(job.room);
      if (job.build?.group) {
        if (job.build.group.parent) this.scene.remove(job.build.group);
        disposeChunkRoot(job.build.group);
      }
      return false;
    });

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

  processLoadQueue(_playerPos) {
    if (!this.loadQueue.length) return;

    const job = this.loadQueue[0];
    const k = this.key(job.cx, job.cz);

    if (!job.room) {
      job.room = generateRoom(job.cx, job.cz);
      job.build = createRoomBuildState(job.room, this.materials, this.furnitureModels);
      this.addCollidersForRoom(job.room);
      return;
    }

    if (!job.build.shellDone) {
      buildPanelBatch(job.build);
    }

    if (!job.build.group.parent) {
      this.scene.add(job.build.group);
    }

    this.attachChunk(job.cx, job.cz, job.room, job.build);
    this.loadQueue.shift();
    this.pendingKeys.delete(k);
  }

  tick(dt) {
    this.time += dt;
    if (this.disposeQueue.length) disposeChunkRoot(this.disposeQueue.shift());
    for (let i = 0; i < DESPAWN_PER_FRAME && this.despawnPending.length; i++) {
      this.despawn(this.despawnPending.shift());
    }
  }

  getColliders() {
    return this.colliders;
  }

  _spawnChunkComplete(cx, cz) {
    const k = this.key(cx, cz);
    const room = generateRoom(cx, cz);
    this.addCollidersForRoom(room);
    const mesh = buildRoomMesh(room, this.materials, this.furnitureModels);
    const furniture = this.addFurnitureForChunk(mesh, room);
    this.scene.add(mesh);
    this.chunks.set(k, { mesh, room, ...furniture });
    this.pendingKeys.delete(k);
  }

  _spawnChunkSafe(cx, cz) {
    try {
      this._spawnChunkComplete(cx, cz);
    } catch (err) {
      console.error(`Chunk build failed (${cx}, ${cz})`, err);
      throw err;
    }
  }

  async preloadAround(camera, onProgress) {
    const playerPos = camera.position;
    const cx = Math.floor(playerPos.x / CHUNK);
    const cz = Math.floor(playerPos.z / CHUNK);
    const toBuild = [];
    for (let z = cz - PRELOAD_RADIUS; z <= cz + PRELOAD_RADIUS; z++) {
      for (let x = cx - PRELOAD_RADIUS; x <= cx + PRELOAD_RADIUS; x++) {
        if (!this.chunks.has(this.key(x, z))) toBuild.push({ cx: x, cz: z });
      }
    }
    toBuild.sort(
      (a, b) =>
        this.distToPlayer(a.cx, a.cz, playerPos) - this.distToPlayer(b.cx, b.cz, playerPos),
    );

    this.preloading = true;
    this.loadQueue.length = 0;
    this.pendingKeys.clear();

    const total = toBuild.length;
    let done = 0;
    for (let i = 0; i < toBuild.length; i += PRELOAD_BATCH) {
      const end = Math.min(i + PRELOAD_BATCH, toBuild.length);
      for (let j = i; j < end; j++) {
        const { cx: x, cz: z } = toBuild[j];
        this._spawnChunkSafe(x, z);
        done++;
      }
      onProgress?.(done, total || 1);
      await new Promise((r) => requestAnimationFrame(r));
    }

    this.preloading = false;
    onProgress?.(total || 1, total || 1);
  }

  hasPendingLoads() {
    return !this.preloading && this.loadQueue.length > 0;
  }
}
