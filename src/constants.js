/** Level 0 grid — one chunk = one connectable room cell */
export const CHUNK = 14;
export const CHUNK_HW = CHUNK / 2;
/** Legacy room size hints — shapes now use zones + inner walls */
export const MIN_ROOM_W = 5;
export const MAX_ROOM_W = CHUNK;
export const MIN_ROOM_D = 5;
export const MAX_ROOM_D = CHUNK;
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
/** Clear span between parallel walls — wider than body so openings never look impassable */
export const MIN_CLEAR_PASSAGE = MIN_PASSAGE_SPAN + 0.75;
/** Door openings — visibly wider than the minimum walkable width */
export const MIN_CLEAR_DOOR_WIDTH = MIN_PASSAGE_SPAN + 0.5;
/** Every zone must be at least this wide in both axes — no crawl-space pockets */
export const MIN_ZONE_DIM = MIN_PASSAGE_SPAN + 2.0;
/** Smaller chambers — still walkable, not crawl spaces */
export const MIN_ZONE_DIM_SMALL = MIN_PASSAGE_SPAN + 0.85;
/** Minimum door width so the player body cannot squeeze through the gap */
export const MIN_DOOR_WIDTH = 2 * (PLAYER_R + BODY_WALL_CLEAR) + 2 * DOOR_JAMB_INSET + 0.14;
/** Maximum door opening width (metres) */
export const MAX_DOOR_WIDTH = 3;
export const JUMP_V = 4.2;
export const GRAVITY = 14;
/** Narrower FOV — 72° caused heavy edge distortion that felt tilted */
export const CAMERA_FOV = 60;
/** Closer near plane — default 0.08 let walls vanish when hugging them */
export const CAMERA_NEAR = 0.035;
/** Must exceed FOG_FAR so distant geometry is not clipped early */
export const CAMERA_FAR = 42;
/** Underside of ceiling stack — flush with wall tops */
export const CEILING_TOP_INSET_M = 0.001;
/** @deprecated kept at 0 — lowering caused wall/ceiling shadow bands */
export const CEILING_DROP_M = 0;
/** Physical recess depth under each ceiling carpet tile (metres) */
export const CEILING_GROOVE_DEPTH_M = 0.009;
export const CEILING_TILE_LIFT_M = CEILING_GROOVE_DEPTH_M;
export const CEILING_PANEL_LIFT_M = CEILING_GROOVE_DEPTH_M + 0.001;
/** Troffer emitter below the visible panel face */
export const TROFFER_LIGHT_DROP_M = 0.018;
/** Keep the eye this far from wall surfaces (near + margin) */
export const CAMERA_WALL_CLEAR = 0.04;
/** Camera may shift slightly off body center to stay out of geometry */
export const CAMERA_MAX_OFFSET = 0.035;
export const MOUSE_SENS = 0.0022;
/** ~±68° — old ±83° made doorways look skewed when looking down */
export const PITCH_LIMIT = 1.18;
export const FOG_NEAR = 8;
export const FOG_FAR = 34;
export const FOG_COLOR = 0x3a3830;
/** Loaded cells around player — ring must cover FOG_FAR */
export const GRID_RADIUS = 2;
/** Full square synced on the title screen before play */
export const PRELOAD_RADIUS = 2;
/** One extra ring built ahead while moving (infinite map — not all preloaded) */
export const PREFETCH_RADIUS = GRID_RADIUS + 1;
/** Start loading the next ring when this far into the current cell (0–1) */
export const EDGE_PREFETCH = 0.55;
/** ~4500K warm white — flat fluorescent office fill */
export const FLUORESCENT_COLOR = 0xfff4e5;
export const AMBIENT_COLOR = FLUORESCENT_COLOR;
export const AMBIENT_INTENSITY = 0.58;
/** Hemisphere — even indirect on ceiling, walls, and floor */
export const HEMI_SKY_COLOR = 0xfff6ea;
export const HEMI_GROUND_COLOR = 0xfff0e0;
export const HEMI_INTENSITY = 0.72;
export const LIGHT_PANEL_COLOR = FLUORESCENT_COLOR;
export const LIGHT_PANEL_OFF_COLOR = 0x8a8478;
/** Lit troffer face — bright square, glow stays inside panel bounds */
export const LIGHT_PANEL_INTENSITY = 2.2;
/** Square ceiling grid cell — troffer bay spacing */
export const PANEL_SIZE = 0.9;
/** Thin physical groove between ceiling tiles only (metres) */
export const CEILING_TILE_GAP_M = 0.008;
/** Visible carpet tile face inside one grid cell */
export const CEILING_TILE_FACE_M = PANEL_SIZE - CEILING_TILE_GAP_M;
/** Recessed seam between ceiling tiles — warm beige, not black */
export const CEILING_GAP_COLOR = 0xa39a68;
/** @deprecated */ export const CEILING_PLENUM_COLOR = CEILING_GAP_COLOR;
/** Lit troffer replaces the whole grid cell */
export const PANEL_W = PANEL_SIZE;
export const PANEL_H = PANEL_SIZE;
/** Keep fixtures off walls — only on open ceiling area */
export const PANEL_EDGE_INSET = 1.25;
/** @deprecated all troffers are lit */
export const PANEL_ON_CHANCE = 1;
/** Downward square troffer — RectAreaLight matches panel footprint */
export const PANEL_LIGHT_INTENSITY = 4.8;
/** Rebuild pooled lights after the camera moves this far (metres) */
export const LIGHT_POOL_MOVE_THRESHOLD = 0.45;
/** Minimum ms between pool rebuilds while moving */
export const LIGHT_POOL_MIN_INTERVAL_MS = 120;
/** @deprecated upward plenum lights removed — caused dark coplanar ceiling */
export const CEILING_PLENUM_INTENSITY = 1.15;
/** Matte surfaces — flat fluorescent look, minimal specular */
export const SURFACE_ROUGHNESS = 1;
export const SURFACE_METALNESS = 0;
/** Layer mask — only troffer meshes enable this for selective bloom */
export const BLOOM_LAYER = 1;
/** Troffer glow — selective bloom pass in postfx.js */
export const BLOOM_STRENGTH = 0.34;
export const BLOOM_RADIUS = 0.28;
export const BLOOM_THRESHOLD = 0.48;
/** Lit troffer panels per chunk */
export const PANELS_PER_CHUNK = 2;
/** Main scene render scale — was 0.5 and caused jagged ceiling grooves */
export const RENDER_RESOLUTION_SCALE = 1;
/** Bloom buffer scale — can stay low; scene pass is full res */
export const BLOOM_RESOLUTION_SCALE = 0.35;
export const TONE_MAPPING_EXPOSURE = 0.92;
export const CARPET_COLOR = 0xf0e8a8;
/** @deprecated walls use texture albedo directly */
export const WALL_COLOR = 0xffffff;
/** Fluorescent hum — disabled until re-enabled later */
export const ENABLE_FLUORESCENT_HUM = false;

/** @deprecated use CHUNK */
export const CELL = CHUNK;
export const HW = CHUNK_HW;
