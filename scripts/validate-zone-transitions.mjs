/**
 * Step 3 — player zone transition tour (5+ macro zones, screenshots + report).
 *
 *   node scripts/validate-zone-transitions.mjs
 *   CAPTURE=1 PORT=5199 node scripts/validate-zone-transitions.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { CHUNK, EYE_H, ROOM_H } from "../src/constants.js";
import {
  findBestZoneTour,
  segmentZonePath,
  segmentZoneStats,
  representativeChunk,
  heroCameraForChunk,
  boundaryCameras,
  segmentDifferentiation,
  evaluateZoneTransitionTour,
} from "../src/zones/ZoneTransitionPath.js";

const MIN_ZONES = Number(process.env.MIN_ZONES ?? 5);
const DO_CAPTURE = process.env.CAPTURE !== "0";
const PORT = Number(process.env.PORT ?? 5199);
const OUT_DIR = process.env.OUT_DIR ?? "/opt/cursor/artifacts/zone-transition-qa";

const CRITERIA = {
  visual_zone_change: "플레이어가 Zone이 바뀌었다는 것을 시각적으로 느낄 수 있는가",
  distinct_spatial_feel: "각 Zone의 공간감이 서로 명확히 다른가",
  clustered_regions: "Zone이 랜덤이 아니라 하나의 지역처럼 이어지는가",
  natural_boundary: "Zone 경계가 자연스럽게 전환되는가",
};

function rel(p) {
  return p.replace(`${OUT_DIR}/`, "");
}

function formatKinds(dist) {
  return Object.entries(dist)
    .sort((a, b) => b[1] - a[1])
    .map(([k, v]) => `${k}:${v}`)
    .join(", ");
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
    /* start server */
  }

  const child = spawn(
    "npx",
    ["vite", "--host", "127.0.0.1", "--port", String(PORT), "--strictPort"],
    { cwd: new URL("..", import.meta.url).pathname, stdio: "pipe" },
  );
  await waitForServer(`http://127.0.0.1:${PORT}/`);
  return child;
}

