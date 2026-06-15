/** Level 0 grid — one chunk = one connectable room cell */
export const CHUNK = 14;
export const CHUNK_HW = CHUNK / 2;
export const MIN_ROOM_W = 9;
export const MAX_ROOM_W = 14;
export const MIN_ROOM_D = 9;
export const MAX_ROOM_D = 14;
export const WALL_T = 0.16;
export const DOOR_H = 2.2;
export const DOOR_CLEAR = 0.42;
/** Fixed ceiling height */
export const ROOM_H = 2.7;
export const MIN_ROOM_H = ROOM_H;
export const MAX_ROOM_H = ROOM_H;
export const EYE_H = 1.62;
export const PLAYER_R = 0.3;
/** Narrower FOV — 72° caused heavy edge distortion that felt tilted */
export const CAMERA_FOV = 60;
export const MOUSE_SENS = 0.0022;
/** ~±68° — old ±83° made doorways look skewed when looking down */
export const PITCH_LIMIT = 1.18;
/** Hazy yellow-green liminal atmosphere */
export const FOG_COLOR = 0xe8e6c4;
export const FOG_DENSITY = 0.022;
export const AMBIENT_COLOR = 0xf0f5cf;
export const AMBIENT_INTENSITY = 0.32;
export const HEMI_SKY = 0xf4f2e4;
export const HEMI_GROUND = 0x7a6848;
export const HEMI_INTENSITY = 0.28;
export const LIGHT_PANEL_COLOR = 0xfffae8;
export const LIGHT_PANEL_INTENSITY = 0.78;
export const FLUORESCENT_LIGHT_COLOR = 0xfff6dc;
export const FLUORESCENT_LIGHT_INTENSITY = 0.62;
export const FLUORESCENT_LIGHT_DISTANCE = 6.5;
export const FLUORESCENT_LIGHT_DECAY = 2;
export const TONE_MAPPING_EXPOSURE = 0.92;
/** Stronger separation: darker floor, lighter ceiling, cream walls */
export const CARPET_COLOR = 0xa08850;
export const CEILING_COLOR = 0xf2eee0;
export const WALL_COLOR = 0xf8f6e8;
export const BASEBOARD_COLOR = 0x4a3a28;
export const BASEBOARD_H = 0.1;
export const CROWN_COLOR = 0x5c4c38;
export const CROWN_H = 0.07;

/** @deprecated use CHUNK */
export const CELL = CHUNK;
export const HW = CHUNK_HW;
