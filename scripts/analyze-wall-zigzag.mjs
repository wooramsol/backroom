import { generateRoom } from "../src/room.js";
import { collectRoomWallSegments } from "../src/mapgen/walls/wallSegments.js";
import { buildRoomWallGeometry } from "../src/mapgen/walls/WallMeshBuilder.js";
import {
  collectWallOutlineDebugPipeline,
  meshBoundaryOutlineLoop,
  analyzeOutlineLoop,
  summarizeZigzagReport,
} from "../src/mapgen/walls/WallOutlineDebug.js";

const cx = Number(process.env.CX ?? 0);
const cz = Number(process.env.CZ ?? 0);
const room = generateRoom(cx, cz);
const segs = collectRoomWallSegments(room);
const pipeline = collectWallOutlineDebugPipeline(segs);

console.log("=== WALL OUTLINE ZIGZAG REPORT ===");
console.log(summarizeZigzagReport(pipeline));

const geo = buildRoomWallGeometry(room, { userData: { tileW: 0.76, tileH: 0.76 } }, 2.7, cx * 14, cz * 14);
const meshLoop = meshBoundaryOutlineLoop(geo);
const meshA = analyzeOutlineLoop(meshLoop);
console.log("\n=== MESH BOUNDARY LOOP ===");
console.log("verts:", meshLoop?.length ?? 0);
console.log(meshA);
if (meshLoop) {
  for (let i = 0; i < meshLoop.length; i++) {
    const [x, z] = meshLoop[i];
    const [x2, z2] = meshLoop[(i + 1) % meshLoop.length];
    const len = Math.hypot(x2 - x, z2 - z);
    const axis = Math.abs(z2 - z) < 1e-5 ? "h" : Math.abs(x2 - x) < 1e-5 ? "v" : "d";
    if (len < 0.5 && len > 0.05) console.log("  micro", i, len.toFixed(4), axis, [x, z], "->", [x2, z2]);
  }
}

let fail = 0;
for (const isl of pipeline.islands) {
  if (
    isl.shapeAnalysis.microEdges > 0 ||
    isl.shapeAnalysis.diagonalEdges > 0 ||
    isl.shapeAnalysis.staircaseSteps > 0
  ) {
    fail++;
    console.log("\nFAIL island", isl.islandIndex, "SHAPE stage edges:", isl.shapeAnalysis.edges);
    console.log("shape polygon:", isl.shapePolygon);
  }
}
if (meshA.microEdges > 0 || meshA.diagonalEdges > 0 || meshA.staircaseSteps > 0) {
  fail++;
  console.log("\nFAIL MESH stage", meshA);
}
console.log(fail ? `\n${fail} stage(s) with zigzag (shape/mesh)` : "\nAll stages: no zigzag detected");
