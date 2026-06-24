const STICK_RADIUS = 52;
const STICK_DEAD = 0.12;

/** On-screen touch controls: left move stick, right look drag, jump button. */
export class MobileControls {
  constructor(root) {
    this.root = root;
    this.active = false;
    this.move = { x: 0, y: 0, strength: 0 };
    this.look = { dx: 0, dy: 0 };
    this._jumpQueued = false;

    this._stickBase = root.querySelector(".mc-stick-base");
    this._stickKnob = root.querySelector(".mc-stick-knob");
    this._lookZone = root.querySelector(".mc-look-zone");
    this._btnJump = root.querySelector(".mc-btn-jump");

    this._stickTouchId = null;
    this._stickOrigin = { x: 0, y: 0 };
    this._lookTouchId = null;
    this._lookLast = { x: 0, y: 0 };

    this._onStickStart = (e) => this._stickDown(e);
    this._onStickMove = (e) => this._stickMove(e);
    this._onStickEnd = (e) => this._stickUp(e);
    this._onLookStart = (e) => this._lookDown(e);
    this._onLookMove = (e) => this._lookMove(e);
    this._onLookEnd = (e) => this._lookUp(e);
    this._onJump = (e) => {
      e.preventDefault();
      this._jumpQueued = true;
      this._btnJump?.classList.add("pressed");
      window.setTimeout(() => this._btnJump?.classList.remove("pressed"), 120);
    };
  }

  mount() {
    this._stickBase?.addEventListener("touchstart", this._onStickStart, { passive: false });
    this._stickBase?.addEventListener("touchmove", this._onStickMove, { passive: false });
    this._stickBase?.addEventListener("touchend", this._onStickEnd);
    this._stickBase?.addEventListener("touchcancel", this._onStickEnd);

    this._lookZone?.addEventListener("touchstart", this._onLookStart, { passive: false });
    this._lookZone?.addEventListener("touchmove", this._onLookMove, { passive: false });
    this._lookZone?.addEventListener("touchend", this._onLookEnd);
    this._lookZone?.addEventListener("touchcancel", this._onLookEnd);

    this._btnJump?.addEventListener("touchstart", this._onJump, { passive: false });
  }

  show() {
    this.active = true;
    this.root.hidden = false;
    this.root.classList.add("visible");
  }

  hide() {
    this.active = false;
    this.root.classList.remove("visible");
    this.root.hidden = true;
    this._reset();
  }

  consumeJump() {
    if (!this._jumpQueued) return false;
    this._jumpQueued = false;
    return true;
  }

  consumeLook() {
    const dx = this.look.dx;
    const dy = this.look.dy;
    this.look.dx = 0;
    this.look.dy = 0;
    return { dx, dy };
  }

  _reset() {
    this.move.x = 0;
    this.move.y = 0;
    this.move.strength = 0;
    this.look.dx = 0;
    this.look.dy = 0;
    this._jumpQueued = false;
    this._stickTouchId = null;
    this._lookTouchId = null;
    this._btnJump?.classList.remove("pressed");
    this._stickKnob?.style.setProperty("transform", "translate(-50%, -50%)");
  }

  _stickDown(e) {
    if (!this.active || this._stickTouchId !== null) return;
    const t = e.changedTouches[0];
    if (!t) return;
    e.preventDefault();
    this._stickTouchId = t.identifier;
    const rect = this._stickBase.getBoundingClientRect();
    this._stickOrigin.x = rect.left + rect.width / 2;
    this._stickOrigin.y = rect.top + rect.height / 2;
    this._updateStick(t.clientX, t.clientY);
  }

  _stickMove(e) {
    if (this._stickTouchId === null) return;
    const t = this._findTouch(e, this._stickTouchId);
    if (!t) return;
    e.preventDefault();
    this._updateStick(t.clientX, t.clientY);
  }

  _stickUp(e) {
    if (this._stickTouchId === null) return;
    const t = this._findTouch(e, this._stickTouchId);
    if (!t && e.type !== "touchcancel") return;
    this._stickTouchId = null;
    this.move.x = 0;
    this.move.y = 0;
    this.move.strength = 0;
    this._stickKnob?.style.setProperty("transform", "translate(-50%, -50%)");
  }

  _updateStick(clientX, clientY) {
    let dx = clientX - this._stickOrigin.x;
    let dy = clientY - this._stickOrigin.y;
    const len = Math.hypot(dx, dy);
    const max = STICK_RADIUS;
    if (len > max) {
      dx = (dx / len) * max;
      dy = (dy / len) * max;
    }
    this._stickKnob?.style.setProperty(
      "transform",
      `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`,
    );
    const nx = dx / max;
    const ny = dy / max;
    const mag = Math.hypot(nx, ny);
    if (mag < STICK_DEAD) {
      this.move.x = 0;
      this.move.y = 0;
      this.move.strength = 0;
    } else {
      this.move.x = nx;
      this.move.y = ny;
      this.move.strength = mag;
    }
  }

  _lookDown(e) {
    if (!this.active || this._lookTouchId !== null) return;
    const t = e.changedTouches[0];
    if (!t) return;
    e.preventDefault();
    this._lookTouchId = t.identifier;
    this._lookLast.x = t.clientX;
    this._lookLast.y = t.clientY;
  }

  _lookMove(e) {
    if (this._lookTouchId === null) return;
    const t = this._findTouch(e, this._lookTouchId);
    if (!t) return;
    e.preventDefault();
    this.look.dx += t.clientX - this._lookLast.x;
    this.look.dy += t.clientY - this._lookLast.y;
    this._lookLast.x = t.clientX;
    this._lookLast.y = t.clientY;
  }

  _lookUp(e) {
    if (this._lookTouchId === null) return;
    const t = this._findTouch(e, this._lookTouchId);
    if (!t && e.type !== "touchcancel") return;
    this._lookTouchId = null;
  }

  _findTouch(e, id) {
    for (const t of e.changedTouches) {
      if (t.identifier === id) return t;
    }
    for (const t of e.touches) {
      if (t.identifier === id) return t;
    }
    return null;
  }
}
