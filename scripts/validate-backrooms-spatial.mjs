/**
 * Step 2 — Backrooms spatial feel validation (100 random maps + player captures).
 *
 *   node scripts/validate-backrooms-spatial.mjs
 *   MAPS=100 SEED=20260613 CAPTURE=1 node scripts/validate-backrooms-spatial.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { generateRoom } from "../src/room.js";
import {
  aggregateSpatialStats,
  collectSpatialCameraPoses,
  evaluateSpatialFeel,
  ORTHO_SHAPES,
  SPATIAL_FAIL,
} from "../src/mapgen/RoomSpatialQA.js";

const MAP_COUNT = Number(process.env.MAPS ?? 100);
const SEED = Number(process.env.SEED ?? 20260613);
const DO_CAPTURE = process.env.CAPTURE !== "0";
const PORT = Number(process.env.PORT ?? 5199);
const OUT_DIR = process.env.OUT_DIR ?? "/opt/cursor/artifacts/backrooms-spatial-qa";

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomCoords(n, seed) {
  const rng = mulberry32(seed);
  const coords = [];
  const seen = new Set();
  while (coords.length < n) {
    const cx = Math.floor(rng() * 180) - 90;
    const cz = Math.floor(rng() * 180) - 90;
    const k = `${cx},${cz}`;
    if (seen.has(k)) continue;
    seen.add(k);
    coords.push({ cx, cz });
  }
  return coords;
}

const CHECK_LABELS = {
  corridor_dominant: "복도보다 방이 더 많이 보이는가",
  long_corridor_repeat: "긴 직선 복도가 반복되지 않는가",
  same_size_consecutive: "같은 크기의 방이 연속 반복되지 않는가",
  no_lounge: "라운지가 자연스럽게 등장하는가",
  no_size_mix: "좁은 방과 넓은 방이 적절히 섞이는가",
  low_novelty: "플레이어가 계속 새로운 공간으로 들어가는 느낌",
  dungeon_like: "던전이 아니라 Backrooms처럼 방이 이어지는 구조",
};

async function captureShots(browser, shots) {
  if (!shots.length) return;
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  for (const shot of shots) {
    const q = new URLSearchParams({
      cx: String(shot.cx),
      cz: String(shot.cz),
      camX: String(shot.camX),
      camY: String(shot.camY),
      camZ: String(shot.camZ),
      lookX: String(shot.lookX),
      lookY: String(shot.lookY),
      lookZ: String(shot.lookZ),
    });
    await page.goto(`http://127.0.0.1:${PORT}/player-wall-qa.html?${q}`, {
      waitUntil: "domcontentloaded",
    });
    await page.waitForFunction(() => window.__PLAYER_WALL_QA__?.ready, null, { timeout: 60000 });
    await page.screenshot({ path: shot.path, fullPage: false });
  }
  await page.close();
}

await mkdir(OUT_DIR, { recursive: true });
await mkdir(join(OUT_DIR, "screenshots"), { recursive: true });
await mkdir(join(OUT_DIR, "screenshots", "maps"), { recursive: true });
await mkdir(join(OUT_DIR, "screenshots", "shapes"), { recursive: true });

const coords = randomCoords(MAP_COUNT, SEED);
const chunkResults = [];
const failCounts = {};
const captureQueue = [];
const shapeExemplars = new Map();

let browser = null;
if (DO_CAPTURE) {
  const { chromium } = await import("playwright");
  browser = await chromium.launch({ headless: true });
}

for (let i = 0; i < coords.length; i++) {
  const { cx, cz } = coords[i];
  const room = generateRoom(cx, cz);
  const spatial = room.spatial;
  if (!spatial) {
    chunkResults.push({ index: i, cx, cz, pass: false, spatial: null, issues: [{ kind: "no_spatial" }] });
    continue;
  }

  const evalResult = evaluateSpatialFeel(spatial);
  for (const issue of evalResult.issues) {
    failCounts[issue.kind] = (failCounts[issue.kind] ?? 0) + 1;
  }

  chunkResults.push({
    index: i,
    cx,
    cz,
    pass: evalResult.pass,
    spatial,
    issues: evalResult.issues,
    roomKinds: spatial.kinds,
  });

  const poses = collectSpatialCameraPoses(room);
  const primary = poses[0];
  if (primary) {
    captureQueue.push({
      ...primary,
      cx,
      cz,
      path: join(OUT_DIR, "screenshots", "maps", `map_${String(i).padStart(3, "0")}_cx${cx}_cz${cz}.png`),
    });
  }

  for (const p of poses) {
    if (!ORTHO_SHAPES.has(p.zoneKind) && p.tag !== "narrow" && p.tag !== "lounge") continue;
    const key = p.zoneKind ?? p.tag;
    if (!shapeExemplars.has(key)) {
      shapeExemplars.set(key, {
        ...p,
        cx,
        cz,
        path: join(OUT_DIR, "screenshots", "shapes", `shape_${key}.png`),
      });
    }
  }
}

const aggregate = aggregateSpatialStats(chunkResults.filter((c) => c.spatial));
const passedChunks = chunkResults.filter((c) => c.pass).length;
const orthoOK = aggregate.orthoShapesMissing.length === 0;

const criteria = {
  rooms_over_corridors: {
    label: CHECK_LABELS.corridor_dominant,
    pass: (failCounts[SPATIAL_FAIL.CORRIDOR_DOMINANT] ?? 0) === 0,
    fails: failCounts[SPATIAL_FAIL.CORRIDOR_DOMINANT] ?? 0,
  },
  no_long_corridor_repeat: {
    label: CHECK_LABELS.long_corridor_repeat,
    pass: (failCounts[SPATIAL_FAIL.LONG_CORRIDOR_REPEAT] ?? 0) === 0,
    fails: failCounts[SPATIAL_FAIL.LONG_CORRIDOR_REPEAT] ?? 0,
    maxCorridorM: aggregate.maxLongestCorridorM,
  },
  no_same_size_consecutive: {
    label: CHECK_LABELS.same_size_consecutive,
    pass: (failCounts[SPATIAL_FAIL.SAME_SIZE_CONSECUTIVE] ?? 0) === 0,
    fails: failCounts[SPATIAL_FAIL.SAME_SIZE_CONSECUTIVE] ?? 0,
  },
  lounge_natural: {
    label: CHECK_LABELS.no_lounge,
    pass: (failCounts[SPATIAL_FAIL.NO_LOUNGE] ?? 0) === 0,
    fails: failCounts[SPATIAL_FAIL.NO_LOUNGE] ?? 0,
    loungeProbability: aggregate.loungeChunkProbability,
  },
  narrow_wide_mix: {
    label: CHECK_LABELS.no_size_mix,
    pass: (failCounts[SPATIAL_FAIL.NO_SIZE_MIX] ?? 0) === 0,
    fails: failCounts[SPATIAL_FAIL.NO_SIZE_MIX] ?? 0,
  },
  ortho_shapes_generated: {
    label: "ㄱ, ㄷ, ㄹ, T, 십자형 방이 실제로 생성되는가",
    pass: orthoOK,
    seen: aggregate.orthoShapesSeen,
    missing: aggregate.orthoShapesMissing,
  },
  novelty_feel: {
    label: CHECK_LABELS.low_novelty,
    pass: (failCounts[SPATIAL_FAIL.LOW_NOVELTY] ?? 0) === 0,
    fails: failCounts[SPATIAL_FAIL.LOW_NOVELTY] ?? 0,
  },
  backrooms_structure: {
    label: CHECK_LABELS.dungeon_like,
    pass: (failCounts[SPATIAL_FAIL.DUNGEON_LIKE] ?? 0) === 0,
    fails: failCounts[SPATIAL_FAIL.DUNGEON_LIKE] ?? 0,
    avgDirectRatio: aggregate.avgRoomToRoomDirectRatio,
  },
};

const allCriteriaPass = Object.values(criteria).every((c) => c.pass);
const pass = allCriteriaPass && passedChunks === MAP_COUNT;

const report = {
  seed: SEED,
  mapCount: MAP_COUNT,
  passedChunks,
  pass,
  criteria,
  statistics: {
    roomCountDistribution: aggregate.roomCountDistribution,
    roomSizeDistribution: aggregate.roomSizeDistribution,
    shapeKindRatio: aggregate.shapeKindRatio,
    avgRoomAreaM2: aggregate.avgRoomAreaM2,
    corridorAreaRatio: aggregate.avgCorridorLikeRatio,
    loungeAppearanceProbability: aggregate.loungeChunkProbability,
    roomToRoomDirectConnectionRatio: aggregate.avgRoomToRoomDirectRatio,
    longestConsecutiveCorridorM: aggregate.maxLongestCorridorM,
  },
  chunks: chunkResults,
  screenshots: {
    maps: captureQueue.length,
    shapes: [...shapeExemplars.values()].map((s) => s.path),
  },
};

if (DO_CAPTURE && browser) {
  await captureShots(browser, captureQueue);
  await captureShots(browser, [...shapeExemplars.values()]);
  await browser.close();
}

const summary = `# Backrooms Spatial QA (Step 2)

- **Maps:** ${MAP_COUNT} (seed ${SEED})
- **Chunks passed:** ${passedChunks}/${MAP_COUNT}
- **Overall:** ${pass ? "PASS" : "FAIL"}

## Criteria

| Check | Result |
|-------|--------|
${Object.entries(criteria)
  .map(([k, c]) => `| ${c.label} | ${c.pass ? "PASS" : "FAIL"} |`)
  .join("\n")}

## Statistics

| Metric | Value |
|--------|-------|
| Room count distribution | ${JSON.stringify(aggregate.roomCountDistribution)} |
| Avg room area | ${aggregate.avgRoomAreaM2.toFixed(1)} m² |
| Corridor-like area ratio (avg) | ${(aggregate.avgCorridorLikeRatio * 100).toFixed(1)}% |
| Lounge chunk probability | ${(aggregate.loungeChunkProbability * 100).toFixed(1)}% |
| Room→room direct connection ratio | ${(aggregate.avgRoomToRoomDirectRatio * 100).toFixed(1)}% |
| Longest straight corridor | ${aggregate.maxLongestCorridorM.toFixed(1)} m |
| Shape kind ratio | ${JSON.stringify(aggregate.shapeKindRatio, null, 0)} |

## Ortho shapes seen

${aggregate.orthoShapesSeen.join(", ") || "none"}
${aggregate.orthoShapesMissing.length ? `\n**Missing:** ${aggregate.orthoShapesMissing.join(", ")}` : ""}

## Screenshots

- Maps: \`${OUT_DIR}/screenshots/maps/\` (${captureQueue.length} captures)
- Shape exemplars: \`${OUT_DIR}/screenshots/shapes/\`
`;

await writeFile(join(OUT_DIR, "report.json"), JSON.stringify(report, null, 2));
await writeFile(join(OUT_DIR, "summary.md"), summary);

console.log("=== BACKROOMS SPATIAL QA ===");
console.log(JSON.stringify({ pass, passedChunks, mapCount: MAP_COUNT, criteria: Object.fromEntries(
  Object.entries(criteria).map(([k, v]) => [k, v.pass]),
) }, null, 2));
console.log("\n--- Statistics ---");
console.log(JSON.stringify(report.statistics, null, 2));
console.log("\nSaved:", join(OUT_DIR, "report.json"));

if (!pass) {
  console.error("FAIL — see", join(OUT_DIR, "summary.md"));
  process.exit(1);
}
console.log("PASS");
