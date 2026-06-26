import * as THREE from "three";
import { CHUNK, generateRoom, isWalkableLocal } from "./room.js";
import { EntityBody } from "./entityPhysics.js";
import { findNavPathWithFallback, hasDirectPath } from "./entityNav.js";

const WALK_SPEED = 3.1;
const RUN_SPEED = 5.5;
const RUN_DIST = 3.2;
const GOAL_REPLAN_DIST = 2.2;
const STUCK_REPLAN = 0.28;
const STUCK_NUDGE = 0.38;
const STUCK_TELEPORT = 5.5;
const REPLAN_COOLDOWN = 0.35;
const MOVE_HOLD = 0.12;
const WP_REACHED = 0.32;

const _fwd = new THREE.Vector3();
const _target = new THREE.Vector3();
const _toPlayer = new THREE.Vector3();
const _moveGoal = new THREE.Vector3();
const _sample = new THREE.Vector3();

const _pathSamples = [
  [0, 0],
  [0.32, 0],
  [-0.32, 0],
  [0, 0.32],
  [0, -0.32],
];

function pickClip(clips, patterns) {
  for (const re of patterns) {
    const hit = clips.find((c) => re.test(c.name));
    if (hit) return hit;
  }
  return null;
}

function bindAnimations(mixer, clips, movePatterns, idlePatterns) {
  const moveClip = pickClip(clips, movePatterns) || clips[0] || null;
  const idleClip =
    clips.find((c) => c !== moveClip && pickClip([c], idlePatterns)) ||
    pickClip(clips, idlePatterns);

  const moveAction = moveClip ? mixer.clipAction(moveClip) : null;
  const idleAction =
    idleClip && idleClip !== moveClip ? mixer.clipAction(idleClip) : null;

  if (moveAction) moveAction.setLoop(THREE.LoopRepeat);
  if (idleAction) idleAction.setLoop(THREE.LoopRepeat);

  return { moveAction, idleAction };
}

function cachedBlocked(isBlocked) {
  const cache = new Map();
  return (x, z) => {
    const k = `${Math.round(x * 8)},${Math.round(z * 8)}`;
    if (cache.has(k)) return cache.get(k);
    const blocked = isBlocked(x, z);
    cache.set(k, blocked);
    return blocked;
  };
}

/** GLB entity that chases the player with maze-aware pathfinding */
export class EntityAgent {
  constructor(data, scene, opts = {}) {
    this.id = opts.id || "entity";
    this.active = false;
    this.root = data.model;
    this.followBehind = opts.followBehind === true;
    this.followDist = opts.followDist ?? 2.35;

    this.body = new EntityBody({
      footOffset: data.footOffset ?? 0,
      steerQuality: "light",
    });
    this.mixer = new THREE.AnimationMixer(this.root);
    const clips = data.animations || [];
    const { moveAction, idleAction } = bindAnimations(
      this.mixer,
      clips,
      opts.movePatterns || [/walk|run|move|chase|stalk|bend|mixamo|locomotion/i],
      opts.idlePatterns || [/idle|stand|stalk|breath/i],
    );
    this.moveAction = moveAction;
    this.idleAction = idleAction;
    this.moving = false;
    this._navPath = null;
    this._navIdx = 0;
    this._stuckT = 0;
    this._moveHold = 0;
    this._replanCooldown = 0;
    this._lastGoalX = NaN;
    this._lastGoalZ = NaN;

    this.root.visible = false;
    scene.add(this.root);
  }

  setColliders(colliders) {
    this.body.setColliders(colliders);
    this._navPath = null;
    this._navIdx = 0;
  }

  _mazeWalkable(wx, wz) {
    const cx = Math.floor(wx / CHUNK);
    const cz = Math.floor(wz / CHUNK);
    const lx = wx - cx * CHUNK;
    const lz = wz - cz * CHUNK;
    const room = generateRoom(cx, cz);
    return isWalkableLocal(lx, lz, room.innerWalls);
  }

