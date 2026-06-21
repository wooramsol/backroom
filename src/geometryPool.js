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

/** Bake wallpaper repeat into UVs for a merged wall material (repeat 1×1) */
export function bakeWallUV(geo, spanU, spanV, tileW, tileH) {
  const uv = geo.attributes.uv;
  const ru = spanU / tileW;
  const rv = spanV / tileH;
  for (let i = 0; i < uv.count; i++) {
    uv.setXY(i, uv.getX(i) * ru, uv.getY(i) * rv);
  }
  uv.needsUpdate = true;
}
