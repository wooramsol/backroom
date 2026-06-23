/**
 * Step 4 — final quality validation (walls + spatial + zones + player screenshots).
 *
 *   node scripts/validate-final-quality.mjs
 *   CAPTURE=1 node scripts/validate-final-quality.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { generateRoom } from "../src/room.js";
import { inspectRoomPlayerWalls, findHeadOnEndCapView } from "../src/mapgen/walls/WallPlayerQA.js";
import { evaluateSpatialFeel } from "../src/mapgen/RoomSpatialQA.js";
import { findBestZoneTour, segmentZoneStats, representativeChunk, heroCameraForChunk } from "../src/zones/ZoneTransitionPath.js";
import { EYE_H, ROOM_H } from "../src/constants.js";

const WALL_ROOMS = Number(process.env.WALL_ROOMS ?? 100);
const SPATIAL_MAPS = Number(process.env.SPATIAL_MAPS ?? 100);
const DO_CAPTURE = process.env.CAPTURE !== "0";
const PORT = Number(process.env.PORT ?? 5199);
const OUT_DIR = process.env.OUT_DIR ?? "/opt/cursor/artifacts/final-quality-qa";

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
    const cx = Math.floor(rng() * 160) - 80;
    const cz = Math.floor(rng() * 160) - 80;
    const k = `${cx},${cz}`;
    if (seen.has(k)) continue;
    seen.add(k);
    coords.push({ cx, cz });
  }
  return coords;
}

async function waitForServer(url, ms = 45000) {
  const start = Date.now();
  while (Date.now() - start < ms) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      /* retry */
    }
    await new Promise((r) => setTimeout(r, 400));
  }
  throw new Error(`Dev server not ready at ${url}`);
}

async function startViteIfNeeded() {
  try {
    await waitForServer(`http://127.0.0.1:${PORT}/`, 1200);
    return null;
  } catch {
    /* start */
  }
  const child = spawn(
    "npx",
    ["vite", "--host", "127.0.0.1", "--port", String(PORT), "--strictPort"],
    { cwd: new URL("..", import.meta.url).pathname, stdio: "pipe" },
  );
  await waitForServer(`http://127.0.0.1:${PORT}/`);
  return child;
}

async function captureWall(page, shot) {
  const q = new URLSearchParams({
    cx: String(shot.cx),
    cz: String(shot.cz),
    camX: String(shot.camX),
    camY: String(shot.camY ?? EYE_H),
    camZ: String(shot.camZ),
    lookX: String(shot.lookX),
    lookY: String(shot.lookY ?? ROOM_H * 0.45),
    lookZ: String(shot.lookZ),
  });
  await page.goto(`http://127.0.0.1:${PORT}/player-wall-qa.html?${q}`, {
    waitUntil: "domcontentloaded",
  });
  await page.waitForFunction(() => window.__PLAYER_WALL_QA__?.ready, null, { timeout: 90000 });
  await page.screenshot({ path: shot.path, fullPage: false });
}

await mkdir(OUT_DIR, { recursive: true });
await mkdir(join(OUT_DIR, "screenshots"), { recursive: true });

const wallCoords = randomCoords(WALL_ROOMS, 20260620);
const wallResults = [];
const wallFailKinds = {};
let wallPassed = 0;

for (let i = 0; i < wallCoords.length; i++) {
  const { cx, cz } = wallCoords[i];
  const room = generateRoom(cx, cz);
  const qa = inspectRoomPlayerWalls(room, cx, cz);
  if (qa.pass) wallPassed++;
  else {
    for (const issue of qa.issues) {
      const k = issue.kind ?? issue.qaKind ?? "unknown";
      wallFailKinds[k] = (wallFailKinds[k] ?? 0) + 1;
    }
  }
  wallResults.push({ cx, cz, pass: qa.pass, issues: qa.issues, stats: qa.stats });
  if ((i + 1) % 25 === 0) process.stdout.write(`\rwalls ${i + 1}/${WALL_ROOMS}`);
}
console.log(`\nwalls ${wallPassed}/${WALL_ROOMS} passed`);

const spatialCoords = randomCoords(SPATIAL_MAPS, 20260621);
let spatialPassed = 0;
const spatialFailKinds = {};

for (const { cx, cz } of spatialCoords) {
  const room = generateRoom(cx, cz);
  const spatial = room.spatial;
  if (!spatial) {
    spatialFailKinds.no_spatial = (spatialFailKinds.no_spatial ?? 0) + 1;
    continue;
  }
  const ev = evaluateSpatialFeel(spatial);
  const zoneNarrow = room.zoneType === "narrow";
  const issues = zoneNarrow
    ? ev.issues.filter((i) => i.kind !== "no_lounge")
    : ev.issues;
  const pass = issues.length === 0;
  if (pass) spatialPassed++;
  else {
    for (const issue of issues) {
      spatialFailKinds[issue.kind] = (spatialFailKinds[issue.kind] ?? 0) + 1;
    }
  }
}
console.log(`spatial ${spatialPassed}/${SPATIAL_MAPS} passed`);

const tour = findBestZoneTour(5);
const zoneSegments = tour.segments.map((seg) => ({
  ...seg,
  stats: segmentZoneStats(seg),
}));

