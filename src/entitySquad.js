import { EntityAgent } from "./entityAgent.js";

/** All chasing entities — spawn near start, share wall colliders */
export class EntitySquad {
  constructor(scene, entityAssets) {
    this.agents = [];

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

    if (entityAssets?.bateria) {
      this.agents.push(
        new EntityAgent(entityAssets.bateria, scene, {
          id: "bateria",
          spawnOffset: [4.2, 1.8],
          movePatterns: [/stalking|bending|chase/i],
          idlePatterns: [/stalking|Tpose/i],
        }),
      );
    }

    if (entityAssets?.library) {
      this.agents.push(
        new EntityAgent(entityAssets.library, scene, {
          id: "library",
          spawnOffset: [-4.2, 1.8],
          movePatterns: [/idle|walk|move/i],
          idlePatterns: [/idle/i],
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
