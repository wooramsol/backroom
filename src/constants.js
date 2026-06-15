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
export const FOG_FAR = 44;
export const FOG_COLOR = 0xe5e4ad;
/** Warm fill — ceiling lit by fixtures, not harsh self-glow */
export const AMBIENT_COLOR = 0xe8e4c8;
export const AMBIENT_INTENSITY = 0.08;
export const HEMI_SKY = 0xfff8e8;
export const HEMI_GROUND = 0xe8e4ad;
export const HEMI_INTENSITY = 0.1;
export const LIGHT_PANEL_COLOR = 0xfff8e8;
export const LIGHT_PANEL_OFF_COLOR = 0x6a6458;
export const LIGHT_PANEL_BRIGHT = 0.92;
export const PANEL_W = 1.15;
export const PANEL_H = 0.42;
export const PANEL_RECESS_DEPTH = 0.008;
export const PANEL_ON_CHANCE = 0.72;
/** PointLight pools — omnidirectional, lights ceiling + floor naturally */
export const ROOM_LIGHT_POOL = 9;
export const PANEL_LIGHT_POOL = 14;
export const ROOM_POINT_INTENSITY = 58;
export const ROOM_POINT_DISTANCE = 15;
export const PANEL_POINT_INTENSITY = 42;
export const PANEL_POINT_DISTANCE = 6.5;
export const TONE_MAPPING_EXPOSURE = 0.82;
export const CARPET_COLOR = 0xf0e8a8;
export const CEILING_COLOR = 0xf8f0a8;
/** Subtle tile bleed near lit panels — not a flat self-lit plane */
export const CEILING_EMISSIVE_MIN = 0;
export const CEILING_EMISSIVE_MAX = 0.1;
export const WALL_COLOR = 0xffffff;

/** @deprecated use CHUNK */
export const CELL = CHUNK;
export const HW = CHUNK_HW;
