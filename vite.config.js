import { readFileSync } from "node:fs";
import { defineConfig } from "vite";

const pkg = JSON.parse(readFileSync("./package.json", "utf8"));

function buildId() {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA.slice(0, 7);
  return new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 12);
}

function buildTime() {
  if (process.env.BUILD_TIME) return process.env.BUILD_TIME;
  return new Date().toLocaleString("sv-SE", { timeZone: "Asia/Seoul" });
}

export default defineConfig({
  base: process.env.VITE_BASE || "./",
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __BUILD_ID__: JSON.stringify(buildId()),
    __BUILD_TIME__: JSON.stringify(buildTime()),
    __BUILD_ENV__: JSON.stringify(process.env.BUILD_ENV || "local"),
  },
  server: {
    host: true,
    port: 5173,
  },
});
