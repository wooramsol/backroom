import * as THREE from "three";
import { CHUNK, ROOM_H, WALL_T } from "./constants.js";
import { isWalkableLocal } from "./room.js";
import { createRng } from "./rng.js";
import {
  cloneFurnitureTemplate,
  pickChairTemplate,
  pickPileChairTemplate,
} from "./furnitureModels.js";
import { colliderFromFurniture } from "./furnitureColliders.js";
import { applyChairGlitchVisual } from "./chairStatic.js";
import { recordFurnitureSurface, supportYAt } from "./furnitureSurfaces.js";

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

const PILE_POSES = [
  ["floor_normal", 38],
  ["floor_tipped", 32],
  ["floor_embedded", 18],
  ["wall_lean", 12],
];

/** Preset floor spots (pile cluster) — wall poses need spot.wall */
const FIXED_SPOT_POSES = [
  ["floor_normal", 32],
  ["floor_tipped", 28],
  ["floor_embedded", 14],
  ["ceiling_stuck", 10],
];

const FIXED_SPOT_PILE_POSES = [
  ["floor_normal", 38],
  ["floor_tipped", 32],
  ["floor_embedded", 18],
  ["ceiling_stuck", 12],
];

function alignLowestY(pivot, rootGroup, targetY) {
  rootGroup.updateMatrixWorld(true);
  _box.setFromObject(pivot);
  pivot.position.y += targetY - _box.min.y;
}

