import * as THREE from "three";
import { CHUNK, ROOM_H, WALL_T } from "./constants.js";
import { isWalkableLocal } from "./room.js";
import { createRng } from "./rng.js";
import { cloneFurnitureTemplate } from "./furnitureModels.js";
import { colliderFromFurniture, furnitureWorldCenter } from "./furnitureColliders.js";
import { applyChairStaticVisual } from "./chairStatic.js";

const _box = new THREE.Box3();
const _euler = new THREE.Euler();

const POSES = [
  ["floor_normal", 28],
  ["floor_tipped", 18],
  ["wall_lean", 24],
  ["wall_embedded", 14],
  ["ceiling_stuck", 10],
  ["floor_embedded", 6],
];

function alignLowestY(pivot, targetY) {
  pivot.updateMatrixWorld(true);
  _box.setFromObject(pivot);
  pivot.position.y += targetY - _box.min.y;
}

function alignHighestY(pivot, targetY) {
  pivot.updateMatrixWorld(true);
  _box.setFromObject(pivot);
  pivot.position.y += targetY - _box.max.y;
}

function sampleWalkable(innerWalls, rng, margin = 0.55, attempts = 48) {
  for (let i = 0; i < attempts; i++) {
    const x = rng.range(margin, CHUNK - margin);
    const z = rng.range(margin, CHUNK - margin);
    if (isWalkableLocal(x, z, innerWalls)) return { x, z };
  }
  return null;
}

function collectWalls(innerWalls) {
  const inset = WALL_T * 0.5 + 0.04;
  const spanPad = 0.8;
  const outer = [
    { axis: "z", pos: inset, span0: spanPad, span1: CHUNK - spanPad },
    { axis: "z", pos: CHUNK - inset, span0: spanPad, span1: CHUNK - spanPad },
    { axis: "x", pos: inset, span0: spanPad, span1: CHUNK - spanPad },
    { axis: "x", pos: CHUNK - inset, span0: spanPad, span1: CHUNK - spanPad },
  ];
  return [...innerWalls, ...outer];
}

function wallRoomOffset(wall, along, innerWalls) {
  if (wall.axis === "z") {
    const north = isWalkableLocal(along, wall.pos + 0.55, innerWalls);
    const south = isWalkableLocal(along, wall.pos - 0.55, innerWalls);
    if (north && !south) return 0.55;
    if (south && !north) return -0.55;
    return north ? 0.55 : -0.55;
  }
  const east = isWalkableLocal(wall.pos + 0.55, along, innerWalls);
  const west = isWalkableLocal(wall.pos - 0.55, along, innerWalls);
  if (east && !west) return 0.55;
  if (west && !east) return -0.55;
  return east ? 0.55 : -0.55;
}

function pickWallSpot(walls, innerWalls, footprint, rng) {
  const order = [...walls];
  for (let i = order.length - 1; i > 0; i--) {
    const j = rng.int(0, i);
    [order[i], order[j]] = [order[j], order[i]];
  }
  for (let attempt = 0; attempt < 24; attempt++) {
    const wall = order[attempt % order.length];
    const along = rng.range(wall.span0 + footprint * 0.5, wall.span1 - footprint * 0.5);
    const offset = wallRoomOffset(wall, along, innerWalls);
    const x = wall.axis === "z" ? along : wall.pos + offset;
    const z = wall.axis === "z" ? wall.pos + offset : along;
    if (!isWalkableLocal(x, z, innerWalls)) continue;
    const yaw = wall.axis === "z" ? (offset > 0 ? 0 : Math.PI) : offset > 0 ? -Math.PI / 2 : Math.PI / 2;
    return { x, z, yaw, wall, offset };
  }
  return null;
}

