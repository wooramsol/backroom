/**
 * Capture key player-perspective corners for QA report.
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import { join } from "node:path";

const PORT = Number(process.env.PORT ?? 5199);
const OUT_DIR = process.env.OUT_DIR ?? "/opt/cursor/artifacts/player-wall-qa";

const shots = [
  { name: "player-qa-inner-L-cx10-cz10.png", cx: 10, cz: 10, camX: 7.31, camY: 1.62, camZ: 3.14, lookX: 6, lookY: 1.42, lookZ: 2 },
  { name: "player-qa-inner-L-cx10-cz10-b.png", cx: 10, cz: 10, camX: 6.86, camY: 1.62, camZ: 3.31, lookX: 8, lookY: 1.42, lookZ: 2 },
  { name: "player-qa-chunk-corner-cx0-cz0.png", cx: 0, cz: 0, camX: 0.69, camY: 1.62, camZ: 0.94, lookX: 0, lookY: 1.42, lookZ: 0 },
  { name: "player-qa-endcap-cx0-cz0.png", cx: 0, cz: 0, camX: 0.85, camY: 1.62, camZ: 7.87, lookX: 0, lookY: 1.42, lookZ: 7.79 },
  { name: "player-qa-inner-L-cx50-cz50.png", cx: 50, cz: 50, camX: 7.31, camY: 1.62, camZ: 3.14, lookX: 7, lookY: 1.42, lookZ: 2 },
];

await mkdir(join(OUT_DIR, "samples"), { recursive: true });
const browser = await chromium.launch({ headless: true });
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
  await page.goto(`http://127.0.0.1:${PORT}/player-wall-qa.html?${q}`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.__PLAYER_WALL_QA__?.ready, null, { timeout: 60000 });
  const path = join(OUT_DIR, "samples", shot.name);
  await page.screenshot({ path });
  console.log("saved", shot.name);
}

await browser.close();
