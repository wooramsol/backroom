import * as THREE from "three";

const _box = new THREE.Box3();
const SHRINK = 0.04;

/** World-space AABB for a placed furniture pivot (group must have matrix updated) */
export function colliderFromFurniture(pivot, rootGroup) {
  rootGroup.updateMatrixWorld(true);
  _box.setFromObject(pivot);

  return {
    minX: _box.min.x + SHRINK,
    maxX: _box.max.x - SHRINK,
    minY: _box.min.y,
    maxY: _box.max.y,
    minZ: _box.min.z + SHRINK,
    maxZ: _box.max.z - SHRINK,
  };
}

/** Centre of furniture in world space — for chair static audio */
export function furnitureWorldCenter(pivot, rootGroup) {
  rootGroup.updateMatrixWorld(true);
  _box.setFromObject(pivot);
  return _box.getCenter(new THREE.Vector3());
}
