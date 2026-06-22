import * as THREE from "three";
import { CEILING_TILE_FACE_M } from "./constants.js";

const _tileGeo = new THREE.PlaneGeometry(CEILING_TILE_FACE_M, CEILING_TILE_FACE_M);
_tileGeo.rotateX(Math.PI / 2);
_tileGeo.userData.shared = true;

const _poolGeo = new THREE.CircleGeometry(2.1, 32);
_poolGeo.rotateX(-Math.PI / 2);
_poolGeo.userData.shared = true;

let _poolTex;

function floorPoolTexture() {
  if (_poolTex) return _poolTex;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255, 246, 214, 0.42)");
  g.addColorStop(0.45, "rgba(255, 242, 205, 0.16)");
  g.addColorStop(1, "rgba(255, 242, 205, 0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  _poolTex = new THREE.CanvasTexture(canvas);
  _poolTex.colorSpace = THREE.SRGBColorSpace;
  _poolTex.minFilter = THREE.LinearFilter;
  _poolTex.generateMipmaps = false;
  return _poolTex;
}

let _poolMat;

function floorPoolMaterial() {
  if (_poolMat) return _poolMat;
  _poolMat = new THREE.MeshBasicMaterial({
    map: floorPoolTexture(),
    transparent: true,
    depthWrite: false,
    toneMapped: false,
  });
  return _poolMat;
}

/** Bright ceiling tile + downward spot + soft floor wash — no frame strokes */
export function addCeilingPanelLight(group, x, tileY, z, materials) {
  const mesh = new THREE.Mesh(_tileGeo, materials.ceilingLightTile);
  mesh.position.set(x, tileY, z);
  mesh.frustumCulled = false;
  mesh.renderOrder = 2;

  const light = new THREE.SpotLight(0xfff0d4, 2.4, 9, Math.PI / 3.2, 0.42, 1.4);
  light.position.set(x, tileY - 0.04, z);
  light.userData.chunkOwned = true;

  const target = new THREE.Object3D();
  target.position.set(x, 0, z);
  light.target = target;

  const pool = new THREE.Mesh(_poolGeo, floorPoolMaterial());
  pool.position.set(x, 0.012, z);
  pool.frustumCulled = false;
  pool.renderOrder = 1;

  group.add(mesh);
  group.add(light);
  group.add(target);
  group.add(pool);

  return { mesh, light, pool };
}
