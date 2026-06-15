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
export const FOG_DENSITY = 0.034;
export const AMBIENT_COLOR = 0xf0f5cf;
export const AMBIENT_INTENSITY = 0.28;
export const HEMI_SKY = 0xf2f0dc;
export const HEMI_GROUND = 0x9a8460;
export const HEMI_INTENSITY = 0.2;
export const LIGHT_PANEL_COLOR = 0xfffae8;
export const LIGHT_PANEL_INTENSITY = 0.82;
export const FLUORESCENT_LIGHT_COLOR = 0xf0f5cf;
export const FLUORESCENT_LIGHT_INTENSITY = 0.48;
export const FLUORESCENT_LIGHT_DISTANCE = 5.5;
export const FLUORESCENT_LIGHT_DECAY = 2;
export const TONE_MAPPING_EXPOSURE = 0.88;
/** Muddy tan carpet / pale yellow ceiling — tinted under cold fluorescents */
export const CARPET_COLOR = 0xc4ad78;
export const CEILING_COLOR = 0xe6e2c8;
export const WALL_COLOR = 0xf8f6e8;

/** @deprecated use CHUNK */
export const CELL = CHUNK;
export const HW = CHUNK_HW;
