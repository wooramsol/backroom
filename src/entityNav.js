const CELL = 0.45;
const NEIGHBORS = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
];

function cellKey(ix, iz) {
  return `${ix},${iz}`;
}

function cellCenter(ix, iz) {
  return { x: ix * CELL + CELL * 0.5, z: iz * CELL + CELL * 0.5 };
}

function heuristic(ix, iz, gix, giz) {
  const dx = Math.abs(ix - gix);
  const dz = Math.abs(iz - giz);
  const dmin = Math.min(dx, dz);
  const dmax = Math.max(dx, dz);
  return (dmax - dmin) + dmin * 1.414;
}

/** Grid A* over walkable cells — isBlocked(x,z) in world metres */
export function findNavPath(startX, startZ, goalX, goalZ, isBlocked, margin = 10) {
  const startIx = Math.floor(startX / CELL);
  const startIz = Math.floor(startZ / CELL);
  let goalIx = Math.floor(goalX / CELL);
  let goalIz = Math.floor(goalZ / CELL);

  if (startIx === goalIx && startIz === goalIz) {
    return [{ x: goalX, z: goalZ }];
  }

  const minIx = Math.min(startIx, goalIx) - margin;
  const maxIx = Math.max(startIx, goalIx) + margin;
  const minIz = Math.min(startIz, goalIz) - margin;
  const maxIz = Math.max(startIz, goalIz) + margin;

  const goalCenter = cellCenter(goalIx, goalIz);
  if (isBlocked(goalCenter.x, goalCenter.z)) {
    let found = false;
    for (let r = 1; r <= 4 && !found; r++) {
      for (const [dx, dz] of NEIGHBORS) {
        const ix = goalIx + dx * r;
        const iz = goalIz + dz * r;
        const c = cellCenter(ix, iz);
        if (!isBlocked(c.x, c.z)) {
          goalIx = ix;
          goalIz = iz;
          found = true;
          break;
        }
      }
    }
  }

  const open = [{ ix: startIx, iz: startIz, g: 0, f: heuristic(startIx, startIz, goalIx, goalIz) }];
  const cameFrom = new Map();
  const gScore = new Map([[cellKey(startIx, startIz), 0]]);
  const closed = new Set();
  let iterations = 0;
  const maxIter = 5200;

  while (open.length && iterations < maxIter) {
    iterations++;
    open.sort((a, b) => a.f - b.f);
    const cur = open.shift();
    const ck = cellKey(cur.ix, cur.iz);
    if (closed.has(ck)) continue;
    closed.add(ck);

    if (cur.ix === goalIx && cur.iz === goalIz) {
      const path = [];
      let k = ck;
      let node = { ix: cur.ix, iz: cur.iz };
      while (node) {
        const c = cellCenter(node.ix, node.iz);
        path.push(c);
        const prev = cameFrom.get(k);
        if (!prev) break;
        k = cellKey(prev.ix, prev.iz);
        node = prev;
      }
      path.reverse();
      if (path.length) path[path.length - 1] = { x: goalX, z: goalZ };
      return path;
    }

    for (const [dx, dz] of NEIGHBORS) {
      const nix = cur.ix + dx;
      const niz = cur.iz + dz;
      if (nix < minIx || nix > maxIx || niz < minIz || niz > maxIz) continue;

      const center = cellCenter(nix, niz);
      if (isBlocked(center.x, center.z)) continue;

      if (dx !== 0 && dz !== 0) {
        const a = cellCenter(cur.ix + dx, cur.iz);
        const b = cellCenter(cur.ix, cur.iz + dz);
        if (isBlocked(a.x, a.z) || isBlocked(b.x, b.z)) continue;
      }

      const nk = cellKey(nix, niz);
      if (closed.has(nk)) continue;

      const step = dx !== 0 && dz !== 0 ? 1.414 : 1;
      const tg = cur.g + step;
      const prevG = gScore.get(nk);
      if (prevG !== undefined && tg >= prevG) continue;

      cameFrom.set(nk, { ix: cur.ix, iz: cur.iz });
      gScore.set(nk, tg);
      open.push({ ix: nix, iz: niz, g: tg, f: tg + heuristic(nix, niz, goalIx, goalIz) });
    }
  }

  return null;
}
