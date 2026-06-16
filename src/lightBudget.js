/** GPU-safe cap — per-panel RectAreaLights above this break wall rendering */
export const MAX_PANEL_LIGHTS = 40;

let active = 0;

export function resetPanelLightBudget() {
  active = 0;
}

export function claimPanelLight() {
  if (active >= MAX_PANEL_LIGHTS) return false;
  active++;
  return true;
}

export function releasePanelLights(count) {
  active = Math.max(0, active - count);
}

export function activePanelLightCount() {
  return active;
}

/** Layer index 1–29 — unique per room zone */
export function zoneLightBit(cx, cz, zoneIdx) {
  const h = (cx * 374761393 + cz * 668265263 + zoneIdx * 1274126177) | 0;
  return 1 + ((h >>> 0) % 29);
}

/** Enable ambient (0) + zone bit so floors keep carpet tone under RectAreaLights */
export function applyZoneLayers(mesh, cx, cz, zoneIdx) {
  const bit = zoneLightBit(cx, cz, zoneIdx);
  mesh.layers.enable(0);
  mesh.layers.enable(bit);
  return bit;
}
