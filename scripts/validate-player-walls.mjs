/**
 * Player-perspective Step 1 validation — 100 random rooms, all corners.
 *
 * Usage:
 *   node scripts/validate-player-walls.mjs
 *   ROOMS=100 SEED=42 CAPTURE=1 node scripts/validate-player-walls.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { generateRoom } from "../src/room.js";
import { inspectRoomPlayerWalls, PLAYER_WALL_FAIL } from "../src/mapgen/walls/WallPlayerQA.js";

const ROOM_COUNT = Number(process.env.ROOMS ?? 100);
const SEED = Number(process.env.SEED ?? 20260611);
const DO_CAPTURE = process.env.CAPTURE !== "0";
const PORT = Number(process.env.PORT ?? 5199);
const OUT_DIR = process.env.OUT_DIR ?? "/opt/cursor/artifacts/player-wall-qa";
const REPORT_PATH = join(OUT_DIR, "report.json");
const SUMMARY_PATH = join(OUT_DIR, "summary.md");

function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomRoomCoords(n, seed) {
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

function issueKey(issue) {
  return issue.kind ?? issue.qaKind ?? "unknown";
}

async function captureCorners(browser, shots) {
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
await mkdir(join(OUT_DIR, "screenshots", "failures"), { recursive: true });
await mkdir(join(OUT_DIR, "screenshots", "corners"), { recursive: true });

const coords = randomRoomCoords(ROOM_COUNT, SEED);
const report = {
  seed: SEED,
  roomCount: ROOM_COUNT,
  failKinds: Object.values(PLAYER_WALL_FAIL),
  rooms: [],
  totals: { rooms: 0, passed: 0, failed: 0, corners: 0, issues: 0 },
};

const captureQueue = [];
let browser = null;

if (DO_CAPTURE) {
  const { chromium } = await import("playwright");
  browser = await chromium.launch({ headless: true });
}

for (let ri = 0; ri < coords.length; ri++) {
  const { cx, cz } = coords[ri];
  const room = generateRoom(cx, cz);
  const result = inspectRoomPlayerWalls(room, cx, cz);
  const roomEntry = {
    index: ri,
    cx,
    cz,
    pass: result.pass,
    cornerCount: result.corners.length,
    issues: result.issues,
    stats: result.stats,
    corners: result.corners,
  };
  report.rooms.push(roomEntry);
  report.totals.rooms++;
  report.totals.corners += result.corners.length;
  report.totals.issues += result.issues.length;
  if (result.pass) report.totals.passed++;
  else report.totals.failed++;

  const roomDir = `r${String(ri).padStart(3, "0")}_cx${cx}_cz${cz}`;
  for (let ci = 0; ci < result.corners.length; ci++) {
    const c = result.corners[ci];
    const sub = result.pass ? "corners" : "failures";
    const fname = `${roomDir}_c${String(ci).padStart(2, "0")}_${c.shape ?? "?"}.png`;
    captureQueue.push({
      cx,
      cz,
      camX: c.camX,
      camY: c.camY,
      camZ: c.camZ,
      lookX: c.lookX,
      lookY: c.lookY,
      lookZ: c.lookZ,
      path: join(OUT_DIR, "screenshots", sub, fname),
      pass: result.pass,
    });
  }

  if ((ri + 1) % 10 === 0) {
    process.stdout.write(`\rinspected ${ri + 1}/${ROOM_COUNT} rooms...`);
  }
}

process.stdout.write(`\rinspected ${ROOM_COUNT}/${ROOM_COUNT} rooms.\n`);

if (browser && captureQueue.length) {
  console.log(`capturing ${captureQueue.length} corner screenshots...`);
  const batchSize = 50;
  for (let i = 0; i < captureQueue.length; i += batchSize) {
    await captureCorners(browser, captureQueue.slice(i, i + batchSize));
    process.stdout.write(`\rcaptured ${Math.min(i + batchSize, captureQueue.length)}/${captureQueue.length}`);
  }
  process.stdout.write("\n");
  await browser.close();
}

const failByKind = {};
for (const room of report.rooms) {
  if (room.pass) continue;
  for (const issue of room.issues) {
    const k = issueKey(issue);
    failByKind[k] = (failByKind[k] ?? 0) + 1;
  }
}

report.failByKind = failByKind;
report.step1Pass = report.totals.failed === 0;

await writeFile(REPORT_PATH, JSON.stringify(report, null, 2));

const lines = [
  "# Step 1 Player-Perspective Wall QA",
  "",
  `- **Seed**: ${SEED}`,
  `- **Rooms**: ${ROOM_COUNT}`,
  `- **Corners captured**: ${report.totals.corners}`,
  `- **Rooms passed**: ${report.totals.passed}/${report.totals.rooms}`,
  `- **Step 1 result**: ${report.step1Pass ? "PASS" : "FAIL"}`,
  "",
];

if (!report.step1Pass) {
  lines.push("## Failures by kind", "");
  for (const [k, n] of Object.entries(failByKind).sort((a, b) => b[1] - a[1])) {
    lines.push(`- \`${k}\`: ${n}`);
  }
  lines.push("", "## Failed rooms", "");
  for (const room of report.rooms.filter((r) => !r.pass)) {
    lines.push(`- room ${room.index} (cx=${room.cx}, cz=${room.cz}): ${room.issues.map(issueKey).join(", ")}`);
  }
}

lines.push("", "## Checklist", "");
const checklist = [
  ["wall_overlap", "벽이 서로 겹침"],
  ["wall_protrusion", "벽 끝이 튀어나옴"],
  ["wall_gap", "벽 사이 틈"],
  ["wall_thickness_mismatch", "벽 두께 불일치"],
  ["floor_wall_gap", "바닥-벽 틈"],
  ["ceiling_wall_gap", "천장-벽 틈"],
  ["abnormal_corner_face", "코너 비정상 면"],
  ["wallpaper_uv_break", "벽지 패턴 끊김"],
  ["z_fighting", "Z-fighting"],
  ["flipped_normal", "Normal 뒤집힘"],
  ["stair_corner_player_view", "코너 계단 현상"],
];
for (const [key, label] of checklist) {
  const n = failByKind[key] ?? 0;
  lines.push(`- [${n === 0 ? "x" : " "}] ${label} (\`${key}\`) — ${n} hits`);
}

await writeFile(SUMMARY_PATH, lines.join("\n"));

console.log("=== STEP 1 PLAYER QA ===");
console.log(`rooms: ${report.totals.passed}/${report.totals.rooms} passed`);
console.log(`corners: ${report.totals.corners}`);
console.log(`step1: ${report.step1Pass ? "PASS" : "FAIL"}`);
if (!report.step1Pass) console.log("failByKind:", failByKind);
console.log(`report: ${REPORT_PATH}`);
console.log(`summary: ${SUMMARY_PATH}`);

process.exit(report.step1Pass ? 0 : 1);
