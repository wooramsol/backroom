/**
 * Step 1 pipeline debug — 4 stages in distinct colors (wireframe, no texture).
 * ?stage=centerlines|outline|shape|mesh|all
 */
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { ROOM_H, CHUNK } from "../constants.js";
import { generateRoom } from "../room.js";
import { buildRoomWallGeometry } from "../mapgen/walls/WallMeshBuilder.js";
import { collectRoomWallSegments } from "../mapgen/walls/wallSegments.js";
import {
  collectWallOutlineDebugPipeline,
  buildCenterLineGeometry,
  buildLoopLineGeometry,
  meshVerticalBoundaryEdges,
  meshBoundaryOutlineLoop,
  analyzeOutlineLoop,
  summarizeZigzagReport,
} from "../mapgen/walls/WallOutlineDebug.js";

const params = new URLSearchParams(location.search);
const cx = Number(params.get("cx") ?? 0);
const cz = Number(params.get("cz") ?? 0);
const stage = params.get("stage") ?? "all";
const island = Number(params.get("island") ?? -1);

const COLORS = {
  centerlines: 0x00e5ff,
  outline: 0x00ff66,
  shape: 0xffe100,
  mesh: 0xff4466,
};

const LEGEND = [
  { key: "centerlines", label: "1. Center lines (cyan)", color: "#00e5ff" },
  { key: "outline", label: "2. Outline polygon (green)", color: "#00ff66" },
  { key: "shape", label: "3. Pre-extrude shape (yellow)", color: "#ffe100" },
  { key: "mesh", label: "4. Extruded mesh boundary (red)", color: "#ff4466" },
];

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(1280, 720);
document.body.appendChild(renderer.domElement);
renderer.domElement.id = "wall-outline-debug-ready";

const legend = document.createElement("div");
legend.style.cssText =
  "position:fixed;top:12px;left:12px;padding:10px 14px;background:rgba(0,0,0,.72);color:#eee;font:13px/1.5 monospace;border-radius:6px;z-index:10";
for (const item of LEGEND) {
  const row = document.createElement("div");
  row.style.opacity = stage === "all" || stage === item.key ? "1" : "0.35";
  row.innerHTML = `<span style="color:${item.color}">■</span> ${item.label}`;
  legend.appendChild(row);
}
document.body.appendChild(legend);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x121018);

const camera = new THREE.PerspectiveCamera(55, 1280 / 720, 0.05, 80);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

scene.add(new THREE.AmbientLight(0xffffff, 0.65));
const key = new THREE.DirectionalLight(0xffffff, 0.85);
key.position.set(5, 12, 6);
scene.add(key);

const room = generateRoom(cx, cz);
const wx = cx * CHUNK;
const wz = cz * CHUNK;
const segs = collectRoomWallSegments(room);
const pipeline = collectWallOutlineDebugPipeline(segs);

const fakeTex = { userData: { tileW: 0.76, tileH: 0.76 } };
const wallGeo = buildRoomWallGeometry(room, fakeTex, ROOM_H, wx, wz);

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(CHUNK, CHUNK),
  new THREE.MeshBasicMaterial({ color: 0x2a2520 }),
);
floor.rotation.x = -Math.PI / 2;
floor.position.set(wx + CHUNK / 2, 0.005, wz + CHUNK / 2);
scene.add(floor);

const grid = new THREE.GridHelper(CHUNK, 14, 0x333344, 0x222230);
grid.position.set(wx + CHUNK / 2, 0.006, wz + CHUNK / 2);
scene.add(grid);

function lineMat(color, opacity = 1) {
  return new THREE.LineBasicMaterial({ color, transparent: opacity < 1, opacity });
}

function addLineSegments(geo, color, opacity = 1) {
  const lines = new THREE.LineSegments(geo, lineMat(color, opacity));
  lines.position.set(wx, 0, wz);
  scene.add(lines);
  return lines;
}

const show = (name) => stage === "all" || stage === name;
const targetIslands =
  island >= 0 ? pipeline.islands.filter((i) => i.islandIndex === island) : pipeline.islands;

if (show("centerlines")) {
  addLineSegments(buildCenterLineGeometry(pipeline.centerLines), COLORS.centerlines, stage === "all" ? 0.9 : 1);
}

for (const isl of targetIslands) {
  const lift = 0.02 * isl.islandIndex;
  if (show("outline")) {
    const g = buildLoopLineGeometry(isl.rawPolygon, 0.1 + lift);
    addLineSegments(g, COLORS.outline, stage === "all" ? 0.95 : 1);
    for (const h of isl.rawHoles ?? []) {
      addLineSegments(buildLoopLineGeometry(h, 0.11 + lift), COLORS.outline, 0.5);
    }
  }
  if (show("shape")) {
    const g = buildLoopLineGeometry(isl.shapePolygon, 0.14 + lift);
    addLineSegments(g, COLORS.shape, stage === "all" ? 0.95 : 1);
    for (const h of isl.shapeHoles ?? []) {
      addLineSegments(buildLoopLineGeometry(h, 0.15 + lift), COLORS.shape, 0.5);
    }
  }
}

if (show("mesh") && wallGeo) {
  const meshLoop = meshBoundaryOutlineLoop(wallGeo);
  if (meshLoop?.length) {
    const g = buildLoopLineGeometry(meshLoop, ROOM_H);
    addLineSegments(g, COLORS.mesh, stage === "all" ? 1 : 1);
  }

  const silEdges = meshVerticalBoundaryEdges(wallGeo, ROOM_H);
  const pts = [];
  for (const e of silEdges) pts.push(e.x0, ROOM_H, e.z0, e.x1, ROOM_H, e.z1);
  if (pts.length) {
    const sg = new THREE.BufferGeometry();
    sg.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    const sl = new THREE.LineSegments(sg, lineMat(COLORS.mesh, stage === "all" ? 0.35 : 0.55));
    sl.position.set(wx, 0, wz);
    scene.add(sl);
  }

  if (params.get("wire") === "1") {
    const wire = new THREE.Mesh(
      wallGeo,
      new THREE.MeshBasicMaterial({ color: COLORS.mesh, wireframe: true, transparent: true, opacity: 0.25 }),
    );
    wire.position.set(wx, 0, wz);
    scene.add(wire);
  }
}

const meshLoop = wallGeo ? meshBoundaryOutlineLoop(wallGeo) : null;
const meshAnalysis = meshLoop ? analyzeOutlineLoop(meshLoop) : null;

camera.position.set(wx + 4.5, 2.8, wz + 0.6);
controls.target.set(wx + 4.5, 1.35, wz + 2.08);

const report = {
  stage,
  cx,
  cz,
  colors: COLORS,
  ...pipeline,
  zigzagReport: summarizeZigzagReport(pipeline),
  meshBoundaryLoop: meshLoop,
  meshSilhouetteAnalysis: meshAnalysis,
  ready: true,
};

window.__WALL_OUTLINE_DEBUG__ = report;
console.log(report.zigzagReport);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
