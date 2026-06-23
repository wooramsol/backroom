/**
 * Step 3 — profile-driven connections (subclass; frozen RoomConnector untouched).
 */
import { RoomConnector, findRoomAdjacencies } from "../mapgen/RoomConnector.js";
import { minPassageCells } from "../mapgen/passage.js";

function mstPairs(adjacencies, rooms) {
  if (rooms.length < 2) return [];
  const ids = rooms.map((r) => r.id);
  const edges = adjacencies.map((p) => ({
    a: p.a,
    b: p.b,
    w: -p.seams.length,
  }));

  const inTree = new Set([ids[0]]);
  const chosen = [];

  while (inTree.size < ids.length) {
    let best = null;
    let bestW = Infinity;
    for (const e of edges) {
      const ai = inTree.has(e.a);
      const bi = inTree.has(e.b);
      if (ai === bi) continue;
      if (e.w < bestW) {
        bestW = e.w;
        best = e;
      }
    }
    if (!best) break;
    chosen.push(best);
    inTree.add(best.a);
    inTree.add(best.b);
  }
  return chosen.map((e) => `${Math.min(e.a, e.b)}:${Math.max(e.a, e.b)}`);
}

function pickDoorRun(seams, width, rng) {
  if (seams.length <= width) return seams;
  const centered = Math.max(0, Math.floor((seams.length - width) / 2));
  if (rng.chance(0.62)) {
    return seams.slice(centered, centered + width);
  }
  const start = rng.int(0, seams.length - width);
  return seams.slice(start, start + width);
}

function edgeKey(x, z, side) {
  return `${x},${z},${side}`;
}

function roomHasOpening(roomId, openPairs) {
  for (const key of openPairs) {
    const [a, b] = key.split(":").map(Number);
    if (a === roomId || b === roomId) return true;
  }
  return false;
}

import { getZoneProfile } from "./ZoneTypes.js";

export class ZoneRoomConnector extends RoomConnector {
  /** @param {import('./ZoneTypes.js').ZoneProfile} profile */
  constructor(rng, profile) {
    super(rng);
    this.extraLoopChance = profile?.extraLoopChance ?? 0.36;
    this.doorWidth = minPassageCells();
  }

  openSeam(seam) {
    this.openEdges.add(edgeKey(seam.x, seam.z, seam.side));
  }

  openPair(pair) {
    const key = `${pair.a}:${pair.b}`;
    if (this.openPairs.has(key)) return;
    const run = pickDoorRun(pair.seams, this.doorWidth, this.rng);
    for (const seam of run) this.openSeam(seam);
    this.openPairs.add(key);
  }

  connect(grid, rooms) {
    const adj = findRoomAdjacencies(grid);
    if (!adj.length) return this.openEdges;

    const mstKeys = new Set(mstPairs(adj, rooms));
    for (const pair of adj) {
      const key = `${pair.a}:${pair.b}`;
      if (mstKeys.has(key)) this.openPair(pair);
    }

    const extra = adj.filter((p) => !mstKeys.has(`${p.a}:${p.b}`));
    for (const pair of extra) {
      if (this.rng.chance(this.extraLoopChance)) this.openPair(pair);
    }

    for (const room of rooms) {
      if (roomHasOpening(room.id, this.openPairs)) continue;
      const pairs = adj
        .filter((p) => p.a === room.id || p.b === room.id)
        .sort((a, b) => b.seams.length - a.seams.length);
      if (pairs[0]) this.openPair(pairs[0]);
    }

    return this.openEdges;
  }
}

export function createZoneConnector(rng, zoneType) {
  return new ZoneRoomConnector(rng, getZoneProfile(zoneType));
}
