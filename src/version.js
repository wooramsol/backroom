/** Injected at build time via vite.config.js */
export const APP_VERSION = __APP_VERSION__;
export const BUILD_ID = __BUILD_ID__;

export function formatBuildLabel() {
  return `v${APP_VERSION} · ${BUILD_ID}`;
}