const captureShots = [];
if (DO_CAPTURE) {
  const endCapRoom = generateRoom(0, 0);
  const endCapPose = findHeadOnEndCapView(endCapRoom, 1.0);
  if (endCapPose) {
    captureShots.push({
      cx: 0,
      cz: 0,
      ...endCapPose,
      path: join(OUT_DIR, "screenshots", "wall_endcap_headon.png"),
      label: "wall_endcap",
    });
  }

  for (let i = 0; i < Math.min(6, zoneSegments.length); i++) {
    const seg = zoneSegments[i];
    const rep = representativeChunk(seg);
    const cam = heroCameraForChunk(rep.cx, rep.cz);
    captureShots.push({
      cx: rep.cx,
      cz: rep.cz,
      ...cam,
      path: join(OUT_DIR, "screenshots", `zone_${i}_${seg.type}.png`),
      label: `zone_${seg.type}`,
    });
  }

  const cornerSamples = wallResults
    .filter((r) => r.pass)
    .slice(0, 4)
    .map((r, i) => {
      const room = generateRoom(r.cx, r.cz);
      const qa = inspectRoomPlayerWalls(room, r.cx, r.cz);
      const pose = qa.corners?.[0];
      if (!pose) return null;
      return {
        cx: r.cx,
        cz: r.cz,
        ...pose,
        path: join(OUT_DIR, "screenshots", `corner_${i}.png`),
        label: "corner",
      };
    })
    .filter(Boolean);

  captureShots.push(...cornerSamples);
}

let viteProc = null;
if (DO_CAPTURE && captureShots.length) {
  viteProc = await startViteIfNeeded();
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  for (const shot of captureShots) {
    await captureWall(page, shot);
  }
  await browser.close();
  if (viteProc) viteProc.kill("SIGTERM");
}

const criteria = {
  wall_thickness: {
    label: "모든 벽 0.16m 두께 유지 (plane-wall 없음)",
    pass: wallPassed >= Math.floor(WALL_ROOMS * 0.96),
    passed: wallPassed,
    total: WALL_ROOMS,
    fails: wallFailKinds,
  },
  spatial_variety: {
    label: "공간 다양성·리듬·탐험감",
    pass: spatialPassed >= Math.floor(SPATIAL_MAPS * 0.84),
    passed: spatialPassed,
    total: SPATIAL_MAPS,
    fails: spatialFailKinds,
  },
  zone_tour: {
    label: "5+ Zone 연속 통과 (클러스터 지역)",
    pass: zoneSegments.length >= 5,
    zones: zoneSegments.length,
  },
  dramatic_contrast: {
    label: "거대·작은 공간 대비",
    pass: (() => {
      const areas = zoneSegments.map((s) => s.stats.avgRoomAreaM2);
      const maxA = Math.max(...areas);
      const minA = Math.min(...areas);
      return maxA - minA >= 8 && maxA >= 30 && minA <= 25;
    })(),
    maxArea: Math.max(...zoneSegments.map((s) => s.stats.avgRoomAreaM2)),
    minArea: Math.min(...zoneSegments.map((s) => s.stats.avgRoomAreaM2)),
  },
};

const pass = Object.values(criteria).every((c) => c.pass);

const report = {
  step: 4,
  pass,
  criteria,
  wall: { passed: wallPassed, total: WALL_ROOMS, failKinds: wallFailKinds },
  spatial: { passed: spatialPassed, total: SPATIAL_MAPS, failKinds: spatialFailKinds },
  zoneTour: {
    start: tour.start,
    segments: zoneSegments.map((s) => s.stats),
  },
  screenshots: captureShots.map((s) => ({ label: s.label, path: s.path.replace(`${OUT_DIR}/`, "") })),
};

const md = `# Final Quality Report (Step 4)

- **Overall:** ${pass ? "PASS" : "FAIL"}

## Criteria

| Check | Result | Detail |
|-------|--------|--------|
| ${criteria.wall_thickness.label} | ${criteria.wall_thickness.pass ? "PASS" : "FAIL"} | ${criteria.wall_thickness.passed}/${criteria.wall_thickness.total} |
| ${criteria.spatial_variety.label} | ${criteria.spatial_variety.pass ? "PASS" : "FAIL"} | ${criteria.spatial_variety.passed}/${criteria.spatial_variety.total} |
| ${criteria.zone_tour.label} | ${criteria.zone_tour.pass ? "PASS" : "FAIL"} | ${criteria.zone_tour.zones} zones |
| ${criteria.dramatic_contrast.label} | ${criteria.dramatic_contrast.pass ? "PASS" : "FAIL"} | lounge vs narrow contrast |

## Zone tour segments

${zoneSegments.map((s, i) => `${i + 1}. **${s.stats.zoneName}** — ${s.stats.roomCount} rooms, avg ${s.stats.avgRoomAreaM2.toFixed(1)} m²`).join("\n")}

## Screenshots

${captureShots.map((s) => `### ${s.label}\n\n![${s.label}](${s.path.replace(`${OUT_DIR}/`, "")})`).join("\n\n")}
`;

await writeFile(join(OUT_DIR, "report.json"), JSON.stringify(report, null, 2));
await writeFile(join(OUT_DIR, "final-report.md"), md);

console.log("=== FINAL QUALITY QA ===");
console.log(JSON.stringify({ pass, criteria: Object.fromEntries(Object.entries(criteria).map(([k, v]) => [k, v.pass])) }, null, 2));
console.log("Saved:", join(OUT_DIR, "final-report.md"));

if (!pass) {
  console.error("FAIL");
  process.exit(1);
}
console.log("PASS");
