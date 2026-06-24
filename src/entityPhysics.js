import * as THREE from "three";
import {
  PLAYER_R,
  CROUCH_PLAYER_R,
  CROUCH_BODY_H,
  CROUCH_BLEND_SPEED,
  JUMP_V,
  GRAVITY,
  ROOM_H,
  EYE_H,
} from "./constants.js";

const LAND_EPS = 0.09;
const MAX_BODY_Y = ROOM_H - 0.1;

/** Wall/floor collision body for chasing entities (player-like, no camera). */
export class EntityBody {
  constructor({ footOffset = 0, radius = PLAYER_R * 0.95 } = {}) {
    this.footOffset = footOffset;
    this.radius = radius;
    this.position = new THREE.Vector3();
    this.yaw = 0;
    this.vy = 0;
    this.grounded = true;
    this.groundY = 0;
    this.crouchBlend = 0;
    this.crouchTarget = 0;
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
    return THREE.MathUtils.lerp(this.radius, CROUCH_PLAYER_R, this.crouchBlend);
  }

  horizontalProbeY() {
    const feet = this.feetY();
    const standProbe = feet + (EYE_H - 0.05);
    const crouchProbe = feet + CROUCH_BODY_H * 0.42;
    return THREE.MathUtils.lerp(standProbe, crouchProbe, this.crouchBlend);
  }

  syncRoot(root) {
    root.position.copy(this.position);
    root.rotation.y = this.yaw;
    const squat = this.crouchBlend * 0.22;
    const sx = root.scale.x || 1;
    root.scale.set(sx, sx * (1 - squat), sx);
  }

  _overlapsXZ(px, pz, c, r = this.collisionRadius()) {
    return !(px + r <= c.minX || px - r >= c.maxX || pz + r <= c.minZ || pz - r >= c.maxZ);
  }

  _blocksHorizontal(c, y) {
    if (c.isCeiling) return false;
    if (y < c.minY - 0.2 || y > c.maxY + 0.2) return false;
    return true;
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

  _lowCeilingAhead(dirX, dirZ, dist = 0.85) {
    const px = this.position.x + dirX * dist;
    const pz = this.position.z + dirZ * dist;
    const feet = this.feetY();
    const headY = feet + EYE_H - 0.15;
    const crouchHeadY = feet + CROUCH_BODY_H;

    for (const c of this.colliders) {
      if (!this._overlapsXZ(px, pz, c, this.collisionRadius())) continue;
      if (c.isCeiling || c.maxY > headY - 0.25) {
        if (c.minY < headY && c.maxY > crouchHeadY) return true;
      }
    }
    return false;
  }

  resolvePenetration() {
    if (!this.insideWall(this.position.x, this.position.z)) return;
    const out = this._pushOut(this.position.x, this.position.z);
    this.position.x = out.px;
    this.position.z = out.pz;
  }

  /** Try steering directions; returns distance moved on XZ */
  moveToward(dirX, dirZ, speed, dt) {
    const desiredLen = Math.hypot(dirX, dirZ);
    if (desiredLen < 1e-6) return 0;

    const step = speed * dt;
    const angles = [0, 0.55, -0.55, 1.1, -1.1, 1.65, -1.65, Math.PI];
    let best = null;
    let bestScore = -Infinity;

    for (const a of angles) {
      const c = Math.cos(a);
      const s = Math.sin(a);
      const dx = dirX * c - dirZ * s;
      const dz = dirX * s + dirZ * c;
      const len = Math.hypot(dx, dz);
      if (len < 1e-6) continue;
      const nx = dx / len;
      const nz = dz / len;
      const tx = this.position.x + nx * step;
      const tz = this.position.z + nz * step;
      if (this.insideWall(tx, tz)) continue;
      const score = nx * (dirX / desiredLen) + nz * (dirZ / desiredLen);
      if (score > bestScore) {
        bestScore = score;
        best = { tx, tz, nx, nz };
      }
    }

    if (!best) {
      this._blockedT += dt;
      if (this._blockedT > 0.12 && this.grounded && this.crouchBlend < 0.05) {
        if (this._lowCeilingAhead(dirX / desiredLen, dirZ / desiredLen)) {
          this.crouchTarget = 1;
        } else if (this._blockedT > 0.35) {
          this.vy = JUMP_V;
          this.grounded = false;
          this._blockedT = 0;
        }
      }
      return 0;
    }

    this._blockedT = 0;
    this.crouchTarget = this._lowCeilingAhead(best.nx, best.nz) ? 1 : 0;

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
      this.yaw = Math.atan2(this.position.x - px0, this.position.z - pz0);
    } else {
      this.yaw = Math.atan2(best.nx, best.nz);
    }

    return moved;
  }

  updateVertical(dt) {
    this.crouchBlend +=
      (this.crouchTarget - this.crouchBlend) * Math.min(1, CROUCH_BLEND_SPEED * dt);

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
