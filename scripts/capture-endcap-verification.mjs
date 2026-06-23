/**
 * End Cap verification — player view ~1m from cap face, outside mesh.
 */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { generateRoom } from "../src/room.js";
import { findEndCapFaces, findHeadOnEndCapView } from "../src/mapgen/walls/WallPlayerQA.js";
import { collectRoomWallSegments } from "../src/mapgen/walls/wallSegments.js";
import { buildSolidWallGeometry } from "../src/mapgen/walls/WallMeshBuilder.js";
import { ROOM_H } from "../src/constants.js";

const PORT = Number(process.env.PORT ?? 5199);
const cx = Number(process.env.CX ?? 0);
const cz = Number(process.env.CZ ?? 0);
const DIST = Number(process.env.DIST ?? 1.0);
const OUT_DIR = process.env.OUT_DIR ?? "/opt/cursor/artifacts/screenshots";

const room = generateRoom(cx, cz);
const pose = findHeadOnEndCapView(room, DIST);

if (!pose) {
  console.error("FAIL: no valid end-cap camera pose (walkable + outside solid)");
  process.exit(1);
}

const segs = collectRoomWallSegments(room);
const geo = buildSolidWallGeometry(segs, ROOM_H, cx * 14, cz * 14, 0.76, 0.76, {
  room,
  validate: false,
});
const caps = findEndCapFaces(geo);
geo.dispose();

const report = {
  cx,
  cz,
  distance: pose.distance,
  camera: pose,
  endCapFaces: caps.length,
  cap: pose.cap,
  checks: {
    cameraOutsideSolid: true,
    cameraWalkable: true,
    distanceMetres: pose.distance,
    lateralMetres: pose.lateral,
    headOn: pose.lateral >= 0.4 && pose.lateral <= 1.25,
  },
};

console.log("=== END CAP VERIFICATION ===");
console.log(JSON.stringify(report, null, 2));

await mkdir(OUT_DIR, { recursive: true });
const shotPath = join(OUT_DIR, "wall-step1-endcap-final.png");

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const q = new URLSearchParams({
  cx: String(cx),
  cz: String(cz),
  camX: String(pose.camX),
  camY: String(pose.camY),
  camZ: String(pose.camZ),
  lookX: String(pose.lookX),
  lookY: String(pose.lookY),
  lookZ: String(pose.lookZ),
});
await page.goto(`http://127.0.0.1:${PORT}/player-wall-qa.html?${q}`, { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.__PLAYER_WALL_QA__?.ready, null, { timeout: 60000 });
await page.screenshot({ path: shotPath, fullPage: false });
await browser.close();

await writeFile(join(OUT_DIR, "wall-step1-endcap-final.json"), JSON.stringify(report, null, 2));
console.log("saved", shotPath);
