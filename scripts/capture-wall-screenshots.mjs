import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const outDir = "/opt/cursor/artifacts/screenshots";
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });

const shots = [
  ["wall-step1-corner.png", "/wall-preview.html?view=corner&cx=0&cz=0"],
  ["wall-step1-endcap.png", "/wall-preview.html?view=endcap&cx=0&cz=0"],
  ["wall-step1-jamb.png", "/wall-preview.html?view=jamb&cx=0&cz=0"],
  ["wall-step1-overview.png", "/wall-preview.html?view=overview&cx=0&cz=0"],
];

for (const [name, path] of shots) {
  await page.goto(`http://127.0.0.1:5199${path}`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => window.__WALL_PREVIEW__?.ready, null, { timeout: 30000 });
  await page.waitForTimeout(500);
  const info = await page.evaluate(() => window.__WALL_PREVIEW__);
  await page.screenshot({ path: `${outDir}/${name}`, fullPage: false });
  console.log("saved", name, info);
}

await browser.close();
