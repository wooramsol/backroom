import * as THREE from "three";
import { CEILING_TILE_FACE_M } from "./constants.js";

/** Warm fluorescent panel — matches yellow-beige backrooms palette */
const PANEL_COLOR = 0xfff4dc;
const LIGHT_COLOR = 0xfff0d4;

/** One ceiling grid cell replaced with a soft area panel + down-light */
export function addCeilingPanelLight(group, x, y, z, size = CEILING_TILE_FACE_M) {
  const geo = new THREE.PlaneGeometry(size * 0.94, size * 0.94);
  geo.rotateX(Math.PI / 2);

  const mat = new THREE.MeshBasicMaterial({
    color: PANEL_COLOR,
    toneMapped: true,
  });
  mat.userData.chunkOwned = true;

  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y + 0.003, z);
  mesh.renderOrder = 4;

  const light = new THREE.RectAreaLight(LIGHT_COLOR, 2.2, size * 0.88, size * 0.88);
  light.position.set(x, y - 0.02, z);
  light.rotation.x = -Math.PI / 2;
  light.userData.chunkOwned = true;

  group.add(mesh);
  group.add(light);

  return { mesh, light };
}
