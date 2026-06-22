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

/** Re-bake every vertex UV from world position + shading normal (post-weld safe). */
export function bakeWorldWallUVBuffer(geo, roomWx, roomWz, tileW, tileH) {
  const pos = geo.attributes.position;
  const norm = geo.attributes.normal;
  const uv = new Float32Array(pos.count * 2);

  for (let i = 0; i < pos.count; i++) {
    const wx = roomWx + pos.getX(i);
    const wy = pos.getY(i);
    const wz = roomWz + pos.getZ(i);
    const [u, v] = worldWallUV(
      wx,
      wy,
      wz,
      norm.getX(i),
      norm.getY(i),
      norm.getZ(i),
      tileW,
      tileH,
    );
    uv[i * 2] = u;
    uv[i * 2 + 1] = v;
  }

  geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
}
