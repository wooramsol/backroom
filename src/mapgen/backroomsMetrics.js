import { CELL_CORRIDOR, CELL_FLOOR } from "./grid.js";

const MAX_CORRIDOR_RATIO = 0.18;

export function corridorRatio(grid) {
  let corridor = 0;
  let walkable = 0;
  for (let z = 0; z < grid.size; z++) {
    for (let x = 0; x < grid.size; x++) {
      const v = grid.get(x, z);
      if (v === CELL_CORRIDOR) corridor++;
      if (grid.isWalkable(x, z)) walkable++;
    }
  }
  return walkable ? corridor / walkable : 0;
}

export function roomFloorRatio(grid) {
  let floor = 0;
  let walkable = 0;
  for (let z = 0; z < grid.size; z++) {
    for (let x = 0; x < grid.size; x++) {
      if (grid.get(x, z) === CELL_FLOOR) floor++;
      if (grid.isWalkable(x, z)) walkable++;
    }
  }
  return walkable ? floor / walkable : 0;
}

export function corridorBudgetOK(grid) {
  return corridorRatio(grid) <= MAX_CORRIDOR_RATIO;
}

export function roomSpaceOK(grid) {
  return roomFloorRatio(grid) >= 0.8;
}

export function roomGenStats(rooms) {
  const kinds = {};
  const sizes = new Set();
  for (const room of rooms) {
    kinds[room.kind] = (kinds[room.kind] ?? 0) + 1;
    if (room.sizeKey) sizes.add(room.sizeKey);
  }
  return {
    roomCount: rooms.length,
    uniqueSizes: sizes.size,
    kinds,
  };
}
