import { generateRoom } from "../src/room.js";
import { buildRoomWallGeometry, wallThicknessOK } from "../src/mapgen/walls/WallMeshBuilder.js";
import { collectRoomWallSegments } from "../src/mapgen/walls/wallSegments.js";
import { segmentsToFootprint } from "../src/mapgen/walls/WallFootprint.js";
import { validateWallMesh } from "../src/mapgen/walls/WallQuality.js";
import { WALL_T } from "../src/constants.js";

const fakeTex = { userData: { tileW: 0.76, tileH: 0.76 }, clone() { return this; } };

let fail = 0;
for (let cz = -2; cz <= 2; cz++) {
  for (let cx = -2; cx <= 2; cx++) {
    const room = generateRoom(cx, cz);
    const segs = collectRoomWallSegments(room);
    const cells = segmentsToFootprint(segs);
    const geo = buildRoomWallGeometry(room, fakeTex, 2.7, cx * 14, cz * 14);
    const issues = validateWallMesh(room, segs, cells).filter(
      (i) => i.kind === "protrusion" || i.kind === "short_segment",
    );
    if (!geo || issues.length || !wallThicknessOK(cells)) {
      fail++;
      console.log("FAIL", cx, cz, { geo: !!geo, issues, thick: wallThicknessOK(cells) });
    }
  }
}

console.log(fail ? `${fail} failures` : "25/25 ok");
console.log("WALL_T", WALL_T);
