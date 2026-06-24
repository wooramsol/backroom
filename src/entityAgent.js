import * as THREE from "three";
import { EntityBody } from "./entityPhysics.js";

const WALK_SPEED = 3.1;
const RUN_SPEED = 5.5;
const RUN_DIST = 3.2;
const STUCK_TIME = 10;
const STUCK_PROGRESS = 0.15;

const _fwd = new THREE.Vector3();
const _target = new THREE.Vector3();
const _toPlayer = new THREE.Vector3();

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
    this._stuckTimer = 0;
    this._bestDist = Infinity;

    this.root.visible = false;
    scene.add(this.root);
  }

  setColliders(colliders) {
    this.body.setColliders(colliders);
  }

  spawn(player, groundY) {
    const gy = groundY ?? player.groundY;
    if (this.followBehind) {
      player.camera.getWorldDirection(_fwd);
      _fwd.y = 0;
      if (_fwd.lengthSq() < 1e-10) _fwd.set(0, 0, 1);
      else _fwd.normalize();
      _target.copy(player.position).addScaledVector(_fwd, -this.followDist);
      this.body.setFeetWorld(_target.x, _target.z, gy);
      this.body.yaw = player.yaw;
    } else if (this.spawnOffset) {
      this.body.setFeetWorld(
        player.position.x + this.spawnOffset[0],
        player.position.z + this.spawnOffset[1],
        gy,
      );
      this.body.yaw = Math.atan2(
        player.position.x - this.body.position.x,
        player.position.z - this.body.position.z,
      );
    } else {
      this.body.setFeetWorld(player.position.x, player.position.z, gy);
    }

    this.root.visible = true;
    this.active = true;
    this._stuckTimer = 0;
    this._bestDist = Infinity;
    this.body.syncRoot(this.root);
    this._setMoving(false);
  }

  hide() {
    this.active = false;
    this.root.visible = false;
    this.mixer.stopAllAction();
    this.moving = false;
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

  update(dt, player) {
    if (!this.active) return;

    _target.copy(this._chaseTarget(player));
    _toPlayer.subVectors(_target, this.body.position);
    _toPlayer.y = 0;
    const dist = _toPlayer.length();

    let moved = 0;
    if (dist > 0.2) {
      if (dist < this._bestDist - STUCK_PROGRESS) {
        this._bestDist = dist;
        this._stuckTimer = 0;
      } else {
        this._stuckTimer += dt;
      }

      if (this._stuckTimer >= STUCK_TIME) {
        this.spawn(player, player.groundY);
        return;
      }

      const speed = dist > RUN_DIST ? RUN_SPEED : WALK_SPEED;
      const actualSpeed = this.body.crouchBlend > 0.5 ? speed * 0.72 : speed;
      moved = this.body.moveToward(_toPlayer.x, _toPlayer.z, actualSpeed, dt);
      this._setMoving(moved > 0.001);
    } else {
      this._stuckTimer = 0;
      this._bestDist = dist;
      this.body.crouchTarget = 0;
      this._setMoving(false);
    }

    this.body.updateVertical(dt);
    this.body.syncRoot(this.root);
    this.mixer.update(dt);
  }
}
