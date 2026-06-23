import { MAP_CELL_M, MAP_GRID_SIZE } from "../constants.js";
import { CELL_FLOOR, GridMap } from "./grid.js";
import { BackroomsRoomPacker } from "./BackroomsRoomPacker.js";
import { RoomConnector, roomOpeningCounts } from "./RoomConnector.js";
import { CorridorGenerator } from "./CorridorGenerator.js";
import { ConnectivityValidator } from "./ConnectivityValidator.js";
import { mergeFloorIslands } from "./floorConnect.js";
import { corridorBudgetOK, roomGenStats, roomSpaceOK } from "./backroomsMetrics.js";
import { analyzeSpatialLayout } from "./RoomSpatialQA.js";
import { innerWallsFromGrid, wallsFromGrid } from "./wallOutline.js";
import { shapeFallback } from "./roomShapes.js";

/**
 * Backrooms-first map generation:
 * pack offices → punch doorways in shared walls → minimal door spurs only
 */
export class MapGenerator {
  constructor(rng) {
    this.rng = rng;
  }

  zonesFromRooms(rooms) {
    return rooms.map((room) => {
      let x0 = MAP_GRID_SIZE;
      let z0 = MAP_GRID_SIZE;
      let x1 = 0;
      let z1 = 0;
      for (const [x, z] of room.cells) {
        x0 = Math.min(x0, x);
        z0 = Math.min(z0, z);
        x1 = Math.max(x1, x + 1);
        z1 = Math.max(z1, z + 1);
      }
      return {
        x0: x0 * MAP_CELL_M,
        z0: z0 * MAP_CELL_M,
        x1: x1 * MAP_CELL_M,
        z1: z1 * MAP_CELL_M,
      };
    });
  }

  buildOnce(doors) {
    const grid = new GridMap(MAP_GRID_SIZE);
    const packer = new BackroomsRoomPacker(this.rng);
    const rooms = packer.generate(grid);

    const connector = new RoomConnector(this.rng);
    connector.connect(grid, rooms);
    mergeFloorIslands(grid, connector, rooms);
    const openEdges = connector.openEdges;

    const corridorGen = new CorridorGenerator(this.rng);
    corridorGen.connectChunkDoors(grid, rooms, doors);

    let wallSegments = wallsFromGrid(grid, openEdges);
    const validator = new ConnectivityValidator(this.rng);
    let validation = validator.validate(grid, rooms, doors, wallSegments);

    if (!validation.ok) {
      const repaired = validator.repair(grid, rooms, doors, openEdges, connector);
      wallSegments = repaired.wallSegments;
      validation = validator.validate(grid, rooms, doors, wallSegments);
    }

    const kind =
      rooms.length === 1 ? rooms[0].kind : `backrooms-${rooms.length}`;

    return {
      kind,
      zones: this.zonesFromRooms(rooms),
      rooms,
      grid,
      openEdges,
      innerWalls: innerWallsFromGrid(grid, openEdges),
      wallSegments,
      validation,
      metrics: {
        roomSpace: roomSpaceOK(grid),
        corridorBudget: corridorBudgetOK(grid),
        ...roomGenStats(rooms),
        openings: roomOpeningCounts(rooms, connector.openPairs),
        openPairs: connector.openPairs,
        spatial: analyzeSpatialLayout(grid, rooms, connector.openPairs),
      },
    };
  }

  generateFallback(doors) {
    const grid = new GridMap(MAP_GRID_SIZE);
    const shape = shapeFallback(this.rng);
    const ox = Math.floor((MAP_GRID_SIZE - shape.w) / 2);
    const oz = Math.floor((MAP_GRID_SIZE - shape.h) / 2);
    grid.stampCells(shape.cells, ox, oz, CELL_FLOOR, 0);
    const rooms = [
      {
        id: 0,
        kind: shape.kind,
        ox,
        oz,
        cells: shape.cells.map(([x, z]) => [ox + x, oz + z]),
        localCells: shape.cells,
        centroid: { x: ox + shape.w / 2, z: oz + shape.h / 2 },
      },
    ];

    const openEdges = new Set();
    const corridorGen = new CorridorGenerator(this.rng);
    corridorGen.connectChunkDoors(grid, rooms, doors);

    const validator = new ConnectivityValidator(this.rng);
    let wallSegments = wallsFromGrid(grid, openEdges);
    let validation = validator.validate(grid, rooms, doors, wallSegments);
    if (!validation.ok) {
      const stub = new RoomConnector(this.rng);
      const repaired = validator.repair(grid, rooms, doors, openEdges, stub);
      wallSegments = repaired.wallSegments;
      validation = validator.validate(grid, rooms, doors, wallSegments);
    }

    return {
      kind: shape.kind,
      zones: this.zonesFromRooms(rooms),
      rooms,
      grid,
      openEdges,
      innerWalls: innerWallsFromGrid(grid, openEdges),
      wallSegments,
      validation,
      metrics: { roomSpace: true, corridorBudget: true },
    };
  }

  generate(doors) {
    let best = null;
    for (let attempt = 0; attempt < 16; attempt++) {
      const result = this.buildOnce(doors);
      const rooms = result.rooms ?? [];
      const unique = new Set(rooms.map((r) => r.sizeKey)).size;
      const dupes = unique < rooms.length;
      const score =
        (result.validation.ok ? 100 : 0) +
        (result.metrics.roomSpace ? 10 : 0) +
        (result.metrics.corridorBudget ? 10 : 0) +
        rooms.length * 5 +
        (dupes ? 0 : 8);
      if (!best || score > best.score) best = { result, score };
      if (
        result.validation.ok &&
        result.metrics.roomSpace &&
        result.metrics.corridorBudget &&
        rooms.length >= 2 &&
        !dupes
      ) {
        return result;
      }
    }
    if (best?.result.validation?.ok) return best.result;
    return this.generateFallback(doors);
  }
}

export function buildGridMap(doors, rng) {
  return new MapGenerator(rng).generate(doors);
}
