import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { CHUNK, WALL_T, WALL_JOINT_OVERLAP } from "./constants.js";
import { WALL_TILE_W } from "./textures.js";
import { cloneWallBox, bakeWallBoxUV } from "./geometryPool.js";
import { expandWallSegments } from "./wallCorners.js";
import { buildExtrudedWallGeometry, tileHFromWallTex } from "./mapgen/WallExtruder.js";

const COLINEAR_CAP = WALL_JOINT_OVERLAP * 0.5;

/** mergeGeometries requires every part to be indexed or none — boundary boxes are non-indexed */
function toNonIndexedGeometry(geo) {
  if (!geo?.index) return geo;
  const flat = geo.toNonIndexed();
  geo.dispose();
  return flat;
}

function appendBoundaryBox(parts, seg, h, roomWx, roomWz, tileH) {
  const slen = seg.s1 - seg.s0;
  if (slen < 0.05) return;
  const smid = (seg.s0 + seg.s1) / 2;
  const geo = cloneWallBox(seg.axis, slen, h);
  const baked = geo.index ? geo.toNonIndexed() : geo;
  if (baked !== geo) geo.dispose();
  const worldU0 = seg.axis === "z" ? roomWx + seg.s0 : roomWz + seg.s0;
  bakeWallBoxUV(baked, seg.axis, slen, h, WALL_TILE_W, tileH, worldU0, 0);
  if (seg.axis === "z") baked.translate(smid, h / 2, seg.pos);
  else baked.translate(seg.pos, h / 2, smid);
  parts.push(baked);
}

/** One merged BufferGeometry — extruded inner walls + boundary chunk shell */
export function buildMergedWallGeometry(room, wallTex, h, roomWx, roomWz) {
  const tileH = tileHFromWallTex(wallTex);
  const parts = [];

  if (room.wallSegments?.length) {
    const inner = buildExtrudedWallGeometry(
      room.wallSegments,
      h,
      roomWx,
      roomWz,
      WALL_TILE_W,
      tileH,
    );
    if (inner) parts.push(toNonIndexedGeometry(inner));
  } else if (room.innerWalls?.length) {
    const inner = buildExtrudedWallGeometry(
      room.innerWalls.map((w) => ({
        axis: w.axis,
        pos: w.pos,
        span0: w.span0,
        span1: w.span1,
      })),
      h,
      roomWx,
      roomWz,
      WALL_TILE_W,
      tileH,
    );
    if (inner) parts.push(toNonIndexedGeometry(inner));
  }

  const boundary = expandWallSegments(room).filter((seg) => {
    if (seg.pos <= 0.01 || seg.pos >= CHUNK - 0.01) return true;
    return seg.s0 <= 0.01 || seg.s1 >= CHUNK - 0.01;
  });

  for (const seg of boundary) {
    const es0 = seg.s0 - COLINEAR_CAP;
    const es1 = seg.s1 + COLINEAR_CAP;
    appendBoundaryBox(parts, { ...seg, s0: es0, s1: es1 }, h, roomWx, roomWz, tileH);
  }

  if (!parts.length) return { geometry: null };

  const geometry = mergeGeometries(parts, false);
  for (const g of parts) {
    if (g !== geometry) g.dispose();
  }
  return { geometry };
}
