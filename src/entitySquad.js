import { EntityAgent } from "./entityAgent.js";

const SPAWN_INTERVAL = 60;
const SPAWN_CHANCE = 0.5;

/** Skinstealer spawns periodically and vanishes on re-contact or when wedged */
export class EntitySquad {
  constructor(scene, entityAssets) {
    this.agents = [];
    this._running = false;
    this._spawnTimer = 0;

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
