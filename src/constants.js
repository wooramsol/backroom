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
/** Warm fluorescent fill in lit areas */
export const AMBIENT_COLOR = 0xc8b890;
export const AMBIENT_INTENSITY = 0.07;
/** Bright panel face — reference white-yellow fluorescent */
export const LIGHT_PANEL_COLOR = 0xffffff;
export const LIGHT_PANEL_OFF_COLOR = 0x1e1c18;
/** Panel face brightness multiplier */
export const LIGHT_PANEL_BRIGHTNESS = 1.35;
/** Lit tile aperture in ceiling grid (metres) */
export const FIXTURE_TILE_SIZE = 1.12;
/** Soft halo on ceiling around each lit tile */
export const FIXTURE_GLOW_SIZE = 2.85;
/** RectAreaLight — warm downward wash from each tile */
export const PANEL_LIGHT_COLOR = 0xffe4b0;
export const PANEL_LIGHT_INTENSITY = 24;
/** Bloom on bright ceiling panels */
export const BLOOM_STRENGTH = 0.62;
export const BLOOM_RADIUS = 0.48;
export const BLOOM_THRESHOLD = 0.68;
export const PANEL_W = 1.15;
export const PANEL_H = 0.42;
/** Keep fixtures off walls — only on open ceiling area */
export const PANEL_EDGE_INSET = 1.25;
export const PANEL_ON_CHANCE = 0.72;
export const TONE_MAPPING_EXPOSURE = 0.88;
export const CARPET_COLOR = 0xf0e8a8;
/** Fluorescent hum — disabled until re-enabled later */
export const ENABLE_FLUORESCENT_HUM = false;
export const WALL_COLOR = 0xffffff;

/** @deprecated use CHUNK */
export const CELL = CHUNK;
export const HW = CHUNK_HW;
