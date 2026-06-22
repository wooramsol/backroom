import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { CHUNK } from "./room.js";
import { WALL_TILE_W } from "./textures.js";
import { cloneWallBox, bakeWallBoxUV } from "./geometryPool.js";

function tileHFromWallTex(wallTex) {
  return wallTex.userData?.tileH ?? WALL_TILE_W;
}

function appendWallSegment(parts, wallTex, axis, pos, a0, a1, door, h, roomWx, roomWz) {
  const tileH = tileHFromWallTex(wallTex);
  const mid = (a0 + a1) / 2 + (door?.offset || 0);
  const dw = door ? door.width / 2 : 0;

  const push = (s0, s1, segH, segY) => {
    const slen = s1 - s0;
    if (slen < 0.1) return;
    const smid = (s0 + s1) / 2;
    const y = segY + segH / 2;
    const geo = cloneWallBox(axis, slen, segH);
    const baked = geo.index ? geo.toNonIndexed() : geo;
    if (baked !== geo) geo.dispose();
    const worldU0 = axis === "z" ? roomWx + s0 : roomWz + s0;
    bakeWallBoxUV(baked, axis, slen, segH, WALL_TILE_W, tileH, worldU0, segY);
    if (axis === "z") baked.translate(smid, y, pos);
    else baked.translate(pos, y, smid);
    parts.push(baked);
  };

  if (door) {
    push(a0, mid - dw, h, 0);
    push(mid + dw, a1, h, 0);
    return;
  }

  push(a0, a1, h, 0);
}

/** One merged BufferGeometry for all wallpaper walls in a chunk */
export function buildMergedWallGeometry(room, wallTex, h, roomWx, roomWz) {
  const parts = [];

  appendWallSegment(parts, wallTex, "z", 0, 0, CHUNK, room.doors.north, h, roomWx, roomWz);
  appendWallSegment(parts, wallTex, "z", CHUNK, 0, CHUNK, room.doors.south, h, roomWx, roomWz);
  appendWallSegment(parts, wallTex, "x", 0, 0, CHUNK, room.doors.west, h, roomWx, roomWz);
  appendWallSegment(parts, wallTex, "x", CHUNK, 0, CHUNK, room.doors.east, h, roomWx, roomWz);

  for (const wall of room.innerWalls) {
    const axis = wall.axis === "x" ? "x" : "z";
    appendWallSegment(parts, wallTex, axis, wall.pos, wall.span0, wall.span1, wall.door, h, roomWx, roomWz);
  }

  if (!parts.length) return { geometry: null };

  const geometry = mergeGeometries(parts, false);
  for (const g of parts) g.dispose();
  return { geometry };
}
