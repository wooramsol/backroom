import { generateRoom } from "../src/room.js";
import {
  buildRoomWallGeometry,
  wallThicknessOK,
  countThicknessFaces,
} from "../src/mapgen/walls/WallMeshBuilder.js";
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
    const caps = geo ? countThicknessFaces(geo) : 0;
    if (!geo || issues.length || !wallThicknessOK(cells) || caps < 4) {
      fail++;
      console.log("FAIL", cx, cz, { geo: !!geo, issues, caps, thick: wallThicknessOK(cells) });
    }
  }
}

const room = generateRoom(0, 0);
const geo = buildRoomWallGeometry(room, fakeTex, 2.7, 0, 0);
geo.computeBoundingBox();
const bb = geo.boundingBox;
console.log("sample bbox", {
  min: [bb.min.x, bb.min.y, bb.min.z].map((v) => +v.toFixed(3)),
  max: [bb.max.x, bb.max.y, bb.max.z].map((v) => +v.toFixed(3)),
});
console.log("thickness faces", countThicknessFaces(geo));
console.log("WALL_T", WALL_T);
console.log(fail ? `${fail} failures` : "25/25 ok");
