import { readFileSync } from "node:fs";
import { defineConfig } from "vite";

const pkg = JSON.parse(readFileSync("./package.json", "utf8"));

function buildId() {
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA.slice(0, 7);
  return new Date().toISOString().replace(/[-:T.Z]/g, "").slice(0, 12);
}

function buildTime() {
  if (process.env.BUILD_TIME) return process.env.BUILD_TIME;
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default defineConfig({
  base: process.env.VITE_BASE || "./",
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __BUILD_ID__: JSON.stringify(buildId()),
    __BUILD_TIME__: JSON.stringify(buildTime()),
  },
  server: {
    host: true,
    port: 5173,
  },
});
