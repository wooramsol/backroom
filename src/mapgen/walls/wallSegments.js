import { CHUNK } from "../../constants.js";
import { expandWallSegments } from "../../wallCorners.js";

function normSeg(seg) {
  return {
    axis: seg.axis,
    pos: seg.pos,
    span0: seg.span0 ?? seg.s0,
    span1: seg.span1 ?? seg.s1,
    door: seg.door ?? null,
  };
}

/** All render/collision wall runs for one chunk — inner partitions + chunk shell with door cuts. */
export function collectRoomWallSegments(room) {
  const out = [];
  const seen = new Set();

  const push = (seg) => {
    const s = normSeg(seg);
    if (s.span1 - s.span0 < 0.05) return;
    const key = `${s.axis}|${s.pos.toFixed(4)}|${s.span0.toFixed(4)}|${s.span1.toFixed(4)}`;
    if (seen.has(key)) return;
    seen.add(key);
    out.push(s);
  };

  const inner = room.wallSegments ?? room.innerWalls ?? [];
  for (const w of inner) push(w);

  for (const seg of expandWallSegments(room)) {
    const onBoundary =
      seg.pos <= 0.01 ||
      seg.pos >= CHUNK - 0.01 ||
      seg.s0 <= 0.01 ||
      seg.s1 >= CHUNK - 0.01;
    if (onBoundary) push(seg);
  }

  return out;
}
