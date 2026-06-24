import * as THREE from "three";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";
import { CHUNK } from "./constants.js";
import { isWalkableLocal } from "./room.js";
import { colliderFromFurniture } from "./furnitureColliders.js";

const _box = new THREE.Box3();
const activeStatues = [];
const SPAWN_CHUNK = { cx: 0, cz: 0 };
const SPAWN_X = CHUNK / 2;
const SPAWN_Z = CHUNK / 2;

/** Fixed spots near the respawn tile — one bateria, one library */
const BATERIA_SPOT = { x: SPAWN_X - 3.4, z: SPAWN_Z + 2.6, yaw: Math.PI * 0.22 };
const LIBRARY_SPOT = { x: SPAWN_X + 3.1, z: SPAWN_Z + 2.2, yaw: -Math.PI * 0.18 };

let bateriaPlaced = false;
let libraryPlaced = false;

function pickClip(clips, patterns) {
  for (const re of patterns) {
    const hit = clips.find((c) => re.test(c.name));
    if (hit) return hit;
  }
  return clips[0] || null;
}

function alignLowestY(pivot, rootGroup, targetY) {
  rootGroup.updateMatrixWorld(true);
  _box.setFromObject(pivot);
  pivot.position.y += targetY - _box.min.y;
}

function placeStatueAt(group, room, entityData, spot, opts, colliders, used) {
  if (!entityData?.model) return false;
  if (!isWalkableLocal(spot.x, spot.z, room.innerWalls)) return false;

  const pivot = new THREE.Group();
  const model = SkeletonUtils.clone(entityData.model);
  pivot.add(model);
  pivot.rotation.y = spot.yaw ?? 0;
  pivot.position.set(spot.x, 0, spot.z);
  alignLowestY(pivot, group, 0);

  pivot.userData.chunkOwned = true;
  pivot.userData.furnitureId = opts.id;
  group.add(pivot);
  colliders.push(colliderFromFurniture(pivot, group));
  used.add(`${spot.x.toFixed(2)},${spot.z.toFixed(2)}`);

  const mixer = new THREE.AnimationMixer(model);
  const clip = pickClip(entityData.animations || [], opts.idlePatterns);
  if (clip) {
    const action = mixer.clipAction(clip);
    action.setLoop(THREE.LoopRepeat);
    action.play();
  }
  activeStatues.push({ root: pivot, mixer });
  return true;
}

/** One bateria + one library near respawn (spawn chunk only) */
export function addChunkStatueEntities(group, room, entities, colliders, used = new Set()) {
  if (!entities) return;
  if (room.cx !== SPAWN_CHUNK.cx || room.cz !== SPAWN_CHUNK.cz) return;

  if (!bateriaPlaced) {
    if (
      placeStatueAt(
        group,
        room,
        entities.bateria,
        BATERIA_SPOT,
        { id: "bateria", idlePatterns: [/stalking|Tpose|idle/i] },
        colliders,
        used,
      )
    ) {
      bateriaPlaced = true;
    }
  }

  if (!libraryPlaced) {
    if (
      placeStatueAt(
        group,
        room,
        entities.library,
        LIBRARY_SPOT,
        { id: "library", idlePatterns: [/idle/i] },
        colliders,
        used,
      )
    ) {
      libraryPlaced = true;
    }
  }
}

export function tickEntityStatues(dt) {
  for (let i = activeStatues.length - 1; i >= 0; i--) {
    const statue = activeStatues[i];
    if (!statue.root.parent) {
      activeStatues.splice(i, 1);
      continue;
    }
    statue.mixer.update(dt);
  }
}
