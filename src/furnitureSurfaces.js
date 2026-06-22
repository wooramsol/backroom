import * as THREE from "three";

const _box = new THREE.Box3();

/** Record a placed prop for stacking / support queries */
export function recordFurnitureSurface(pivot, rootGroup, surfaces) {
  rootGroup.updateMatrixWorld(true);
  _box.setFromObject(pivot);
  const entry = {
    minX: _box.min.x,
    maxX: _box.max.x,
    minZ: _box.min.z,
    maxZ: _box.max.z,
    topY: _box.max.y,
    bottomY: _box.min.y,
  };
  surfaces.push(entry);
  return entry;
}

/** Highest support under (x,z) — floor at 0 or another prop top */
export function supportYAt(x, z, footprint, surfaces) {
  let y = 0;
  const pad = Math.max(0.22, footprint * 0.38);
  for (const s of surfaces) {
    if (x + pad > s.minX && x - pad < s.maxX && z + pad > s.minZ && z - pad < s.maxZ) {
      y = Math.max(y, s.topY);
    }
  }
  return y;
}
