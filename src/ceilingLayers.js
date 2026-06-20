import {
  CEILING_TOP_INSET_M,
  CEILING_DROP_M,
  CEILING_TILE_LIFT_M,
  CEILING_PANEL_LIFT_M,
  CEILING_PANEL_FACE_EPS_M,
  TROFFER_LIGHT_DROP_M,
} from "./constants.js";

/** Shared ceiling stack — gap backing, tiles, troffer face, and light emitter */
export function getCeilingLayers(roomHeight) {
  const gapY = roomHeight - CEILING_TOP_INSET_M - CEILING_DROP_M;
  const tileY = gapY + CEILING_TILE_LIFT_M;
  const panelFaceY = tileY + CEILING_PANEL_FACE_EPS_M;
  return {
    gapY,
    tileY,
    panelFaceY,
    panelY: panelFaceY,
    lightY: gapY + CEILING_PANEL_LIFT_M - TROFFER_LIGHT_DROP_M,
  };
}
