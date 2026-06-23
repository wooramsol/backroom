import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { CHUNK } from "./room.js";
import { WALL_T, WALL_JOINT_OVERLAP } from "./constants.js";
import { WALL_TILE_W } from "./textures.js";
import { cloneWallBox, bakeWallBoxUV } from "./geometryPool.js";

const JUNCTION_EPS = 0.02;
const COLINEAR_CAP = WALL_JOINT_OVERLAP * 0.5;
const CORNER_TRIM = WALL_T / 2;

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

function hasPerpendicularJoin(segments, seg, end) {
  const zWalls = segments.filter((s) => s.axis === "z");
  const xWalls = segments.filter((s) => s.axis === "x");

  if (seg.axis === "z") {
    const x = end === "start" ? seg.s0 : seg.s1;
    const z = seg.pos;
    return xWalls.some((xw) => Math.abs(xw.pos - x) < JUNCTION_EPS && spansMeet(z, xw.s0, xw.s1));
  }

  const z = end === "start" ? seg.s0 : seg.s1;
  const x = seg.pos;
  return zWalls.some((zw) => Math.abs(zw.pos - z) < JUNCTION_EPS && spansMeet(x, zw.s0, zw.s1));
}

/**
 * L-corner butt joint — one wall runs through, the other stops at half thickness.
 * Prevents the thin-edge gap visible at perpendicular box corners.
 */
function adjustStart(segments, seg) {
  if (hasColinearJoin(segments, seg, "start")) return -COLINEAR_CAP;
  if (hasPerpendicularJoin(segments, seg, "start") && seg.axis === "x") return CORNER_TRIM;
  return 0;
}

function adjustEnd(segments, seg) {
  if (hasColinearJoin(segments, seg, "end")) return COLINEAR_CAP;
  if (hasPerpendicularJoin(segments, seg, "end") && seg.axis === "x") return -CORNER_TRIM;
  return 0;
}

function appendWallBox(parts, seg, es0, es1, h, roomWx, roomWz, tileH) {
  const slen = es1 - es0;
  if (slen < 0.05) return;

  const smid = (es0 + es1) / 2;
  const geo = cloneWallBox(seg.axis, slen, h);
  const baked = geo.index ? geo.toNonIndexed() : geo;
  if (baked !== geo) geo.dispose();

  const worldU0 = seg.axis === "z" ? roomWx + es0 : roomWz + es0;
  bakeWallBoxUV(baked, seg.axis, slen, h, WALL_TILE_W, tileH, worldU0, 0);
  if (seg.axis === "z") baked.translate(smid, h / 2, seg.pos);
  else baked.translate(seg.pos, h / 2, smid);
  parts.push(baked);
}

function appendWallSegment(parts, segments, seg, h, roomWx, roomWz, tileH) {
  const es0 = seg.s0 + adjustStart(segments, seg);
  const es1 = seg.s1 + adjustEnd(segments, seg);
  appendWallBox(parts, seg, es0, es1, h, roomWx, roomWz, tileH);
}

/** One merged BufferGeometry for all wallpaper walls in a chunk */
export function buildMergedWallGeometry(room, wallTex, h, roomWx, roomWz) {
  const parts = [];
  const segments = expandWallSegments(room);
  const tileH = tileHFromWallTex(wallTex);

  for (const seg of segments) {
    appendWallSegment(parts, segments, seg, h, roomWx, roomWz, tileH);
  }

  if (!parts.length) return { geometry: null };

  const geometry = mergeGeometries(parts, false);
  for (const g of parts) g.dispose();
  return { geometry };
}
