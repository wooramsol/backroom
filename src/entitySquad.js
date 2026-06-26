import * as THREE from "three";
import { EntityAgent } from "./entityAgent.js";

const SPAWN_INTERVAL = 60;
const SPAWN_CHANCE = 1; // TODO: restore 0.5 after testing

const _fwd = new THREE.Vector3();
const _right = new THREE.Vector3();

function panToEntity(player, agent) {
  const dx = agent.body.position.x - player.position.x;
  const dz = agent.body.position.z - player.position.z;
  const len = Math.hypot(dx, dz);
  if (len < 0.05) return 0;

  player.camera.getWorldDirection(_fwd);
  _fwd.y = 0;
  if (_fwd.lengthSq() < 1e-10) return 0;
  _fwd.normalize();
  _right.set(_fwd.z, 0, -_fwd.x);

  const side = (dx * _right.x + dz * _right.z) / len;
  return Math.max(-1, Math.min(1, side * 1.15));
}

/** Skinstealer spawns periodically and vanishes on re-contact or when wedged */
export class EntitySquad {
  constructor(scene, entityAssets) {
    this.agents = [];
    this._running = false;
    this._spawnTimer = 0;
    this._audio = null;

    if (entityAssets?.skinstealer) {
      this.agents.push(
        new EntityAgent(entityAssets.skinstealer, scene, {
          id: "skinstealer",
          followBehind: true,
          followDist: 2.35,
          movePatterns: [/mixamo|walk|run|move/i],
        }),
      );
    }
  }

  setAudio(audio) {
    this._audio = audio;
    for (const a of this.agents) {
      a.onStep = (distance, running, speed, player) => {
        if (!this._audio) return;
        const dx = a.body.position.x - player.position.x;
        const dz = a.body.position.z - player.position.z;
        const entityDist = Math.hypot(dx, dz);
        this._audio.onEntityMove(
          distance,
          running,
          speed,
          panToEntity(player, a),
          entityDist,
        );
      };
    }
  }

  setColliders(colliders) {
    for (const a of this.agents) a.setColliders(colliders);
  }

  begin() {
    this._running = true;
    this._spawnTimer = 0;
  }

  _anyActive() {
    return this.agents.some((a) => a.active);
  }

  _trySpawn(player) {
    if (this._anyActive()) return;
    const gy = player.groundY;
    for (const a of this.agents) a.spawn(player, gy);
  }

  update(dt, player) {
    if (!this._running) return;

    for (const a of this.agents) {
      if (a.active) a.update(dt, player);
    }

    if (this._anyActive()) return;

    this._spawnTimer += dt;
    if (this._spawnTimer < SPAWN_INTERVAL) return;

    this._spawnTimer = 0;
    if (Math.random() < SPAWN_CHANCE) this._trySpawn(player);
  }
}
