import * as THREE from "three";
import { CHUNK, WALL_T } from "./constants.js";
import { isWalkableLocal } from "./room.js";
import { createRng } from "./rng.js";
import { cloneSpecialTemplate } from "./specialAssets.js";
import { colliderFromFurniture } from "./furnitureColliders.js";

const _box = new THREE.Box3();
const SPAWN_CHUNK = { cx: 0, cz: 0 };

function alignLowestY(pivot, rootGroup, targetY) {
  rootGroup.updateMatrixWorld(true);
  _box.setFromObject(pivot);
  pivot.position.y += targetY - _box.min.y;
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
  for (let attempt = 0; attempt < 28; attempt++) {
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

function spotTooClose(spot, used, radius) {
  for (const key of used) {
    const [ux, uz] = key.split(",").map(Number);
    const dx = spot.x - ux;
    const dz = spot.z - uz;
    if (dx * dx + dz * dz < radius * radius) return true;
  }
  return false;
}

function applyArmchairWedge(pivot, spot, rng, meta, group) {
  const tilt = THREE.MathUtils.degToRad(rng.range(20, 70));
  pivot.rotation.set(0, 0, 0);
  pivot.position.set(spot.x, 0, spot.z);
  pivot.rotation.y = spot.yaw + rng.range(-0.2, 0.2);

  const embed = meta.depth * rng.range(0.48, 0.78);
  if (spot.wall.axis === "z") {
    pivot.rotation.x = spot.offset > 0 ? -tilt : tilt;
    pivot.position.z -= Math.sign(spot.offset) * embed;
  } else {
    pivot.rotation.z = spot.offset > 0 ? tilt : -tilt;
    pivot.position.x -= Math.sign(spot.offset) * embed;
  }

  alignLowestY(pivot, group, 0);
}

function placeArmchair(group, room, template, rng, used, colliders) {
  const walls = collectWalls(room.innerWalls);
  const pivot = cloneSpecialTemplate(template);
  const meta = pivot.userData;
  const spot = pickWallSpot(walls, room.innerWalls, meta.footprint, rng);
  if (!spot) return false;
  if (spotTooClose(spot, used, meta.footprint * 0.85)) return false;

  applyArmchairWedge(pivot, spot, rng, meta, group);
  pivot.userData.chunkOwned = true;
  group.add(pivot);
  colliders.push(colliderFromFurniture(pivot, group));
  used.add(`${spot.x.toFixed(2)},${spot.z.toFixed(2)}`);
  return true;
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

/** Armchairs wedged into walls at 20°–70° */
export function addChunkArmchairs(group, room, armchairTemplate, colliders, used = new Set()) {
  if (!armchairTemplate) return;

  const rng = createRng(room.cx, room.cz, 902);
  if (!rng.chance(0.42)) return;

  const count = rng.int(1, 2);
  let placed = 0;
  for (let i = 0; i < count * 5 && placed < count; i++) {
    if (placeArmchair(group, room, armchairTemplate, rng, used, colliders)) placed++;
  }
}

export function addSpecialChunkProps(group, room, specialAssets, colliders, used) {
  if (!specialAssets) return;
  addSpawnCar(group, room, specialAssets.car, colliders);
  addChunkArmchairs(group, room, specialAssets.armchair, colliders, used);
}
