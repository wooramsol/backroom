/**
 * Step 3 — zone cluster validation.
 */
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { generateRoom, getSharedDoor } from "../src/room.js";
import { buildZoneMap } from "../src/zones/index.js";
import { createRng } from "../src/rng.js";
import { ZONE_TYPES } from "../src/zones/ZoneTypes.js";
import { getMacroZoneAt, sampleZoneField } from "../src/zones/ZoneClusterField.js";

const OUT_DIR = process.env.OUT_DIR ?? "/opt/cursor/artifacts/zone-qa";
const SEED = Number(process.env.SEED ?? 20260614);

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(SEED);
const coords = [];
const seen = new Set();
while (coords.length < 100) {
  const cx = Math.floor(rng() * 120) - 60;
  const cz = Math.floor(rng() * 120) - 60;
  const k = `${cx},${cz}`;
  if (seen.has(k)) continue;
  seen.add(k);
  coords.push({ cx, cz });
}

const zoneCounts = {};
const profileStats = {};
let sameNeighbor = 0;
let neighborTotal = 0;
let transitions = 0;
let validationOk = 0;
const zoneTypesSeen = new Set();

for (const { cx, cz } of coords) {
  const macro = getMacroZoneAt(cx, cz);
  zoneCounts[macro.type] = (zoneCounts[macro.type] ?? 0) + 1;
  zoneTypesSeen.add(macro.type);

  for (const [dx, dz] of [[1, 0], [0, 1]]) {
    const nb = getMacroZoneAt(cx + dx, cz + dz);
    neighborTotal++;
    if (nb.type === macro.type) sameNeighbor++;
    else transitions++;
  }

  const doors = {
    north: getSharedDoor(cx, cz, cx, cz - 1),
    south: getSharedDoor(cx, cz, cx, cz + 1),
    east: getSharedDoor(cx, cz, cx + 1, cz),
    west: getSharedDoor(cx, cz, cx - 1, cz),
  };
  const map = buildZoneMap(cx, cz, doors, createRng(cx, cz, SEED));
  if (map.validation?.ok) validationOk++;

  const zt = map.zoneType;
  if (!profileStats[zt]) {
    profileStats[zt] = { rooms: [], fill: [], direct: [] };
  }
  profileStats[zt].rooms.push(map.rooms?.length ?? 0);
  profileStats[zt].fill.push(map.metrics?.spatial?.roomFloorRatio ?? 0);
  profileStats[zt].direct.push(map.metrics?.spatial?.roomToRoomDirectRatio ?? 0);

  const room = generateRoom(cx, cz);
  if (room.zoneType !== macro.type) {
    console.warn("zone mismatch", cx, cz, room.zoneType, macro.type);
  }
}

const clusterCohesion = neighborTotal ? sameNeighbor / neighborTotal : 0;
const avgByZone = {};
for (const [zt, s] of Object.entries(profileStats)) {
  const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);
  avgByZone[zt] = {
    avgRooms: avg(s.rooms),
    avgRoomFloor: avg(s.fill),
    avgDirect: avg(s.direct),
    samples: s.rooms.length,
  };
}

const report = {
  seed: SEED,
  chunks: coords.length,
  validationOk,
  clusterCohesion,
  boundaryTransitions: transitions,
  zoneTypeCounts: zoneCounts,
  zoneTypesSeen: [...zoneTypesSeen].sort(),
  zoneTypesMissing: ZONE_TYPES.filter((z) => !zoneTypesSeen.has(z)),
  profileDifferentiation: avgByZone,
  sampleField: sampleZoneField(-20, -20, 40, 40),
  pass:
    validationOk >= 95 &&
    clusterCohesion >= 0.72 &&
    zoneTypesSeen.size >= ZONE_TYPES.length &&
    Object.keys(avgByZone).length >= 4,
};

console.log("=== ZONE CLUSTER QA ===");
console.log(JSON.stringify(report, null, 2));

await mkdir(OUT_DIR, { recursive: true });
await writeFile(join(OUT_DIR, "report.json"), JSON.stringify(report, null, 2));

if (!report.pass) process.exit(1);
console.log("PASS");
