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

/** Visible viewport for fixed UI shells (iOS Safari chrome / offset) */
export function getViewportShellRect() {
  if (typeof window === "undefined") {
    return { width: 800, height: 600, top: 0, left: 0 };
  }
  const vv = window.visualViewport;
  if (vv) {
    return {
      width: Math.max(1, Math.round(vv.width)),
      height: Math.max(1, Math.round(vv.height)),
      top: Math.max(0, Math.round(vv.offsetTop)),
      left: Math.max(0, Math.round(vv.offsetLeft)),
    };
  }
  const { width, height } = getLayoutSize();
  return { width, height, top: 0, left: 0 };
}

export function applyFixedShell(el, rect = getViewportShellRect()) {
  if (!el) return;
  el.style.position = "fixed";
  el.style.top = `${rect.top}px`;
  el.style.left = `${rect.left}px`;
  el.style.width = `${rect.width}px`;
  el.style.height = `${rect.height}px`;
  el.style.right = "auto";
  el.style.bottom = "auto";
  el.style.boxSizing = "border-box";
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
