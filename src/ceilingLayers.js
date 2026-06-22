import {
  CEILING_TOP_INSET_M,
  CEILING_DROP_M,
  CEILING_TILE_LIFT_M,
} from "./constants.js";

/** Shared ceiling stack — gap backing and tile faces */
export function getCeilingLayers(roomHeight) {
  const gapY = roomHeight - CEILING_TOP_INSET_M - CEILING_DROP_M;
  return {
    gapY,
    tileY: gapY + CEILING_TILE_LIFT_M,
  };
}
