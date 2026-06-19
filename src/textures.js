import * as THREE from "three";
import { PANEL_SIZE, SURFACE_ROUGHNESS, SURFACE_METALNESS } from "./constants.js";

/** User wallpaper — one image = one repeat; horizontal width 76 cm */
export const WALLPAPER_URL = "./assets/backroom_wallpaper.webp";
/** User floor/ceiling surface */
export const BOTTOM_URL = "./assets/bottom.jpg";
/** @deprecated */ export const SURFACE_URL = BOTTOM_URL;
/** @deprecated */ export const CEILING_URL = BOTTOM_URL;
export const WALL_TILE_W = 0.76;
/** One bottom.jpg repeat = one ceiling troffer tile (matches PANEL_SIZE) */
export const SURFACE_TILE_M = PANEL_SIZE;
/** @deprecated */ export const CARPET_TILE_M = SURFACE_TILE_M;
/** Ceiling tile — matches square PANEL_SIZE */
export const CEILING_TILE_M = PANEL_SIZE;

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
    roughness: SURFACE_ROUGHNESS,
    metalness: SURFACE_METALNESS,
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

/** Rectangular tile repeat — e.g. ceiling troffers 1.2m × 0.6m */
export function tiledAtRect(tex, tileW, tileD, w, h, worldX, worldZ) {
  const t = tex.clone();
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(w / tileW, h / tileD);
  const frac = (n) => ((n % 1) + 1) % 1;
  t.offset.set(frac(worldX / tileW), frac(worldZ / tileD));
  return t;
}

/** Floor/ceiling — matte, texture albedo only (no tint) */
export function createSurfaceMaterial(map = null) {
  return new THREE.MeshStandardMaterial({
    map,
    roughness: SURFACE_ROUGHNESS,
    metalness: SURFACE_METALNESS,
    side: THREE.DoubleSide,
  });
}

/** @deprecated */ export function createFloorCeilingMaterial(_wallpaperTex, _surfaceTex, map = null) {
  return createSurfaceMaterial(map);
}

/** One troffer tile — bottom texture inset with dark plenum grooves */
export function createCeilingGridTexture(sourceTex, tileM = CEILING_TILE_M) {
  const img = sourceTex?.image;
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d");
  const groove = Math.max(3, Math.round(size * 0.032));

  ctx.fillStyle = "#2a2818";
  ctx.fillRect(0, 0, size, size);
  if (img?.width && img?.height) {
    ctx.drawImage(img, groove, groove, size - groove * 2, size - groove * 2);
  } else {
    ctx.fillStyle = "#e7e191";
    ctx.fillRect(groove, groove, size - groove * 2, size - groove * 2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.generateMipmaps = false;
  tex.userData.tileW = tileM;
  tex.userData.tileH = tileM;
  return tex;
}

/** @deprecated */ export function createCarpetSurfaceMaterial(map) {
  return createSurfaceMaterial(map);
}

/** @deprecated */ export function createCeilingSurfaceMaterial(map) {
  return createSurfaceMaterial(map);
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

/** Store tile physical size for floor/ceiling asset */
export function applySurfaceTileSize(tex) {
  tex.userData.tileW = SURFACE_TILE_M;
  tex.userData.tileH = SURFACE_TILE_M;
  return tex;
}

/** @deprecated */ export function applyCeilingTileSize(tex) {
  return applySurfaceTileSize(tex);
}

export function loadSurface(loader) {
  return new Promise((resolve, reject) => {
    loader.load(
      BOTTOM_URL,
      (tex) => {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
        applySurfaceTileSize(tex);
        resolve(tex);
      },
      undefined,
      reject,
    );
  });
}

export async function loadSurfaceOrFallback(loader) {
  try {
    return await loadSurface(loader);
  } catch {
    const tex = createCarpetTexture();
    applySurfaceTileSize(tex);
    return tex;
  }
}

/** @deprecated */ export function loadCeiling(loader) {
  return loadSurface(loader);
}

/** @deprecated */ export async function loadCeilingOrFallback(loader) {
  return loadSurfaceOrFallback(loader);
}

/** Fallback procedural troffer tile */
export function createCeilingTileTexture() {
  return canvasTex((ctx, size) => {
    const inset = Math.round(size * 0.08);
    const groove = Math.max(1, Math.round(size * 0.02));

    ctx.fillStyle = "#b8b080";
    ctx.fillRect(0, 0, size, size);

    const g = ctx.createLinearGradient(0, inset, 0, size - inset);
    g.addColorStop(0, "#d8d4a8");
    g.addColorStop(0.45, "#ebe8c0");
    g.addColorStop(1, "#ccc890");
    ctx.fillStyle = g;
    ctx.fillRect(inset, inset, size - inset * 2, size - inset * 2);

    ctx.strokeStyle = "rgba(50,45,25,0.55)";
    ctx.lineWidth = groove;
    ctx.strokeRect(groove / 2, groove / 2, size - groove, size - groove);
  });
}

/** Dark plenum between tiles — square grid */
export function createCeilingBackingTexture() {
  return canvasTex((ctx, size) => {
    const tiles = 2;
    const cell = size / tiles;
    ctx.fillStyle = "#2e2c22";
    ctx.fillRect(0, 0, size, size);
    ctx.strokeStyle = "rgba(12,10,6,0.9)";
    ctx.lineWidth = 3;
    for (let y = 0; y < tiles; y++) {
      for (let x = 0; x < tiles; x++) {
        ctx.strokeRect(x * cell + 1, y * cell + 1, cell - 2, cell - 2);
      }
    }
  });
}

export function createCeilingBackingMaterial(map) {
  return new THREE.MeshBasicMaterial({
    map,
    color: 0x8a8470,
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
