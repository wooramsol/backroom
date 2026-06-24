import * as THREE from "three";
import { EntityBody } from "./entityPhysics.js";
import { findNavPath } from "./entityNav.js";

const WALK_SPEED = 3.1;
const RUN_SPEED = 5.5;
const RUN_DIST = 3.2;
const LOOK_AHEAD = 1.35;
const GOAL_REPLAN_DIST = 2.2;
const STUCK_REPLAN = 0.55;
const MOVE_HOLD = 0.12;

const _fwd = new THREE.Vector3();
const _target = new THREE.Vector3();
const _toPlayer = new THREE.Vector3();
const _moveGoal = new THREE.Vector3();
const _pos = new THREE.Vector3();

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

/** One GLB entity that chases the player with collision + animation */
export class EntityAgent {
  constructor(data, scene, opts = {}) {
    this.id = opts.id || "entity";
    this.active = false;
    this.root = data.model;
    this.followBehind = opts.followBehind === true;
    this.followDist = opts.followDist ?? 2.35;
    this.spawnOffset = opts.spawnOffset ?? null;

    this.body = new EntityBody({ footOffset: data.footOffset ?? 0 });
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

    for (let i = 0; i < 12; i++) {
      const ang = player.yaw + Math.PI + (i / 12) * Math.PI * 2;
      candidates.push({
        x: px + Math.sin(ang) * this.followDist,
        z: pz + Math.cos(ang) * this.followDist,
      });
    }

    for (const scale of [0.65, 0.4, 1.15]) {
      candidates.push({ x: px + scale, z: pz }, { x: px - scale, z: pz });
      candidates.push({ x: px, z: pz + scale }, { x: px, z: pz - scale });
    }

    for (const pos of candidates) {
      if (!this.body.insideWall(pos.x, pos.z)) {
        this.body.setFeetWorld(pos.x, pos.z, gy);
        this.body.yaw = Math.atan2(px - pos.x, pz - pos.z);
        this.body.desiredYaw = this.body.yaw;
        this.root.visible = true;
        this.active = true;
        this._navPath = null;
        this._navIdx = 0;
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
    if (!this._navPath?.length) return true;
    if (this._stuckT >= STUCK_REPLAN) return true;
    const gx = this._lastGoalX;
    const gz = this._lastGoalZ;
    if (!Number.isFinite(gx)) return true;
    return Math.hypot(goalX - gx, goalZ - gz) > GOAL_REPLAN_DIST;
  }

  _replanNav(goalX, goalZ) {
    const sx = this.body.position.x;
    const sz = this.body.position.z;
    const blocked = (x, z) => this.body.insideWall(x, z);
    this._navPath = findNavPath(sx, sz, goalX, goalZ, blocked);
    this._navIdx = 0;
    this._lastGoalX = goalX;
    this._lastGoalZ = goalZ;
    this._stuckT = 0;
  }

  _advanceNavIdx() {
    if (!this._navPath?.length) return;
    const px = this.body.position.x;
    const pz = this.body.position.z;
    while (this._navIdx < this._navPath.length - 1) {
      const wp = this._navPath[this._navIdx];
      const dx = px - wp.x;
      const dz = pz - wp.z;
      if (dx * dx + dz * dz < 0.28 * 0.28) this._navIdx++;
      else break;
    }
  }

  _lookAheadGoal(goalX, goalZ) {
    if (this._needsReplan(goalX, goalZ)) this._replanNav(goalX, goalZ);

    if (!this._navPath?.length) {
      _moveGoal.set(goalX, 0, goalZ);
      return _moveGoal;
    }

    this._advanceNavIdx();
    _pos.set(this.body.position.x, 0, this.body.position.z);

    let remain = LOOK_AHEAD;
    for (let i = this._navIdx; i < this._navPath.length; i++) {
      const wp = this._navPath[i];
      const dx = wp.x - _pos.x;
      const dz = wp.z - _pos.z;
      const seg = Math.hypot(dx, dz);
      if (seg >= remain || i === this._navPath.length - 1) {
        if (seg < 1e-5) {
          _moveGoal.set(wp.x, 0, wp.z);
        } else {
          const t = Math.min(1, remain / seg);
          _moveGoal.set(_pos.x + dx * t, 0, _pos.z + dz * t);
        }
        return _moveGoal;
      }
      remain -= seg;
      _pos.set(wp.x, 0, wp.z);
    }

    const last = this._navPath[this._navPath.length - 1];
    _moveGoal.set(last.x, 0, last.z);
    return _moveGoal;
  }

  update(dt, player) {
    if (!this.active) return;

    _target.copy(this._chaseTarget(player));
    const navGoal = this._lookAheadGoal(_target.x, _target.z);

    _toPlayer.subVectors(navGoal, this.body.position);
    _toPlayer.y = 0;
    const dist = _toPlayer.length();

    let moved = 0;
    if (dist > 0.2) {
      const speed = dist > RUN_DIST ? RUN_SPEED : WALK_SPEED;
      moved = this.body.moveToward(_toPlayer.x, _toPlayer.z, speed, dt);
      if (moved < 0.0005) this._stuckT += dt;
      else this._stuckT = 0;
    } else {
      this._stuckT = 0;
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
