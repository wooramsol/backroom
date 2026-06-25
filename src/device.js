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

/** Visible viewport for fixed UI shells (mobile browser chrome / offset) */
export function getViewportShellRect() {
  if (typeof window === "undefined") {
    return { width: 800, height: 600, top: 0, left: 0 };
  }
  const vv = window.visualViewport;
  if (vv) {
    let top = Math.max(0, Math.round(vv.offsetTop));
    const left = Math.max(0, Math.round(vv.offsetLeft));
    const width = Math.max(1, Math.round(vv.width));
    let height = Math.max(1, Math.round(vv.height));

    // pageTop is more reliable than offsetTop when the URL bar overlays fixed content
    const pageTop = Math.max(0, Math.round(vv.pageTop - window.scrollY));
    if (pageTop > top) top = pageTop;

    const docTop = Math.round(-document.documentElement.getBoundingClientRect().top);
    if (docTop > top) top = docTop;

    // Landscape phones: tab/URL bar sits on top while offsetTop stays 0
    if (isMobileDevice() && isLandscapeOrientation()) {
      const uiChrome = Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop));
      if (top === 0 && uiChrome > 0) top = uiChrome;
    }

    height = Math.max(1, Math.min(height, Math.round(window.innerHeight - top)));

    return { width, height, top, left };
  }
  const { width, height } = getLayoutSize();
  return { width, height, top: 0, left: 0 };
}

export function syncViewportCssVars(rect = getViewportShellRect()) {
  if (typeof document === "undefined") return rect;
  const root = document.documentElement;
  root.style.setProperty("--vv-top", `${rect.top}px`);
  root.style.setProperty("--vv-left", `${rect.left}px`);
  root.style.setProperty("--vv-width", `${rect.width}px`);
  root.style.setProperty("--vv-height", `${rect.height}px`);
  return rect;
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
