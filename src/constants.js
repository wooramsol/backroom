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
export const CAMERA_FOV = 60;
export const MOUSE_SENS = 0.0022;
export const PITCH_LIMIT = 1.18;
export const FOG_NEAR = 12;
export const FOG_FAR = 48;
/** Classic Level 0 yellow-beige wash */
export const FOG_COLOR = 0xe5e4ad;
export const AMBIENT_COLOR = 0xe8e4c8;
export const AMBIENT_INTENSITY = 0.17;
export const HEMI_SKY = 0xfff8e8;
export const HEMI_GROUND = 0xe5d890;
export const HEMI_INTENSITY = 0.22;
export const LIGHT_PANEL_COLOR = 0xfffdf5;
export const LIGHT_PANEL_OFF_COLOR = 0x8a8578;
export const PANEL_EMISSIVE_INTENSITY = 2.2;
export const PANEL_W = 1.15;
export const PANEL_H = 0.42;
/** Nearly flush with drop-ceiling grid (troffer) */
export const PANEL_RECESS_DEPTH = 0.008;
export const PANEL_ON_CHANCE = 0.72;
/** Panel face area light — floor/walls */
export const PANEL_LIGHT_INTENSITY = 10;
/** Soft room-wide ceiling plane wash per chunk */
export const ROOM_FILL_INTENSITY = 5.5;
export const ROOM_FILL_SIZE = CHUNK - 0.6;
export const PANEL_LIGHT_POOL = 28;
/** Ceiling tile glow from ON panels — texture stays visible */
export const CEILING_EMISSIVE_MIN = 0.05;
export const CEILING_EMISSIVE_MAX = 0.34;
export const TONE_MAPPING_EXPOSURE = 0.95;
export const CARPET_COLOR = 0xf0e8a8;
export const CEILING_COLOR = 0xf5f0c8;
export const WALL_COLOR = 0xffffff;

/** @deprecated use CHUNK */
export const CELL = CHUNK;
export const HW = CHUNK_HW;
