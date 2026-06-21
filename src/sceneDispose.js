/** Release GPU resources for a despawned room chunk */

function disposeMaterial(mat) {
  if (!mat?.userData?.chunkOwned) return;
  if (mat.map?.userData?.chunkOwned) mat.map.dispose();
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
    if (obj.isMesh || obj.isInstancedMesh) disposeMeshObject(obj);
  });
}

/** Drain a queue of chunk roots (see World.disposeQueue) */
export function flushDisposeQueue(queue) {
  while (queue.length) disposeChunkRoot(queue.pop());
}
