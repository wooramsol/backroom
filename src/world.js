import { CHUNK, generateRoom, appendRoomWalls } from "./room.js";
import {
  createRoomBuildState,
  buildRoomShell,
  buildPanelBatch,
  finalizeRoomBuild,
  buildRoomMesh,
} from "./roomMesh.js";
import { releasePanelLights, resetPanelLightBudget } from "./lightBudget.js";

/** 3×3 loaded rooms — keeps per-panel RectAreaLights within GPU cap */
const GRID_RADIUS = 1;
const PANELS_PER_FRAME = 2;
const EDGE_PREFETCH = 0.38;

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
    this.pendingColliderRebuild = false;
  }

  addFixtures(mesh) {
    const f = mesh.userData.fixtures;
    if (f?.length) this.fixtures.push(...f);
  }

  removeFixtures(mesh) {
    const f = mesh.userData.fixtures;
    if (!f?.length) return;
    const drop = new Set(f);
    this.fixtures = this.fixtures.filter((item) => !drop.has(item));
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
      releasePanelLights(mesh.userData.lightCount || 0);
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
    resetPanelLightBudget();
    const cx = Math.floor(playerPos.x / CHUNK);
    const cz = Math.floor(playerPos.z / CHUNK);
    this.cellCx = cx;
    this.cellCz = cz;
    this.lastPrefetchEdge = this.nearPrefetchEdge(playerPos, cx, cz);
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

  processLoadQueue(playerPos, budgetMs = 6) {
    const t0 = performance.now();
    const overBudget = () => performance.now() - t0 >= budgetMs;

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

      const panelsDone = buildPanelBatch(job.build, PANELS_PER_FRAME);
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
}
