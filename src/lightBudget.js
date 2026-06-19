/** GPU-safe cap — pooled RectAreaLights (each one is expensive) */
export const MAX_PANEL_LIGHTS = 32;
/** Nearby panels stay lit even when behind the camera (stops rotate-in-place flicker) */
export const LIGHT_KEEP_RADIUS = 20;
