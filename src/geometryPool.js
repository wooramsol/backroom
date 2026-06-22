import * as THREE from "three";
import { WALL_T } from "./constants.js";

const _boxCache = new Map();

/** Reuse box templates; returned clones are safe to transform/dispose */
export function cloneWallBox(axis, slen, segH, wallT = WALL_T) {
  const key = `${axis}|${slen.toFixed(3)}|${segH.toFixed(3)}|${wallT.toFixed(3)}`;
  let base = _boxCache.get(key);
  if (!base) {
    base =
      axis === "z"
        ? new THREE.BoxGeometry(slen, segH, wallT)
        : new THREE.BoxGeometry(wallT, segH, slen);
    base.userData.shared = true;
    _boxCache.set(key, base);
  }
  return base.clone();
}

/** Bake wallpaper UVs aligned to world metres (material repeat 1×1) */
export function bakePlaneWallUV(geo, widthM, heightM, tileW, tileH, worldU0, worldV0) {
  const uv = geo.attributes.uv;
  for (let i = 0; i < uv.count; i++) {
    const u = (worldU0 + uv.getX(i) * widthM) / tileW;
    const v = (worldV0 + uv.getY(i) * heightM) / tileH;
    uv.setXY(i, u, v);
  }
  uv.needsUpdate = true;
}

/** Bake wallpaper UVs aligned to world metres (material repeat 1×1) */
export function bakeWallUV(geo, spanU, spanV, tileW, tileH, worldU0 = 0, worldV0 = 0) {
  const uv = geo.attributes.uv;
  for (let i = 0; i < uv.count; i++) {
    const u = (worldU0 + uv.getX(i) * spanU) / tileW;
    const v = (worldV0 + uv.getY(i) * spanV) / tileH;
    uv.setXY(i, u, v);
  }
  uv.needsUpdate = true;
}

/**
 * Box wall UV — main faces use world-aligned RepeatWrapping tiles only.
 * Thin edge/cap faces sample the texture centre so thickness strips do not
 * continue or overlap the wall pattern.
 */
export function bakeWallBoxUV(
  geo,
  axis,
  spanU,
  spanV,
  tileW,
  tileH,
  worldU0 = 0,
  worldV0 = 0,
) {
  const pos = geo.attributes.position;
  const norm = geo.attributes.normal;
  const uv = geo.attributes.uv;
  const halfU = spanU / 2;
  const halfV = spanV / 2;

  for (let i = 0; i < pos.count; i++) {
    const lx = pos.getX(i);
    const ly = pos.getY(i);
    const lz = pos.getZ(i);
    const nx = norm.getX(i);
    const ny = norm.getY(i);
    const nz = norm.getZ(i);
    const isMain = axis === "z" ? Math.abs(nz) > 0.5 : Math.abs(nx) > 0.5;
    let u;
    let v;

    if (isMain) {
      if (axis === "z") {
        u = (worldU0 + lx + halfU) / tileW;
        v = (worldV0 + ly + halfV) / tileH;
      } else {
        u = (worldU0 + lz + halfU) / tileW;
        v = (worldV0 + ly + halfV) / tileH;
      }
    } else {
      u = 0.5;
      v = 0.5;
    }

    uv.setXY(i, u, v);
  }
  uv.needsUpdate = true;
}
