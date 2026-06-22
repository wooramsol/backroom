import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const ASSET_BASE = import.meta.env.BASE_URL;
const CHAIR_URL = `${ASSET_BASE}assets/Chair.glb`;
const STOOL_URL = `${ASSET_BASE}assets/Stool.glb`;
const CHAIR_PACK_URL = `${ASSET_BASE}assets/poppy_playtime_4_chairs_pack_1.glb`;

/** Dining chair height (~82 cm) */
const CHAIR_TARGET_H = 0.82;
/** Stool height (~85 cm) */
const STOOL_TARGET_H = 0.85;

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

function finalizeTemplate(root, meta = {}) {
  _box.setFromObject(root);
  _box.getSize(_size);

  root.userData.furnitureTemplate = true;
  root.userData.furnitureId = meta.id || "unknown";
  root.userData.chairGlitch = meta.chairGlitch === true;
  root.userData.isPile = meta.isPile === true;
  root.userData.footprint = Math.max(_size.x, _size.z);
  root.userData.height = _size.y;
  root.userData.depth = Math.min(_size.x, _size.z);
  return root;
}

function scaleAndGround(root, targetHeight) {
  _box.setFromObject(root);
  _box.getSize(_size);
  const scale = targetHeight / Math.max(_size.y, 1e-6);
  root.scale.multiplyScalar(scale);

  root.updateMatrixWorld(true);
  _box.setFromObject(root);
  _box.getCenter(_center);
  root.position.x -= _center.x;
  root.position.z -= _center.z;
  root.position.y -= _box.min.y;

  root.updateMatrixWorld(true);
  return root;
}

function prepareTemplate(gltfScene, targetHeight, meta = {}) {
  const root = new THREE.Group();
  const model = gltfScene.clone(true);
  normalizeMaterials(model);
  root.add(model);
  scaleAndGround(root, targetHeight);
  return finalizeTemplate(root, meta);
}

function preparePackChairNode(node, targetHeight, meta = {}) {
  const root = new THREE.Group();
  const model = node.clone(true);
  normalizeMaterials(model);
  root.add(model);
  scaleAndGround(root, targetHeight);
  return finalizeTemplate(root, meta);
}

function extractPackChairNodes(scene) {
  let rootNode = null;
  scene.traverse((obj) => {
    if (obj.name === "RootNode") rootNode = obj;
  });
  const parent = rootNode || scene;
  const chairs = [];
  for (const child of parent.children) {
    if (!child.name) continue;
    const id = child.name.replace(/\.mo$/i, "");
    chairs.push({ id, node: child });
  }
  return chairs;
}

async function loadTemplate(loader, url, targetHeight, meta) {
  const gltf = await loader.loadAsync(url);
  return prepareTemplate(gltf.scene, targetHeight, meta);
}

async function loadPackChairs(loader) {
  const gltf = await loader.loadAsync(CHAIR_PACK_URL);
  const nodes = extractPackChairNodes(gltf.scene);
  return nodes.map(({ id, node }) =>
    preparePackChairNode(node, CHAIR_TARGET_H, {
      id: `pack:${id}`,
      chairGlitch: false,
      isPile: /Pile/i.test(id),
    }),
  );
}

/** Load chair/stool GLBs once; returns null if assets are missing */
export async function loadFurnitureModels() {
  const loader = new GLTFLoader();
  try {
    const [chairGlb, stool, packChairs] = await Promise.all([
      loadTemplate(loader, CHAIR_URL, CHAIR_TARGET_H, { id: "chairGlb", chairGlitch: true }),
      loadTemplate(loader, STOOL_URL, STOOL_TARGET_H, { id: "stool", chairGlitch: false }),
      loadPackChairs(loader).catch((err) => {
        console.warn("Chair pack unavailable", err);
        return [];
      }),
    ]);
    const allChairs = [chairGlb, ...packChairs];
    const pileChairs = packChairs.filter((t) => t.userData.isPile);
    return { chairGlb, stool, packChairs, pileChairs, allChairs };
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
  pivot.userData.furnitureId = template.userData.furnitureId;
  pivot.userData.chairGlitch = template.userData.chairGlitch;
  pivot.userData.isPile = template.userData.isPile;
  return pivot;
}

/** Pick a random chair template from Chair.glb + pack variants */
export function pickChairTemplate(models, rng) {
  const pool = models.allChairs?.length ? models.allChairs : models.chairGlb ? [models.chairGlb] : [];
  if (!pool.length) return null;
  return rng.pick(pool);
}

/** Prefer pile/stack variants from the pack */
export function pickPileChairTemplate(models, rng) {
  const piles = models.pileChairs?.length ? models.pileChairs : [];
  if (piles.length && rng.chance(0.72)) return rng.pick(piles);
  return pickChairTemplate(models, rng);
}
