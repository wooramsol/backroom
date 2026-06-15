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
export const FOG_NEAR = 8;
export const FOG_FAR = 36;
export const FOG_COLOR = 0xc9b87a;
export const AMBIENT_COLOR = 0x9a8a68;
export const AMBIENT_INTENSITY = 0.52;
export const HEMI_SKY = 0xfff0c8;
export const HEMI_GROUND = 0x5a4a30;
export const HEMI_INTENSITY = 0.34;
export const LIGHT_PANEL_COLOR = 0xfff4d0;
export const LIGHT_PANEL_INTENSITY = 0.88;
export const TONE_MAPPING_EXPOSURE = 1.02;

/** @deprecated use CHUNK */
export const CELL = CHUNK;
export const HW = CHUNK_HW;
