import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const ASSET_BASE = import.meta.env.BASE_URL;
const CHAIR_URL = `${ASSET_BASE}assets/Chair.glb`;
const STOOL_URL = `${ASSET_BASE}assets/Stool.glb`;

/** Dining chair height — scaled 1.5× from base (~82 cm → ~123 cm) */
const CHAIR_TARGET_H = 0.82 * 1.5;
/** Stool height — scaled 2× from base (~45 cm → ~90 cm) */
const STOOL_TARGET_H = 0.45 * 2;

const _box = new THREE.Box3();
const _size = new THREE.Vector3();
const _center = new THREE.Vector3();

function normalizeMaterials(root) {
  root.traverse((obj) => {
    if (!obj.isMesh) return;
    const src = obj.material;
    if (!src) return;
    const mats = Array.isArray(src) ? src : [src];
    const out = mats.map((mat) => {
      const next = new THREE.MeshLambertMaterial({
        map: mat.map || null,
        color: mat.color?.clone?.() ?? new THREE.Color(0xbfb8a0),
      });
      if (next.map) next.map.colorSpace = THREE.SRGBColorSpace;
      next.userData.chunkOwned = true;
      return next;
    });
    obj.material = out.length === 1 ? out[0] : out;
  });
}

function prepareTemplate(gltfScene, targetHeight) {
  const root = new THREE.Group();
  const model = gltfScene.clone(true);
  normalizeMaterials(model);
  root.add(model);

  _box.setFromObject(model);
  _box.getSize(_size);
  const scale = targetHeight / Math.max(_size.y, 1e-6);
  model.scale.setScalar(scale);

  model.updateMatrixWorld(true);
  _box.setFromObject(model);
  _box.getCenter(_center);
  model.position.set(-_center.x, -_box.min.y, -_center.z);

  model.updateMatrixWorld(true);
  _box.setFromObject(model);
  _box.getSize(_size);

  root.userData.furnitureTemplate = true;
  root.userData.footprint = Math.max(_size.x, _size.z);
  root.userData.height = _size.y;
  root.userData.depth = Math.min(_size.x, _size.z);
  return root;
}

async function loadTemplate(loader, url, targetHeight) {
  const gltf = await loader.loadAsync(url);
  return prepareTemplate(gltf.scene, targetHeight);
}

/** Load chair/stool GLBs once; returns null if assets are missing */
export async function loadFurnitureModels() {
  const loader = new GLTFLoader();
  try {
    const [chair, stool] = await Promise.all([
      loadTemplate(loader, CHAIR_URL, CHAIR_TARGET_H),
      loadTemplate(loader, STOOL_URL, STOOL_TARGET_H),
    ]);
    return { chair, stool };
  } catch (err) {
    console.warn("Furniture models unavailable — skipping props", err);
    return null;
  }
}

/** Deep-clone a prepared template for one chunk instance */
export function cloneFurnitureTemplate(template) {
  const pivot = new THREE.Group();
  const model = template.clone(true);
  model.traverse((obj) => {
    if (!obj.isMesh || !obj.material) return;
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const mat of mats) mat.userData.chunkOwned = true;
  });
  pivot.add(model);
  pivot.userData.footprint = template.userData.footprint;
  pivot.userData.height = template.userData.height;
  pivot.userData.depth = template.userData.depth;
  return pivot;
}