async function captureWallQA(page, shot) {
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

async function captureZoneTour(page, shot) {
  const q = new URLSearchParams({
    chunks: shot.chunks,
    camX: String(shot.camX),
    camY: String(shot.camY ?? EYE_H),
    camZ: String(shot.camZ),
    lookX: String(shot.lookX),
    lookY: String(shot.lookY ?? ROOM_H * 0.45),
    lookZ: String(shot.lookZ),
  });
  await page.goto(`http://127.0.0.1:${PORT}/player-zone-tour.html?${q}`, {
    waitUntil: "domcontentloaded",
  });
  await page.waitForFunction(() => window.__PLAYER_ZONE_TOUR__?.ready, null, { timeout: 90000 });
  await page.screenshot({ path: shot.path, fullPage: false });
}

await mkdir(OUT_DIR, { recursive: true });
await mkdir(join(OUT_DIR, "screenshots", "zones"), { recursive: true });
await mkdir(join(OUT_DIR, "screenshots", "boundaries"), { recursive: true });

const tour = findBestZoneTour(MIN_ZONES);
const path = tour.path;
const rawSegments = tour.segments ?? segmentZonePath(path);

const segments = rawSegments.map((seg, index) => {
  const stats = segmentZoneStats(seg);
  const rep = representativeChunk(seg);
  const cam = heroCameraForChunk(rep.cx, rep.cz);
  return {
    index,
    ...seg,
    stats,
    representative: rep,
    heroShot: join(OUT_DIR, "screenshots", "zones", `zone_${index}_${seg.type}.png`),
    camera: cam,
  };
});

const transitions = [];
for (let i = 0; i < segments.length - 1; i++) {
  const a = segments[i];
  const b = segments[i + 1];
  const lastA = a.steps[a.steps.length - 1];
  const firstB = b.steps[0];
  const bc = boundaryCameras(lastA, firstB);
  const diff = segmentDifferentiation(a.stats, b.stats);

  transitions.push({
    index: i,
    from: { type: a.type, label: a.label, clusterId: a.clusterId },
    to: { type: b.type, label: b.label, clusterId: b.clusterId },
    edge: bc.edge,
    chunkA: lastA,
    chunkB: firstB,
    differentiation: diff,
    before: {
      zoneType: a.type,
      clusterId: a.clusterId,
      ...bc.before,
      camY: EYE_H,
      lookY: ROOM_H * 0.45,
      path: join(OUT_DIR, "screenshots", "boundaries", `t${i}_before_${a.type}.png`),
    },
    after: {
      zoneType: b.type,
      clusterId: b.clusterId,
      ...bc.after,
      camY: EYE_H,
      lookY: ROOM_H * 0.45,
      path: join(OUT_DIR, "screenshots", "boundaries", `t${i}_after_${b.type}.png`),
    },
    panorama: {
      chunks: bc.tourChunks,
      camX: bc.tourCam.x,
      camY: bc.tourCam.y,
      camZ: bc.tourCam.z,
      lookX: bc.tourLook.x,
      lookY: bc.tourLook.y,
      lookZ: bc.tourLook.z,
      path: join(OUT_DIR, "screenshots", "boundaries", `t${i}_panorama_${a.type}_to_${b.type}.png`),
    },
  });
}

const evaluation = evaluateZoneTransitionTour(segments, transitions);

const criteria = {
  visual_zone_change: {
    label: CRITERIA.visual_zone_change,
    pass: transitions.every((t) => t.differentiation.visuallyDistinct),
    detail: `${transitions.filter((t) => t.differentiation.visuallyDistinct).length}/${transitions.length} transitions metric-distinct`,
  },
  distinct_spatial_feel: {
    label: CRITERIA.distinct_spatial_feel,
    pass: !evaluation.issues.some((i) => i.startsWith("similar_adjacent")),
    distinctTypes: evaluation.distinctZoneTypes,
  },
  clustered_regions: {
    label: CRITERIA.clustered_regions,
    pass: evaluation.avgChunksPerZone >= 2 && !evaluation.issues.includes("random_like_chunks"),
    avgChunksPerZone: Number(evaluation.avgChunksPerZone.toFixed(2)),
  },
  natural_boundary: {
    label: CRITERIA.natural_boundary,
    pass: !evaluation.issues.includes("same_cluster_boundary"),
    transitionCount: transitions.length,
  },
  min_zones: {
    label: `${MIN_ZONES}개 이상 Zone 연속 통과`,
    pass: segments.length >= MIN_ZONES,
    zonesVisited: segments.length,
  },
};

const pass = evaluation.pass && Object.values(criteria).every((c) => c.pass);

let viteProc = null;
if (DO_CAPTURE) {
  viteProc = await startViteIfNeeded();
  const { chromium } = await import("playwright");
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

  for (const seg of segments) {
    await captureWallQA(page, {
      cx: seg.representative.cx,
      cz: seg.representative.cz,
      ...seg.camera,
      path: seg.heroShot,
    });
  }

  for (const t of transitions) {
    await captureWallQA(page, { ...t.before, path: t.before.path });
    await captureWallQA(page, { ...t.after, path: t.after.path });
    await captureZoneTour(page, { ...t.panorama, path: t.panorama.path });
  }

  await browser.close();
  if (viteProc) viteProc.kill("SIGTERM");
}

const pathSummary = path.map((s) => `(${s.cx},${s.cz}) ${s.zone.type}`).join(" → ");

const report = {
  minZones: MIN_ZONES,
  start: tour.start,
  pathLength: path.length,
  zonesVisited: segments.length,
  distinctZoneTypes: evaluation.distinctZoneTypes,
  pass,
  criteria,
  evaluation,
  path: path.map((s) => ({ cx: s.cx, cz: s.cz, type: s.zone.type, clusterId: s.zone.clusterId })),
  segments: segments.map((s) => ({
    index: s.index,
    zoneName: s.stats.zoneName,
    zoneType: s.stats.zoneType,
    clusterId: s.stats.clusterId,
    chunkCount: s.stats.chunkCount,
    roomCount: s.stats.roomCount,
    avgRoomAreaM2: s.stats.avgRoomAreaM2,
    shapeDistribution: s.stats.shapeDistribution,
    connectionDensity: s.stats.connectionDensity,
    heroScreenshot: rel(s.heroShot),
    representativeChunk: s.representative,
  })),
  transitions: transitions.map((t) => ({
    from: t.from,
    to: t.to,
    edge: t.edge,
    differentiation: t.differentiation,
    screenshots: {
      before: rel(t.before.path),
      after: rel(t.after.path),
      panorama: rel(t.panorama.path),
    },
  })),
};

const zoneTable = segments
  .map(
    (s) =>
      `| ${s.index + 1} | ${s.stats.zoneName} (\`${s.stats.zoneType}\`) | ${s.stats.chunkCount} | ${s.stats.roomCount} | ${s.stats.avgRoomAreaM2.toFixed(1)} | ${(s.stats.connectionDensity * 100).toFixed(0)}% | ${formatKinds(s.stats.shapeDistribution)} |`,
  )
  .join("\n");

const transitionBlocks = transitions
  .map((t) => {
    const d = t.differentiation;
    return `### Transition ${t.index + 1}: ${t.from.label} → ${t.to.label}

- **Edge:** ${t.edge} — chunk (${t.chunkA.cx},${t.chunkA.cz}) → (${t.chunkB.cx},${t.chunkB.cz})
- **Metric delta:** rooms Δ${d.roomDelta}, area Δ${d.areaDelta.toFixed(1)}, conn Δ${(d.connDelta * 100).toFixed(1)}%, shape overlap ${(d.shapeOverlap * 100).toFixed(0)}%
- **Distinct:** ${d.visuallyDistinct ? "yes" : "no"}

| Before (still in ${t.from.type}) | After (entering ${t.to.type}) | Panorama at boundary |
|----------------------------------|-------------------------------|----------------------|
| ![before](${rel(t.before.path)}) | ![after](${rel(t.after.path)}) | ![panorama](${rel(t.panorama.path)}) |
`;
  })
  .join("\n");

const heroGallery = segments
  .map(
    (s) =>
      `#### Zone ${s.index + 1}: ${s.stats.zoneName}

![${s.stats.zoneType}](${rel(s.heroShot)})

- Chunks: ${s.stats.chunkCount} · Rooms: ${s.stats.roomCount} · Avg area: ${s.stats.avgRoomAreaM2.toFixed(1)} m² · Connection density: ${(s.stats.connectionDensity * 100).toFixed(0)}%
- Shapes: ${formatKinds(s.stats.shapeDistribution)}
`,
  )
  .join("\n");

const markdown = `# Zone Transition Report (Step 3)

- **Overall:** ${pass ? "PASS" : "FAIL"}
- **Tour start:** chunk (${tour.start.cx}, ${tour.start.cz})
- **Path length:** ${path.length} chunks across **${segments.length}** macro zones (${evaluation.distinctZoneTypes} types)
- **Avg chunks per zone:** ${evaluation.avgChunksPerZone.toFixed(2)}

## Validation criteria

| Criterion | Result | Detail |
|-----------|--------|--------|
${Object.entries(criteria)
  .map(([, c]) => `| ${c.label} | ${c.pass ? "PASS" : "FAIL"} | ${c.detail ?? c.zonesVisited ?? c.distinctTypes ?? c.avgChunksPerZone ?? c.transitionCount ?? ""} |`)
  .join("\n")}

${evaluation.issues.length ? `**Issues:** ${evaluation.issues.join(", ")}\n` : ""}

## Player path

\`\`\`
${pathSummary}
\`\`\`

## Per-zone metrics

| # | Zone | Chunks | Rooms | Avg area (m²) | Conn. density | Shape distribution |
|---|------|--------|-------|---------------|---------------|-------------------|
${zoneTable}

## Zone hero screenshots

${heroGallery}

## Boundary transitions

${transitionBlocks}

---
*Generated by \`scripts/validate-zone-transitions.mjs\`*
`;

await writeFile(join(OUT_DIR, "report.json"), JSON.stringify(report, null, 2));
await writeFile(join(OUT_DIR, "transition-report.md"), markdown);

console.log("=== ZONE TRANSITION QA ===");
console.log(
  JSON.stringify(
    {
      pass,
      zonesVisited: segments.length,
      distinctTypes: evaluation.distinctZoneTypes,
      avgChunksPerZone: evaluation.avgChunksPerZone,
      criteria: Object.fromEntries(Object.entries(criteria).map(([k, v]) => [k, v.pass])),
      issues: evaluation.issues,
    },
    null,
    2,
  ),
);
console.log("\nSaved:", join(OUT_DIR, "transition-report.md"));

if (!pass) {
  console.error("FAIL");
  process.exit(1);
}
console.log("PASS");
