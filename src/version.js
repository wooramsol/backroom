/** Injected at build time via vite.config.js */
export const APP_VERSION = __APP_VERSION__;
export const BUILD_ID = __BUILD_ID__;
export const BUILD_TIME = __BUILD_TIME__;
export const BUILD_ENV = __BUILD_ENV__;

export function formatBuildLabel() {
  return `v${APP_VERSION} · ${BUILD_ID} · ${BUILD_TIME} · ${BUILD_ENV}`;
}

export function formatBuildTime() {
  return BUILD_TIME;
}
