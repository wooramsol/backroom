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
export const MIN_ROOM_H = 2.5;
export const MAX_ROOM_H = 2.85;
export const EYE_H = 1.62;
export const PLAYER_R = 0.3;
export const FOG_NEAR = 6;
export const FOG_FAR = 30;
export const FOG_COLOR = 0xc9b87a;
export const AMBIENT_COLOR = 0x9a8a68;

/** @deprecated use CHUNK */
export const CELL = CHUNK;
export const HW = CHUNK_HW;
