const ASSET_BASE = import.meta.env.BASE_URL;
const BGM_URL = `${ASSET_BASE}assets/${encodeURIComponent("01. Government Funding.mp3")}`;

/** Steps per second — interval is derived from current move speed */
const STEP_CADENCE_WALK = 2.0;
const STEP_CADENCE_RUN = 2.75;
const STEP_CADENCE_CROUCH = 1.4;

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

  _playFootstep(running, crouching) {
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const dur = crouching ? 0.12 : running ? 0.075 : 0.1;
    const vol = crouching ? 0.24 : running ? 0.42 : 0.34;

    const thump = ctx.createOscillator();
    thump.type = "sine";
    thump.frequency.value = (crouching ? 88 : running ? 118 : 102) + Math.random() * 28;
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
    low.frequency.value = crouching ? 480 : running ? 1050 : 780;
    low.Q.value = 0.55;

    const mid = ctx.createBiquadFilter();
    mid.type = "bandpass";
    mid.frequency.value = (crouching ? 165 : running ? 285 : 220) + Math.random() * 70;
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
