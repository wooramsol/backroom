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
  const { width, height } = getViewportSize();
  return width >= height;
}

export function getViewportSize() {
  if (typeof window === "undefined") return { width: 800, height: 600 };
  const vv = window.visualViewport;
  if (vv) {
    return {
      width: Math.max(1, Math.round(vv.width)),
      height: Math.max(1, Math.round(vv.height)),
    };
  }
  return {
    width: Math.max(1, window.innerWidth),
    height: Math.max(1, window.innerHeight),
  };
}

export function getViewportOffset() {
  if (typeof window === "undefined") return { left: 0, top: 0 };
  const vv = window.visualViewport;
  if (!vv) return { left: 0, top: 0 };
  return { left: vv.offsetLeft, top: vv.offsetTop };
}

/** Mobile browsers often report stale sizes right after orientation changes */
export function scheduleViewportRelayout(callback) {
  callback();
  requestAnimationFrame(() => {
    callback();
    requestAnimationFrame(callback);
  });
  window.setTimeout(callback, 120);
  window.setTimeout(callback, 320);
}
