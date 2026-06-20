/** Fluorescent ceiling hum — Level 0 signature sound */
export class FluorescentHum {
  constructor() {
    this.ctx = null;
    this.gain = null;
    this.running = false;
  }

  start() {
    if (this.running) return;
    try {
      this.ctx = new AudioContext();
      const master = this.ctx.createGain();
      master.gain.value = 0.22;
      master.connect(this.ctx.destination);
      this.gain = master;

      const hum = this.ctx.createOscillator();
      hum.type = "sawtooth";
      hum.frequency.value = 60;
      const humGain = this.ctx.createGain();
      humGain.gain.value = 0.35;
      hum.connect(humGain);
      humGain.connect(master);

      const buzz = this.ctx.createOscillator();
      buzz.type = "square";
      buzz.frequency.value = 120;
      const buzzGain = this.ctx.createGain();
      buzzGain.gain.value = 0.08;
      buzz.connect(buzzGain);
      buzzGain.connect(master);

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
      noiseGain.connect(master);

      hum.start();
      buzz.start();
      noise.start();
      this.running = true;
    } catch {
      /* audio blocked */
    }
  }

  tick(time) {
    if (!this.ctx || !this.gain) return;
    const flicker = 0.2 + Math.sin(time * 7.3) * 0.04 + Math.sin(time * 11.1) * 0.02;
    this.gain.gain.setTargetAtTime(flicker, this.ctx.currentTime, 0.05);
  }
}
