import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { cloneFurnitureTemplate } from "./furnitureModels.js";

const ASSET_BASE = import.meta.env.BASE_URL;
const CAR_URL = `${ASSET_BASE}assets/car.glb`;
const ARMCHAIR_URL = `${ASSET_BASE}assets/armchair.glb`;
const SKINSTEALER_URL = `${ASSET_BASE}assets/entity_skinstealer.glb`;

const CAR_TARGET_LEN = 4.6;
const ARMCHAIR_TARGET_H = 0.86;
const SKINSTEALER_TARGET_H = 1.78;

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

const SG_EXT = "KHR_materials_pbrSpecularGlossiness";

/**
 * Three.js r177 dropped KHR_materials_pbrSpecularGlossiness — loader leaves
 * MeshStandardMaterial with no map (reads as black). Rebuild from GLB defs.
 */
async function repairSpecularGlossinessMaterials(gltf) {
  const parser = gltf.parser;
  const json = parser.json;
  if (!json?.materials) return;

  const meshes = [];
  gltf.scene.traverse((obj) => {
    if (obj.isMesh) meshes.push(obj);
  });

  await Promise.all(
    meshes.map(async (mesh) => {
      const assoc = parser.associations.get(mesh);
      if (assoc?.meshes === undefined) return;

      const meshDef = json.meshes[assoc.meshes];
      const prim = meshDef?.primitives?.[assoc.primitives ?? 0];
      const matIndex = prim?.material;
      if (matIndex === undefined) return;

      const matDef = json.materials[matIndex];
      const sg = matDef.extensions?.[SG_EXT];
      if (!sg) return;

      const diffuseFactor = sg.diffuseFactor ?? [1, 1, 1, 1];
      const params = {
        color: new THREE.Color(diffuseFactor[0], diffuseFactor[1], diffuseFactor[2]),
        transparent: diffuseFactor[3] < 0.999,
        opacity: diffuseFactor[3],
        side: matDef.doubleSided ? THREE.DoubleSide : THREE.FrontSide,
      };

      if (sg.diffuseTexture !== undefined) {
        params.map = await parser.getDependency("texture", sg.diffuseTexture.index);
        if (params.map) params.map.colorSpace = THREE.SRGBColorSpace;
      }

      if (matDef.normalTexture !== undefined) {
        params.normalMap = await parser.getDependency("texture", matDef.normalTexture.index);
        const scale = matDef.normalTexture.scale ?? 1;
        params.normalScale = new THREE.Vector2(scale, scale);
      }

      const old = mesh.material;
      const next = new THREE.MeshLambertMaterial(params);
      next.userData.entityOwned = true;
      mesh.material = next;
      if (old?.dispose) old.dispose();
    }),
  );
}

function measureBounds(root) {
  root.updateMatrixWorld(true);
  _box.setFromObject(root);
  _box.getSize(_size);
  _box.getCenter(_center);
  return {
    sizeX: _size.x,
    sizeY: _size.y,
    sizeZ: _size.z,
    minY: _box.min.y,
    centerX: _center.x,
    centerZ: _center.z,
  };
}

function centerAndGround(root) {
  const { minY, centerX, centerZ } = measureBounds(root);
  root.position.x -= centerX;
  root.position.z -= centerZ;
  root.position.y -= minY;
  root.updateMatrixWorld(true);
}

function scaleToSize(root, rawSize, targetSize, axis = "y") {
  const scale = targetSize / Math.max(rawSize, 1e-6);
  root.scale.setScalar(scale);
  centerAndGround(root);
  return root;
}

function finalizePropTemplate(root, meta = {}) {
  const { sizeX, sizeY, sizeZ } = measureBounds(root);
  root.userData.furnitureTemplate = true;
  root.userData.furnitureId = meta.id || "prop";
  root.userData.footprint = Math.max(sizeX, sizeZ);
  root.userData.height = sizeY;
  root.userData.depth = Math.min(sizeX, sizeZ);
  return root;
}

function prepareStaticProp(gltfScene, targetSize, meta, axis = "y") {
  const root = new THREE.Group();
  const model = gltfScene.clone(true);
  normalizeMaterials(model);
  root.add(model);
  const bounds = measureBounds(root);
  const raw =
    axis === "x" ? bounds.sizeX : axis === "z" ? bounds.sizeZ : bounds.sizeY;
  const natural = raw > 2.5 ? raw * 0.01 : raw;
  const target = axis === "y" && natural > 8 ? natural * 0.01 : targetSize;
  scaleToSize(root, raw, target, axis);
  return finalizePropTemplate(root, meta);
}

async function loadStaticProp(loader, url, targetSize, meta, axis = "y") {
  const gltf = await loader.loadAsync(url);
  return prepareStaticProp(gltf.scene, targetSize, meta, axis);
}

async function loadSkinstealerModel(loader) {
  const gltf = await loader.loadAsync(SKINSTEALER_URL);
  await repairSpecularGlossinessMaterials(gltf);
  const root = new THREE.Group();
  const model = gltf.scene;
  root.add(model);

  const bounds = measureBounds(root);
  scaleToSize(root, bounds.sizeY, SKINSTEALER_TARGET_H);

  root.traverse((obj) => {
    if (obj.isMesh) obj.frustumCulled = false;
  });

  return {
    model: root,
    animations: gltf.animations,
    footOffset: measureBounds(root).minY,
    height: measureBounds(root).sizeY,
  };
}

/** Car, armchair templates + skinstealer rig */
export async function loadSpecialAssets() {
  const loader = new GLTFLoader();
  try {
    const [car, armchair, skinstealer] = await Promise.all([
      loadStaticProp(loader, CAR_URL, CAR_TARGET_LEN, { id: "car" }, "x").catch((err) => {
        console.warn("Car model unavailable", err);
        return null;
      }),
      loadStaticProp(loader, ARMCHAIR_URL, ARMCHAIR_TARGET_H, { id: "armchair" }, "y").catch(
        (err) => {
          console.warn("Armchair model unavailable", err);
          return null;
        },
      ),
      loadSkinstealerModel(loader).catch((err) => {
        console.warn("Skinstealer model unavailable", err);
        return null;
      }),
    ]);
    return { car, armchair, skinstealer };
  } catch (err) {
    console.warn("Special assets unavailable", err);
    return null;
  }
}

export function cloneSpecialTemplate(template) {
  return cloneFurnitureTemplate(template);
}
