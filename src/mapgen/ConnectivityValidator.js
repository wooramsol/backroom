import { MAP_GRID_SIZE } from "../constants.js";
import { CorridorGenerator } from "./CorridorGenerator.js";
import { WallGenerator } from "./WallGenerator.js";
import { RoomConnector } from "./RoomConnector.js";
import { corridorBudgetOK, roomSpaceOK } from "./backroomsMetrics.js";
import {
  allPassagesWideEnough,
  minCorridorCells,
  minPassageCells,
  narrowPassageCells,
} from "./passage.js";
import { wallsFromGrid } from "./wallOutline.js";

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
    this.minPassage = minPassageCells();
    this.minCorridor = minCorridorCells();
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

  validate(grid, rooms, doors, wallSegments) {
    const errors = [];
    if (!this.allWalkableConnected(grid)) errors.push("disconnected_walkable");
    if (!this.allRoomsReachable(grid, rooms)) errors.push("isolated_room");
    if (!this.doorsReachable(grid, doors)) errors.push("door_unreachable");
    if (!allPassagesWideEnough(grid, this.minPassage)) errors.push("narrow_passage");
    if (!roomSpaceOK(grid)) errors.push("low_room_space");
    if (!corridorBudgetOK(grid)) errors.push("corridor_heavy");
    const wallIssues = WallGenerator.validate(wallSegments);
    const criticalWalls = wallIssues.filter((i) => i.kind !== "dangling");
    if (criticalWalls.length) errors.push("wall_issues");
    return { ok: errors.length === 0, errors, wallIssues };
  }

  repair(grid, rooms, doors, openEdges, connector) {
    const corridor = new CorridorGenerator(this.rng);
    let attempts = 0;

    while (attempts < 8) {
      attempts++;
      if (!this.allRoomsReachable(grid, rooms) || !this.allWalkableConnected(grid)) {
        connector.connect(grid, rooms);
      }
      if (!this.doorsReachable(grid, doors)) {
        corridor.connectChunkDoors(grid, rooms, doors);
      }
      if (!allPassagesWideEnough(grid, this.minPassage)) {
        const narrow = narrowPassageCells(grid, this.minPassage);
        const roomId = rooms[0]?.id ?? 0;
        for (const [x, z] of narrow) corridor.widenAt(grid, x, z, this.minCorridor, roomId);
      }
      const segs = wallsFromGrid(grid, openEdges);
      const result = this.validate(grid, rooms, doors, segs);
      if (result.ok) return { openEdges: connector.openEdges, wallSegments: segs, repaired: attempts };
    }

    return {
      openEdges: connector.openEdges,
      wallSegments: wallsFromGrid(grid, openEdges),
      repaired: attempts,
    };
  }
}
