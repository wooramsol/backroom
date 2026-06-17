import * as THREE from "three";
import { CHUNK } from "./constants.js";
export function sampleFloorHeight(surfaces, wx, wz) {
  let y = 0;
  for (const s of surfaces) {
    if (wx < s.x0 || wx > s.x1 || wz < s.z0 || wz > s.z1) continue;
    if (s.type === "flat") {
      if (s.y > y) y = s.y;
      continue;
    }
    if (s.type === "ramp") {
      const t =
        s.axis === "x"
          ? (wx - s.x0) / (s.x1 - s.x0)
          : (wz - s.z0) / (s.z1 - s.z0);
      const ry = s.y0 + THREE.MathUtils.clamp(t, 0, 1) * (s.y1 - s.y0);
      if (ry > y) y = ry;
    }
  }
  return y;
}

export function roomFloorSurfacesToWorld(room) {
  const ox = room.cx * CHUNK;
  const oz = room.cz * CHUNK;
  return room.floorSurfaces.map((s) => ({
    ...s,
    x0: s.x0 + ox,
    x1: s.x1 + ox,
    z0: s.z0 + oz,
    z1: s.z1 + oz,
  }));
}
