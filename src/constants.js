/** Level 0 grid — one chunk = one connectable room cell */
export const CHUNK = 14;
export const CHUNK_HW = CHUNK / 2;
export const MIN_ROOM_W = 9;
export const MAX_ROOM_W = 14;
export const MIN_ROOM_D = 9;
export const MAX_ROOM_D = 14;
export const WALL_T = 0.16;
export const DOOR_H = 2.2;
/** Legacy — door offset RNG only; collision gap matches visual mesh width */
export const DOOR_CLEAR = 0.48;
/** Fixed ceiling height */
export const ROOM_H = 2.7;
export const MIN_ROOM_H = ROOM_H;
export const MAX_ROOM_H = ROOM_H;
export const EYE_H = 1.62;
/** ~41 cm radius — adult torso / shoulder width */
export const PLAYER_R = 0.41;
/** Body depth (front–back) for corner collision samples */
export const PLAYER_DEPTH = 0.28;
export const JUMP_V = 4.2;
export const GRAVITY = 14;
/** Narrower FOV — 72° caused heavy edge distortion that felt tilted */
export const CAMERA_FOV = 60;
/** Closer near plane — default 0.08 let walls vanish when hugging them */
export const CAMERA_NEAR = 0.035;
/** Keep the eye this far from wall surfaces (near + margin) */
export const CAMERA_WALL_CLEAR = 0.13;
/** Camera may shift slightly off body center to stay out of geometry */
export const CAMERA_MAX_OFFSET = 0.11;
export const MOUSE_SENS = 0.0022;
/** ~±68° — old ±83° made doorways look skewed when looking down */
export const PITCH_LIMIT = 1.18;
export const FOG_NEAR = 10;
export const FOG_FAR = 42;
export const FOG_COLOR = 0x1a1810;
/** Low warm fill — lit rooms come from ceiling fixtures */
export const AMBIENT_COLOR = 0xa09888;
export const AMBIENT_INTENSITY = 0.04;
export const LIGHT_PANEL_COLOR = 0xfff8e8;
export const LIGHT_PANEL_OFF_COLOR = 0x2a2820;
/** Lit rectangle emissive look on the panel face */
export const LIGHT_PANEL_INTENSITY = 0.48;
export const PANEL_W = 1.15;
export const PANEL_H = 0.42;
/** Keep fixtures off walls — only on open ceiling area */
export const PANEL_EDGE_INSET = 1.25;
export const PANEL_ON_CHANCE = 0.72;
/** RectAreaLight — same rectangle as panel face, points down */
export const PANEL_LIGHT_COLOR = 0xfff4d8;
export const PANEL_LIGHT_INTENSITY = 16;
/** Subtle bloom on bright rectangular panels (half-res for perf) */
export const BLOOM_STRENGTH = 0.32;
export const BLOOM_RADIUS = 0.3;
export const BLOOM_THRESHOLD = 0.85;
export const BLOOM_RESOLUTION_SCALE = 0.5;
export const TONE_MAPPING_EXPOSURE = 0.78;
export const CARPET_COLOR = 0xf0e8a8;
/** Fluorescent hum — disabled until re-enabled later */
export const ENABLE_FLUORESCENT_HUM = false;
export const WALL_COLOR = 0xffffff;

/** @deprecated use CHUNK */
export const CELL = CHUNK;
export const HW = CHUNK_HW;
