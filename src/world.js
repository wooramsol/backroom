import {
  CHUNK,
  generateRoom,
  tryPickValidShape,
  createRoomFromShape,
  appendRoomWalls,
  removeRoomWalls,
  collidersFromMap,
  roomColliderBoxes,
} from "./room.js";
import {
  LANDING_RADIUS,
  GRID_RADIUS,
  PREFETCH_RADIUS,
  DESPAWN_RADIUS,
  EDGE_PREFETCH,
  SHAPE_ATTEMPTS_MAX,
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
const MAX_ENQUEUE_PER_UPDATE = 2;

export class World {
  constructor(scene, materials, furnitureModels = null) {
    this.scene = scene;
    this.materials = materials;
    this.furnitureModels = furnitureModels;
    this.chunks = new Map();
    this.wallMap = new Map();
    this.colliders = [];
    this.collidersDirty = false;
    this.time = 0;
    this.loadQueue = [];
    this.pendingKeys = new Set();
    this.disposeQueue = [];
    this.despawnPending = [];
    this.cellCx = NaN;
    this.cellCz = NaN;
    this.lastPrefetchEdge = false;
    this.preloading = false;
    this.landingReady = false;
    this._nearColliderKey = "";
    this._nearColliderCache = [];
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

  atEdge(playerPos) {
    const cx = Math.floor(playerPos.x / CHUNK);
    const cz = Math.floor(playerPos.z / CHUNK);
    return this.nearPrefetchEdge(playerPos, cx, cz);
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

  computeNeed(cx, cz, playerPos, atEdge = this.nearPrefetchEdge(playerPos, cx, cz)) {
    const radius = atEdge ? PREFETCH_RADIUS : GRID_RADIUS;
    const need = this.ringKeys(cx, cz, radius);

    const lx = playerPos.x - cx * CHUNK;
    const lz = playerPos.z - cz * CHUNK;
    const outer = radius + 1;
    if (lx > CHUNK * EDGE_PREFETCH) {
      for (let z = cz - radius; z <= cz + radius; z++) need.add(this.key(cx + outer, z));
    }
    if (lx < CHUNK * (1 - EDGE_PREFETCH)) {
      for (let z = cz - radius; z <= cz + radius; z++) need.add(this.key(cx - outer, z));
    }
    if (lz > CHUNK * EDGE_PREFETCH) {
      for (let x = cx - radius; x <= cx + radius; x++) need.add(this.key(x, cz + outer));
    }
    if (lz < CHUNK * (1 - EDGE_PREFETCH)) {
      for (let x = cx - radius; x <= cx + radius; x++) need.add(this.key(x, cz - outer));
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

  /** Wall map + furniture boxes — single source of truth (fixes noclip desync) */
  rebuildColliderList() {
    const list = collidersFromMap(this.wallMap);
    for (const entry of this.chunks.values()) {
      const fc = entry.furnitureColliders;
      if (fc?.length) list.push(...fc);
    }
    this.colliders = list;
    this.collidersDirty = false;
  }

  _markCollidersDirty() {
    this.collidersDirty = true;
    this._nearColliderKey = "";
    this._nearColliderCache = [];
  }

  /** Only colliders in the immediate chunk ring — avoids scanning 900+ boxes per frame */
  getNearbyColliders(px, pz, ring = 1) {
    const ccx = Math.floor(px / CHUNK);
    const ccz = Math.floor(pz / CHUNK);
    const cacheKey = `${ccx},${ccz},${ring}`;
    if (!this.collidersDirty && cacheKey === this._nearColliderKey) {
      return this._nearColliderCache;
    }

    const list = [];
    for (let dz = -ring; dz <= ring; dz++) {
      for (let dx = -ring; dx <= ring; dx++) {
        const entry = this.chunks.get(this.key(ccx + dx, ccz + dz));
        if (!entry) continue;
        if (entry.wallColliders?.length) list.push(...entry.wallColliders);
        if (entry.furnitureColliders?.length) list.push(...entry.furnitureColliders);
      }
    }

    this._nearColliderKey = cacheKey;
    this._nearColliderCache = list;
    return list;
  }

  addCollidersForRoom(room) {
    appendRoomWalls(this.wallMap, room);
    this._markCollidersDirty();
  }

  removeCollidersForRoom(room) {
    if (removeRoomWalls(this.wallMap, room)) {
      this._markCollidersDirty();
    }
  }

  addFurnitureForChunk(mesh) {
    const fc = mesh.userData.furnitureColliders || [];
    this._markCollidersDirty();
    return { furnitureColliders: fc };
  }

  removeFurnitureForChunk(_entry) {
    this._markCollidersDirty();
  }

  consumeColliderRebuild() {
    if (!this.collidersDirty) return false;
    this.rebuildColliderList();
    return true;
  }

  attachChunk(cx, cz, room, build) {
    const k = this.key(cx, cz);
    finalizeRoomBuild(build);
    const mesh = build.group;
    const furniture = this.addFurnitureForChunk(mesh);
    const wallColliders = roomColliderBoxes(this.wallMap, room);
    this.chunks.set(k, { mesh, room, wallColliders, ...furniture });
  }

  spawnComplete(cx, cz) {
    const room = generateRoom(cx, cz);
    appendRoomWalls(this.wallMap, room);
    const wallColliders = roomColliderBoxes(this.wallMap, room);
    const mesh = buildRoomMesh(room, this.materials, this.furnitureModels);
    const furniture = this.addFurnitureForChunk(mesh);
    this.scene.add(mesh);
    this.chunks.set(this.key(cx, cz), { mesh, room, wallColliders, ...furniture });
    this._markCollidersDirty();
  }

  despawn(k) {
    const entry = this.chunks.get(k);
    if (!entry) return;
    const { mesh, room } = entry;
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
    if (!this.chunks.has(this.key(cx, cz))) this.spawnComplete(cx, cz);
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

    const need = this.computeNeed(cx, cz, playerPos, atEdge);
    const pending = new Set(this.despawnPending);

    for (const k of this.chunks.keys()) {
      if (need.has(k) || pending.has(k)) continue;
      const [x, z] = k.split(",").map(Number);
      const chebyshev = Math.max(Math.abs(x - cx), Math.abs(z - cz));
      if (chebyshev > DESPAWN_RADIUS) this.despawnPending.push(k);
    }

    this.loadQueue = this.loadQueue.filter((job) => {
      const k = this.key(job.cx, job.cz);
      if (need.has(k)) return true;
      if (job.room && !this.chunks.has(k)) {
        removeRoomWalls(this.wallMap, job.room);
        this._markCollidersDirty();
      }
      if (job.build?.group) {
        if (job.build.group.parent) this.scene.remove(job.build.group);
        disposeChunkRoot(job.build.group);
      }
      return false;
    });

    for (const k of this.pendingKeys) {
      if (!need.has(k) && !this.chunks.has(k)) this.pendingKeys.delete(k);
    }

    const backlog = this.loadQueue.length;
    if (!atEdge) return;

    const enqueueCap = backlog > 6 ? 1 : backlog > 2 ? MAX_ENQUEUE_PER_UPDATE : MAX_ENQUEUE_PER_UPDATE + 1;
    const missing = [];
    for (const k of need) {
      if (this.chunks.has(k) || this.pendingKeys.has(k)) continue;
      const [x, z] = k.split(",").map(Number);
      missing.push({ x, z, dist: this.distToPlayer(x, z, playerPos) });
    }
    missing.sort((a, b) => a.dist - b.dist);
    for (let i = 0; i < Math.min(enqueueCap, missing.length); i++) {
      const { x, z } = missing[i];
      this.enqueue(x, z, playerPos);
    }
  }

  countLandingChunks(cx, cz) {
    let n = 0;
    for (let z = cz - LANDING_RADIUS; z <= cz + LANDING_RADIUS; z++) {
      for (let x = cx - LANDING_RADIUS; x <= cx + LANDING_RADIUS; x++) {
        if (this.chunks.has(this.key(x, z))) n++;
      }
    }
    return n;
  }

  tryFinishLanding(playerPos) {
    if (!this.preloading || this.landingReady) return false;
    const cx = Math.floor(playerPos.x / CHUNK);
    const cz = Math.floor(playerPos.z / CHUNK);
    const total = (LANDING_RADIUS * 2 + 1) ** 2;
    if (this.countLandingChunks(cx, cz) < total || this.loadQueue.length > 0) return false;

    this.init(playerPos);
    this.rebuildColliderList();
    this.preloading = false;
    this.landingReady = true;
    return true;
  }

  /** Edge streaming only during play — full steps while landing on the title screen. */
  processLoadQueue(playerPos) {
    if (!this.loadQueue.length) return;
    if (!this.preloading && !this.atEdge(playerPos)) return;

    const job = this.loadQueue[0];
    const k = this.key(job.cx, job.cz);

    if (!job.room) {
      if (job.shapeAttempt == null) job.shapeAttempt = 0;

      const shape = tryPickValidShape(job.cx, job.cz, job.shapeAttempt);
      job.shapeAttempt += 1;

      if (shape) {
        job.room = createRoomFromShape(job.cx, job.cz, shape);
      } else if (job.shapeAttempt >= SHAPE_ATTEMPTS_MAX) {
        job.room = generateRoom(job.cx, job.cz);
      } else {
        return;
      }

      job.build = createRoomBuildState(job.room, this.materials, this.furnitureModels);
      if (!this.chunks.has(k)) {
        appendRoomWalls(this.wallMap, job.room);
        this._markCollidersDirty();
      }
      return;
    }

    if (!job.build.shellDone) {
      buildPanelBatch(job.build);
      return;
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
    appendRoomWalls(this.wallMap, room);
    const wallColliders = roomColliderBoxes(this.wallMap, room);
    const mesh = buildRoomMesh(room, this.materials, this.furnitureModels);
    const furniture = this.addFurnitureForChunk(mesh);
    this.scene.add(mesh);
    this.chunks.set(k, { mesh, room, wallColliders, ...furniture });
    this.pendingKeys.delete(k);
    this._markCollidersDirty();
  }

  _spawnChunkSafe(cx, cz) {
    try {
      this._spawnChunkComplete(cx, cz);
    } catch (err) {
      console.error(`Chunk build failed (${cx}, ${cz})`, err);
      throw err;
    }
  }

  async preloadAround(camera, { onProgress, onBootstrapReady, onComplete } = {}) {
    const playerPos = camera.position;
    const cx = Math.floor(playerPos.x / CHUNK);
    const cz = Math.floor(playerPos.z / CHUNK);

    const collectRing = (radius) => {
      const list = [];
      for (let z = cz - radius; z <= cz + radius; z++) {
        for (let x = cx - radius; x <= cx + radius; x++) {
          if (!this.chunks.has(this.key(x, z))) list.push({ cx: x, cz: z });
        }
      }
      list.sort(
        (a, b) =>
          this.distToPlayer(a.cx, a.cz, playerPos) - this.distToPlayer(b.cx, b.cz, playerPos),
      );
      return list;
    };

    this.preloading = true;
    this.landingReady = false;
    this.loadQueue.length = 0;
    this.pendingKeys.clear();
    this._landingTotal = (LANDING_RADIUS * 2 + 1) ** 2;
    this._landingCx = cx;
    this._landingCz = cz;
    this._onLandingProgress = onProgress;
    this._onLandingReady = onBootstrapReady;
    this._onLandingComplete = onComplete;

    for (const { cx: x, cz: z } of collectRing(LANDING_RADIUS)) {
      this.enqueue(x, z, playerPos);
    }
  }

  tickLandingPreload(playerPos) {
    if (!this.preloading) return;
    this.processLoadQueue(playerPos);
    const done = this.countLandingChunks(this._landingCx, this._landingCz);
    this._onLandingProgress?.(done, this._landingTotal);
    if (this.tryFinishLanding(playerPos)) {
      this._onLandingReady?.();
      this._onLandingComplete?.();
    }
  }

  hasPendingLoads() {
    return !this.preloading && this.landingReady && this.loadQueue.length > 0;
  }

  isStreaming() {
    return this.hasPendingLoads();
  }

  shouldStream(playerPos) {
    return this.landingReady && this.atEdge(playerPos) && this.loadQueue.length > 0;
  }
}
