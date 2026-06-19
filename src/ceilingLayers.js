import {
  CEILING_TOP_INSET_M,
  CEILING_DROP_M,
  CEILING_TILE_LIFT_M,
  CEILING_PANEL_LIFT_M,
  TROFFER_LIGHT_DROP_M,
} from "./constants.js";

/** Shared ceiling stack — gap backing, tiles, troffer face, and light emitter */
export function getCeilingLayers(roomHeight) {
  const gapY = roomHeight - CEILING_TOP_INSET_M - CEILING_DROP_M;
  return {
    gapY,
    tileY: gapY + CEILING_TILE_LIFT_M,
    panelY: gapY + CEILING_PANEL_LIFT_M,
    lightY: gapY - TROFFER_LIGHT_DROP_M,
  };
}
