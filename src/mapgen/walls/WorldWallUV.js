import * as THREE from "three";

/**
 * World-space wallpaper UV per Backrooms Architecture Design Guide §5.
 * Vertical pattern: V = worldY. U = worldZ on ±X faces, worldX on ±Z faces.
 */
export function worldWallUV(wx, wy, wz, nx, ny, nz, tileW, tileH) {
  const ax = Math.abs(nx);
  const ay = Math.abs(ny);
  const az = Math.abs(nz);

  if (ay > ax && ay > az) {
    return [wx / tileW, wz / tileW];
  }

  const u = ax >= az ? wz / tileW : wx / tileW;
  const v = wy / tileH;
  return [u, v];
}

/** Re-bake every vertex UV from world position + face normal (sharp corners). */
export function bakeWorldWallUVBuffer(geo, roomWx, roomWz, tileW, tileH) {
  const pos = geo.attributes.position;
  const norm = geo.attributes.normal;
  const uv = new Float32Array(pos.count * 2);

  for (let i = 0; i < pos.count; i += 3) {
    const ax = pos.getX(i);
    const ay = pos.getY(i);
    const az = pos.getZ(i);
    const bx = pos.getX(i + 1);
    const by = pos.getY(i + 1);
    const bz = pos.getZ(i + 1);
    const cx = pos.getX(i + 2);
    const cy = pos.getY(i + 2);
    const cz = pos.getZ(i + 2);

    const e1x = bx - ax;
    const e1y = by - ay;
    const e1z = bz - az;
    const e2x = cx - ax;
    const e2y = cy - ay;
    const e2z = cz - az;

    let fnx = e1y * e2z - e1z * e2y;
    let fny = e1z * e2x - e1x * e2z;
    let fnz = e1x * e2y - e1y * e2x;
    const flen = Math.hypot(fnx, fny, fnz) || 1;
    fnx /= flen;
    fny /= flen;
    fnz /= flen;

    for (let k = 0; k < 3; k++) {
      const vi = i + k;
      const wx = roomWx + pos.getX(vi);
      const wy = pos.getY(vi);
      const wz = roomWz + pos.getZ(vi);
      const nx = norm.getX(vi);
      const ny = norm.getY(vi);
      const nz = norm.getZ(vi);
      const [u, v] = worldWallUV(
        wx,
        wy,
        wz,
        Math.abs(nx) > 0.5 ? nx : fnx,
        Math.abs(ny) > 0.5 ? ny : fny,
        Math.abs(nz) > 0.5 ? nz : fnz,
        tileW,
        tileH,
      );
      uv[vi * 2] = u;
      uv[vi * 2 + 1] = v;
    }
  }

  geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
}
