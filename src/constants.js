/** Level 0 grid — one chunk = one connectable room cell */
export const CHUNK = 14;
export const CHUNK_HW = CHUNK / 2;
/** Legacy room size hints — shapes now use zones + inner walls */
export const MIN_ROOM_W = 5;
export const MAX_ROOM_W = CHUNK;
export const MIN_ROOM_D = 5;
export const MAX_ROOM_D = CHUNK;
export const WALL_T = 0.16;
/** Wall mesh overlap at joints — closes visible slits between segments */
export const WALL_JOINT_OVERLAP = WALL_T * 1.05;
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
/** Eye height while holding crouch */
export const CROUCH_EYE_H = 0.92;
/** Collision radius while crouching — slip under corridor chairs */
export const CROUCH_PLAYER_R = 0.3;
/** Top of crouched body above feet for horizontal collision */
export const CROUCH_BODY_H = 0.82;
export const CROUCH_SPEED = 1.65;
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
/** One extra ring built ahead while moving (infinite map — not all preloaded) */
export const PREFETCH_RADIUS = GRID_RADIUS + 1;
/** Preload must cover edge-prefetch outer strip (PREFETCH_RADIUS + 1) */
export const PRELOAD_RADIUS = PREFETCH_RADIUS + 1;
/** Keep chunks this far before despawning — extra buffer avoids black holes while streaming */
export const DESPAWN_RADIUS = PREFETCH_RADIUS + 2;
/** Start loading the next ring when this far into the current cell (0–1) */
export const EDGE_PREFETCH = 0.55;
export const AMBIENT_COLOR = 0xfffaf6;
export const AMBIENT_INTENSITY = 0.55;
/** Hemisphere — even white fill */
export const HEMI_SKY_COLOR = 0xffffff;
export const HEMI_GROUND_COLOR = 0xfff6ee;
export const HEMI_INTENSITY = 0.68;
/** Square ceiling grid cell spacing */
export const PANEL_SIZE = 0.9;
/** Thin physical groove between ceiling tiles only (metres) */
export const CEILING_TILE_GAP_M = 0.001;
/** Visible carpet tile face inside one grid cell */
export const CEILING_TILE_FACE_M = PANEL_SIZE - CEILING_TILE_GAP_M;
/** Recessed seam between ceiling tiles — warm beige, not black */
export const CEILING_GAP_COLOR = 0xa39a68;
/** @deprecated */ export const CEILING_PLENUM_COLOR = CEILING_GAP_COLOR;
/** @deprecated ceiling tile grid only */
export const PANEL_W = PANEL_SIZE;
export const PANEL_H = PANEL_SIZE;
/** Matte surfaces — flat fluorescent look, minimal specular */
export const SURFACE_ROUGHNESS = 1;
export const SURFACE_METALNESS = 0;
/** Main scene render scale — was 0.5 and caused jagged ceiling grooves */
export const RENDER_RESOLUTION_SCALE = 1;
export const TONE_MAPPING_EXPOSURE = 0.92;
export const CARPET_COLOR = 0xf0e8a8;
/** @deprecated walls use texture albedo directly */
export const WALL_COLOR = 0xffffff;
/** Fluorescent hum — disabled until re-enabled later */
export const ENABLE_FLUORESCENT_HUM = false;

/** @deprecated use CHUNK */
export const CELL = CHUNK;
export const HW = CHUNK_HW;