  _furnitureBlocked(wx, wz) {
    const r = this.body.collisionRadius();
    const y = this.body.horizontalProbeY();
    for (const c of this.body.colliders) {
      if (!c.isFurniture) continue;
      if (y < c.minY - 0.2 || y > c.maxY + 0.2) continue;
      if (wx + r <= c.minX || wx - r >= c.maxX || wz + r <= c.minZ || wz - r >= c.maxZ) {
        continue;
      }
      return true;
    }
    return false;
  }

  _pathBlocked(wx, wz) {
    for (const [ox, oz] of _pathSamples) {
      _sample.set(wx + ox, 0, wz + oz);
      if (!this._mazeWalkable(_sample.x, _sample.z)) return true;
    }
    return this._furnitureBlocked(wx, wz);
  }

  spawn(player, groundY) {
    const gy = groundY ?? player.groundY;
    const px = player.position.x;
    const pz = player.position.z;
    const candidates = [];

    if (this.followBehind) {
      player.camera.getWorldDirection(_fwd);
      _fwd.y = 0;
      if (_fwd.lengthSq() < 1e-10) _fwd.set(0, 0, 1);
      else _fwd.normalize();
      candidates.push({
        x: px - _fwd.x * this.followDist,
        z: pz - _fwd.z * this.followDist,
      });
    }

    for (let i = 0; i < 16; i++) {
      const ang = player.yaw + Math.PI + (i / 16) * Math.PI * 2;
      candidates.push({
        x: px + Math.sin(ang) * this.followDist,
        z: pz + Math.cos(ang) * this.followDist,
      });
    }

    for (const scale of [0.65, 0.4, 1.15, 1.8]) {
      candidates.push({ x: px + scale, z: pz }, { x: px - scale, z: pz });
      candidates.push({ x: px, z: pz + scale }, { x: px, z: pz - scale });
    }

    for (const pos of candidates) {
      if (!this._pathBlocked(pos.x, pos.z)) {
        this.body.setFeetWorld(pos.x, pos.z, gy);
        this.body.yaw = Math.atan2(px - pos.x, pz - pos.z);
        this.body.desiredYaw = this.body.yaw;
        this.root.visible = true;
        this.active = true;
        this._navPath = null;
        this._navIdx = 0;
        this._stuckT = 0;
        this._replanCooldown = 0;
        this.body.syncRoot(this.root);
        this._setMoving(false);
        return;
      }
    }

    this.body.setFeetWorld(px, pz, gy);
    this.body.resolvePenetration();
    this.body.yaw = player.yaw;
    this.body.desiredYaw = player.yaw;
    this.root.visible = true;
    this.active = true;
    this._navPath = null;
    this._navIdx = 0;
    this._stuckT = 0;
    this.body.syncRoot(this.root);
    this._setMoving(false);
  }

  hide() {
    this.active = false;
    this.root.visible = false;
    this.mixer.stopAllAction();
    this.moving = false;
    this._navPath = null;
  }

  _setMoving(on) {
    if (!this.moveAction) return;
    if (on === this.moving) return;
    this.moving = on;

    if (!this.idleAction) {
      if (!this.moveAction.isRunning()) this.moveAction.play();
      this.moveAction.timeScale = on ? 1 : 0.15;
      return;
    }

    if (on) {
      this.idleAction.fadeOut(0.22);
      if (!this.moveAction.isRunning()) this.moveAction.play();
      this.moveAction.fadeIn(0.22);
    } else {
      this.moveAction.fadeOut(0.28);
      if (!this.idleAction.isRunning()) this.idleAction.play();
      this.idleAction.fadeIn(0.28);
    }
  }

  _chaseTarget(player) {
    if (this.followBehind) {
      player.camera.getWorldDirection(_fwd);
      _fwd.y = 0;
      if (_fwd.lengthSq() < 1e-10) _fwd.set(0, 0, 1);
      else _fwd.normalize();
      _target.copy(player.position).addScaledVector(_fwd, -this.followDist);
      return _target;
    }
    return player.position;
  }

