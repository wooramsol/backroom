import * as THREE from "three";

const STATIC_SIZE = 96;
const AUDIO_RANGE = 5.5;

let _canvas;
let _ctx;
let _staticTex;
let _frame = 0;

function staticTexture() {
  if (_staticTex) return _staticTex;
  _canvas = document.createElement("canvas");
  _canvas.width = _canvas.height = STATIC_SIZE;
  _ctx = _canvas.getContext("2d");
  _staticTex = new THREE.CanvasTexture(_canvas);
  _staticTex.colorSpace = THREE.SRGBColorSpace;
  _staticTex.wrapS = _staticTex.wrapT = THREE.RepeatWrapping;
  return _staticTex;
}

function refreshStaticTexture() {
  const tex = staticTexture();
  const imageData = _ctx.createImageData(STATIC_SIZE, STATIC_SIZE);
  const d = imageData.data;
  for (let i = 0; i < d.length; i += 4) {
    const on = Math.random() < 0.58;
    const v = on ? (Math.random() * 255) | 0 : 0;
    d[i] = d[i + 1] = d[i + 2] = v;
    d[i + 3] = on ? 255 : 0;
  }
  _ctx.putImageData(imageData, 0, 0);
  tex.needsUpdate = true;
}

/** TV-snow emissive overlay on chair meshes */
export function applyChairStaticVisual(pivot) {
  const tex = staticTexture();
  pivot.userData.isChair = true;
  pivot.traverse((obj) => {
    if (!obj.isMesh || !obj.material) return;
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const mat of mats) {
      mat.emissiveMap = tex;
      mat.emissive = new THREE.Color(0x9a9a9a);
      mat.emissiveIntensity = 0.28;
      mat.userData.chairStatic = true;
    }
  });
}

export function tickChairStaticVisuals(scene, time) {
  _frame++;
  if (_frame % 2 !== 0) return;
  refreshStaticTexture();

  const flicker = 0.18 + Math.sin(time * 37.7) * 0.08 + Math.random() * 0.22;
  scene.traverse((obj) => {
    if (!obj.isMesh?.material) return;
    const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
    for (const mat of mats) {
      if (!mat.userData?.chairStatic) continue;
      mat.emissiveIntensity = flicker + Math.random() * 0.18;
    }
  });
}

/** Crackling static when the player nears a chair */
export class ChairStaticAudio {
  constructor() {
    this.chairs = [];
    this.ctx = null;
    this.gain = null;
    this.running = false;
  }

  setChairs(chairs) {
    this.chairs = chairs;
  }

  start() {
    if (this.running) return;
    try {
      this.ctx = new AudioContext();
      const master = this.ctx.createGain();
      master.gain.value = 0;
      master.connect(this.ctx.destination);
      this.gain = master;

      const bufferSize = 2 * this.ctx.sampleRate;
      const buf = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      const noise = this.ctx.createBufferSource();
      noise.buffer = buf;
      noise.loop = true;

      const hp = this.ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 900;

      const bp = this.ctx.createBiquadFilter();
      bp.type = "bandpass";
      bp.frequency.value = 3200;
      bp.Q.value = 0.7;

      noise.connect(hp);
      hp.connect(bp);
      bp.connect(master);
      noise.start();
      this.running = true;
    } catch {
      /* audio blocked */
    }
  }

  tick(playerPos, time) {
    if (!this.ctx || !this.gain) return;

    let nearest = Infinity;
    for (const c of this.chairs) {
      const dx = playerPos.x - c.x;
      const dy = playerPos.y - c.y;
      const dz = playerPos.z - c.z;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (d < nearest) nearest = d;
    }

    let vol = 0;
    if (nearest < AUDIO_RANGE) {
      const t = 1 - nearest / AUDIO_RANGE;
      vol =
        t *
        t *
        (0.12 + Math.sin(time * 48.3) * 0.04 + (Math.random() < 0.14 ? 0.18 : 0));
    }
    this.gain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.018);
  }
}
