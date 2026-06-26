import * as THREE from "three";
import {
  PLAYER_R,
  GRAVITY,
  ROOM_H,
  EYE_H,
} from "./constants.js";

const LAND_EPS = 0.09;
const MAX_BODY_Y = ROOM_H - 0.1;
const PROBE_Y = EYE_H - 0.35;

/** Wall/floor collision body for chasing entities — no crouch/jump */
export class EntityBody {
  constructor({
    footOffset = 0,
    radius = PLAYER_R * 0.95,
    probeYOffset = 0,
    steerQuality = "light",
  } = {}) {
    this.footOffset = footOffset;
    this.radius = radius;
    this.probeYOffset = probeYOffset;
    this.steerQuality = steerQuality;
    this.position = new THREE.Vector3();
    this.yaw = 0;
    this.desiredYaw = 0;
    this.vy = 0;
    this.grounded = true;
    this.groundY = 0;
    this.colliders = [];
    this._blockedT = 0;
  }

  setColliders(colliders) {
    this.colliders = colliders;
  }

  feetY() {
    return this.position.y + this.footOffset;
  }

  collisionRadius() {
    return this.radius;
  }

  horizontalProbeY() {
    return this.feetY() + PROBE_Y + this.probeYOffset;
  }

  syncRoot(root) {
    root.position.copy(this.position);
    root.rotation.y = this.yaw;
    const sx = root.scale.x || 1;
    root.scale.set(sx, sx, sx);
  }

  _overlapsXZ(px, pz, c, r = this.collisionRadius()) {
    return !(px + r <= c.minX || px - r >= c.maxX || pz + r <= c.minZ || pz - r >= c.maxZ);
  }

  _blocksHorizontal(c, y) {
    if (c.isCeiling) return false;
    if (y < c.minY - 0.2 || y > c.maxY + 0.2) return false;
    return true;
  }

  isBlocked(px, pz, r = this.collisionRadius()) {
    return this.insideWall(px, pz, r);
  }

  insideWall(px, pz, r = this.collisionRadius()) {
    const y = this.horizontalProbeY();
    for (const c of this.colliders) {
      if (!this._blocksHorizontal(c, y)) continue;
      if (px + r <= c.minX || px - r >= c.maxX || pz + r <= c.minZ || pz - r >= c.maxZ) {
        continue;
      }
      return true;
    }
    return false;
  }

  _pushOut(px, pz) {
    const y = this.horizontalProbeY();
    const r = this.collisionRadius();

    for (let n = 0; n < 14; n++) {
      let hit = false;
      for (const c of this.colliders) {
        if (!this._blocksHorizontal(c, y)) continue;
        if (px + r <= c.minX || px - r >= c.maxX || pz + r <= c.minZ || pz - r >= c.maxZ) {
          continue;
        }
        const oL = px + r - c.minX;
        const oR = c.maxX - (px - r);
        const oF = pz + r - c.minZ;
        const oB = c.maxZ - (pz - r);
        const m = Math.min(oL, oR, oF, oB);
        if (m === oL) px -= oL;
        else if (m === oR) px += oR;
        else if (m === oF) pz -= oF;
        else pz += oB;
        hit = true;
      }
      if (!hit) break;
    }

    return { px, pz };
  }

  _findSupportY(px, pz, feetY, vy, dt) {
    let best = 0;
    const nextFeet = feetY + vy * dt;
    const r = this.radius;

    for (const c of this.colliders) {
      if (!c.standable || c.standTopY === undefined) continue;
      if (!this._overlapsXZ(px, pz, c, r)) continue;

      const top = c.standTopY;
      const onTop = Math.abs(feetY - top) < LAND_EPS;
      const landing = vy <= 0 && nextFeet <= top + LAND_EPS && feetY >= top - 0.65;
      if (onTop || landing) best = Math.max(best, top);
    }

    return best;
  }

  resolvePenetration() {
    if (!this.insideWall(this.position.x, this.position.z)) return;
    const out = this._pushOut(this.position.x, this.position.z);
    this.position.x = out.px;
    this.position.z = out.pz;
  }

  _probeClearance(nx, nz, maxDist, steps = 10) {
    const inc = maxDist / steps;
    for (let i = 1; i <= steps; i++) {
      const d = inc * i;
      const tx = this.position.x + nx * d;
      const tz = this.position.z + nz * d;
      if (this.insideWall(tx, tz)) return Math.max(0, d - inc);
    }
    return maxDist;
  }

