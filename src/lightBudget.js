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

/** Unique render layer per room zone — RectAreaLights only hit matching floor/ceiling */
export function zoneLightLayer(cx, cz, zoneIdx) {
  const h = (cx * 374761393 + cz * 668265263 + zoneIdx * 1274126177) | 0;
  const bit = 1 + ((h >>> 0) % 29);
  return 1 << bit;
}
