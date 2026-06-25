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
  return window.innerWidth >= window.innerHeight;
}

/** innerWidth/innerHeight can be stale briefly after orientation changes */
export function scheduleViewportRelayout(callback) {
  callback();
  requestAnimationFrame(() => {
    callback();
    requestAnimationFrame(callback);
  });
  window.setTimeout(callback, 120);
  window.setTimeout(callback, 320);
}
