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
/** Fog only in the far distance — keeps nearby edges readable */
export const FOG_COLOR = 0xd4d0b4;
export const FOG_NEAR = 28;
export const FOG_FAR = 52;
export const AMBIENT_COLOR = 0xffffff;
export const AMBIENT_INTENSITY = 0.16;
export const HEMI_SKY = 0xf8f6ee;
export const HEMI_GROUND = 0x3a2e1c;
export const HEMI_INTENSITY = 0.22;
export const LIGHT_PANEL_COLOR = 0xffffff;
export const LIGHT_PANEL_INTENSITY = 0.95;
export const FLUORESCENT_LIGHT_COLOR = 0xfff4d8;
export const FLUORESCENT_LIGHT_INTENSITY = 1.05;
export const FLUORESCENT_LIGHT_DISTANCE = 8;
export const FLUORESCENT_LIGHT_DECAY = 2;
export const TONE_MAPPING_EXPOSURE = 1.02;
/** Strong surface separation */
export const CARPET_COLOR = 0x6b5230;
export const CEILING_COLOR = 0xf4f2ea;
export const WALL_COLOR = 0xffffff;
export const BASEBOARD_COLOR = 0x120c08;
export const BASEBOARD_H = 0.15;
export const WAINSCOT_COLOR = 0x5c4c38;
export const WAINSCOT_H = 0.42;
export const CROWN_COLOR = 0x120c08;
export const CROWN_H = 0.1;
export const FLOOR_SHADOW_COLOR = 0x080604;
export const BUILD_TAG = "062515c";

/** @deprecated use CHUNK */
export const CELL = CHUNK;
export const HW = CHUNK_HW;
