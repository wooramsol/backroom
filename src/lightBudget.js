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

/** Unique layer bit per zone — fixture lights only hit matching surfaces */
export function zoneLightBit(cx, cz, zoneIdx) {
  const h = (cx * 374761393 + cz * 668265263 + zoneIdx * 1274126177) | 0;
  return 1 + ((h >>> 0) % 29);
}

/** Layer 0 = ambient/hemi + layer bit = RectAreaLight for this zone */
export function applyZoneLayers(mesh, cx, cz, zoneIdx) {
  const bit = zoneLightBit(cx, cz, zoneIdx);
  mesh.layers.enable(0);
  mesh.layers.enable(bit);
  return bit;
}
