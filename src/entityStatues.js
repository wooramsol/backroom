import * as THREE from "three";
import * as SkeletonUtils from "three/addons/utils/SkeletonUtils.js";
import { CHUNK } from "./constants.js";
import { isWalkableLocal, reachableCellsFrom } from "./room.js";
import { colliderFromFurniture } from "./furnitureColliders.js";

const _box = new THREE.Box3();
const activeStatues = [];
const SPAWN_CHUNK = { cx: 0, cz: 0 };
const SPAWN_X = CHUNK / 2;
const SPAWN_Z = CHUNK / 2;
/** Default player facing at spawn (yaw 0 → -Z) */
const SPAWN_FWD_X = 0;
const SPAWN_FWD_Z = -1;

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

function floodOrigin(innerWalls) {
  if (isWalkableLocal(SPAWN_X, SPAWN_Z, innerWalls)) {
    return { x: SPAWN_X, z: SPAWN_Z };
  }

  for (let r = 0.5; r < 6; r += 0.5) {
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const x = SPAWN_X + Math.cos(a) * r;
      const z = SPAWN_Z + Math.sin(a) * r;
      if (isWalkableLocal(x, z, innerWalls)) return { x, z };
    }
  }
  return null;
}

function findBateriaSpot(innerWalls) {
  const origin = floodOrigin(innerWalls);
  if (!origin) return null;

  const cells = reachableCellsFrom(innerWalls, origin.x, origin.z);
  let best = null;
  let bestScore = Infinity;

  for (const cell of cells) {
    const dx = cell.x - origin.x;
    const dz = cell.z - origin.z;
    const dist = Math.hypot(dx, dz);
    if (dist < 1.05 || dist > 3.6) continue;

    const align = (dx * SPAWN_FWD_X + dz * SPAWN_FWD_Z) / dist;
    if (align < 0.55) continue;

    const score = Math.abs(dist - 2.15) + (1 - align) * 1.8;
    if (score < bestScore) {
      bestScore = score;
      best = {
        x: cell.x,
        z: cell.z,
        yaw: Math.atan2(origin.x - cell.x, origin.z - cell.z),
      };
    }
  }

  if (best) return best;

  for (const cell of cells) {
    const dx = cell.x - origin.x;
    const dz = cell.z - origin.z;
    const dist = Math.hypot(dx, dz);
    if (dist < 0.9 || dist > 4.2) continue;
    const score = Math.abs(dist - 2.15);
    if (score < bestScore) {
      bestScore = score;
      best = {
        x: cell.x,
        z: cell.z,
        yaw: Math.atan2(origin.x - cell.x, origin.z - cell.z),
      };
    }
  }

  return best;
}

function findLibrarySpot(innerWalls, avoid) {
  const origin = floodOrigin(innerWalls);
  if (!origin) return null;

  const cells = reachableCellsFrom(innerWalls, origin.x, origin.z);
  let best = null;
  let bestScore = -Infinity;

  for (const cell of cells) {
    const dx = cell.x - origin.x;
    const dz = cell.z - origin.z;
    const dist = Math.hypot(dx, dz);
    if (dist < 2.4 || dist > 6.5) continue;
    if (avoid && Math.hypot(cell.x - avoid.x, cell.z - avoid.z) < 2.4) continue;

    const side = dx > 0 ? 1 : -1;
    const score = side * 0.55 + dist * 0.12 - Math.abs(dz) * 0.08;
    if (score > bestScore) {
      bestScore = score;
      best = {
        x: cell.x,
        z: cell.z,
        yaw: Math.atan2(origin.x - cell.x, origin.z - cell.z) + Math.PI * 0.15 * side,
      };
    }
  }

  return best;
}

function placeStatueAt(group, room, entityData, spot, opts, colliders, used) {
  if (!entityData?.model || !spot) return false;

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

/** Bateria in front of spawn + library in the same reachable area */
export function addChunkStatueEntities(group, room, entities, colliders, used = new Set()) {
  if (!entities) return;
  if (room.cx !== SPAWN_CHUNK.cx || room.cz !== SPAWN_CHUNK.cz) return;

  let bateriaSpot = null;

  if (!bateriaPlaced) {
    bateriaSpot = findBateriaSpot(room.innerWalls);
    if (
      bateriaSpot &&
      placeStatueAt(
        group,
        room,
        entities.bateria,
        bateriaSpot,
        { id: "bateria", idlePatterns: [/stalking|Tpose|idle/i] },
        colliders,
        used,
      )
    ) {
      bateriaPlaced = true;
    }
  }

  if (!libraryPlaced) {
    const librarySpot = findLibrarySpot(room.innerWalls, bateriaSpot);
    if (
      librarySpot &&
      placeStatueAt(
        group,
        room,
        entities.library,
        librarySpot,
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
