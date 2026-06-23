/**
 * Step 3 — zone-aware map orchestrator (parallel to frozen MapGenerator).
 */
import { MAP_CELL_M, MAP_GRID_SIZE } from "../constants.js";
import { CELL_FLOOR, GridMap } from "../mapgen/grid.js";
import { CorridorGenerator } from "../mapgen/CorridorGenerator.js";
import { ConnectivityValidator } from "../mapgen/ConnectivityValidator.js";
import { mergeFloorIslands } from "../mapgen/floorConnect.js";
import { corridorBudgetOK, roomGenStats, roomSpaceOK } from "../mapgen/backroomsMetrics.js";
import { analyzeSpatialLayout } from "../mapgen/RoomSpatialQA.js";
import { innerWallsFromGrid, wallsFromGrid } from "../mapgen/wallOutline.js";
import { roomOpeningCounts } from "../mapgen/RoomConnector.js";
import { shapeFallback } from "../mapgen/roomShapes.js";
import { getMacroZoneAt } from "./ZoneClusterField.js";
import { getZoneProfile } from "./ZoneTypes.js";
import { createZonePacker } from "./ZoneRoomPacker.js";
import { createZoneConnector } from "./ZoneRoomConnector.js";

export class ZoneMapGenerator {
  constructor(rng, zoneType, macroZone) {
    this.rng = rng;
    this.zoneType = zoneType;
    this.macroZone = macroZone;
    this.profile = getZoneProfile(zoneType);
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
    const packer = createZonePacker(this.rng, this.zoneType);
    const rooms = packer.generate(grid);

    const connector = createZoneConnector(this.rng, this.zoneType);
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

    const kind = `zone-${this.zoneType}-${rooms.length}`;

    return {
      kind,
      zones: this.zonesFromRooms(rooms),
      rooms,
      grid,
      openEdges,
      innerWalls: innerWallsFromGrid(grid, openEdges),
      wallSegments,
      validation,
      macroZone: this.macroZone,
      zoneType: this.zoneType,
      zoneProfile: this.profile,
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
        sizeKey: `${shape.w}x${shape.h}`,
      },
    ];

    const openEdges = new Set();
    const corridorGen = new CorridorGenerator(this.rng);
    corridorGen.connectChunkDoors(grid, rooms, doors);

    const validator = new ConnectivityValidator(this.rng);
    let wallSegments = wallsFromGrid(grid, openEdges);
    let validation = validator.validate(grid, rooms, doors, wallSegments);

    return {
      kind: `zone-${this.zoneType}-fallback`,
      zones: this.zonesFromRooms(rooms),
      rooms,
      grid,
      openEdges,
      innerWalls: innerWallsFromGrid(grid, openEdges),
      wallSegments,
      validation,
      macroZone: this.macroZone,
      zoneType: this.zoneType,
      zoneProfile: this.profile,
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
      const meetsMin = rooms.length >= this.profile.minRooms;
      const sp = result.metrics.spatial;
      let spatialBonus = 0;
      if (sp) {
        spatialBonus += sp.uniqueSizes * 3;
        spatialBonus += sp.orthoShapeCount * 2;
        if (sp.narrowPresent && sp.widePresent) spatialBonus += 12;
        if (sp.loungePresent) spatialBonus += 4;
        spatialBonus -= sp.sameSizeConsecutive * 8;
        spatialBonus -= Math.max(0, sp.longestCorridorCells - 6) * 3;
        if (sp.roomToRoomDirectRatio >= 0.5) spatialBonus += 5;
      }
      const score =
        (result.validation.ok ? 100 : 0) +
        (result.metrics.roomSpace ? 10 : 0) +
        (result.metrics.corridorBudget ? 10 : 0) +
        rooms.length * 5 +
        (dupes ? 0 : 8) +
        (meetsMin ? 12 : 0) +
        spatialBonus;
      if (!best || score > best.score) best = { result, score };
      if (
        result.validation.ok &&
        result.metrics.roomSpace &&
        result.metrics.corridorBudget &&
        rooms.length >= Math.max(1, this.profile.minRooms - 1) &&
        !dupes
      ) {
        return result;
      }
    }
    if (best?.result.validation?.ok) return best.result;
    return this.generateFallback(doors);
  }
}

/**
 * Build chunk map for macro zone at (cx, cz).
 * Wall + room frozen pipelines run inside via shared grid/wall outline imports.
 */
export function buildZoneMap(cx, cz, doors, rng) {
  const macroZone = getMacroZoneAt(cx, cz);
  return new ZoneMapGenerator(rng, macroZone.type, macroZone).generate(doors);
}

export { getMacroZoneAt } from "./ZoneClusterField.js";
export { ZONE_TYPES, ZONE_PROFILES, getZoneProfile } from "./ZoneTypes.js";
