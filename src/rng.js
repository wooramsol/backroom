export function createRng(...seeds) {
  let s = seeds.reduce((a, b) => (a ^ Math.imul(b | 0, 2654435761)) >>> 0, 0x9e3779b9);
  const next = () => {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  return {
    next,
    range(a, b) {
      return a + next() * (b - a);
    },
    int(a, b) {
      return Math.floor(this.range(a, b + 1));
    },
    pick(arr) {
      return arr[Math.floor(next() * arr.length)];
    },
    chance(p) {
      return next() < p;
    },
    pickWeighted(entries) {
      const total = entries.reduce((s, [, w]) => s + w, 0);
      let r = next() * total;
      for (const [val, w] of entries) {
        r -= w;
        if (r <= 0) return val;
      }
      return entries[entries.length - 1][0];
    },
  };
}
