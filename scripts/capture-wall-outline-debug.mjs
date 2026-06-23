import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const outDir = "/opt/cursor/artifacts/screenshots";
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

const shots = [
  ["wall-debug-1-centerlines.png", "centerlines"],
  ["wall-debug-2-outline.png", "outline"],
  ["wall-debug-3-shape.png", "shape"],
  ["wall-debug-4-mesh.png", "mesh"],
  ["wall-debug-all-stages.png", "all"],
];

for (const [name, stage] of shots) {
  await page.goto(`http://127.0.0.1:5199/wall-outline-debug.html?stage=${stage}&cx=0&cz=0`, {
    waitUntil: "networkidle",
  });
  await page.waitForFunction(() => window.__WALL_OUTLINE_DEBUG__?.ready, null, { timeout: 30000 });
  await page.waitForTimeout(600);
  const info = await page.evaluate(() => ({
    zigzag: window.__WALL_OUTLINE_DEBUG__.zigzagReport,
    mesh: window.__WALL_OUTLINE_DEBUG__.meshSilhouetteAnalysis,
  }));
  await page.screenshot({ path: `${outDir}/${name}`, fullPage: false });
  console.log("saved", name, info);
}

await browser.close();
