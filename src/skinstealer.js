import * as THREE from "three";

const FOLLOW_DIST = 2.35;
const WALK_SPEED = 3.15;
const RUN_SPEED = 5.6;
const CATCH_LERP = 9;
const ROT_LERP = 12;

const _fwd = new THREE.Vector3();
const _target = new THREE.Vector3();
const _delta = new THREE.Vector3();

function pickClip(clips, patterns) {
  for (const re of patterns) {
    const hit = clips.find((c) => re.test(c.name));
    if (hit) return hit;
  }
  return clips[0] || null;
}

/** Animated stalker that trails behind the player */
export class Skinstealer {
  constructor(data, scene) {
    this.active = false;
    this.root = data.model;
    this.footOffset = data.footOffset ?? 0;
    this.moving = false;

    this.mixer = new THREE.AnimationMixer(this.root);
    const clips = data.animations || [];
    const moveClip = pickClip(clips, [/walk|run|move|chase|locomotion|mixamo/i]);
    const idleClip =
      clips.find((c) => c !== moveClip && /idle|stand|breath/i.test(c.name)) || null;

    this.moveAction = moveClip ? this.mixer.clipAction(moveClip) : null;
    this.idleAction = idleClip ? this.mixer.clipAction(idleClip) : null;

    if (this.moveAction) {
      this.moveAction.setLoop(THREE.LoopRepeat);
      this.moveAction.clampWhenFinished = false;
    }
    if (this.idleAction) {
      this.idleAction.setLoop(THREE.LoopRepeat);
    }

    this.root.visible = false;
    scene.add(this.root);
  }

  spawnBehind(player) {
    this._syncForward(player);
    _target.copy(player.position).addScaledVector(_fwd, -FOLLOW_DIST);
    this.root.position.set(_target.x, player.groundY - this.footOffset, _target.z);
    this.root.rotation.y = player.yaw;
    this.root.visible = true;
    this.active = true;
    this._setMoving(false);
  }

  hide() {
    this.active = false;
    this.root.visible = false;
    this.mixer.stopAllAction();
    this.moving = false;
  }

  _syncForward(player) {
    player.camera.getWorldDirection(_fwd);
    _fwd.y = 0;
    if (_fwd.lengthSq() < 1e-10) _fwd.set(0, 0, 1);
    else _fwd.normalize();
  }

  _setMoving(on) {
    if (!this.moveAction) return;
    if (on === this.moving && this.idleAction) return;
    this.moving = on;

    if (!this.idleAction) {
      if (!this.moveAction.isRunning()) this.moveAction.play();
      this.moveAction.timeScale = on ? 1 : 0.12;
      return;
    }

    if (on) {
      this.idleAction?.fadeOut(0.2);
      this.moveAction.reset().fadeIn(0.2).play();
    } else if (this.idleAction) {
      this.moveAction.fadeOut(0.2);
      this.idleAction.reset().fadeIn(0.2).play();
    } else {
      this.moveAction.fadeOut(0.2);
    }
  }

  update(dt, player) {
    if (!this.active) return;

    this._syncForward(player);
    _target.copy(player.position).addScaledVector(_fwd, -FOLLOW_DIST);
    _target.y = player.groundY - this.footOffset;

    _delta.subVectors(_target, this.root.position);
    _delta.y = 0;
    const dist = _delta.length();

    if (dist > 0.08) {
      const speed = dist > FOLLOW_DIST * 1.35 ? RUN_SPEED : WALK_SPEED;
      const step = Math.min(dist, speed * dt);
      _delta.normalize();
      this.root.position.addScaledVector(_delta, step);
      const faceYaw = Math.atan2(_delta.x, _delta.z);
      this.root.rotation.y = THREE.MathUtils.lerp(
        this.root.rotation.y,
        faceYaw,
        Math.min(1, ROT_LERP * dt),
      );
      this._setMoving(true);
    } else {
      this.root.position.lerp(_target, Math.min(1, CATCH_LERP * dt));
      this.root.rotation.y = THREE.MathUtils.lerp(
        this.root.rotation.y,
        player.yaw,
        Math.min(1, ROT_LERP * dt),
      );
      this._setMoving(false);
    }

    this.mixer.update(dt);
  }
}
