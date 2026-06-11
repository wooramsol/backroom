export function createRng(cx, cz, floor) {
  let s = (cx * 374761 + cz * 668265 + floor * 982451) >>> 0;
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
  };
}
