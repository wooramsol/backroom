import { MAP_CELL_M, MAP_GRID_SIZE } from "../constants.js";
import { GridMap } from "./grid.js";
import { RoomGenerator } from "./RoomGenerator.js";
import { CorridorGenerator } from "./CorridorGenerator.js";
import { WallGenerator } from "./WallGenerator.js";
import { ConnectivityValidator } from "./ConnectivityValidator.js";

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

  generate(doors) {
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
}

export function buildGridMap(doors, rng) {
  return new MapGenerator(rng).generate(doors);
}
