import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { CHUNK } from "./room.js";
import { WALL_T, DOOR_H } from "./constants.js";
import { WALL_TILE_W } from "./textures.js";
import { cloneWallBox, bakeWallUV } from "./geometryPool.js";

function tileHFromWallTex(wallTex) {
  return wallTex.userData?.tileH ?? WALL_TILE_W;
}

function appendWallSegment(parts, wallTex, axis, pos, a0, a1, door, h, jambs, roomWx, roomWz) {
  const tileH = tileHFromWallTex(wallTex);
  const mid = (a0 + a1) / 2 + (door?.offset || 0);
  const dw = door ? door.width / 2 : 0;
  const cap = WALL_T * 0.5;

  const push = (s0, s1, segH, segY, capStart = true, capEnd = true) => {
    const es0 = capStart ? s0 - cap : s0;
    const es1 = capEnd ? s1 + cap : s1;
    const slen = es1 - es0;
    if (slen < 0.1) return;
    const smid = (es0 + es1) / 2;
    const y = segY + segH / 2;
    const geo = cloneWallBox(axis, slen, segH);
    const worldU0 = axis === "z" ? roomWx + es0 : roomWz + es0;
    bakeWallUV(geo, slen, segH, WALL_TILE_W, tileH, worldU0, segY);
    if (axis === "z") geo.translate(smid, y, pos);
    else geo.translate(pos, y, smid);
    parts.push(geo);
  };

  if (door) {
    push(a0, mid - dw, DOOR_H, 0, true, false);
    push(mid + dw, a1, DOOR_H, 0, false, true);
    push(a0, a1, h - DOOR_H, DOOR_H, true, true);
    jambs.push({ axis, pos, mid, dw });
    return;
  }

  push(a0, a1, h, 0, true, true);
}

/** One merged BufferGeometry for all wallpaper walls in a chunk */
export function buildMergedWallGeometry(room, wallTex, h, roomWx, roomWz) {
  const parts = [];
  const jambs = [];

  appendWallSegment(parts, wallTex, "z", 0, 0, CHUNK, room.doors.north, h, jambs, roomWx, roomWz);
  appendWallSegment(parts, wallTex, "z", CHUNK, 0, CHUNK, room.doors.south, h, jambs, roomWx, roomWz);
  appendWallSegment(parts, wallTex, "x", 0, 0, CHUNK, room.doors.west, h, jambs, roomWx, roomWz);
  appendWallSegment(parts, wallTex, "x", CHUNK, 0, CHUNK, room.doors.east, h, jambs, roomWx, roomWz);

  for (const wall of room.innerWalls) {
    const axis = wall.axis === "x" ? "x" : "z";
    appendWallSegment(parts, wallTex, axis, wall.pos, wall.span0, wall.span1, wall.door, h, jambs, roomWx, roomWz);
  }

  if (!parts.length) return { geometry: null, jambs };

  const geometry = mergeGeometries(parts, false);
  for (const g of parts) g.dispose();
  return { geometry, jambs };
}
