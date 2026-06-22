import { MAP_CELL_M, MAP_GRID_SIZE } from "../constants.js";
import { CELL_FLOOR, GridMap } from "./grid.js";
import { RoomGenerator } from "./RoomGenerator.js";
import { CorridorGenerator } from "./CorridorGenerator.js";
import { WallGenerator } from "./WallGenerator.js";
import { ConnectivityValidator } from "./ConnectivityValidator.js";
import { shapeFallback } from "./roomShapes.js";

/**
 * Orchestrates grid-based map generation:
 * rooms → corridors → outline walls → validation
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
    const roomGen = new RoomGenerator(this.rng);
    const rooms = roomGen.generate(grid);

    const corridorGen = new CorridorGenerator(this.rng);
    corridorGen.connectRooms(grid, rooms);
    corridorGen.connectChunkDoors(grid, rooms, doors);

    let wallSegments = WallGenerator.fromGrid(grid);
    const validator = new ConnectivityValidator(this.rng);
    let validation = validator.validate(grid, rooms, doors, wallSegments);

    if (!validation.ok) {
      const repaired = validator.repair(grid, rooms, doors);
      wallSegments = repaired.wallSegments;
      validation = validator.validate(grid, rooms, doors, wallSegments);
    }

    const innerWalls = WallGenerator.toInnerWalls(wallSegments);
    const kind = rooms.length === 1 ? rooms[0].kind : `grid-${rooms.length}`;

    return {
      kind,
      zones: this.zonesFromRooms(rooms),
      rooms,
      grid,
      innerWalls,
      wallSegments,
      validation,
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

    const corridorGen = new CorridorGenerator(this.rng);
    corridorGen.connectChunkDoors(grid, rooms, doors);

    const validator = new ConnectivityValidator(this.rng);
    let wallSegments = WallGenerator.fromGrid(grid);
    let validation = validator.validate(grid, rooms, doors, wallSegments);
    if (!validation.ok) {
      const repaired = validator.repair(grid, rooms, doors);
      wallSegments = repaired.wallSegments;
      validation = validator.validate(grid, rooms, doors, wallSegments);
    }

    return {
      kind: shape.kind,
      zones: this.zonesFromRooms(rooms),
      rooms,
      grid,
      innerWalls: WallGenerator.toInnerWalls(wallSegments),
      wallSegments,
      validation,
    };
  }

  generate(doors) {
    for (let attempt = 0; attempt < 10; attempt++) {
      const result = this.buildOnce(doors);
      if (result.validation.ok) return result;
    }
    return this.generateFallback(doors);
  }
}

export function buildGridMap(doors, rng) {
  return new MapGenerator(rng).generate(doors);
}
