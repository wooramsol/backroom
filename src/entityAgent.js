import * as THREE from "three";
import { CHUNK } from "./constants.js";
import { generateRoom, isWalkableLocal, reachableCellsFrom } from "./room.js";
import { createRng } from "./rng.js";
import { EntityBody } from "./entityPhysics.js";
import { findNavPath } from "./entityNav.js";

const WALK_SPEED = 3.1;
const LOOK_AHEAD = 1.35;
const GOAL_REPLAN_DIST = 2.2;
const STUCK_REPLAN = 0.55;
const REPLAN_COOLDOWN = 0.4;
const GOAL_REACHED = 0.45;

const _target = new THREE.Vector3();
const _toGoal = new THREE.Vector3();
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

function walkableCellsInChunk(cx, cz, localX, localZ) {
  const room = generateRoom(cx, cz);
  let cells = reachableCellsFrom(room.innerWalls, localX, localZ);
  if (!cells.length) {
    for (let iz = 0; iz < Math.ceil(CHUNK / 0.5); iz++) {
      for (let ix = 0; ix < Math.ceil(CHUNK / 0.5); ix++) {
        const x = ix * 0.5 + 0.25;
        const z = iz * 0.5 + 0.25;
        if (isWalkableLocal(x, z, room.innerWalls)) cells.push({ x, z });
      }
    }
  }
  return cells.map((c) => ({ wx: cx * CHUNK + c.x, wz: cz * CHUNK + c.z }));
}

/** GLB entity with collision, pathfinding, and optional room wandering */
export class EntityAgent {
  constructor(data, scene, opts = {}) {
    this.id = opts.id || "entity";
    this.active = false;
    this.root = data.model;
    this.wanderMode = opts.wanderMode === true;

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
    this._replanCooldown = 0;
    this._lastGoalX = NaN;
    this._lastGoalZ = NaN;
    this._wanderGoalX = NaN;
    this._wanderGoalZ = NaN;
    this._wanderSeed = 901;

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
    const cx = Math.floor(player.position.x / CHUNK);
    const cz = Math.floor(player.position.z / CHUNK);
    const localX = player.position.x - cx * CHUNK;
    const localZ = player.position.z - cz * CHUNK;

    const spots = walkableCellsInChunk(cx, cz, localX, localZ).filter(
      (s) => !this.body.insideWall(s.wx, s.wz),
    );

    this._wanderSeed += 1;
    const rng = createRng(cx, cz, this._wanderSeed);
    const spot = rng.pick(spots) ?? spots[0];

    if (spot) {
      this.body.setFeetWorld(spot.wx, spot.wz, gy);
    } else {
      this.body.setFeetWorld(player.position.x, player.position.z, gy);
      this.body.resolvePenetration();
    }

    this.body.yaw = Math.random() * Math.PI * 2;
    this.body.desiredYaw = this.body.yaw;
    this.root.visible = true;
    this.active = true;
    this._navPath = null;
    this._navIdx = 0;
    this._stuckT = 0;
    this._pickWanderGoal();
    this.body.syncRoot(this.root);
    this._setWalkAnim();
  }

  hide() {
    this.active = false;
    this.root.visible = false;
    this.mixer.stopAllAction();
    this.moving = false;
    this._navPath = null;
  }

  _setWalkAnim() {
    if (!this.moveAction) return;
    this.moving = true;
    if (!this.moveAction.isRunning()) this.moveAction.play();
    this.moveAction.timeScale = 1;
    if (this.idleAction?.isRunning()) this.idleAction.fadeOut(0.15);
  }

  _pickWanderGoal() {
    const sx = this.body.position.x;
    const sz = this.body.position.z;
    const cx = Math.floor(sx / CHUNK);
    const cz = Math.floor(sz / CHUNK);
    const localX = sx - cx * CHUNK;
    const localZ = sz - cz * CHUNK;

    const spots = walkableCellsInChunk(cx, cz, localX, localZ).filter((s) => {
      if (this.body.insideWall(s.wx, s.wz)) return false;
      return Math.hypot(s.wx - sx, s.wz - sz) > 1.8;
    });

    this._wanderSeed += 1;
    const rng = createRng(cx, cz, this._wanderSeed);
    const spot = rng.pick(spots);
    if (!spot) return;

    this._wanderGoalX = spot.wx;
    this._wanderGoalZ = spot.wz;
    this._navPath = null;
    this._navIdx = 0;
    this._lastGoalX = NaN;
    this._lastGoalZ = NaN;
    this._stuckT = 0;
    this._replanCooldown = 0;
  }

  _wanderTarget() {
    _target.set(this._wanderGoalX, 0, this._wanderGoalZ);
    return _target;
  }

  _needsReplan(goalX, goalZ) {
    if (this._replanCooldown > 0) return false;
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

  update(dt, _player) {
    if (!this.active) return;

    if (this._replanCooldown > 0) this._replanCooldown -= dt;

    if (!Number.isFinite(this._wanderGoalX)) this._pickWanderGoal();

    const goal = this._wanderTarget();
    const navGoal = this._lookAheadGoal(goal.x, goal.z);

    _toGoal.subVectors(navGoal, this.body.position);
    _toGoal.y = 0;
    const dist = _toGoal.length();

    let moved = 0;
    if (dist > 0.2) {
      moved = this.body.moveToward(_toGoal.x, _toGoal.z, WALK_SPEED, dt);
      if (moved < 0.0005) this._stuckT += dt;
      else this._stuckT = 0;
    } else {
      this._stuckT += dt;
    }

    const goalDist = Math.hypot(
      this._wanderGoalX - this.body.position.x,
      this._wanderGoalZ - this.body.position.z,
    );
    if (goalDist <= GOAL_REACHED || this._stuckT >= STUCK_REPLAN) {
      this._pickWanderGoal();
    }

    this._setWalkAnim();

    this.body.smoothYaw(dt);
    this.body.updateVertical(dt);
    this.body.syncRoot(this.root);
    this.mixer.update(dt);
  }
}