  _steerAngles() {
    const out = [0];
    if (this.steerQuality === "light") {
      for (let deg = 10; deg <= 140; deg += 10) {
        const rad = THREE.MathUtils.degToRad(deg);
        out.push(rad, -rad);
      }
      return out;
    }

    for (let deg = 4; deg <= 120; deg += 4) {
      const rad = THREE.MathUtils.degToRad(deg);
      out.push(rad, -rad);
    }
    for (let deg = 130; deg <= 180; deg += 10) {
      const rad = THREE.MathUtils.degToRad(deg);
      out.push(rad, -rad);
    }
    return out;
  }

  /** Steer around walls toward a world XZ goal */
  moveToward(dirX, dirZ, speed, dt) {
    const desiredLen = Math.hypot(dirX, dirZ);
    if (desiredLen < 1e-6) return 0;

    const goalNX = dirX / desiredLen;
    const goalNZ = dirZ / desiredLen;
    const step = speed * dt;
    const probeSteps = this.steerQuality === "light" ? 6 : 10;
    const probeDist = this.steerQuality === "light"
      ? Math.max(step * 4, 1.35)
      : Math.max(step * 5.5, 1.85);

    let best = null;
    let bestScore = -Infinity;

    for (const a of this._steerAngles()) {
      const c = Math.cos(a);
      const s = Math.sin(a);
      const nx = goalNX * c - goalNZ * s;
      const nz = goalNX * s + goalNZ * c;
      const len = Math.hypot(nx, nz);
      if (len < 1e-6) continue;

      const tx = this.position.x + (nx / len) * step;
      const tz = this.position.z + (nz / len) * step;
      if (this.insideWall(tx, tz)) continue;

      const nnx = nx / len;
      const nnz = nz / len;
      const alignment = nnx * goalNX + nnz * goalNZ;
      const clearance = this._probeClearance(nnx, nnz, probeDist, probeSteps);
      const wallBias = clearance < 0.35 ? -0.8 : 0;
      const score =
        alignment * 2.6 +
        clearance * 0.85 +
        wallBias +
        (Math.abs(a) < 1e-4 ? 0.08 : 0);

      if (score > bestScore) {
        bestScore = score;
        best = { tx, tz, nx: nx / len, nz: nz / len };
      }
    }

    if (!best) {
      const slides = [
        { nx: -goalNZ, nz: goalNX },
        { nx: goalNZ, nz: -goalNX },
        { nx: goalNX, nz: goalNZ },
        { nx: -goalNX, nz: -goalNZ },
      ];
      for (const slide of slides) {
        const tx = this.position.x + slide.nx * step;
        const tz = this.position.z + slide.nz * step;
        if (this.insideWall(tx, tz)) continue;
        best = { tx, tz, nx: slide.nx, nz: slide.nz };
        break;
      }
    }

    if (!best) {
      this._blockedT += dt;
      return 0;
    }

    this._blockedT = 0;

    const px0 = this.position.x;
    const pz0 = this.position.z;
    if (!this.insideWall(best.tx, best.tz)) {
      this.position.x = best.tx;
      this.position.z = best.tz;
    } else {
      const out = this._pushOut(best.tx, best.tz);
      this.position.x = out.px;
      this.position.z = out.pz;
    }

    const moved = Math.hypot(this.position.x - px0, this.position.z - pz0);
    if (moved > 1e-5) {
      this.desiredYaw = Math.atan2(this.position.x - px0, this.position.z - pz0);
    } else {
      this.desiredYaw = Math.atan2(best.nx, best.nz);
    }

    return moved;
  }

  smoothYaw(dt, turnSpeed = 9) {
    let dy = this.desiredYaw - this.yaw;
    while (dy > Math.PI) dy -= Math.PI * 2;
    while (dy < -Math.PI) dy += Math.PI * 2;
    this.yaw += dy * Math.min(1, turnSpeed * dt);
  }

  updateVertical(dt) {
    const feetY = this.feetY();
    const supportY = this._findSupportY(this.position.x, this.position.z, feetY, this.vy, dt);
    const targetFeetY = supportY;
    const maxFeetY = MAX_BODY_Y - this.footOffset;

    this.vy -= GRAVITY * dt;
    let nextFeet = feetY + this.vy * dt;

    if (nextFeet > maxFeetY) {
      nextFeet = maxFeetY;
      this.vy = 0;
    }

    if (nextFeet <= targetFeetY && this.vy <= 0) {
      this.position.y = targetFeetY - this.footOffset;
      this.vy = 0;
      this.grounded = true;
      this.groundY = supportY;
    } else {
      this.position.y = nextFeet - this.footOffset;
      this.grounded = false;
    }

    this.resolvePenetration();
  }

  setFeetWorld(x, z, groundY) {
    this.position.x = x;
    this.position.z = z;
    this.groundY = groundY;
    this.position.y = groundY - this.footOffset;
    this.grounded = true;
    this.vy = 0;
  }
}
