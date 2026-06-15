import * as THREE from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";
import { WALL_THICK, FLOOR_STEP, CELL } from "./roomGen.js";

function shapeFromVerts(verts) {
  const shape = new THREE.Shape();
  shape.moveTo(verts[0][0], verts[0][1]);
  for (let i = 1; i < verts.length; i++) shape.lineTo(verts[i][0], verts[i][1]);
  shape.closePath();
  return shape;
}

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
    const half = door.width / 2;
    const mid = len / 2 + door.offset;
    const d0 = mid - half;
    const d1 = mid + half;
    addBox(0, d0, door.height, 0);
    addBox(d1, len - d1, door.height, 0);
    addBox(0, len, roomH - door.height, door.height);
  } else {
    addBox(0, len, roomH, 0);
  }

  return geos;
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
    wallGeos.push(...wallBoxes(edge, room.height, edge.door));
  }

  if (wallGeos.length) {
    const merged = mergeGeometries(wallGeos, false);
    wallGeos.forEach((g) => g.dispose());
    merged.translate(0, y0, 0);
    group.add(new THREE.Mesh(merged, wallMat));
  }

  group.position.set(room.cx * CELL, 0, room.cz * CELL);
  return group;
}
