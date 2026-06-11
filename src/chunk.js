import * as THREE from "three";

const ROOM_W = 8;
const ROOM_D = 8;
const ROOM_H = 2.8;
const WALL_THICK = 0.12;
const DOOR_W = 1.8;
const DOOR_H = 2.2;

export { ROOM_W, ROOM_D, ROOM_H };

function makeWallSegment(w, h, material) {
  const geo = new THREE.BoxGeometry(w, h, WALL_THICK);
  return new THREE.Mesh(geo, material);
}

function buildWalls(materials) {
  const group = new THREE.Group();
  const sideW = (ROOM_W - DOOR_W) / 2;
  const frontD = (ROOM_D - DOOR_W) / 2;

  const configs = [
    // North wall (z = -ROOM_D/2)
    { x: -ROOM_W / 2 + sideW / 2, z: -ROOM_D / 2, w: sideW, rotY: 0 },
    { x: ROOM_W / 2 - sideW / 2, z: -ROOM_D / 2, w: sideW, rotY: 0 },
    // South wall
    { x: -ROOM_W / 2 + sideW / 2, z: ROOM_D / 2, w: sideW, rotY: 0 },
    { x: ROOM_W / 2 - sideW / 2, z: ROOM_D / 2, w: sideW, rotY: 0 },
    // West wall (x = -ROOM_W/2)
    { x: -ROOM_W / 2, z: -ROOM_D / 2 + frontD / 2, w: frontD, rotY: Math.PI / 2 },
    { x: -ROOM_W / 2, z: ROOM_D / 2 - frontD / 2, w: frontD, rotY: Math.PI / 2 },
    // East wall
    { x: ROOM_W / 2, z: -ROOM_D / 2 + frontD / 2, w: frontD, rotY: Math.PI / 2 },
    { x: ROOM_W / 2, z: ROOM_D / 2 - frontD / 2, w: frontD, rotY: Math.PI / 2 },
  ];

  for (const c of configs) {
    const wall = makeWallSegment(c.w, DOOR_H, materials.wall);
    wall.position.set(c.x, DOOR_H / 2, c.z);
    wall.rotation.y = c.rotY;
    group.add(wall);

    const top = makeWallSegment(c.w, ROOM_H - DOOR_H, materials.wall);
    top.position.set(c.x, DOOR_H + (ROOM_H - DOOR_H) / 2, c.z);
    top.rotation.y = c.rotY;
    group.add(top);
  }

  return group;
}

function buildLight() {
  const fixture = new THREE.Group();

  const housing = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 0.08, 0.4),
    new THREE.MeshStandardMaterial({ color: 0xe8e8e0, roughness: 0.6 })
  );
  housing.position.y = ROOM_H - 0.12;
  fixture.add(housing);

  const bulb = new THREE.Mesh(
    new THREE.PlaneGeometry(1.4, 0.25),
    new THREE.MeshBasicMaterial({ color: 0xfff8d0 })
  );
  bulb.rotation.x = -Math.PI / 2;
  bulb.position.y = ROOM_H - 0.15;
  fixture.add(bulb);

  const light = new THREE.PointLight(0xfff0c8, 1.2, 14, 1.8);
  light.position.y = ROOM_H - 0.3;
  fixture.add(light);

  fixture.userData.light = light;
  fixture.userData.bulb = bulb;
  fixture.userData.baseIntensity = 1.2;
  fixture.userData.flickerPhase = Math.random() * Math.PI * 2;
  fixture.userData.flickerSpeed = 0.5 + Math.random() * 2;

  return fixture;
}

export function createRoomChunk(materials) {
  const chunk = new THREE.Group();

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(ROOM_W, ROOM_D),
    materials.floor
  );
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  chunk.add(floor);

  const ceiling = new THREE.Mesh(
    new THREE.PlaneGeometry(ROOM_W, ROOM_D),
    materials.ceiling
  );
  ceiling.rotation.x = Math.PI / 2;
  ceiling.position.y = ROOM_H;
  chunk.add(ceiling);

  chunk.add(buildWalls(materials));
  chunk.add(buildLight());

  chunk.userData.colliders = buildColliders();
  return chunk;
}

function buildColliders() {
  const hw = ROOM_W / 2;
  const hd = ROOM_D / 2;
  const dw = DOOR_W / 2;
  const sideW = (ROOM_W - DOOR_W) / 2;

  return [
    // North
    { minX: -hw, maxX: -dw, minZ: -hd - WALL_THICK, maxZ: -hd + WALL_THICK },
    { minX: dw, maxX: hw, minZ: -hd - WALL_THICK, maxZ: -hd + WALL_THICK },
    // South
    { minX: -hw, maxX: -dw, minZ: hd - WALL_THICK, maxZ: hd + WALL_THICK },
    { minX: dw, maxX: hw, minZ: hd - WALL_THICK, maxZ: hd + WALL_THICK },
    // West
    { minX: -hw - WALL_THICK, maxX: -hw + WALL_THICK, minZ: -hd, maxZ: -dw },
    { minX: -hw - WALL_THICK, maxX: -hw + WALL_THICK, minZ: dw, maxZ: hd },
    // East
    { minX: hw - WALL_THICK, maxX: hw + WALL_THICK, minZ: -hd, maxZ: -dw },
    { minX: hw - WALL_THICK, maxX: hw + WALL_THICK, minZ: dw, maxZ: hd },
  ];
}
