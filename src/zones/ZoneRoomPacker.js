/**
 * Step 3 — profile-driven room packer (subclass; frozen BackroomsRoomPacker untouched).
 */
import { MAP_GRID_SIZE } from "../constants.js";
import { BackroomsRoomPacker } from "../mapgen/BackroomsRoomPacker.js";
import { CELL_FLOOR } from "../mapgen/grid.js";
import { shapeNarrow, shapeLounge, pickSeedLoungeShape } from "../mapgen/roomShapes.js";
import { pickZoneRoomShape, pickZoneSeedShape } from "./zoneShapes.js";
import { pickCompactRoomShape } from "../mapgen/roomShapes.js";
import { getZoneProfile } from "./ZoneTypes.js";

const MARGIN = 1;
const MAX_PACK_ATTEMPTS = 200;

function fillRatio(grid) {
  let floor = 0;
  const n = grid.size * grid.size;
  for (let z = 0; z < grid.size; z++) {
    for (let x = 0; x < grid.size; x++) {
      if (grid.get(x, z) === CELL_FLOOR) floor++;
    }
  }
  return floor / n;
}

export class ZoneRoomPacker extends BackroomsRoomPacker {
  /** @param {import('./ZoneTypes.js').ZoneProfile} profile */
  constructor(rng, profile) {
    super(rng);
    this.profile = profile ?? getZoneProfile("open");
  }

  hasSmallRoom() {
    return this.rooms.some((r) => (r.cells?.length ?? 0) <= 22);
  }

  hasLounge() {
    return this.rooms.some((r) => r.kind === "lounge");
  }

  pickNextShape(ratio = 0) {
    if (this.rooms.length === 0) {
      return pickZoneSeedShape(this.rng, this.usedSizes, this.profile.seedMode);
    }
    if (this.rooms.length >= 2 && !this.hasLounge() && this.profile.pickMode !== "narrow") {
      const lounge = pickSeedLoungeShape(this.rng, this.usedSizes) ?? shapeLounge(this.rng, this.usedSizes);
      if (lounge) return lounge;
    }
    if (this.rooms.length >= 2 && !this.hasSmallRoom() && this.profile.pickMode !== "open") {
      const narrow = shapeNarrow(this.rng, this.usedSizes);
      if (narrow) return narrow;
    }

    let shape = pickZoneRoomShape(this.rng, this.usedSizes, this.profile.pickMode, ratio);

    if (shape && this.rooms.length >= 1 && ratio < 0.72 && this.profile.pickMode !== "open") {
      const last = this.rooms[this.rooms.length - 1];
      const lastArea = last.cells?.length ?? 0;
      const nextArea = shape.cells?.length ?? shape.w * shape.h;
      const similar = Math.abs(lastArea - nextArea) < 10;
      if (similar) {
        const contrast =
          lastArea >= 28
            ? shapeNarrow(this.rng, this.usedSizes) ?? pickCompactRoomShape(this.rng, this.usedSizes)
            : pickZoneRoomShape(this.rng, this.usedSizes, "lounge", ratio);
        if (contrast && contrast.cells?.length !== nextArea) shape = contrast;
      }
    }

    return shape;
  }

  generate(grid) {
    this.rooms = [];
    this.usedSizes = new Set();
    let id = 0;
    const targetFill = this.profile.targetFill;

    const seedShape = pickZoneSeedShape(this.rng, this.usedSizes, this.profile.seedMode);
    if (!this.tryPlace(grid, seedShape, id++, false)) {
      this.tryPlace(grid, pickZoneSeedShape(this.rng, this.usedSizes, "compact"), id++, false);
    }

    let fails = 0;
    while (fillRatio(grid) < targetFill && fails < MAX_PACK_ATTEMPTS) {
      const ratio = fillRatio(grid);
      let placed = false;
      for (let t = 0; t < 12; t++) {
        const shape = this.pickNextShape(ratio);
        if (!shape) continue;
        const room = this.tryPlace(grid, shape, id, true);
        if (room) {
          id++;
          fails = 0;
          placed = true;
          break;
        }
      }
      if (!placed) fails++;
    }

    if (!this.rooms.length) {
      const shape = pickZoneSeedShape(this.rng, new Set(), this.profile.seedMode);
      const ox = MARGIN;
      const oz = MARGIN;
      grid.stampCells(shape.cells, ox, oz, CELL_FLOOR, 0);
      this.placeRoom(shape, ox, oz, 0);
    }

    return this.rooms;
  }
}

export function createZonePacker(rng, zoneType) {
  return new ZoneRoomPacker(rng, getZoneProfile(zoneType));
}
