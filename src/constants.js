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
export const FOG_FAR = 40;
export const FOG_COLOR = 0xe5e4ad;
export const AMBIENT_COLOR = 0xe8e4c8;
export const AMBIENT_INTENSITY = 0.58;
export const HEMI_SKY = 0xfff8e8;
export const HEMI_GROUND = 0xe5d890;
export const HEMI_INTENSITY = 0.38;
export const LIGHT_PANEL_COLOR = 0xfff6e0;
export const LIGHT_PANEL_INTENSITY = 0.78;
export const DARK_ROOM_LIGHT_MULT = 0.06;
export const ROOM_LIGHT_INTENSITY = 0.52;
export const ROOM_LIGHT_DISTANCE = 11;
export const TONE_MAPPING_EXPOSURE = 1.0;
export const CARPET_COLOR = 0xf0e8a8;
export const CEILING_COLOR = 0xf5f0c8;
export const WALL_COLOR = 0xffffff;

/** @deprecated use CHUNK */
export const CELL = CHUNK;
export const HW = CHUNK_HW;
