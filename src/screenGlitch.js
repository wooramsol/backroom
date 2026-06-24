let boost = 0;
let decay = 3.2;

/** Full-screen TV-static burst — higher strength = heavier corruption */
export function triggerScreenGlitch(strength = 1, duration = 0.5) {
  boost = Math.max(boost, Math.min(strength, 2.5));
  decay = Math.max(0.8, 1 / duration);
}

export function updateScreenGlitch(dt) {
  if (boost <= 0) return;
  boost = Math.max(0, boost - dt * decay);
}

export function screenGlitchBoost() {
  return boost;
}
