import * as THREE from "three";
import { isWalkableLocal } from "../../room.js";

const EPS = 1e-5;
const SNAP = 1e-4;

export function snapCoord(v, step = SNAP) {
  return Math.round(v / step) * step;
}

/** Remove duplicate and collinear vertices — keeps exact 90° corners only. */
export function simplifyOrthogonalLoop(loop) {
  if (loop.length < 4) return loop;

  const cleaned = [];
  for (const [x, z] of loop) {
    const px = snapCoord(x);
    const pz = snapCoord(z);
    const last = cleaned[cleaned.length - 1];
    if (last && Math.abs(last[0] - px) < EPS && Math.abs(last[1] - pz) < EPS) continue;
    cleaned.push([px, pz]);
  }
  if (cleaned.length > 1) {
    const first = cleaned[0];
    const last = cleaned[cleaned.length - 1];
    if (Math.abs(first[0] - last[0]) < EPS && Math.abs(first[1] - last[1]) < EPS) {
      cleaned.pop();
    }
  }
  if (cleaned.length < 3) return loop;

  const out = [];
  const n = cleaned.length;
  for (let i = 0; i < n; i++) {
    const [x0, z0] = cleaned[(i - 1 + n) % n];
    const [x1, z1] = cleaned[i];
    const [x2, z2] = cleaned[(i + 1) % n];
    const collinearH = Math.abs(z0 - z1) < EPS && Math.abs(z1 - z2) < EPS;
    const collinearV = Math.abs(x0 - x1) < EPS && Math.abs(x1 - x2) < EPS;
    if (collinearH || collinearV) continue;
    out.push(cleaned[i]);
  }

  return out.length >= 3 ? out : cleaned;
}

function signedArea(loop) {
  let a = 0;
  for (let i = 0; i < loop.length; i++) {
    const [x0, z0] = loop[i];
    const [x1, z1] = loop[(i + 1) % loop.length];
    a += x0 * z1 - x1 * z0;
  }
  return a * 0.5;
}

/** Outer CCW, holes CW — required for ExtrudeGeometry boolean cuts. */
export function orientExtrudeLoops(outer, holes) {
  const outOuter = outer ? simplifyOrthogonalLoop(outer) : null;
  const outHoles = holes.map((h) => simplifyOrthogonalLoop(h));

  if (outOuter && signedArea(outOuter) < 0) outOuter.reverse();
  for (let i = 0; i < outHoles.length; i++) {
    if (signedArea(outHoles[i]) > 0) outHoles[i].reverse();
  }

  return { outer: outOuter, holes: outHoles };
}

function snapAxisNormal(nx, ny, nz) {
  const ax = Math.abs(nx);
  const ay = Math.abs(ny);
  const az = Math.abs(nz);
  if (ay >= ax && ay >= az) return [0, ny < 0 ? -1 : 1, 0];
  if (ax >= az) return [nx < 0 ? -1 : 1, 0, 0];
  return [0, 0, nz < 0 ? -1 : 1];
}

/** Per-triangle axis-aligned normals — sharp 90° corners, no bevel shading. */
export function applyAxisFaceNormals(geo) {
  const mesh = geo.index ? geo.toNonIndexed() : geo;
  if (mesh !== geo) geo.dispose();

  const pos = mesh.attributes.position;
  const norm = new Float32Array(pos.count * 3);

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

    let nx = e1y * e2z - e1z * e2y;
    let ny = e1z * e2x - e1x * e2z;
    let nz = e1x * e2y - e1y * e2x;
    const len = Math.hypot(nx, ny, nz);
    if (len < 1e-12) {
      nx = 0;
      ny = 1;
      nz = 0;
    } else {
      nx /= len;
      ny /= len;
      nz /= len;
    }

    const [snx, sny, snz] = snapAxisNormal(nx, ny, nz);
    for (let k = 0; k < 3; k++) {
      const j = (i + k) * 3;
      norm[j] = snx;
      norm[j + 1] = sny;
      norm[j + 2] = snz;
    }
  }

  mesh.setAttribute("normal", new THREE.BufferAttribute(norm, 3));
  return mesh;
}

