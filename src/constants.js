/** Level 0 grid — one chunk = one connectable room cell */
export const CHUNK = 14;
export const CHUNK_HW = CHUNK / 2;
export const MIN_ROOM_W = 9;
export const MAX_ROOM_W = 14;
export const MIN_ROOM_D = 9;
export const MAX_ROOM_D = 14;
export const WALL_T = 0.16;
export const DOOR_H = 2.2;
export const DOOR_CLEAR = 0.48;
/** Fixed ceiling height */
export const ROOM_H = 2.7;
export const MIN_ROOM_H = ROOM_H;
export const MAX_ROOM_H = ROOM_H;
export const EYE_H = 1.62;
/** ~41 cm radius — adult torso / shoulder width */
export const PLAYER_R = 0.41;
/** Narrower FOV — 72° caused heavy edge distortion that felt tilted */
export const CAMERA_FOV = 60;
export const MOUSE_SENS = 0.0022;
/** ~±68° — old ±83° made doorways look skewed when looking down */
export const PITCH_LIMIT = 1.18;
export const FOG_NEAR = 10;
export const FOG_FAR = 42;
export const FOG_COLOR = 0x1a1810;
/** Low fill — lit rooms come from ceiling fixtures, not sky */
export const AMBIENT_COLOR = 0xa09888;
export const AMBIENT_INTENSITY = 0.06;
export const HEMI_SKY = 0x706860;
export const HEMI_GROUND = 0x281f18;
export const HEMI_INTENSITY = 0.035;
export const LIGHT_PANEL_COLOR = 0xfff8e8;
export const LIGHT_PANEL_OFF_COLOR = 0x2a2820;
/** Panel emissive visual — the lit rectangle itself */
export const LIGHT_PANEL_INTENSITY = 0.48;
export const PANEL_W = 1.15;
export const PANEL_H = 0.42;
export const PANEL_ON_CHANCE = 0.72;
/** RectAreaLight strength (nits) — light emits from panel face downward */
export const PANEL_LIGHT_INTENSITY = 7;
export const LIGHT_POOL_SIZE = 40;
export const TONE_MAPPING_EXPOSURE = 0.78;
export const CARPET_COLOR = 0xf0e8a8;
/** Reference Level 0 — pale yellow cream ceiling tiles */
export const CEILING_COLOR = 0xf5f0c8;
export const CEILING_EMISSIVE_MIN = 0.1;
export const CEILING_EMISSIVE_MAX = 0.26;
export const WALL_COLOR = 0xffffff;

/** @deprecated use CHUNK */
export const CELL = CHUNK;
export const HW = CHUNK_HW;
