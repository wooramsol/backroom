import { readFileSync } from "node:fs";
import { defineConfig } from "vite";

const pkg = JSON.parse(readFileSync("./package.json", "utf8"));

function buildPr() {
  const raw = process.env.BUILD_PR || process.env.GITHUB_PR_NUMBER || "";
  const n = String(raw).trim();
  return /^\d+$/.test(n) ? n : "";
}

function buildTime() {
  if (process.env.BUILD_TIME) return process.env.BUILD_TIME;
  return new Date().toLocaleString("sv-SE", { timeZone: "Asia/Seoul" });
}

export default defineConfig({
  base: process.env.VITE_BASE || "./",
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
    __BUILD_PR__: JSON.stringify(buildPr()),
    __BUILD_TIME__: JSON.stringify(buildTime()),
    __BUILD_ENV__: JSON.stringify(process.env.BUILD_ENV || "local"),
  },
  server: {
    host: true,
    port: 5173,
  },
});
