/** Injected at build time via vite.config.js */
export const APP_VERSION = __APP_VERSION__;
export const BUILD_PR = __BUILD_PR__;
export const BUILD_TIME = __BUILD_TIME__;
export const BUILD_ENV = __BUILD_ENV__;

export function formatBuildLabel() {
  const parts = [`v${APP_VERSION}`];
  if (BUILD_PR) parts.push(`PR #${BUILD_PR}`);
  parts.push(BUILD_TIME, BUILD_ENV);
  return parts.join(" · ");
}