function alignHighestY(pivot, rootGroup, targetY) {
  rootGroup.updateMatrixWorld(true);
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

function applyPose(pivot, pose, spot, rng, meta, group) {
  const { height, depth } = meta;
  const support = spot.supportY ?? 0;
  pivot.rotation.set(0, 0, 0);
  pivot.position.set(spot.x, 0, spot.z);

  switch (pose) {
    case "floor_normal":
      pivot.rotation.y = spot.yaw ?? rng.range(0, Math.PI * 2);
      alignLowestY(pivot, group, support);
      break;

    case "floor_tipped":
      pivot.rotation.y = rng.range(0, Math.PI * 2);
      _euler.set(rng.range(1.1, 1.65), pivot.rotation.y, rng.range(-0.35, 0.35));
      pivot.setRotationFromEuler(_euler);
      alignLowestY(pivot, group, support + rng.range(-0.01, 0.02));
      break;

    case "wall_lean": {
      const lean = rng.range(0.22, 0.48);
      pivot.rotation.y = spot.yaw + rng.range(-0.2, 0.2);
      const axis = spot.wall.axis === "z" ? "x" : "z";
      if (axis === "x") pivot.rotation.x = spot.offset > 0 ? -lean : lean;
      else pivot.rotation.z = spot.offset > 0 ? lean : -lean;
      const inset = depth * rng.range(0.22, 0.42);
      if (spot.wall.axis === "z") pivot.position.z -= Math.sign(spot.offset) * inset;
      else pivot.position.x -= Math.sign(spot.offset) * inset;
      alignLowestY(pivot, group, support);
      break;
    }

    case "wall_embedded": {
      pivot.rotation.y = spot.yaw + rng.range(-0.15, 0.15);
      const embed = depth * rng.range(0.42, 0.72);
      if (spot.wall.axis === "z") pivot.position.z -= Math.sign(spot.offset) * embed;
      else pivot.position.x -= Math.sign(spot.offset) * embed;
      pivot.rotation.x = rng.range(-0.12, 0.12);
      alignLowestY(pivot, group, support + rng.range(-0.03, 0.05));
      break;
    }

    case "ceiling_stuck":
      pivot.rotation.y = rng.range(0, Math.PI * 2);
      pivot.rotation.x = Math.PI + rng.range(-0.22, 0.22);
      pivot.rotation.z = rng.range(-0.18, 0.18);
      alignHighestY(pivot, group, ROOM_H - 0.006 + rng.range(0, height * 0.22));
      break;

    case "floor_embedded":
      pivot.rotation.y = rng.range(0, Math.PI * 2);
      pivot.rotation.z = rng.range(-0.18, 0.18);
      alignLowestY(pivot, group, support - height * rng.range(0.15, 0.35));
      break;

    default:
      pivot.rotation.y = rng.range(0, Math.PI * 2);
      alignLowestY(pivot, group, support);
  }
}

function pickPose(rng, pileMode = false, fixedSpot = false) {
  if (fixedSpot) {
    return rng.pickWeighted(pileMode ? FIXED_SPOT_PILE_POSES : FIXED_SPOT_POSES);
  }
  return rng.pickWeighted(pileMode ? PILE_POSES : POSES);
}

function spotTooClose(spot, used, radius) {
  for (const key of used) {
    const [ux, uz] = key.split(",").map(Number);
    const dx = spot.x - ux;
    const dz = spot.z - uz;
    if (dx * dx + dz * dz < radius * radius) return true;
  }
  return false;
}

function finalizePlacement(group, pivot, meta, colliders, used, spot, surfaces) {
  pivot.userData.chunkOwned = true;
  group.add(pivot);
  colliders.push(colliderFromFurniture(pivot, group));
  if (meta.furnitureId === "chairGlb") applyChairGlitchVisual(pivot);
  recordFurnitureSurface(pivot, group, surfaces);
  used.add(`${spot.x.toFixed(2)},${spot.z.toFixed(2)}`);
}

function placeFurniture(group, room, template, rng, used, colliders, surfaces, opts = {}) {
  if (!template) return false;

  const pivot = cloneFurnitureTemplate(template);
  const meta = pivot.userData;
  meta.furnitureKind = opts.kind || (meta.isPile ? "pile" : "chair");
  const pose = pickPose(rng, opts.pileMode, Boolean(opts.spot));
  let spot = null;

  if (opts.spot) {
    spot = { ...opts.spot, yaw: opts.spot.yaw ?? rng.range(0, Math.PI * 2) };
  } else if (pose === "floor_normal" || pose === "floor_tipped" || pose === "floor_embedded") {
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

  spot.supportY = supportYAt(spot.x, spot.z, meta.footprint, surfaces);

  const sep = opts.minSep ?? meta.footprint * 0.85;
  if (spotTooClose(spot, used, sep)) return false;

  applyPose(pivot, pose, spot, rng, meta, group);
  finalizePlacement(group, pivot, meta, colliders, used, spot, surfaces);
  return true;
}

function placeOne(group, room, models, rng, used, colliders, surfaces) {
  const isChair = rng.chance(0.55);
  const template = isChair ? pickChairTemplate(models, rng) : models.stool;
  return placeFurniture(group, room, template, rng, used, colliders, surfaces, {
    kind: isChair ? "chair" : "stool",
  });
}

function placePileCluster(group, room, models, rng, used, colliders, surfaces) {
  const center = sampleWalkable(room.innerWalls, rng, 1.4, 64);
  if (!center) return 0;

  const count = rng.int(4, 8);
  const radius = rng.range(0.45, 1.15);
  let placed = 0;

  for (let i = 0; i < count * 4 && placed < count; i++) {
    const angle = rng.range(0, Math.PI * 2);
    const dist = rng.range(0.02, radius) * Math.sqrt(rng.range(0.15, 1));
    const spot = {
      x: center.x + Math.cos(angle) * dist,
      z: center.z + Math.sin(angle) * dist,
      yaw: rng.range(0, Math.PI * 2),
    };

    if (spot.x < 0.45 || spot.x > CHUNK - 0.45 || spot.z < 0.45 || spot.z > CHUNK - 0.45) {
      continue;
    }
    if (!isWalkableLocal(spot.x, spot.z, room.innerWalls)) continue;

    const template = pickPileChairTemplate(models, rng);
    if (
      placeFurniture(group, room, template, rng, used, colliders, surfaces, {
        spot,
        pileMode: true,
        minSep: 0.32,
        kind: "pile",
      })
    ) {
      placed++;
    }
  }

  return placed;
}

/** Scatter chair/stool props in chunk-local space */
export function addChunkFurniture(group, room, models) {
  if (!models?.allChairs?.length && !models?.stool) return { colliders: [] };

  const colliders = [];
  const surfaces = [];
  const rng = createRng(room.cx, room.cz, 881);
  if (!rng.chance(0.55)) {
    group.userData.furnitureColliders = colliders;
    return { colliders };
  }

  const used = new Set();
  let placed = 0;

  const pileCount =
    models.pileChairs?.length && rng.chance(0.34)
      ? placePileCluster(group, room, models, rng, used, colliders, surfaces)
      : 0;
  placed += pileCount;

  const scatterGoal = pileCount > 0 ? rng.int(0, 1) : rng.int(1, 2);
  let scattered = 0;
  for (let i = 0; i < scatterGoal * 5 && scattered < scatterGoal; i++) {
    if (placeOne(group, room, models, rng, used, colliders, surfaces)) scattered++;
  }
  placed += scattered;

  if (placed === 0) {
    for (let i = 0; i < 4; i++) {
      if (placeOne(group, room, models, rng, used, colliders, surfaces)) break;
    }
  }

  group.userData.furnitureColliders = colliders;
  return { colliders };
}
