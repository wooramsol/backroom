/** Touch-first phones/tablets — coarse pointer + touch, or common mobile UA */
export function isMobileDevice() {
  if (typeof window === "undefined") return false;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const touch = navigator.maxTouchPoints > 0;
  const ua = /Android|iPhone|iPad|iPod|Mobile|webOS|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent,
  );
  return (coarse && touch) || ua;
}

export function isLandscapeOrientation() {
  if (typeof window === "undefined") return true;
  if (window.matchMedia("(orientation: landscape)").matches) return true;
  if (window.matchMedia("(orientation: portrait)").matches) return false;
  return window.innerWidth >= window.innerHeight;
}

/** innerWidth/innerHeight are often stale right after rotation — align to orientation */
export function getLayoutSize() {
  if (typeof window === "undefined") return { width: 800, height: 600 };
  let w = window.innerWidth;
  let h = window.innerHeight;
  const landscape = isLandscapeOrientation();
  if (landscape && w < h) [w, h] = [h, w];
  else if (!landscape && w > h) [w, h] = [h, w];
  return { width: Math.max(1, w), height: Math.max(1, h) };
}

/** innerWidth/innerHeight can be stale briefly after orientation changes */
export function scheduleViewportRelayout(callback) {
  callback();
  requestAnimationFrame(() => {
    callback();
    requestAnimationFrame(callback);
  });
  for (const ms of [120, 320, 520]) {
    window.setTimeout(callback, ms);
  }
}
