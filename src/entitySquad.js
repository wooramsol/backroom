import { EntityAgent } from "./entityAgent.js";

/** Skinstealer follows behind the player; library wanders separately */
export class EntitySquad {
  constructor(scene, entityAssets) {
    this.agents = [];

    if (entityAssets?.skinstealer) {
      this.agents.push(
        new EntityAgent(entityAssets.skinstealer, scene, {
          id: "skinstealer",
          followBehind: true,
          followDist: 2.35,
          crawlMode: true,
          movePatterns: [/zombie.?crawl|crawl|mixamo/i],
          idlePatterns: [/zombie.?crawl|crawl|idle/i],
        }),
      );
    }
  }

  setColliders(colliders) {
    for (const a of this.agents) a.setColliders(colliders);
  }

  spawnAtStart(player) {
    const gy = player.groundY;
    for (const a of this.agents) a.spawn(player, gy);
  }

  update(dt, player) {
    for (const a of this.agents) a.update(dt, player);
  }
}
