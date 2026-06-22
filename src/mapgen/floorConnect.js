import { CELL_FLOOR } from "./grid.js";
import { findRoomAdjacencies } from "./RoomConnector.js";

function floorComponents(grid) {
  const seen = new Set();
  const comps = [];

  for (let z = 0; z < grid.size; z++) {
    for (let x = 0; x < grid.size; x++) {
      if (grid.get(x, z) !== CELL_FLOOR) continue;
      const k = `${x},${z}`;
      if (seen.has(k)) continue;

      const comp = [];
      const queue = [[x, z]];
      while (queue.length) {
        const [cx, cz] = queue.pop();
        const ck = `${cx},${cz}`;
        if (seen.has(ck)) continue;
        if (grid.get(cx, cz) !== CELL_FLOOR) continue;
        seen.add(ck);
        comp.push([cx, cz]);
        queue.push([cx + 1, cz], [cx - 1, cz], [cx, cz + 1], [cx, cz - 1]);
      }
      comps.push(comp);
    }
  }
  return comps;
}

/** If packing left separate floor islands, open every shared wall between them */
export function mergeFloorIslands(grid, connector, rooms) {
  const comps = floorComponents(grid);
  if (comps.length <= 1) return;

  const adj = findRoomAdjacencies(grid);
  for (const pair of adj) {
    connector.openPair(pair);
  }
}
