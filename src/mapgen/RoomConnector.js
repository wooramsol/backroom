import { minPassageCells } from "./passage.js";

function edgeKey(x, z, side) {
  return `${x},${z},${side}`;
}

/** Adjacent room pairs and shared boundary cell pairs */
export function findRoomAdjacencies(grid) {
  const pairs = new Map();

  for (let z = 0; z < grid.size; z++) {
    for (let x = 0; x < grid.size; x++) {
      const ra = grid.roomId[grid.idx(x, z)];
      if (ra < 0) continue;

      const rb = grid.inBounds(x + 1, z) ? grid.roomId[grid.idx(x + 1, z)] : -1;
      if (rb >= 0 && ra !== rb) {
        const key = ra < rb ? `${ra}:${rb}` : `${rb}:${ra}`;
        if (!pairs.has(key)) pairs.set(key, { a: Math.min(ra, rb), b: Math.max(ra, rb), seams: [] });
        pairs.get(key).seams.push({ x, z, side: "east" });
      }

      const rc = grid.inBounds(x, z + 1) ? grid.roomId[grid.idx(x, z + 1)] : -1;
      if (rc >= 0 && ra !== rc) {
        const key = ra < rc ? `${ra}:${rc}` : `${rc}:${ra}`;
        if (!pairs.has(key)) pairs.set(key, { a: Math.min(ra, rc), b: Math.max(ra, rc), seams: [] });
        pairs.get(key).seams.push({ x, z, side: "south" });
      }
    }
  }

  return [...pairs.values()];
}

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
  const start = rng.int(0, seams.length - width);
  return seams.slice(start, start + width);
}

/** Opens doorways in shared walls — room-to-room, not long corridors */
export class RoomConnector {
  constructor(rng) {
    this.rng = rng;
    this.openEdges = new Set();
    this.doorWidth = minPassageCells();
  }

  openSeam(seam) {
    this.openEdges.add(edgeKey(seam.x, seam.z, seam.side));
  }

  openPair(pair) {
    const run = pickDoorRun(pair.seams, this.doorWidth, this.rng);
    for (const seam of run) this.openSeam(seam);
  }

  connect(grid, rooms) {
    const adj = findRoomAdjacencies(grid);
    if (!adj.length) return this.openEdges;

    const mstKeys = new Set(mstPairs(adj, rooms));
    for (const pair of adj) {
      const key = `${pair.a}:${pair.b}`;
      if (mstKeys.has(key)) this.openPair(pair);
    }

    for (const pair of adj) {
      const key = `${pair.a}:${pair.b}`;
      if (mstKeys.has(key)) continue;
      if (this.rng.chance(0.42)) this.openPair(pair);
    }

    return this.openEdges;
  }

  isOpen(x, z, side) {
    return this.openEdges.has(edgeKey(x, z, side));
  }
}

export { edgeKey };
