/** Connector kinds selected from vertex topology (not separate box pieces). */
export const CONNECTOR = {
  STRAIGHT: "straight",
  END_CAP: "end_cap",
  INNER_CORNER: "inner_corner",
  OUTER_CORNER: "outer_corner",
  T_JUNCTION: "t_junction",
  CROSS: "cross",
  DOOR: "door_opening",
  WIDE: "wide_opening",
};

export const DIR = { N: 1, E: 2, S: 4, W: 8 };

export function dirFromDelta(dx, dz) {
  if (dx === 0 && dz === -1) return DIR.N;
  if (dx === 1 && dz === 0) return DIR.E;
  if (dx === 0 && dz === 1) return DIR.S;
  if (dx === -1 && dz === 0) return DIR.W;
  return 0;
}

/**
 * Classify a wall-graph vertex from incident edge directions (N/E/S/W bitmask)
 * and walkable quadrant count around the junction.
 */
export function classifyConnector(dirMask, walkableQuads) {
  const count = popcount(dirMask);
  if (count === 0) return null;
  if (count === 1) return CONNECTOR.END_CAP;
  if (count === 2) {
    const opp =
      (dirMask & DIR.N && dirMask & DIR.S) || (dirMask & DIR.E && dirMask & DIR.W);
    if (opp) return CONNECTOR.STRAIGHT;
    if (walkableQuads === 1) return CONNECTOR.INNER_CORNER;
    if (walkableQuads === 3) return CONNECTOR.OUTER_CORNER;
    return CONNECTOR.INNER_CORNER;
  }
  if (count === 3) return CONNECTOR.T_JUNCTION;
  if (count >= 4) return CONNECTOR.CROSS;
  return CONNECTOR.STRAIGHT;
}

export function popcount(n) {
  let c = 0;
  while (n) {
    c += n & 1;
    n >>= 1;
  }
  return c;
}

export function probeWalkableQuads(x, z, isWalkable) {
  const d = 0.35;
  const probes = [
    [x - d, z - d],
    [x + d, z - d],
    [x - d, z + d],
    [x + d, z + d],
  ];
  let n = 0;
  for (const [px, pz] of probes) {
    if (isWalkable(px, pz)) n++;
  }
  return n;
}
