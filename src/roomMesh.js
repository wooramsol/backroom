import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { CELL, WALL_THICK, FLOOR_STEP } from "./roomGen.js";

function wallBoxes(edge, roomH, door) {
  const geos = [];
  const dx = edge.v1[0] - edge.v0[0];
  const dz = edge.v1[1] - edge.v0[1];
  const len = edge.len;
  const ux = dx / len;
  const uz = dz / len;
  const angle = Math.atan2(dx, dz);
  const nx = edge.normal[0];
  const nz = edge.normal[1];

  const addBox = (t0, tLen, h, y) => {
    if (tLen < 0.12) return;
    const mx = edge.v0[0] + ux * (t0 + tLen / 2) + nx * (WALL_THICK / 2);
    const mz = edge.v0[1] + uz * (t0 + tLen / 2) + nz * (WALL_THICK / 2);
    const g = new THREE.BoxGeometry(tLen, h, WALL_THICK);
    g.rotateY(angle);
    g.translate(mx, y + h / 2, mz);
    geos.push(g);
  };

  if (door) {
    const mid = Math.max(0, (len - door.width) / 2 + door.offset);
    const doorEnd = Math.min(len, mid + door.width);
    addBox(0, mid, door.height, 0);
    addBox(doorEnd, len - doorEnd, door.height, 0);
    addBox(0, len, roomH - door.height, door.height);
  } else if (!edge.feature) {
    addBox(0, len, roomH, 0);
  } else {
    addBox(0, len * 0.2, roomH, 0);
    addBox(len * 0.8, len * 0.2, roomH, 0);
    addBox(0, len, roomH * 0.5, 0);
  }

  return geos;
}

function buildStairMesh(room, materials) {
  if (!room.feature) return null;
  const edge = room.edges[room.feature.edgeIndex];
  const mx = (edge.v0[0] + edge.v1[0]) / 2;
  const mz = (edge.v0[1] + edge.v1[1]) / 2;
  const angle = Math.atan2(edge.v1[0] - edge.v0[0], edge.v1[1] - edge.v0[1]);
  const dirX = -edge.normal[0];
  const dirZ = -edge.normal[1];
  const steps = 5;
  const group = new THREE.Group();
  const rise = FLOOR_STEP / steps;
  const run = 2.4 / steps;
  const y0 = room.floorLevel * FLOOR_STEP;

  for (let i = 0; i < steps; i++) {
    const step = new THREE.Mesh(new THREE.BoxGeometry(1.4, rise, run), materials.stair);
    const along = 1.0 + i * run + run / 2;
    step.position.set(mx + dirX * along, y0 + rise * (i + 0.5), mz + dirZ * along);
    step.rotation.y = angle;
    group.add(step);
  }

  return group;
}

export function buildRoomMesh(room, materials) {
  const group = new THREE.Group();
  const y0 = room.floorLevel * FLOOR_STEP;
  const wallMat = room.isBasement ? materials.basementWall : materials.wall;

  // Full cell floor/ceiling — prevents gaps between varied room shapes
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(CELL, CELL),
    room.isBasement ? materials.basementFloor : materials.floor
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = y0;
  group.add(floor);

  const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(CELL, CELL), materials.ceiling);
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = y0 + room.height;
  group.add(ceiling);

  const light = new THREE.Mesh(
    new THREE.PlaneGeometry(1.2, 0.3),
    materials.lightPanel
  );
  light.rotation.x = -Math.PI / 2;
  light.position.set(0, y0 + room.height - 0.05, 0);
  group.add(light);

  const wallGeos = [];
  for (const edge of room.edges) {
    wallGeos.push(...wallBoxes(edge, room.height, edge.door));
  }

  if (wallGeos.length) {
    const merged = mergeGeometries(wallGeos, false);
    wallGeos.forEach((g) => g.dispose());
    merged.translate(0, y0, 0);
    group.add(new THREE.Mesh(merged, wallMat));
  }

  const stairs = buildStairMesh(room, materials);
  if (stairs) group.add(stairs);

  group.position.set(room.cx * CELL, 0, room.cz * CELL);
  group.userData.room = room;
  return group;
}
