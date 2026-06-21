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
 * Box wall UV — main faces world-aligned; edge/cap faces crop wallpaper to
 * the physical face size (wall thickness metres), continuing from the
 * adjoining wall surface like cut wallpaper strips.
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
  wallT = WALL_T,
) {
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  const halfU = spanU / 2;
  const halfV = spanV / 2;
  const halfT = wallT / 2;
  const eps = 1e-4;

  for (let i = 0; i < pos.count; i++) {
    const lx = pos.getX(i);
    const ly = pos.getY(i);
    const lz = pos.getZ(i);
    let u;
    let v;

    if (axis === "z") {
      if (Math.abs(lz) >= halfT - eps) {
        u = (worldU0 + lx + halfU) / tileW;
        v = (worldV0 + ly + halfV) / tileH;
      } else if (Math.abs(lx) >= halfU - eps) {
        const edgeWorldU = worldU0 + (lx > 0 ? spanU : 0);
        u = (edgeWorldU + (lz + halfT)) / tileW;
        v = (worldV0 + ly + halfV) / tileH;
      } else {
        u = (worldU0 + lx + halfU) / tileW;
        const edgeWorldV = worldV0 + (ly > 0 ? spanV : 0);
        v = (edgeWorldV + (lz + halfT)) / tileH;
      }
    } else if (Math.abs(lx) >= halfT - eps) {
      u = (worldU0 + lz + halfU) / tileW;
      v = (worldV0 + ly + halfV) / tileH;
    } else if (Math.abs(lz) >= halfU - eps) {
      const edgeWorldU = worldU0 + (lz > 0 ? spanU : 0);
      u = (edgeWorldU + (lx + halfT)) / tileW;
      v = (worldV0 + ly + halfV) / tileH;
    } else {
      u = (worldU0 + lz + halfU) / tileW;
      const edgeWorldV = worldV0 + (ly > 0 ? spanV : 0);
      v = (edgeWorldV + (lx + halfT)) / tileH;
    }

    uv.setXY(i, u, v);
  }
  uv.needsUpdate = true;
}
