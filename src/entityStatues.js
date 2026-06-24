import * as THREE from "three";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";
import { CHUNK } from "./constants.js";
import { isWalkableLocal } from "./room.js";
import { createRng } from "./rng.js";
import { colliderFromFurniture } from "./furnitureColliders.js";

const _box = new THREE.Box3();
const activeStatues = [];

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

function sampleWalkable(innerWalls, rng, margin = 0.9, attempts = 48) {
  for (let i = 0; i < attempts; i++) {
    const x = rng.range(margin, CHUNK - margin);
    const z = rng.range(margin, CHUNK - margin);
    if (isWalkableLocal(x, z, innerWalls)) return { x, z };
  }
  return null;
}

function pickFarChunk(rng, avoid = []) {
  for (let i = 0; i < 48; i++) {
    const cx = rng.int(-4, 4);
    const cz = rng.int(-4, 4);
    if (cx === 0 && cz === 0) continue;
    if (Math.abs(cx) + Math.abs(cz) < 2) continue;
    if (avoid.some((c) => c.cx === cx && c.cz === cz)) continue;
    return { cx, cz };
  }
  return { cx: 2, cz: 1 };
}

const placeRng = createRng(0, 0, 1203);
const BATERIA_CHUNK = pickFarChunk(placeRng);
const LIBRARY_CHUNK = pickFarChunk(placeRng, [BATERIA_CHUNK]);

let bateriaPlaced = false;
let libraryPlaced = false;

function placeStatue(group, room, entityData, opts, colliders, used) {
  if (!entityData?.model) return false;

  const rng = createRng(room.cx, room.cz, opts.seed);
  const spot = sampleWalkable(room.innerWalls, rng);
  if (!spot) return false;

  const pivot = new THREE.Group();
  const model = SkeletonUtils.clone(entityData.model);
  pivot.add(model);
  pivot.rotation.y = rng.range(0, Math.PI * 2);
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

/** One bateria + one library standing alone on the map (chunk-owned, idle loop) */
export function addChunkStatueEntities(group, room, entities, colliders, used = new Set()) {
  if (!entities) return;

  if (!bateriaPlaced && room.cx === BATERIA_CHUNK.cx && room.cz === BATERIA_CHUNK.cz) {
    if (
      placeStatue(group, room, entities.bateria, {
        id: "bateria",
        seed: 1205,
        idlePatterns: [/stalking|Tpose|idle/i],
      }, colliders, used)
    ) {
      bateriaPlaced = true;
    }
  }

  if (!libraryPlaced && room.cx === LIBRARY_CHUNK.cx && room.cz === LIBRARY_CHUNK.cz) {
    if (
      placeStatue(group, room, entities.library, {
        id: "library",
        seed: 1206,
        idlePatterns: [/idle/i],
      }, colliders, used)
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
