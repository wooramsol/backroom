import * as THREE from "three";
import { CHUNK } from "./constants.js";
import { isWalkableLocal } from "./room.js";
import { cloneSpecialTemplate } from "./specialAssets.js";
import { colliderFromFurniture } from "./furnitureColliders.js";

const _box = new THREE.Box3();
const SPAWN_CHUNK = { cx: 0, cz: 0 };

function alignLowestY(pivot, rootGroup, targetY) {
  rootGroup.updateMatrixWorld(true);
  _box.setFromObject(pivot);
  pivot.position.y += targetY - _box.min.y;
}

/** One car beside the respawn tile — chunk (0, 0) only */
export function addSpawnCar(group, room, carTemplate, colliders) {
  if (!carTemplate) return;
  if (room.cx !== SPAWN_CHUNK.cx || room.cz !== SPAWN_CHUNK.cz) return;

  const spot = { x: CHUNK / 2 + 2.6, z: CHUNK / 2 - 2.4, yaw: Math.PI * 0.12 };
  if (!isWalkableLocal(spot.x, spot.z, room.innerWalls)) return;

  const pivot = cloneSpecialTemplate(carTemplate);
  pivot.rotation.y = spot.yaw;
  pivot.position.set(spot.x, 0, spot.z);
  alignLowestY(pivot, group, 0);
  pivot.userData.chunkOwned = true;
  group.add(pivot);
  colliders.push(colliderFromFurniture(pivot, group));
}

export function addSpecialChunkProps(group, room, specialAssets, colliders, used) {
  if (!specialAssets) return;
  addSpawnCar(group, room, specialAssets.car, colliders);
}
