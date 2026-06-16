import { CHUNK, generateRoom, registerRoomWalls, collidersFromMap } from "./room.js";
import { buildRoomMesh } from "./roomMesh.js";
import { releasePanelLights } from "./lightBudget.js";

/** 3×3 loaded rooms — keeps per-panel RectAreaLights within GPU cap */
const GRID_RADIUS = 1;

export class World {
  constructor(scene, materials) {
    this.scene = scene;
    this.materials = materials;
    this.chunks = new Map();
    this.cell = { x: 0, z: 0 };
    this.colliders = [];
    this.dirty = true;
    this.time = 0;
  }

  key(cx, cz) {
    return `${cx},${cz}`;
  }

  spawn(cx, cz) {
    const room = generateRoom(cx, cz);
    const mesh = buildRoomMesh(room, this.materials);
    this.scene.add(mesh);
    this.chunks.set(this.key(cx, cz), { mesh, room });
  }

  rebuildColliders() {
    const map = new Map();
    for (const { room } of this.chunks.values()) {
      registerRoomWalls(map, room);
    }
    this.colliders = collidersFromMap(map);
    this.dirty = false;
  }

  init() {
    for (let z = -GRID_RADIUS; z <= GRID_RADIUS; z++) {
      for (let x = -GRID_RADIUS; x <= GRID_RADIUS; x++) {
        this.spawn(x, z);
      }
    }
    this.rebuildColliders();
  }

  update(playerPos) {
    const cx = Math.floor(playerPos.x / CHUNK);
    const cz = Math.floor(playerPos.z / CHUNK);

    if (cx === this.cell.x && cz === this.cell.z) return;
    this.cell = { x: cx, z: cz };

    const need = new Set();
    for (let z = cz - GRID_RADIUS; z <= cz + GRID_RADIUS; z++) {
      for (let x = cx - GRID_RADIUS; x <= cx + GRID_RADIUS; x++) {
        need.add(this.key(x, z));
      }
    }

    for (const k of [...this.chunks.keys()]) {
      if (!need.has(k)) {
        const { mesh } = this.chunks.get(k);
        releasePanelLights(mesh.userData.lightCount || 0);
        this.scene.remove(mesh);
        mesh.traverse((o) => o.geometry?.dispose());
        this.chunks.delete(k);
        this.dirty = true;
      }
    }

    for (const k of need) {
      if (!this.chunks.has(k)) {
        const [x, z] = k.split(",").map(Number);
        this.spawn(x, z);
        this.dirty = true;
      }
    }

    if (this.dirty) this.rebuildColliders();
  }

  tick(dt) {
    this.time += dt;
  }

  getColliders() {
    return this.colliders;
  }
}
