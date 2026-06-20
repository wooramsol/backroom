/** Level 0 grid — one chunk = one connectable room cell */
export const CHUNK = 14;
export const CHUNK_HW = CHUNK / 2;
/** Legacy room size hints — shapes now use zones + inner walls */
export const MIN_ROOM_W = 3;
export const MAX_ROOM_W = 14;
export const MIN_ROOM_D = 3;
export const MAX_ROOM_D = 14;
export const WALL_T = 0.16;
export const DOOR_H = 2.2;
/** Collision jambs sit this much inside the visible opening on each side */
export const DOOR_JAMB_INSET = 0.05;
/** Legacy — door offset RNG only */
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
/** Extra radius on body samples when pushing away from walls */
export const BODY_WALL_CLEAR = 0.035;
/** Minimum walkable span (corridor width / depth) — must fit the body */
export const MIN_PASSAGE_SPAN = 2 * (PLAYER_R * 0.98 + BODY_WALL_CLEAR) + 0.18;
/** Minimum door width so the player body cannot squeeze through the gap */
export const MIN_DOOR_WIDTH = 2 * (PLAYER_R + BODY_WALL_CLEAR) + 2 * DOOR_JAMB_INSET + 0.14;
export const JUMP_V = 4.2;
export const GRAVITY = 14;
/** Narrower FOV — 72° caused heavy edge distortion that felt tilted */
export const CAMERA_FOV = 60;
/** Closer near plane — default 0.08 let walls vanish when hugging them */
export const CAMERA_NEAR = 0.035;
/** Underside of ceiling stack — flush with wall tops */
export const CEILING_TOP_INSET_M = 0.001;
/** @deprecated kept at 0 — lowering caused wall/ceiling shadow bands */
export const CEILING_DROP_M = 0;
/** Physical recess depth under each ceiling carpet tile (metres) */
export const CEILING_GROOVE_DEPTH_M = 0.009;
export const CEILING_TILE_LIFT_M = CEILING_GROOVE_DEPTH_M;
export const CEILING_PANEL_LIFT_M = CEILING_GROOVE_DEPTH_M + 0.001;
/** Tiny lift so troffer face clears coplanar ceiling tiles (avoids z-fight) */
export const CEILING_PANEL_FACE_EPS_M = 0.0008;
/** Troffer emitter below the visible panel face */
export const TROFFER_LIGHT_DROP_M = 0.018;
/** Keep the eye this far from wall surfaces (near + margin) */
export const CAMERA_WALL_CLEAR = 0.04;
/** Camera may shift slightly off body center to stay out of geometry */
export const CAMERA_MAX_OFFSET = 0.035;
export const MOUSE_SENS = 0.0022;
/** ~±68° — old ±83° made doorways look skewed when looking down */
export const PITCH_LIMIT = 1.18;
export const FOG_NEAR = 38;
export const FOG_FAR = 58;
/** Warm yellow-beige — matches wallpaper, less gray haze */
export const FOG_COLOR = 0xd8d0a8;
/** Loaded cells around player — 2-ring keeps ~35 m built, matches fog */
export const GRID_RADIUS = 2;
/** Full square synced on the title screen before play */
export const PRELOAD_RADIUS = 2;
/** One extra ring built ahead while moving (infinite map — not all preloaded) */
export const PREFETCH_RADIUS = GRID_RADIUS + 1;
/** Start loading the next ring when this far into the current cell (0–1) */
export const EDGE_PREFETCH = 0.55;
/** ~4500K warm white — flat fluorescent office fill */
export const FLUORESCENT_COLOR = 0xfff4e5;
export const LIGHT_PANEL_COLOR = FLUORESCENT_COLOR;
export const LIGHT_PANEL_OFF_COLOR = 0x8a8478;
/** @deprecated use LIGHT_PANEL_COLOR */
export const LIGHT_PANEL_EMISSIVE = 0;
/** @deprecated use LIGHT_PANEL_EMISSIVE */
export const LIGHT_PANEL_INTENSITY = 1.05;
/** Square ceiling grid cell — troffer bay spacing */
export const PANEL_SIZE = 0.9;
/** Thin physical groove between ceiling tiles only (metres) */
export const CEILING_TILE_GAP_M = 0.008;
/** Visible carpet tile face inside one grid cell */
export const CEILING_TILE_FACE_M = PANEL_SIZE - CEILING_TILE_GAP_M;
/** Recessed seam between ceiling tiles — warm beige, stays visible not black */
export const CEILING_GAP_COLOR = 0xb8b088;
/** @deprecated */ export const CEILING_PLENUM_COLOR = CEILING_GAP_COLOR;
/** Lit troffer replaces the whole grid cell — mesh and lights match PANEL_SIZE */
export const PANEL_W = PANEL_SIZE;
export const PANEL_H = PANEL_SIZE;
/** Keep fixtures off walls — only on open ceiling area */
export const PANEL_EDGE_INSET = 1.25;
/** Fake ceiling-down shadows on walls (no lights) */
export const FAKE_SHADOW_CEILING_BAND = 0.14;
export const FAKE_SHADOW_CEILING_DARK = 0.52;
export const FAKE_SHADOW_FLOOR_BAND = 0.1;
export const FAKE_SHADOW_FLOOR_DARK = 0.72;
export const FAKE_SHADOW_CORNER_RADIUS = 0.45;
export const FAKE_SHADOW_CORNER_DARK = 0.48;
/** Floor perimeter shadow under walls */
export const FAKE_SHADOW_FLOOR_EDGE_M = 0.4;
export const FAKE_SHADOW_FLOOR_EDGE_DARK = 0.58;
/** Main scene render scale — was 0.5 and caused jagged ceiling grooves */
export const RENDER_RESOLUTION_SCALE = 1;
/** Cap device pixel ratio for the WebGL canvas */
export const MAX_PIXEL_RATIO = 1;
export const CARPET_COLOR = 0xf0e8a8;
/** @deprecated walls use texture albedo directly */
export const WALL_COLOR = 0xffffff;

/** @deprecated use CHUNK */
export const CELL = CHUNK;
export const HW = CHUNK_HW;
