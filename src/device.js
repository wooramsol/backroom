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

export function isLandscape() {
  if (typeof window === "undefined") return true;
  if (window.screen?.orientation?.type) {
    return window.screen.orientation.type.startsWith("landscape");
  }
  return window.innerWidth >= window.innerHeight;
}
