import * as THREE from "three";
import { createRoomChunk, ROOM_W, ROOM_D } from "./chunk.js";

const GRID_RADIUS = 3;

export class InfiniteWorld {
  constructor(scene, materials) {
    this.scene = scene;
    this.materials = materials;
    this.chunks = new Map();
    this.lights = [];
    this.playerChunk = { x: 0, z: 0 };
  }

  init() {
    for (let dz = -GRID_RADIUS; dz <= GRID_RADIUS; dz++) {
      for (let dx = -GRID_RADIUS; dx <= GRID_RADIUS; dx++) {
        this.spawnChunk(dx, dz);
      }
    }
  }

  key(cx, cz) {
    return `${cx},${cz}`;
  }

  spawnChunk(cx, cz) {
    const chunk = createRoomChunk(this.materials);
    chunk.position.set(cx * ROOM_W, 0, cz * ROOM_D);
    chunk.userData.chunkX = cx;
    chunk.userData.chunkZ = cz;
    this.scene.add(chunk);
    this.chunks.set(this.key(cx, cz), chunk);

    const fixture = chunk.children.find((c) => c.userData.light);
    if (fixture) this.lights.push(fixture);
  }

  getColliders() {
    const colliders = [];
    for (const chunk of this.chunks.values()) {
      const ox = chunk.position.x;
      const oz = chunk.position.z;
      for (const c of chunk.userData.colliders) {
        colliders.push({
          minX: c.minX + ox,
          maxX: c.maxX + ox,
          minZ: c.minZ + oz,
          maxZ: c.maxZ + oz,
        });
      }
    }
    return colliders;
  }

  update(playerPos) {
    const pcx = Math.floor((playerPos.x + ROOM_W / 2) / ROOM_W);
    const pcz = Math.floor((playerPos.z + ROOM_D / 2) / ROOM_D);

    if (pcx === this.playerChunk.x && pcz === this.playerChunk.z) return;

    const dx = pcx - this.playerChunk.x;
    const dz = pcz - this.playerChunk.z;
    this.playerChunk = { x: pcx, z: pcz };

    const needed = new Set();
    for (let z = pcz - GRID_RADIUS; z <= pcz + GRID_RADIUS; z++) {
      for (let x = pcx - GRID_RADIUS; x <= pcx + GRID_RADIUS; x++) {
        needed.add(this.key(x, z));
      }
    }

    for (const k of [...this.chunks.keys()]) {
      if (!needed.has(k)) {
        const chunk = this.chunks.get(k);
        this.scene.remove(chunk);
        this.chunks.delete(k);
        const idx = this.lights.findIndex((l) => chunk.children.includes(l));
        if (idx >= 0) this.lights.splice(idx, 1);
        chunk.traverse((obj) => {
          if (obj.geometry) obj.geometry.dispose();
        });
      }
    }

    for (let z = pcz - GRID_RADIUS; z <= pcz + GRID_RADIUS; z++) {
      for (let x = pcx - GRID_RADIUS; x <= pcx + GRID_RADIUS; x++) {
        const k = this.key(x, z);
        if (!this.chunks.has(k)) this.spawnChunk(x, z);
      }
    }
  }

  updateLights(time) {
    for (const fixture of this.lights) {
      const t = time * fixture.userData.flickerSpeed + fixture.userData.flickerPhase;
      const flicker = 0.85 + Math.sin(t * 3.7) * 0.05 + Math.sin(t * 11.3) * 0.03;
      fixture.userData.light.intensity = fixture.userData.baseIntensity * flicker;
      const b = 0.7 + flicker * 0.3;
      fixture.userData.bulb.material.color.setRGB(b, b, b * 0.85);
    }
  }
}
