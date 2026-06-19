import * as THREE from "three";
import { CARPET_COLOR } from "./constants.js";

/** User wallpaper — one image = one repeat; horizontal width 76 cm */
export const WALLPAPER_URL = "./assets/backroom_wallpaper.webp";
export const WALL_TILE_W = 0.76;
export const CARPET_TILE_M = 0.55;
/** Acoustic drop-ceiling tile — ~60 cm (2 ft) */
export const CEILING_TILE_M = 0.6;

function canvasTex(draw, size = 256) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  draw(ctx, size);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.minFilter = THREE.LinearFilter;
  t.generateMipmaps = false;
  return t;
}

/** Store physical tile size from image pixels — no scaling or recoloring */
export function applyWallpaperTileSize(tex) {
  const img = tex.image;
  const pxW = img?.width || 1;
  const pxH = img?.height || 1;
  tex.userData.tileW = WALL_TILE_W;
  tex.userData.tileH = WALL_TILE_W * (pxH / pxW);
  return tex;
}

const _wallMatCache = new Map();

export function createTiledMaterial(tex, widthM, heightM, opts = {}) {
  const key = `${widthM.toFixed(2)}|${heightM.toFixed(2)}`;
  const cached = _wallMatCache.get(key);
  if (cached) return cached;

  const map = tex.clone();
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  const tileW = tex.userData?.tileW ?? WALL_TILE_W;
  const tileH = tex.userData?.tileH ?? WALL_TILE_W;
  map.repeat.set(widthM / tileW, heightM / tileH);
  const mat = new THREE.MeshStandardMaterial({
    map,
    roughness: 0.92,
    metalness: 0,
    ...opts,
  });
  _wallMatCache.set(key, mat);
  return mat;
}

export function tiled(tex, tileM, w, h) {
  const t = tex.clone();
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(w / tileM, h / tileM);
  return t;
}

/** Tile aligned to world origin so adjacent room chunks share one continuous pattern */
export function tiledAt(tex, tileM, w, h, worldX, worldZ) {
  const t = tiled(tex, tileM, w, h);
  const frac = (n) => ((n % 1) + 1) % 1;
  t.offset.set(frac(worldX / tileM), frac(worldZ / tileM));
  return t;
}

/** Carpet — floor and ceiling share the same Standard material */
export function createCarpetSurfaceMaterial(map) {
  return new THREE.MeshStandardMaterial({
    map,
    color: CARPET_COLOR,
    roughness: 0.94,
    metalness: 0,
    side: THREE.DoubleSide,
  });
}

/** Level 0 carpet — yellow-beige like wallpaper (#e5e4ad family) */
export function createCarpetTexture() {
  return canvasTex((ctx, size) => {
    ctx.fillStyle = "#e5e4ad";
    ctx.fillRect(0, 0, size, size);
    for (let y = 0; y < size; y += 3) {
      for (let x = 0; x < size; x += 3) {
        const v = 198 + ((x * 17 + y * 31) % 24);
        ctx.fillStyle = `rgb(${v + 8},${v + 4},${v - 18})`;
        ctx.fillRect(x, y, 2, 2);
      }
    }
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      ctx.fillStyle = `rgba(120,110,60,${0.02 + Math.random() * 0.05})`;
      ctx.fillRect(x, y, 4 + Math.random() * 6, 3 + Math.random() * 5);
    }
  });
}

/** Ceiling — acoustic drop tile (single cell for instanced mesh) */
export function createCeilingTileTexture() {
  return canvasTex((ctx, size) => {
    const inset = Math.round(size * 0.1);
    const groove = Math.max(1, Math.round(size * 0.018));

    ctx.fillStyle = "#b8b080";
    ctx.fillRect(0, 0, size, size);

    const g = ctx.createLinearGradient(0, inset, 0, size - inset);
    g.addColorStop(0, "#d8d4a8");
    g.addColorStop(0.45, "#ebe8c0");
    g.addColorStop(1, "#ccc890");
    ctx.fillStyle = g;
    ctx.fillRect(inset, inset, size - inset * 2, size - inset * 2);

    for (let i = 0; i < 120; i++) {
      const x = inset + Math.random() * (size - inset * 2);
      const y = inset + Math.random() * (size - inset * 2);
      ctx.fillStyle = `rgba(90,80,40,${0.02 + Math.random() * 0.04})`;
      ctx.fillRect(x, y, 2, 2);
    }

    ctx.strokeStyle = "rgba(70,60,30,0.45)";
    ctx.lineWidth = groove;
    ctx.strokeRect(groove / 2, groove / 2, size - groove, size - groove);
  });
}

export function createCeilingTileMaterial() {
  const map = createCeilingTileTexture();
  return new THREE.MeshStandardMaterial({
    map,
    color: 0xf2eed0,
    roughness: 0.92,
    metalness: 0,
  });
}

/** Continuous ceiling backing — dark grid visible between drop tiles */
export function createCeilingBackingTexture() {
  return canvasTex((ctx, size) => {
    const tiles = 4;
    const cell = size / tiles;
    ctx.fillStyle = "#3a3828";
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = "rgba(20,18,12,0.85)";
    ctx.lineWidth = 2;
    for (let y = 0; y <= tiles; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * cell);
      ctx.lineTo(size, y * cell);
      ctx.stroke();
    }
    for (let x = 0; x <= tiles; x++) {
      ctx.beginPath();
      ctx.moveTo(x * cell, 0);
      ctx.lineTo(x * cell, size);
      ctx.stroke();
    }
  });
}

export function createCeilingBackingMaterial(map) {
  return new THREE.MeshStandardMaterial({
    map,
    color: 0x8a8470,
    roughness: 0.98,
    metalness: 0,
    side: THREE.DoubleSide,
  });
}

/** @deprecated use createCeilingTileTexture */
export function createCeilingTexture() {
  return createCeilingTileTexture();
}

export function loadWallpaper(loader) {
  return new Promise((resolve, reject) => {
    loader.load(
      WALLPAPER_URL,
      (tex) => {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
        applyWallpaperTileSize(tex);
        resolve(tex);
      },
      undefined,
      reject
    );
  });
}

export async function loadWallpaperOrFallback(loader) {
  try {
    return await loadWallpaper(loader);
  } catch {
    const tex = canvasTex((ctx, size) => {
      ctx.fillStyle = "#e5e4ad";
      ctx.fillRect(0, 0, size, size);
    });
    applyWallpaperTileSize(tex);
    return tex;
  }
}
