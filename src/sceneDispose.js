/** Release GPU resources for a despawned room chunk */

const TEXTURE_KEYS = [
  "map",
  "normalMap",
  "roughnessMap",
  "metalnessMap",
  "aoMap",
  "emissiveMap",
  "alphaMap",
  "bumpMap",
];

function disposeMaterial(mat) {
  if (!mat?.userData?.chunkOwned) return;
  for (const key of TEXTURE_KEYS) {
    const tex = mat[key];
    if (tex?.userData?.chunkOwned) tex.dispose();
  }
  mat.dispose();
}

function disposeMeshObject(obj) {
  const geo = obj.geometry;
  if (geo && !geo.userData?.shared) geo.dispose();

  if (!obj.material) return;
  if (Array.isArray(obj.material)) {
    for (const mat of obj.material) disposeMaterial(mat);
  } else {
    disposeMaterial(obj.material);
  }
}

/** Walk a chunk group and dispose chunk-owned buffers/materials */
export function disposeChunkRoot(root) {
  if (!root) return;
  root.traverse((obj) => {
    if (obj.isLight) return;
    if (obj.isMesh || obj.isInstancedMesh) disposeMeshObject(obj);
  });
}

/** Drain a queue of chunk roots (see World.disposeQueue) */
export function flushDisposeQueue(queue) {
  while (queue.length) disposeChunkRoot(queue.pop());
}