  _needsReplan(goalX, goalZ) {
    if (this._replanCooldown > 0 && this._stuckT < STUCK_REPLAN) return false;
    if (!this._navPath?.length) return true;
    if (this._stuckT >= STUCK_REPLAN) return true;
    const gx = this._lastGoalX;
    const gz = this._lastGoalZ;
    if (!Number.isFinite(gx)) return true;
    return Math.hypot(goalX - gx, goalZ - gz) > GOAL_REPLAN_DIST;
  }

  _replanNav(goalX, goalZ, player) {
    const sx = this.body.position.x;
    const sz = this.body.position.z;
    const blocked = cachedBlocked((x, z) => this._pathBlocked(x, z));
    const goals = [
      { x: goalX, z: goalZ },
      { x: player.position.x, z: player.position.z },
      { x: sx + (goalX - sx) * 0.5, z: sz + (goalZ - sz) * 0.5 },
    ];

    let path = null;
    for (const goal of goals) {
      if (hasDirectPath(sx, sz, goal.x, goal.z, blocked)) {
        path = [{ x: goal.x, z: goal.z }];
        goalX = goal.x;
        goalZ = goal.z;
        break;
      }
      path = findNavPathWithFallback(sx, sz, goal.x, goal.z, blocked);
      if (path?.length) {
        goalX = goal.x;
        goalZ = goal.z;
        break;
      }
    }

    this._navPath = path;
    this._navIdx = 0;
    this._lastGoalX = goalX;
    this._lastGoalZ = goalZ;
    this._stuckT = 0;
    this._replanCooldown = REPLAN_COOLDOWN;
  }

  _advanceNavIdx() {
    if (!this._navPath?.length) return;
    const px = this.body.position.x;
    const pz = this.body.position.z;
    while (this._navIdx < this._navPath.length - 1) {
      const wp = this._navPath[this._navIdx];
      const dx = px - wp.x;
      const dz = pz - wp.z;
      if (dx * dx + dz * dz < WP_REACHED * WP_REACHED) this._navIdx++;
      else break;
    }
  }

  _moveGoalFromPath(goalX, goalZ, player) {
    if (this._needsReplan(goalX, goalZ)) this._replanNav(goalX, goalZ, player);

    if (!this._navPath?.length) {
      _moveGoal.set(goalX, 0, goalZ);
      return _moveGoal;
    }

    this._advanceNavIdx();
    const wp = this._navPath[this._navIdx];
    _moveGoal.set(wp.x, 0, wp.z);
    return _moveGoal;
  }

  update(dt, player) {
    if (!this.active) return;

    if (this._replanCooldown > 0) this._replanCooldown -= dt;

    if (this._stuckT >= STUCK_TELEPORT) {
      this.spawn(player, player.groundY);
      return;
    }

    _target.copy(this._chaseTarget(player));
    const navGoal = this._moveGoalFromPath(_target.x, _target.z, player);

    _toPlayer.subVectors(navGoal, this.body.position);
    _toPlayer.y = 0;
    const dist = _toPlayer.length();

    let moved = 0;
    if (dist > 0.15) {
      const speed = dist > RUN_DIST ? RUN_SPEED : WALK_SPEED;
      moved = this.body.moveToward(_toPlayer.x, _toPlayer.z, speed, dt);
      if (moved < 0.0005) this._stuckT += dt;
      else this._stuckT = Math.max(0, this._stuckT - dt * 0.5);
    } else if (this._navPath?.length && this._navIdx < this._navPath.length - 1) {
      this._advanceNavIdx();
      this._stuckT = 0;
    } else {
      this._stuckT = 0;
    }

    if (moved < 0.0005 && this._stuckT >= STUCK_NUDGE) {
      moved = this.body.nudgeUnstuck();
      if (moved > 0) {
        this._stuckT = 0;
        this._replanCooldown = 0;
        this._lastGoalX = NaN;
      }
    }

    if (moved > 0.002) this._moveHold = MOVE_HOLD;
    else this._moveHold = Math.max(0, this._moveHold - dt);
    this._setMoving(this._moveHold > 0);

    this.body.smoothYaw(dt);
    this.body.updateVertical(dt);
    this.body.syncRoot(this.root);
    this.mixer.update(dt);
  }
}
