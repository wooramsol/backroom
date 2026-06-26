const ASSET_BASE = import.meta.env.BASE_URL;
const BGM_URL = `${ASSET_BASE}assets/${encodeURIComponent("01. Government Funding.mp3")}`;

/** Steps per second — interval is derived from current move speed */
const STEP_CADENCE_WALK = 2.0;
const STEP_CADENCE_RUN = 2.75;
const STEP_CADENCE_CROUCH = 1.4;
const STEP_CADENCE_ENTITY_WALK = 1.85;
const STEP_CADENCE_ENTITY_RUN = 2.45;

/** Web Audio — MP3 background music + carpet footsteps */
export class GameAudio {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.sfxGain = null;
    this.bgmGain = null;
    this.bgmBuffer = null;
    this.bgmSource = null;
    this._stepAccum = 0;
    this._entityStepAccum = 0;
    this._bgmLoading = null;
  }

  _ensure() {
    if (this.ctx) return true;
    try {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = 1;
      this.master.connect(this.ctx.destination);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = 2.1;
      this.sfxGain.connect(this.master);
      return true;
    } catch {
      return false;
    }
  }

  async preload() {
    if (this.bgmBuffer) return this.bgmBuffer;
    if (this._bgmLoading) return this._bgmLoading;

    this._bgmLoading = fetch(BGM_URL)
      .then((res) => {
        if (!res.ok) throw new Error(`BGM load failed: ${res.status}`);
        return res.arrayBuffer();
      })
      .then((ab) => {
        if (!this._ensure()) return null;
        return this.ctx.decodeAudioData(ab);
      })
      .then((buf) => {
        this.bgmBuffer = buf;
        return buf;
      })
      .catch((err) => {
        console.warn("[audio] background music unavailable", err);
        return null;
      });

    return this._bgmLoading;
  }

  start() {
    if (!this._ensure()) return;
    if (this.ctx.state === "suspended") void this.ctx.resume();
    if (this.bgmSource) return;

    const play = () => {
      if (!this.bgmBuffer || this.bgmSource) return;

      const src = this.ctx.createBufferSource();
      src.buffer = this.bgmBuffer;
      src.loop = true;

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = 0.42;
      src.connect(this.bgmGain);
      this.bgmGain.connect(this.master);
      src.start();
      this.bgmSource = src;
    };

    if (this.bgmBuffer) {
      play();
      return;
    }

    void this.preload().then(play);
  }

  onLand(impactVy = 4) {
    if (!this._ensure()) return;
    if (this.ctx.state === "suspended") void this.ctx.resume();
    const impact = Math.min(1, Math.max(0.3, impactVy / 7.5));
    this._stepAccum = 0;
    this._playFootstep(false, false, { land: true, impact });
  }

  onJump() {
    if (!this._ensure()) return;
    if (this.ctx.state === "suspended") void this.ctx.resume();
    this._playFootstep(false, false, { jump: true });
  }

  onMove(distance, running, crouching = false, speed = 3.2) {
    if (!this._ensure()) return;
    if (this.ctx.state === "suspended") void this.ctx.resume();
    if (distance < 1e-5 || speed < 0.1) return;

    this._stepAccum += distance;
    const cadence = crouching ? STEP_CADENCE_CROUCH : running ? STEP_CADENCE_RUN : STEP_CADENCE_WALK;
    const interval = speed / cadence;
    while (this._stepAccum >= interval) {
      this._stepAccum -= interval;
      this._playFootstep(running, crouching);
    }
  }

  /** Distant, damped footsteps for chasing entities (e.g. skin stealer) */
  onEntityMove(distance, running, speed = 3.1, pan = 0) {
    if (!this._ensure()) return;
    if (this.ctx.state === "suspended") void this.ctx.resume();
    if (distance < 1e-5 || speed < 0.1) return;

    this._entityStepAccum += distance;
    const cadence = running ? STEP_CADENCE_ENTITY_RUN : STEP_CADENCE_ENTITY_WALK;
    const interval = speed / cadence;
    while (this._entityStepAccum >= interval) {
      this._entityStepAccum -= interval;
      this._playEntityFootstep(running, pan);
    }
  }

  _playEntityFootstep(running, pan = 0) {
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const dur = running ? 0.13 : 0.16;
    const vol = running ? 0.26 : 0.22;
    const thumpBase = running ? 58 : 48;
    const lowFreq = running ? 320 : 260;
    const midBase = running ? 145 : 118;
    const panClamped = Math.max(-1, Math.min(1, pan));

    const thump = ctx.createOscillator();
    thump.type = "triangle";
    thump.frequency.value = thumpBase + Math.random() * 18;
    const thumpGain = ctx.createGain();
    thumpGain.gain.setValueAtTime(vol * 1.1, t);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    const thumpPan = ctx.createStereoPanner();
    thumpPan.pan.value = panClamped * 0.85;
    thump.connect(thumpGain);
    thumpGain.connect(thumpPan);
    thumpPan.connect(this.sfxGain);
    thump.start(t);
    thump.stop(t + dur + 0.02);

    const frames = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < frames; i++) {
      const env = Math.pow(1 - i / frames, 1.55);
      data[i] = (Math.random() * 2 - 1) * env;
    }

    const src = ctx.createBufferSource();
    src.buffer = buf;

    const low = ctx.createBiquadFilter();
    low.type = "lowpass";
    low.frequency.value = lowFreq;
    low.Q.value = 0.7;

    const mid = ctx.createBiquadFilter();
    mid.type = "bandpass";
    mid.frequency.value = midBase + Math.random() * 40;
    mid.Q.value = 0.8;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(vol * 0.9, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.95);

    const noisePan = ctx.createStereoPanner();
    noisePan.pan.value = panClamped * 0.9;

    src.connect(low);
    low.connect(mid);
    mid.connect(noiseGain);
    noiseGain.connect(noisePan);
    noisePan.connect(this.sfxGain);
    src.start(t);
    src.stop(t + dur + 0.02);
  }

  _playFootstep(running, crouching, { jump = false, land = false, impact = 1 } = {}) {
    const ctx = this.ctx;
    const t = ctx.currentTime;
    let dur;
    let vol;
    let thumpBase;
    let lowFreq;
    let midBase;

    if (jump) {
      dur = 0.065;
      vol = 0.22;
      thumpBase = 128;
      lowFreq = 860;
      midBase = 250;
    } else if (land) {
      dur = 0.12;
      vol = 0.3 + impact * 0.38;
      thumpBase = 72 + impact * 48;
      lowFreq = 620;
      midBase = 175;
    } else {
      dur = crouching ? 0.12 : running ? 0.075 : 0.1;
      vol = crouching ? 0.24 : running ? 0.42 : 0.34;
      thumpBase = crouching ? 88 : running ? 118 : 102;
      lowFreq = crouching ? 480 : running ? 1050 : 780;
      midBase = crouching ? 165 : running ? 285 : 220;
    }

    const thump = ctx.createOscillator();
    thump.type = "sine";
    thump.frequency.value = thumpBase + Math.random() * 28;
    const thumpGain = ctx.createGain();
    thumpGain.gain.setValueAtTime(vol * 1.35, t);
    thumpGain.gain.exponentialRampToValueAtTime(0.001, t + dur);
    thump.connect(thumpGain);
    thumpGain.connect(this.sfxGain);
    thump.start(t);
    thump.stop(t + dur + 0.02);

    const frames = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < frames; i++) {
      const env = Math.pow(1 - i / frames, 1.4);
      data[i] = (Math.random() * 2 - 1) * env;
    }

    const src = ctx.createBufferSource();
    src.buffer = buf;

    const low = ctx.createBiquadFilter();
    low.type = "lowpass";
    low.frequency.value = lowFreq;
    low.Q.value = 0.55;

    const mid = ctx.createBiquadFilter();
    mid.type = "bandpass";
    mid.frequency.value = midBase + Math.random() * 70;
    mid.Q.value = 0.65;

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(vol, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + dur * 0.92);

    src.connect(low);
    low.connect(mid);
    mid.connect(noiseGain);
    noiseGain.connect(this.sfxGain);
    src.start(t);
    src.stop(t + dur + 0.02);
  }
}

/** @deprecated use GameAudio */
export class FluorescentHum extends GameAudio {}
