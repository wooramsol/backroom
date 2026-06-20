/** Shared Web Audio — fluorescent hum + procedural footsteps */
export class GameAudio {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.humGain = null;
    this.running = false;
    this._stepAccum = 0;
  }

  _ensure() {
    if (this.ctx) return true;
    try {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = 1;
      this.master.connect(this.ctx.destination);
      return true;
    } catch {
      return false;
    }
  }

  start() {
    if (!this._ensure()) return;
    if (this.ctx.state === "suspended") void this.ctx.resume();
    if (this.running) return;

    const humBus = this.ctx.createGain();
    humBus.gain.value = 0.22;
    humBus.connect(this.master);
    this.humGain = humBus;

    const hum = this.ctx.createOscillator();
    hum.type = "sawtooth";
    hum.frequency.value = 60;
    const humGain = this.ctx.createGain();
    humGain.gain.value = 0.35;
    hum.connect(humGain);
    humGain.connect(humBus);

    const buzz = this.ctx.createOscillator();
    buzz.type = "square";
    buzz.frequency.value = 120;
    const buzzGain = this.ctx.createGain();
    buzzGain.gain.value = 0.08;
    buzz.connect(buzzGain);
    buzzGain.connect(humBus);

    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuf = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuf;
    noise.loop = true;
    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = "bandpass";
    noiseFilter.frequency.value = 180;
    noiseFilter.Q.value = 0.8;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.value = 0.12;
    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(humBus);

    hum.start();
    buzz.start();
    noise.start();
    this.running = true;
  }

  tickHum(time) {
    if (!this.ctx || !this.humGain) return;
    const flicker = 0.2 + Math.sin(time * 7.3) * 0.04 + Math.sin(time * 11.1) * 0.02;
    this.humGain.gain.setTargetAtTime(flicker, this.ctx.currentTime, 0.05);
  }

  onMove(distance, running) {
    if (!this._ensure()) return;
    if (this.ctx.state === "suspended") void this.ctx.resume();
    if (distance < 1e-5) return;
    this._stepAccum += distance;
    const interval = running ? 0.44 : 0.64;
    while (this._stepAccum >= interval) {
      this._stepAccum -= interval;
      this._playFootstep(running);
    }
  }

  _playFootstep(running) {
    const ctx = this.ctx;
    const t = ctx.currentTime;
    const dur = running ? 0.055 : 0.075;
    const frames = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < frames; i++) {
      const env = 1 - i / frames;
      data[i] = (Math.random() * 2 - 1) * env * env;
    }

    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = running ? 260 + Math.random() * 80 : 190 + Math.random() * 60;
    filter.Q.value = 0.7;
    const gain = ctx.createGain();
    gain.gain.value = running ? 0.14 : 0.1;
    gain.gain.setTargetAtTime(0.001, t + dur * 0.55, 0.02);
    src.connect(filter);
    filter.connect(gain);
    gain.connect(this.master);
    src.start(t);
    src.stop(t + dur + 0.02);
  }
}

/** @deprecated use GameAudio */
export class FluorescentHum extends GameAudio {}
