import { CHUNK, generateRoom, appendRoomWalls } from "./room.js";
import {
  GRID_RADIUS,
  PRELOAD_RADIUS,
  PREFETCH_RADIUS,
  EDGE_PREFETCH,
} from "./constants.js";
import {
  createRoomBuildState,
  buildRoomShell,
  buildPanelBatch,
  finalizeRoomBuild,
  buildRoomMesh,
} from "./roomMesh.js";
import { PanelLightPool } from "./lightPool.js";

const PANELS_PER_FRAME = 2;
const PRELOAD_BATCH = 2;

export class World {
  constructor(scene, materials) {
    this.scene = scene;
    this.materials = materials;
    this.chunks = new Map();
    this.wallMap = new Map();
    this.colliders = [];
    this.collidersDirty = false;
    this.pendingColliderRebuild = false;
    this.time = 0;
    this.loadQueue = [];
    this.pendingKeys = new Set();
    this.disposeQueue = [];
    this.fixtures = [];
    this.cellCx = NaN;
    this.cellCz = NaN;
    this.lastPrefetchEdge = false;
    this.preloading = false;
    this.lightPool = new PanelLightPool(scene);
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

  computeNeed(cx, cz, playerPos, radius = PREFETCH_RADIUS) {
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

  rebuildColliders() {
    this.wallMap.clear();
    this.colliders = [];
    for (const { room } of this.chunks.values()) {
      this.colliders.push(...appendRoomWalls(this.wallMap, room));
    }
    this.collidersDirty = true;
    this.pendingColliderRebuild = false;
  }

  addFixtures(mesh) {
    const f = mesh.userData.fixtures;
    if (f?.length) {
      this.fixtures.push(...f);
      this.lightPool.markDirty();
    }
  }

  removeFixtures(mesh) {
    const f = mesh.userData.fixtures;
    if (!f?.length) return;
    const drop = new Set(f);
    this.fixtures = this.fixtures.filter((item) => !drop.has(item));
    for (const fixture of f) fixture.light = null;
    this.lightPool.markDirty();
  }

  consumeColliderRebuild() {
    const v = this.collidersDirty;
    this.collidersDirty = false;
    return v;
  }

  attachChunk(cx, cz, room, build) {
    const k = this.key(cx, cz);
    finalizeRoomBuild(build);
    this.chunks.set(k, { mesh: build.group, room });
    this.addFixtures(build.group);
  }

  spawnComplete(cx, cz) {
    const room = generateRoom(cx, cz);
    this.addCollidersForRoom(room);
    const mesh = buildRoomMesh(room, this.materials);
    this.scene.add(mesh);
    this.chunks.set(this.key(cx, cz), { mesh, room });
    this.addFixtures(mesh);
  }

  despawn(k) {
    const entry = this.chunks.get(k);
    if (!entry) return;
    const { mesh } = entry;
    if (mesh) {
      this.removeFixtures(mesh);
      this.scene.remove(mesh);
      this.disposeQueue.push(mesh);
    }
    this.chunks.delete(k);
    this.pendingColliderRebuild = true;
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
      !this.pendingColliderRebuild
    ) {
      return;
    }

    this.cellCx = cx;
    this.cellCz = cz;
    this.lastPrefetchEdge = atEdge;

    const need = this.computeNeed(cx, cz, playerPos);
    const prevQueueLen = this.loadQueue.length;

    for (const k of [...this.chunks.keys()]) {
      if (!need.has(k)) this.despawn(k);
    }

    this.loadQueue = this.loadQueue.filter((job) => need.has(this.key(job.cx, job.cz)));
    if (this.loadQueue.length < prevQueueLen) this.pendingColliderRebuild = true;

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

  _isPrefetchOnly(cx, cz, playerPos) {
    const pcx = Math.floor(playerPos.x / CHUNK);
    const pcz = Math.floor(playerPos.z / CHUNK);
    return Math.max(Math.abs(cx - pcx), Math.abs(cz - pcz)) > GRID_RADIUS;
  }

  _finishPrefetchJob(job) {
    const k = this.key(job.cx, job.cz);
    if (job.build?.group) {
      this.removeFixtures(job.build.group);
      this.scene.remove(job.build.group);
      job.build.group.traverse((o) => o.geometry?.dispose());
    }
    this.chunks.delete(k);

    const room = job.room || generateRoom(job.cx, job.cz);
    if (!job.room) this.addCollidersForRoom(room);
    const mesh = buildRoomMesh(room, this.materials);
    this.scene.add(mesh);
    this.chunks.set(k, { mesh, room });
    this.addFixtures(mesh);
    this.loadQueue.shift();
    this.pendingKeys.delete(k);
    this.pendingColliderRebuild = true;
  }

  processLoadQueue(playerPos, budgetMs = 6, opts = {}) {
    const panelsPerFrame =
      opts.panelsPerFrame ?? (budgetMs >= 12 ? 999 : PANELS_PER_FRAME);
    const t0 = performance.now();
    const overBudget = () => budgetMs < 1e8 && performance.now() - t0 >= budgetMs;

    if (this.disposeQueue.length && !overBudget()) {
      const mesh = this.disposeQueue.shift();
      mesh.traverse((o) => o.geometry?.dispose());
    }

    if (this.pendingColliderRebuild && !overBudget()) {
      this.rebuildColliders();
    }

    while (this.loadQueue.length && !overBudget()) {
      const job = this.loadQueue[0];
      const k = this.key(job.cx, job.cz);

      if (this._isPrefetchOnly(job.cx, job.cz, playerPos) && (!job.build || !job.build.shellDone)) {
        this._finishPrefetchJob(job);
        continue;
      }

      if (!job.room) {
        job.room = generateRoom(job.cx, job.cz);
        this.addCollidersForRoom(job.room);
        job.dist = this.distToPlayer(job.cx, job.cz, playerPos);
        continue;
      }

      if (!job.build) {
        job.build = createRoomBuildState(job.room, this.materials);
      }

      if (!job.build.shellDone) {
        buildRoomShell(job.build);
        this.scene.add(job.build.group);
        this.chunks.set(k, { mesh: job.build.group, room: job.room });
        continue;
      }

      const panelsDone = buildPanelBatch(job.build, panelsPerFrame);
      if (panelsDone) {
        this.attachChunk(job.cx, job.cz, job.room, job.build);
        this.loadQueue.shift();
        this.pendingKeys.delete(k);
      } else {
        break;
      }
    }
  }

  tick(dt) {
    this.time += dt;
  }

  getColliders() {
    return this.colliders;
  }

  flushColliders() {
    if (this.pendingColliderRebuild) this.rebuildColliders();
  }

  getFixtures() {
    return this.fixtures;
  }

  updateLights(playerPos) {
    this.lightPool.update(this.fixtures, playerPos);
  }

  /** Sync full build — used during title-screen preload to avoid in-game hitches */
  _spawnChunkComplete(cx, cz) {
    const k = this.key(cx, cz);
    const room = generateRoom(cx, cz);
    this.addCollidersForRoom(room);
    const mesh = buildRoomMesh(room, this.materials);
    this.scene.add(mesh);
    this.chunks.set(k, { mesh, room });
    this.addFixtures(mesh);
    this.pendingKeys.delete(k);
  }

  /** Fully build the visible preload square before gameplay. */
  async preloadAround(playerPos, onProgress) {
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
        this._spawnChunkComplete(x, z);
        done++;
      }
      onProgress?.(done, total || 1);
      await new Promise((r) => requestAnimationFrame(r));
    }

    if (this.pendingColliderRebuild) this.rebuildColliders();
    else this.flushColliders();

    this.preloading = false;
    this.lightPool.markDirty();
    this.lightPool.update(this.fixtures, playerPos);
    onProgress?.(total || 1, total || 1);
  }

  hasPendingLoads() {
    return !this.preloading && (this.loadQueue.length > 0 || this.pendingColliderRebuild);
  }
}
