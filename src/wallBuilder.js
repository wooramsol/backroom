import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { CHUNK } from "./room.js";
import { WALL_T, WALL_JOINT_OVERLAP } from "./constants.js";
import { WALL_TILE_W } from "./textures.js";
import { cloneWallBox, bakeWallBoxUV } from "./geometryPool.js";

const JUNCTION_EPS = 0.02;
const COLINEAR_CAP = WALL_JOINT_OVERLAP * 0.5;

function tileHFromWallTex(wallTex) {
  return wallTex.userData?.tileH ?? WALL_TILE_W;
}

function spansMeet(value, s0, s1) {
  return value >= s0 - JUNCTION_EPS && value <= s1 + JUNCTION_EPS;
}

function expandWallSegments(room) {
  const segments = [];

  const push = (axis, pos, a0, a1, door) => {
    if (door) {
      const mid = (a0 + a1) / 2 + (door.offset || 0);
      const dw = door.width / 2;
      if (mid - dw - a0 > 0.1) segments.push({ axis, pos, s0: a0, s1: mid - dw });
      if (a1 - (mid + dw) > 0.1) segments.push({ axis, pos, s0: mid + dw, s1: a1 });
      return;
    }
    if (a1 - a0 >= 0.1) segments.push({ axis, pos, s0: a0, s1: a1 });
  };

  push("z", 0, 0, CHUNK, room.doors.north);
  push("z", CHUNK, 0, CHUNK, room.doors.south);
  push("x", 0, 0, CHUNK, room.doors.west);
  push("x", CHUNK, 0, CHUNK, room.doors.east);

  for (const wall of room.innerWalls) {
    const axis = wall.axis === "x" ? "x" : "z";
    push(axis, wall.pos, wall.span0, wall.span1, wall.door);
  }

  return segments;
}

function hasColinearJoin(segments, seg, end) {
  const junction = end === "start" ? seg.s0 : seg.s1;
  return segments.some((other) => {
    if (other.axis !== seg.axis || Math.abs(other.pos - seg.pos) > 1e-6) return false;
    if (end === "start") return Math.abs(other.s1 - junction) < JUNCTION_EPS;
    return Math.abs(other.s0 - junction) < JUNCTION_EPS;
  });
}

function findPerpendicularCorners(segments) {
  const corners = new Map();
  const zWalls = segments.filter((s) => s.axis === "z");
  const xWalls = segments.filter((s) => s.axis === "x");

  for (const zw of zWalls) {
    for (const xw of xWalls) {
      if (spansMeet(xw.pos, zw.s0, zw.s1) && spansMeet(zw.pos, xw.s0, xw.s1)) {
        corners.set(`${xw.pos.toFixed(4)}:${zw.pos.toFixed(4)}`, { x: xw.pos, z: zw.pos });
      }
    }
  }

  return [...corners.values()];
}

function appendCornerPost(parts, wallTex, tileH, x, z, h, roomWx, roomWz) {
  const geo = new THREE.BoxGeometry(WALL_T, h, WALL_T);
  const baked = geo.index ? geo.toNonIndexed() : geo;
  if (baked !== geo) geo.dispose();
  bakeWallBoxUV(baked, "z", WALL_T, h, WALL_TILE_W, tileH, roomWx + x - WALL_T / 2, 0);
  baked.translate(x, h / 2, z);
  parts.push(baked);
}

function appendWallSegment(parts, wallTex, segments, seg, h, roomWx, roomWz) {
  const tileH = tileHFromWallTex(wallTex);
  const { axis, pos, s0, s1 } = seg;
  const capStart = hasColinearJoin(segments, seg, "start") ? COLINEAR_CAP : 0;
  const capEnd = hasColinearJoin(segments, seg, "end") ? COLINEAR_CAP : 0;
  const es0 = s0 - capStart;
  const es1 = s1 + capEnd;
  const slen = es1 - es0;
  if (slen < 0.1) return;

  const smid = (es0 + es1) / 2;
  const y = h / 2;
  const geo = cloneWallBox(axis, slen, h);
  const baked = geo.index ? geo.toNonIndexed() : geo;
  if (baked !== geo) geo.dispose();

  const worldU0 = axis === "z" ? roomWx + es0 : roomWz + es0;
  bakeWallBoxUV(baked, axis, slen, h, WALL_TILE_W, tileH, worldU0, 0);
  if (axis === "z") baked.translate(smid, y, pos);
  else baked.translate(pos, y, smid);
  parts.push(baked);
}

/** One merged BufferGeometry for all wallpaper walls in a chunk */
export function buildMergedWallGeometry(room, wallTex, h, roomWx, roomWz) {
  const parts = [];
  const segments = expandWallSegments(room);

  for (const seg of segments) {
    appendWallSegment(parts, wallTex, segments, seg, h, roomWx, roomWz);
  }

  for (const corner of findPerpendicularCorners(segments)) {
    appendCornerPost(parts, wallTex, tileHFromWallTex(wallTex), corner.x, corner.z, h, roomWx, roomWz);
  }

  if (!parts.length) return { geometry: null };

  const geometry = mergeGeometries(parts, false);
  for (const g of parts) g.dispose();
  return { geometry };
}
