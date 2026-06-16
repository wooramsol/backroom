/** GPU-safe cap — two RectAreaLights per panel (floor + ceiling) */
export const MAX_PANEL_LIGHTS = 80;

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
