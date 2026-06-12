import {
  CELL,
  FLOOR_STEP,
  cellOf,
  generateRoom,
  registerRoomEdges,
  buildCollidersFromEdges,
  buildStairVolume,
} from "./roomGen.js";
import { buildRoomMesh } from "./roomMesh.js";

const GRID_RADIUS = 2;

export class InfiniteWorld {
  constructor(scene, materials) {
    this.scene = scene;
    this.materials = materials;
    this.chunks = new Map();
    this.playerCell = { x: 0, z: 0 };
    this.playerFloor = 0;
    this.walls = [];
    this.stairs = [];
    this.dirty = true;
  }

  key(cx, cz, floor) {
    return `${cx},${cz},${floor}`;
  }

  spawnChunk(cx, cz, floor) {
    const room = generateRoom(cx, cz, floor);
    const mesh = buildRoomMesh(room, this.materials);
    this.scene.add(mesh);
    this.chunks.set(this.key(cx, cz, floor), { mesh, room });
  }

  rebuildPhysics() {
    const edgeMap = new Map();
    const rooms = [];
    this.stairs = [];

    for (const { room } of this.chunks.values()) {
      rooms.push(room);
      registerRoomEdges(edgeMap, room);
      const stair = buildStairVolume(room);
      if (stair) this.stairs.push(stair);
    }

    this.walls = buildCollidersFromEdges(edgeMap, rooms);
    this.dirty = false;
  }

  init() {
    for (let dz = -GRID_RADIUS; dz <= GRID_RADIUS; dz++) {
      for (let dx = -GRID_RADIUS; dx <= GRID_RADIUS; dx++) {
        this.spawnChunk(dx, dz, 0);
      }
    }
    this.rebuildPhysics();
  }

  update(playerPos, playerFloor) {
    const { x: pcx, z: pcz } = cellOf(playerPos);

    const moved =
      pcx !== this.playerCell.x ||
      pcz !== this.playerCell.z ||
      playerFloor !== this.playerFloor;

    if (!moved) return;

    this.playerCell = { x: pcx, z: pcz };
    this.playerFloor = playerFloor;

    const needed = new Set();
    for (let z = pcz - GRID_RADIUS; z <= pcz + GRID_RADIUS; z++) {
      for (let x = pcx - GRID_RADIUS; x <= pcx + GRID_RADIUS; x++) {
        needed.add(this.key(x, z, playerFloor));
      }
    }

    for (const k of [...this.chunks.keys()]) {
      if (!needed.has(k)) {
        const { mesh } = this.chunks.get(k);
        this.scene.remove(mesh);
        this.chunks.delete(k);
        mesh.traverse((obj) => {
          if (obj.geometry) obj.geometry.dispose();
          if (obj.material) {
            if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
            else obj.material.dispose();
          }
        });
        this.dirty = true;
      }
    }

    for (let z = pcz - GRID_RADIUS; z <= pcz + GRID_RADIUS; z++) {
      for (let x = pcx - GRID_RADIUS; x <= pcx + GRID_RADIUS; x++) {
        const k = this.key(x, z, playerFloor);
        if (!this.chunks.has(k)) {
          this.spawnChunk(x, z, playerFloor);
          this.dirty = true;
        }
      }
    }

    if (this.dirty) this.rebuildPhysics();
  }

  getWallsForFloor(floor) {
    const yMin = floor * FLOOR_STEP - 0.5;
    const yMax = floor * FLOOR_STEP + 3.5;
    return this.walls.filter((w) => w.maxY > yMin && w.minY < yMax);
  }

  getStairs() {
    return this.stairs;
  }

  getFloorLabel(floor) {
    if (floor < 0) return "BASEMENT";
    if (floor === 0) return "LEVEL 0 — THE LOBBY";
    return `LEVEL ${floor}`;
  }
}
