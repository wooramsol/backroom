import { MAP_CELL_M, MAP_GRID_SIZE, MIN_PASSAGE_SPAN } from "../constants.js";
import { CELL_CORRIDOR, CELL_FLOOR, GridMap } from "./grid.js";
import { CorridorGenerator } from "./CorridorGenerator.js";
import { WallGenerator } from "./WallGenerator.js";

function doorCells(doors) {
  const mid = MAP_GRID_SIZE / 2;
  return [
    { x: Math.round(mid + doors.north.offset), z: 0, name: "north" },
    { x: Math.round(mid + doors.south.offset), z: MAP_GRID_SIZE - 1, name: "south" },
    { x: MAP_GRID_SIZE - 1, z: Math.round(mid + doors.east.offset), name: "east" },
    { x: 0, z: Math.round(mid + doors.west.offset), name: "west" },
  ];
}

/** Validates connectivity and wall integrity; attempts automatic repair */
export class ConnectivityValidator {
  constructor(rng) {
    this.rng = rng;
  }

  allWalkableConnected(grid) {
    let start = null;
    let total = 0;
    for (let z = 0; z < grid.size; z++) {
      for (let x = 0; x < grid.size; x++) {
        if (!grid.isWalkable(x, z)) continue;
        total++;
        if (!start) start = [x, z];
      }
    }
    if (!start || total === 0) return false;
    return grid.floodComponent(start[0], start[1]).size >= total;
  }

  allRoomsReachable(grid, rooms) {
    if (!rooms.length) return true;
    const start = rooms[0].cells[0];
    const reached = grid.floodComponent(start[0], start[1]);
    for (const room of rooms) {
      for (const [x, z] of room.cells) {
        if (!reached.has(`${x},${z}`)) return false;
      }
    }
    return true;
  }

  doorsReachable(grid, doors) {
    const entries = doorCells(doors);
    const walkable = [];
    for (let z = 0; z < grid.size; z++) {
      for (let x = 0; x < grid.size; x++) {
        if (grid.isWalkable(x, z)) walkable.push([x, z]);
      }
    }
    if (!walkable.length) return false;
    const reached = grid.floodComponent(walkable[0][0], walkable[0][1]);
    for (const d of entries) {
      if (!reached.has(`${d.x},${d.z}`)) return false;
    }
    return true;
  }

  minCorridorWidthOK(grid) {
    const minCells = Math.ceil(MIN_PASSAGE_SPAN / MAP_CELL_M);
    for (let z = 0; z < grid.size; z++) {
      for (let x = 0; x < grid.size; x++) {
        if (!grid.isWalkable(x, z)) continue;
        let wx = 0;
        let wz = 0;
        while (grid.isWalkable(x + wx, z)) wx++;
        while (grid.isWalkable(x, z + wz)) wz++;
        if (wx < minCells && wz < minCells) return false;
      }
    }
    return true;
  }

  validate(grid, rooms, doors, wallSegments) {
    const errors = [];
    if (!this.allWalkableConnected(grid)) errors.push("disconnected_walkable");
    if (!this.allRoomsReachable(grid, rooms)) errors.push("isolated_room");
    if (!this.doorsReachable(grid, doors)) errors.push("door_unreachable");
    const wallIssues = WallGenerator.validate(wallSegments);
    const criticalWalls = wallIssues.filter((i) => i.kind !== "dangling");
    if (criticalWalls.length) errors.push("wall_issues");
    return { ok: errors.length === 0, errors, wallIssues };
  }

  repair(grid, rooms, doors) {
    const corridor = new CorridorGenerator(this.rng);
    let attempts = 0;

    while (attempts < 6) {
      attempts++;
      if (!this.allWalkableConnected(grid) || !this.allRoomsReachable(grid, rooms)) {
        if (rooms.length >= 2) {
          const a = rooms[0].centroid;
          const b = rooms[rooms.length - 1].centroid;
          corridor.carvePath(grid, a.x, a.z, b.x, b.z, corridor.pickWidth());
        }
      }
      if (!this.doorsReachable(grid, doors)) {
        corridor.connectChunkDoors(grid, rooms, doors);
      }
      const segs = WallGenerator.fromGrid(grid);
      const result = this.validate(grid, rooms, doors, segs);
      if (result.ok) return { grid, wallSegments: segs, repaired: attempts };
    }

    return { grid, wallSegments: WallGenerator.fromGrid(grid), repaired: attempts };
  }
}