export function quantizeWallPositions(geo, step = SNAP) {
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    pos.setXYZ(
      i,
      snapCoord(pos.getX(i), step),
      snapCoord(pos.getY(i), step),
      snapCoord(pos.getZ(i), step),
    );
  }
  pos.needsUpdate = true;
}

function pointInFootprint(x, z, cells) {
  return cells.some(
    (c) => x >= c.x0 - EPS && x <= c.x1 + EPS && z >= c.z0 - EPS && z <= c.z1 + EPS,
  );
}

/** Flip triangle winding when the face normal points into the wall solid. */
export function orientWallFacesOutward(geo, cells, room = null) {
  if (!geo) return geo;
  const pos = geo.attributes.position;
  const norm = geo.attributes.normal;
  const innerWalls = room?.innerWalls ?? [];
  const walkable = room ? (x, z) => isWalkableLocal(x, z, innerWalls) : null;
  const probe = 0.42;

  for (let i = 0; i < pos.count; i += 3) {
    const xs = [pos.getX(i), pos.getX(i + 1), pos.getX(i + 2)];
    const ys = [pos.getY(i), pos.getY(i + 1), pos.getY(i + 2)];
    const zs = [pos.getZ(i), pos.getZ(i + 1), pos.getZ(i + 2)];
    const cx = (xs[0] + xs[1] + xs[2]) / 3;
    const cz = (zs[0] + zs[1] + zs[2]) / 3;
    const nx = norm.getX(i);
    const ny = norm.getY(i);
    const nz = norm.getZ(i);
    if (Math.abs(ny) > 0.85) continue;

    let flip = false;

    if (walkable) {
      const wPlus = walkable(cx + probe * nx, cz + probe * nz);
      const wMinus = walkable(cx - probe * nx, cz - probe * nz);
      if (wPlus && !wMinus) {
        flip = false;
      } else if (wMinus && !wPlus) {
        flip = true;
      } else if (wPlus && wMinus) {
        continue;
      } else if (cells?.length) {
        const inPlus = pointInFootprint(cx + 0.05 * nx, cz + 0.05 * nz, cells);
        const inMinus = pointInFootprint(cx - 0.05 * nx, cz - 0.05 * nz, cells);
        if (inPlus && !inMinus) flip = true;
        else if (inMinus && !inPlus) flip = false;
        else continue;
      } else {
        continue;
      }
    } else if (cells?.length) {
      const inPlus = pointInFootprint(cx + 0.05 * nx, cz + 0.05 * nz, cells);
      const inMinus = pointInFootprint(cx - 0.05 * nx, cz - 0.05 * nz, cells);
      if (inPlus && inMinus) continue;
      if (inPlus && !inMinus) flip = true;
    } else {
      continue;
    }

    if (!flip) continue;

    const x1 = pos.getX(i + 1);
    const y1 = pos.getY(i + 1);
    const z1 = pos.getZ(i + 1);
    pos.setXYZ(i + 1, pos.getX(i + 2), pos.getY(i + 2), pos.getZ(i + 2));
    pos.setXYZ(i + 2, x1, y1, z1);
    for (let k = 0; k < 3; k++) {
      const j = (i + k) * 3;
      norm.array[j] = -norm.array[j];
      norm.array[j + 1] = -norm.array[j + 1];
      norm.array[j + 2] = -norm.array[j + 2];
    }
  }

  pos.needsUpdate = true;
  norm.needsUpdate = true;
  return geo;
}

export function finalizeWallMeshGeometry(geo, cells = null, room = null) {
  let out = geo.index ? geo.toNonIndexed() : geo;
  if (out !== geo) geo.dispose();

  quantizeWallPositions(out);
  out = applyAxisFaceNormals(out);
  if (cells || room) orientWallFacesOutward(out, cells, room);
  return out;
}
