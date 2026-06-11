import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { WALL_THICK, FLOOR_STEP } from "./roomGen.js";

function shapeFromVerts(verts) {
  const shape = new THREE.Shape();
  shape.moveTo(verts[0][0], verts[0][1]);
  for (let i = 1; i < verts.length; i++) shape.lineTo(verts[i][0], verts[i][1]);
  shape.closePath();
  return shape;
}

function wallBoxes(edge, roomH, door, material) {
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
    if (tLen < 0.15) return;
    const mx = edge.v0[0] + ux * (t0 + tLen / 2) + nx * (WALL_THICK / 2);
    const mz = edge.v0[1] + uz * (t0 + tLen / 2) + nz * (WALL_THICK / 2);
    const g = new THREE.BoxGeometry(tLen, h, WALL_THICK);
    g.rotateY(angle);
    g.translate(mx, y + h / 2, mz);
    geos.push(g);
  };

  if (door) {
    const mid = (len - door.width) / 2 + door.offset;
    addBox(0, mid, door.height, 0);
    addBox(mid + door.width, len - mid - door.width, door.height, 0);
    addBox(0, len, roomH - door.height, door.height);
    if (door.style === "low") addBox(mid, door.width, roomH - door.height, door.height);
  } else if (!edge.feature) {
    addBox(0, len, roomH, 0);
  } else {
    addBox(0, len, roomH * 0.55, 0);
  }

  return geos;
}

function buildStairMesh(room, materials) {
  if (!room.feature) return null;
  const edge = room.edges[room.feature.edgeIndex];
  const dx = edge.v1[0] - edge.v0[0];
  const dz = edge.v1[1] - edge.v0[1];
  const mx = (edge.v0[0] + edge.v1[0]) / 2;
  const mz = (edge.v0[1] + edge.v1[1]) / 2;
  const angle = Math.atan2(dx, dz);
  const nx = edge.normal[0];
  const nz = edge.normal[1];
  const dirX = -nx;
  const dirZ = -nz;
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
  const shape = shapeFromVerts(room.vertices);

  const floorGeo = new THREE.ShapeGeometry(shape);
  floorGeo.rotateX(-Math.PI / 2);
  const floor = new THREE.Mesh(floorGeo, room.isBasement ? materials.basementFloor : materials.floor);
  floor.position.y = y0;
  group.add(floor);

  const ceilGeo = new THREE.ShapeGeometry(shape);
  ceilGeo.rotateX(Math.PI / 2);
  const ceiling = new THREE.Mesh(ceilGeo, materials.ceiling);
  ceiling.position.y = y0 + room.height;
  group.add(ceiling);

  const lightGeo = new THREE.PlaneGeometry(1.2, 0.3);
  const light = new THREE.Mesh(lightGeo, materials.lightPanel);
  light.rotation.x = -Math.PI / 2;
  const cx = room.vertices.reduce((s, v) => s + v[0], 0) / room.vertices.length;
  const cz = room.vertices.reduce((s, v) => s + v[1], 0) / room.vertices.length;
  light.position.set(cx, y0 + room.height - 0.05, cz);
  group.add(light);

  const wallGeos = [];
  const wallMat = room.isBasement ? materials.basementWall : materials.wall;
  for (const edge of room.edges) {
    const boxes = wallBoxes(edge, room.height, edge.door, wallMat);
    wallGeos.push(...boxes);
  }

  if (wallGeos.length) {
    const merged = mergeGeometries(wallGeos, false);
    wallGeos.forEach((g) => g.dispose());
    merged.translate(0, y0, 0);
    group.add(new THREE.Mesh(merged, wallMat));
  }

  const stairs = buildStairMesh(room, materials);
  if (stairs) group.add(stairs);

  group.position.set(room.cx * 12, 0, room.cz * 12);
  group.userData.room = room;
  return group;
}
