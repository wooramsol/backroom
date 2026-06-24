import * as THREE from "three";
import { EntityBody } from "./entityPhysics.js";
import { findNavPath } from "./entityNav.js";

const WALK_SPEED = 3.1;
const RUN_SPEED = 5.5;
const RUN_DIST = 3.2;
const NAV_REPLAN = 0.28;
const WAYPOINT_R = 0.42;

const _fwd = new THREE.Vector3();
const _target = new THREE.Vector3();
const _toPlayer = new THREE.Vector3();
const _moveGoal = new THREE.Vector3();

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
    this._navTimer = 0;
    this._stuckT = 0;

    this.root.visible = false;
    scene.add(this.root);
  }

  setColliders(colliders) {
    this.body.setColliders(colliders);
    this._navPath = null;
    this._navTimer = 0;
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
        this.root.visible = true;
        this.active = true;
        this._navPath = null;
        this._navTimer = 0;
        this.body.syncRoot(this.root);
        this._setMoving(false);
        return;
      }
    }

    this.body.setFeetWorld(px, pz, gy);
    this.body.resolvePenetration();
    this.body.yaw = player.yaw;
    this.root.visible = true;
    this.active = true;
    this._navPath = null;
    this._navTimer = 0;
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
    if (on === this.moving && this.idleAction) return;
    this.moving = on;

    if (!this.idleAction) {
      if (!this.moveAction.isRunning()) this.moveAction.play();
      this.moveAction.timeScale = on ? 1 : 0.1;
      return;
    }

    if (on) {
      this.idleAction.fadeOut(0.15);
      this.moveAction.reset().fadeIn(0.15).play();
    } else {
      this.moveAction.fadeOut(0.15);
      this.idleAction.reset().fadeIn(0.15).play();
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

  _replanNav(goalX, goalZ) {
    const sx = this.body.position.x;
    const sz = this.body.position.z;
    const blocked = (x, z) => this.body.insideWall(x, z);
    this._navPath = findNavPath(sx, sz, goalX, goalZ, blocked);
    this._navIdx = 0;
    this._navTimer = NAV_REPLAN;
  }

  _navGoal(goalX, goalZ) {
    if (!this._navPath || this._navTimer <= 0 || this._stuckT > 0.45) {
      this._replanNav(goalX, goalZ);
      this._stuckT = 0;
    }

    if (!this._navPath?.length) {
      _moveGoal.set(goalX, 0, goalZ);
      return _moveGoal;
    }

    while (this._navIdx < this._navPath.length - 1) {
      const wp = this._navPath[this._navIdx];
      const dx = this.body.position.x - wp.x;
      const dz = this.body.position.z - wp.z;
      if (dx * dx + dz * dz < WAYPOINT_R * WAYPOINT_R) this._navIdx++;
      else break;
    }

    const wp = this._navPath[this._navIdx];
    _moveGoal.set(wp.x, 0, wp.z);
    return _moveGoal;
  }

  update(dt, player) {
    if (!this.active) return;

    this._navTimer -= dt;

    _target.copy(this._chaseTarget(player));
    const navGoal = this._navGoal(_target.x, _target.z);

    _toPlayer.subVectors(navGoal, this.body.position);
    _toPlayer.y = 0;
    const dist = _toPlayer.length();

    let moved = 0;
    if (dist > 0.2) {
      const speed = dist > RUN_DIST ? RUN_SPEED : WALK_SPEED;
      moved = this.body.moveToward(_toPlayer.x, _toPlayer.z, speed, dt);
      if (moved < 0.0005) this._stuckT += dt;
      else this._stuckT = 0;
      this._setMoving(moved > 0.001);
    } else {
      this._stuckT = 0;
      this._setMoving(false);
    }

    this.body.updateVertical(dt);
    this.body.syncRoot(this.root);
    this.mixer.update(dt);
  }
}
