/**
 * Capture representative player-perspective corner samples for QA report.
 */
import { chromium } from "playwright";
import { mkdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const PORT = Number(process.env.PORT ?? 5199);
const OUT_DIR = process.env.OUT_DIR ?? "/opt/cursor/artifacts/player-wall-qa";
const report = JSON.parse(await readFile(join(OUT_DIR, "report.json"), "utf8"));

const samples = [];
const shapes = new Set();
const usedRooms = new Set();
for (const room of report.rooms) {
  if (usedRooms.size < 12 && !usedRooms.has(room.index)) {
    for (const c of room.corners) {
      if (!["ㄱ", "ㄴ", "ㄷ", "ㅁ", "end"].includes(c.shape)) continue;
      const key = `${room.index}:${c.shape}`;
      if (shapes.has(key)) continue;
      shapes.add(key);
      samples.push({ room, c });
      usedRooms.add(room.index);
      break;
    }
  }
  for (const c of room.corners) {
    if (!["ㄱ", "ㄴ", "ㄷ", "ㅁ"].includes(c.shape)) continue;
    const key = c.shape;
    if (shapes.has(key)) continue;
    shapes.add(key);
    samples.push({ room, c });
    if (samples.length >= 16) break;
  }
  if (samples.length >= 16) break;
}

await mkdir(join(OUT_DIR, "samples"), { recursive: true });
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

for (let i = 0; i < samples.length; i++) {
  const { room, c } = samples[i];
  const q = new URLSearchParams({
    cx: String(room.cx),
    cz: String(room.cz),
    camX: String(c.camX),
    camY: String(c.camY),
    camZ: String(c.camZ),
    lookX: String(c.lookX),
    lookY: String(c.lookY),
    lookZ: String(c.lookZ),
  });
  await page.goto(`http://127.0.0.1:${PORT}/player-wall-qa.html?${q}`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.__PLAYER_WALL_QA__?.ready, null, { timeout: 60000 });
  const name = `sample_${String(i).padStart(2, "0")}_${c.shape}_cx${room.cx}_cz${room.cz}.png`;
  await page.screenshot({ path: join(OUT_DIR, "samples", name) });
  console.log("saved", name);
}

await browser.close();
