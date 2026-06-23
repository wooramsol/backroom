/**
 * Step 2 — room generator validation (wall mesh untouched).
 */
import { writeFile, mkdir } from "node:fs/promises";
import { join } from "node:path";
import { generateRoom, getSharedDoor } from "../src/room.js";
import { createRng } from "../src/rng.js";
import { buildGridMap } from "../src/mapgen/MapGenerator.js";
import { CHUNK } from "../src/constants.js";

const SEED_BASE = Number(process.env.SEED ?? 20260612);
const COUNT = Number(process.env.COUNT ?? 80);
const OUT_DIR = process.env.OUT_DIR ?? "/opt/cursor/artifacts/room-gen-qa";

const failures = [];
const kindHist = {};
let totalRooms = 0;
let duplicateSizes = 0;
let roomsWithoutEntrance = 0;
let validationFails = 0;
let navFails = 0;

function chunkDoors(cx, cz) {
  return {
    north: getSharedDoor(cx, cz, cx, cz - 1),
    south: getSharedDoor(cx, cz, cx, cz + 1),
    east: getSharedDoor(cx, cz, cx + 1, cz),
    west: getSharedDoor(cx, cz, cx - 1, cz),
  };
}

for (let i = 0; i < COUNT; i++) {
  const cx = (SEED_BASE + i * 17) % 97;
  const cz = (SEED_BASE + i * 31) % 89;
  const doors = chunkDoors(cx, cz);
  const rng = createRng(cx, cz, SEED_BASE);
  const map = buildGridMap(doors, rng);

  if (!map.validation?.ok) validationFails++;

  const rooms = map.rooms ?? [];
  totalRooms += rooms.length;

  const sizes = rooms.map((r) => r.sizeKey).filter(Boolean);
  if (new Set(sizes).size < sizes.length) duplicateSizes++;

  const openings = map.metrics?.openings;
  if (!map.metrics?.roomSpace || !map.metrics?.corridorBudget) {
    failures.push({ cx, cz, reason: "metrics", metrics: map.metrics });
  }

  if (openings instanceof Map) {
    for (const room of rooms) {
      const n = openings.get(room.id) ?? 0;
      if (rooms.length > 1 && n < 1) roomsWithoutEntrance++;
      kindHist[room.kind] = (kindHist[room.kind] ?? 0) + 1;
    }
  }

  if (rooms.length < 2) {
    failures.push({ cx, cz, reason: "few_rooms", count: rooms.length });
  }
}

const report = {
  chunks: COUNT,
  validationFails,
  navFails,
  totalRooms,
  avgRoomsPerChunk: totalRooms / COUNT,
  duplicateSizeChunks: duplicateSizes,
  roomsWithoutEntrance,
  kindHistogram: kindHist,
  pass:
    validationFails === 0 &&
    roomsWithoutEntrance === 0 &&
    duplicateSizes === 0 &&
    failures.length === 0,
};

console.log("=== ROOM GENERATION QA ===");
console.log(JSON.stringify(report, null, 2));

await mkdir(OUT_DIR, { recursive: true });
await writeFile(join(OUT_DIR, "report.json"), JSON.stringify(report, null, 2));

if (!report.pass) {
  console.error("FAIL", failures.slice(0, 10));
  process.exit(1);
}

console.log("PASS");
