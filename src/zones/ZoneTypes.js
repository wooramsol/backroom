/**
 * Step 3 — macro zone types (clustered, not per-chunk random).
 * Each profile drives packer shape weights, fill, and connection style.
 */

export const ZONE_TYPES = [
  "small_room",
  "large_lounge",
  "long_room",
  "dense_maze",
  "open",
  "narrow",
];

/** @typedef {import('./zoneShapes.js').ZoneShapePickers} ZoneShapePickers */

/**
 * @typedef {object} ZoneProfile
 * @property {string} id
 * @property {string} label
 * @property {number} targetFill
 * @property {number} extraLoopChance
 * @property {number} minRooms
 * @property {string} seedMode
 * @property {string} pickMode
 */

/** @type {Record<string, ZoneProfile>} */
export const ZONE_PROFILES = {
  small_room: {
    id: "small_room",
    label: "Small Room Zone",
    targetFill: 0.91,
    extraLoopChance: 0.4,
    minRooms: 6,
    seedMode: "compact",
    pickMode: "small",
  },
  large_lounge: {
    id: "large_lounge",
    label: "Large Lounge Zone",
    targetFill: 0.56,
    extraLoopChance: 0.14,
    minRooms: 2,
    seedMode: "lounge",
    pickMode: "lounge",
  },
  long_room: {
    id: "long_room",
    label: "Long Room Zone",
    targetFill: 0.68,
    extraLoopChance: 0.22,
    minRooms: 2,
    seedMode: "long",
    pickMode: "long",
  },
  dense_maze: {
    id: "dense_maze",
    label: "Dense Maze Zone",
    targetFill: 0.9,
    extraLoopChance: 0.54,
    minRooms: 6,
    seedMode: "compact",
    pickMode: "maze",
  },
  open: {
    id: "open",
    label: "Open Zone",
    targetFill: 0.46,
    extraLoopChance: 0.12,
    minRooms: 1,
    seedMode: "lounge",
    pickMode: "open",
  },
  narrow: {
    id: "narrow",
    label: "Narrow Zone",
    targetFill: 0.86,
    extraLoopChance: 0.32,
    minRooms: 5,
    seedMode: "narrow",
    pickMode: "narrow",
  },
};

export function getZoneProfile(zoneType) {
  return ZONE_PROFILES[zoneType] ?? ZONE_PROFILES.open;
}
