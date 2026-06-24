import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { cloneFurnitureTemplate } from "./furnitureModels.js";

const ASSET_BASE = import.meta.env.BASE_URL;
const CAR_URL = `${ASSET_BASE}assets/car.glb`;
const ARMCHAIR_URL = `${ASSET_BASE}assets/armchair.glb`;
const SKINSTEALER_URL = `${ASSET_BASE}assets/entity_skinstealer.glb`;
const BATERIA_URL = `${ASSET_BASE}assets/entity_bateria.glb`;
const LIBRARY_URL = `${ASSET_BASE}assets/entity_library.glb`;

const CAR_TARGET_LEN = 4.6;
const ARMCHAIR_TARGET_H = 0.86;
const ENTITY_TARGET_H = 1.78;

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
 * Rebuild entity materials for this scene's Lambert lighting.
 * Handles legacy specular-glossiness and standard metallic-roughness GLBs.
 */
async function repairEntityMaterials(gltf) {
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
      const mr = matDef.pbrMetallicRoughness;
      const params = {
        side: matDef.doubleSided ? THREE.DoubleSide : THREE.FrontSide,
      };

      if (sg) {
        const diffuseFactor = sg.diffuseFactor ?? [1, 1, 1, 1];
        params.color = new THREE.Color(diffuseFactor[0], diffuseFactor[1], diffuseFactor[2]);
        params.transparent = diffuseFactor[3] < 0.999;
        params.opacity = diffuseFactor[3];
        if (sg.diffuseTexture !== undefined) {
          params.map = await parser.getDependency("texture", sg.diffuseTexture.index);
          if (params.map) params.map.colorSpace = THREE.SRGBColorSpace;
        }
      } else if (mr) {
        const base = mr.baseColorFactor ?? [1, 1, 1, 1];
        params.color = new THREE.Color(base[0], base[1], base[2]);
        params.transparent = base[3] < 0.999 || matDef.alphaMode === "BLEND";
        params.opacity = base[3];
        if (mr.baseColorTexture !== undefined) {
          params.map = await parser.getDependency("texture", mr.baseColorTexture.index);
          if (params.map) params.map.colorSpace = THREE.SRGBColorSpace;
        }
      } else {
        return;
      }

      if (matDef.emissiveFactor) {
        const e = matDef.emissiveFactor;
        params.emissive = new THREE.Color(e[0], e[1], e[2]);
      }
      if (matDef.emissiveTexture !== undefined) {
        params.emissiveMap = await parser.getDependency("texture", matDef.emissiveTexture.index);
        if (params.emissiveMap) params.emissiveMap.colorSpace = THREE.SRGBColorSpace;
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

async function loadEntityModel(loader, url) {
  const gltf = await loader.loadAsync(url);
  await repairEntityMaterials(gltf);
  const root = new THREE.Group();
  root.add(gltf.scene);

  const bounds = measureBounds(root);
  scaleToSize(root, bounds.sizeY, ENTITY_TARGET_H);

  root.traverse((obj) => {
    if (obj.isMesh) obj.frustumCulled = false;
  });

  const finalBounds = measureBounds(root);
  return {
    model: root,
    animations: gltf.animations,
    footOffset: finalBounds.minY,
    height: finalBounds.sizeY,
  };
}

/** Car, armchair templates + entity rigs */
export async function loadSpecialAssets() {
  const loader = new GLTFLoader();
  try {
    const [car, armchair, skinstealer, bateria, library] = await Promise.all([
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
      loadEntityModel(loader, SKINSTEALER_URL).catch((err) => {
        console.warn("Skinstealer model unavailable", err);
        return null;
      }),
      loadEntityModel(loader, BATERIA_URL).catch((err) => {
        console.warn("Bateria entity unavailable", err);
        return null;
      }),
      loadEntityModel(loader, LIBRARY_URL).catch((err) => {
        console.warn("Library entity unavailable", err);
        return null;
      }),
    ]);
    return {
      car,
      armchair,
      skinstealer,
      entities: { skinstealer, bateria, library },
    };
  } catch (err) {
    console.warn("Special assets unavailable", err);
    return null;
  }
}

export function cloneSpecialTemplate(template) {
  return cloneFurnitureTemplate(template);
}
