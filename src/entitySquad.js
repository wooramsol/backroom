import { EntityAgent } from "./entityAgent.js";

/** Skinstealer hunts from random spawns; library wanders separately */
export class EntitySquad {
  constructor(scene, entityAssets) {
    this.agents = [];
    this._respawnSeed = 2203;

    if (entityAssets?.skinstealer) {
      this.agents.push(
        new EntityAgent(entityAssets.skinstealer, scene, {
          id: "skinstealer",
          huntPlayer: true,
          vanishDist: 3,
          movePatterns: [/mixamo|walk|run|move/i],
        }),
      );
    }
  }

  setColliders(colliders) {
    for (const a of this.agents) a.setColliders(colliders);
  }

  spawnAtStart(player) {
    const gy = player.groundY;
    for (const a of this.agents) {
      this._respawnSeed += 1;
      a.spawnRandom(player, gy, this._respawnSeed);
    }
  }

  _respawn(agent, player) {
    this._respawnSeed += 1;
    agent.spawnRandom(player, player.groundY, this._respawnSeed);
  }

  update(dt, player) {
    for (const a of this.agents) {
      const result = a.update(dt, player);
      if (result?.vanished) this._respawn(a, player);
    }
  }
}