function applyPose(pivot, pose, spot, rng, meta) {
  const { height, depth } = meta;
  pivot.rotation.set(0, 0, 0);
  pivot.position.set(spot.x, 0, spot.z);

  switch (pose) {
    case "floor_normal":
      pivot.rotation.y = spot.yaw ?? rng.range(0, Math.PI * 2);
      alignLowestY(pivot, 0);
      break;

    case "floor_tipped":
      pivot.rotation.y = rng.range(0, Math.PI * 2);
      _euler.set(rng.range(1.1, 1.65), pivot.rotation.y, rng.range(-0.35, 0.35));
      pivot.setRotationFromEuler(_euler);
      alignLowestY(pivot, rng.range(-0.02, 0.04));
      break;

    case "wall_lean": {
      const lean = rng.range(0.22, 0.48);
      pivot.rotation.y = spot.yaw + rng.range(-0.2, 0.2);
      const axis = spot.wall.axis === "z" ? "x" : "z";
      if (axis === "x") pivot.rotation.x = spot.offset > 0 ? -lean : lean;
      else pivot.rotation.z = spot.offset > 0 ? lean : -lean;
      const inset = depth * rng.range(0.15, 0.35);
      if (spot.wall.axis === "z") pivot.position.z -= Math.sign(spot.offset) * inset;
      else pivot.position.x -= Math.sign(spot.offset) * inset;
      alignLowestY(pivot, 0);
      break;
    }

    case "wall_embedded": {
      pivot.rotation.y = spot.yaw + rng.range(-0.15, 0.15);
      const embed = depth * rng.range(0.35, 0.62);
      if (spot.wall.axis === "z") pivot.position.z -= Math.sign(spot.offset) * embed;
      else pivot.position.x -= Math.sign(spot.offset) * embed;
      pivot.rotation.x = rng.range(-0.12, 0.12);
      alignLowestY(pivot, rng.range(-0.05, 0.08));
      break;
    }

    case "ceiling_stuck":
      pivot.rotation.y = rng.range(0, Math.PI * 2);
      pivot.rotation.x = Math.PI + rng.range(-0.25, 0.25);
      pivot.rotation.z = rng.range(-0.2, 0.2);
      alignHighestY(pivot, ROOM_H + rng.range(0.02, height * 0.35));
      break;

    case "floor_embedded":
      pivot.rotation.y = rng.range(0, Math.PI * 2);
      pivot.rotation.z = rng.range(-0.18, 0.18);
      alignLowestY(pivot, -height * rng.range(0.18, 0.42));
      break;

    default:
      pivot.rotation.y = rng.range(0, Math.PI * 2);
      alignLowestY(pivot, 0);
  }
}

function pickPose(rng) {
  return rng.pickWeighted(POSES);
}

function placeOne(group, room, models, rng, used, colliders, chairs) {
  const kind = rng.chance(0.55) ? "chair" : "stool";
  const template = models[kind];
  if (!template) return false;

  const pivot = cloneFurnitureTemplate(template);
  const meta = pivot.userData;
  meta.furnitureKind = kind;
  const pose = pickPose(rng);
  let spot = null;

  if (pose === "floor_normal" || pose === "floor_tipped" || pose === "floor_embedded") {
    const pt = sampleWalkable(room.innerWalls, rng, meta.footprint * 0.45);
    if (!pt) return false;
    spot = { ...pt, yaw: rng.range(0, Math.PI * 2) };
  } else if (pose === "ceiling_stuck") {
    const pt = sampleWalkable(room.innerWalls, rng, meta.footprint * 0.4);
    if (!pt) return false;
    spot = { ...pt };
  } else {
    const walls = collectWalls(room.innerWalls);
    spot = pickWallSpot(walls, room.innerWalls, meta.footprint, rng);
    if (!spot) return false;
  }

  for (const key of used) {
    const [ux, uz] = key.split(",").map(Number);
    const dx = spot.x - ux;
    const dz = spot.z - uz;
    if (dx * dx + dz * dz < meta.footprint * meta.footprint) return false;
  }

  applyPose(pivot, pose, spot, rng, meta);
  pivot.userData.chunkOwned = true;
  group.add(pivot);

  const box = colliderFromFurniture(pivot, group);
  colliders.push(box);

  if (kind === "chair") {
    applyChairStaticVisual(pivot);
    chairs.push(furnitureWorldCenter(pivot, group));
  }

  used.add(`${spot.x.toFixed(2)},${spot.z.toFixed(2)}`);
  return true;
}

/** Scatter chair/stool props in chunk-local space */
export function addChunkFurniture(group, room, models) {
  if (!models?.chair && !models?.stool) return { colliders: [], chairs: [] };

  const colliders = [];
  const chairs = [];
  const rng = createRng(room.cx, room.cz, 881);
  if (!rng.chance(0.52)) {
    group.userData.furnitureColliders = colliders;
    group.userData.furnitureChairs = chairs;
    return { colliders, chairs };
  }

  const count = rng.int(1, 2);
  const used = new Set();
  let placed = 0;
  for (let i = 0; i < count * 4 && placed < count; i++) {
    if (placeOne(group, room, models, rng, used, colliders, chairs)) placed++;
  }

  group.userData.furnitureColliders = colliders;
  group.userData.furnitureChairs = chairs;
  return { colliders, chairs };
}
