/**
 * Player-view wall thickness captures — doors, end caps, corners.
 *
 *   node scripts/capture-wall-thickness-player.mjs
 *   LABEL=after node scripts/capture-wall-thickness-player.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { spawn } from "node:child_process";
import { generateRoom } from "../src/room.js";
import {
  collectThicknessPlayerViews,
  inspectRoomPlayerWalls,
  findHeadOnEndCapView,
} from "../src/mapgen/walls/WallPlayerQA.js";
import { EYE_H, ROOM_H } from "../src/constants.js";

const LABEL = process.env.LABEL ?? "after";
const PORT = Number(process.env.PORT ?? 5199);
const OUT_DIR = process.env.OUT_DIR ?? `/opt/cursor/artifacts/wall-thickness-${LABEL}`;
const ROOM_COORDS = [
  { cx: 0, cz: 0 },
  { cx: -30, cz: -30 },
  { cx: 3, cz: 7 },
  { cx: 14, cz: 3 },
  { cx: -14, cz: 14 },
];

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

async function startVite() {
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

async function capture(page, shot) {
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

const shots = [];
const qaResults = [];

for (const { cx, cz } of ROOM_COORDS) {
  const room = generateRoom(cx, cz);
  const qa = inspectRoomPlayerWalls(room, cx, cz);
  qaResults.push({ cx, cz, pass: qa.pass, issues: qa.issues });

  const views = collectThicknessPlayerViews(room);
  for (let i = 0; i < views.length; i++) {
    const v = views[i];
    shots.push({
      cx,
      cz,
      ...v,
      path: join(OUT_DIR, `room_${cx}_${cz}_${v.tag ?? "view"}_${i}.png`),
    });
  }

  const headOn = findHeadOnEndCapView(room, 1.0);
  if (headOn) {
    shots.push({
      cx,
      cz,
      ...headOn,
      path: join(OUT_DIR, `room_${cx}_${cz}_endcap_1m.png`),
    });
  }
}

const vite = await startVite();
const { chromium } = await import("playwright");
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

for (const shot of shots) {
  await capture(page, shot);
}

await browser.close();
if (vite) vite.kill("SIGTERM");

const report = {
  label: LABEL,
  rooms: qaResults,
  shots: shots.map((s) => ({
    path: s.path.replace(`${OUT_DIR}/`, ""),
    cx: s.cx,
    cz: s.cz,
    tag: s.tag,
  })),
  pass: qaResults.every((r) => r.pass),
};

await writeFile(join(OUT_DIR, "report.json"), JSON.stringify(report, null, 2));

const md = `# Wall Thickness Player Views (${LABEL})

- **QA pass:** ${report.pass ? "PASS" : "FAIL"}

## Rooms

${qaResults.map((r) => `- (${r.cx},${r.cz}): ${r.pass ? "PASS" : "FAIL"}${r.issues.length ? ` — ${r.issues.map((i) => i.kind).join(", ")}` : ""}`).join("\n")}

## Screenshots

${shots.map((s) => `### ${s.tag ?? "view"} @ (${s.cx},${s.cz})\n\n![${s.tag}](${s.path.replace(`${OUT_DIR}/`, "")})`).join("\n\n")}
`;

await writeFile(join(OUT_DIR, "player-views.md"), md);

console.log(`Captured ${shots.length} shots → ${OUT_DIR}`);
console.log(JSON.stringify({ pass: report.pass, rooms: qaResults.length }, null, 2));

if (!report.pass) process.exit(1);
