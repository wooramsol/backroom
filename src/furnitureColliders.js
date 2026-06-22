import * as THREE from "three";
import { EYE_H, PLAYER_R, ROOM_H } from "./constants.js";

const _box = new THREE.Box3();
const SHRINK = 0.03;
const MIN_SPAN = 0.38;
const BODY_Y_LO = 0.3;
const BODY_Y_HI = EYE_H + PLAYER_R * 0.45 + 0.15;
/** Max surface height the player can stand on (keeps head below ceiling) */
export const MAX_STAND_HEIGHT = ROOM_H - EYE_H - 0.12;

function expandAxis(min, max, minSpan) {
  if (max - min >= minSpan) return [min, max];
  const mid = (min + max) * 0.5;
  const half = minSpan * 0.5;
  return [mid - half, mid + half];
}

/** World-space AABB for player collision (chunk-local coords) */
export function colliderFromFurniture(pivot, rootGroup) {
  rootGroup.updateMatrixWorld(true);
  _box.setFromObject(pivot);

  let [minX, maxX] = expandAxis(_box.min.x + SHRINK, _box.max.x - SHRINK, MIN_SPAN);
  let [minZ, maxZ] = expandAxis(_box.min.z + SHRINK, _box.max.z - SHRINK, MIN_SPAN);

  const meshBottom = _box.min.y;
  const meshTop = _box.max.y;
  const isCeiling = meshBottom > ROOM_H * 0.5;

  let minY;
  let maxY;
  if (isCeiling) {
    minY = Math.min(meshBottom, BODY_Y_LO);
    maxY = Math.max(meshTop, ROOM_H + 0.05);
  } else {
    minY = Math.min(meshBottom, BODY_Y_LO);
    maxY = Math.max(meshTop, BODY_Y_HI);
  }

  const spanX = maxX - minX;
  const spanZ = maxZ - minZ;
  const standable =
    !isCeiling &&
    meshTop >= 0.22 &&
    meshTop <= MAX_STAND_HEIGHT &&
    spanX >= 0.28 &&
    spanZ >= 0.28;

  return {
    minX,
    maxX,
    minY,
    maxY,
    minZ,
    maxZ,
    standTopY: meshTop,
    standable,
    isFurniture: true,
  };
}
