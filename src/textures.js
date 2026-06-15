import * as THREE from "three";

/** User wallpaper — one image = one repeat; horizontal width 76 cm */
export const WALLPAPER_URL = "./assets/backroom_wallpaper.webp";
export const WALL_TILE_W = 0.76;
export const CARPET_TILE_M = 0.55;
export const CEILING_TILE_M = 0.65;

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

export function createTiledMaterial(tex, widthM, heightM, opts = {}) {
  const map = tex.clone();
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  const tileW = tex.userData?.tileW ?? WALL_TILE_W;
  const tileH = tex.userData?.tileH ?? WALL_TILE_W;
  map.repeat.set(widthM / tileW, heightM / tileH);
  return new THREE.MeshLambertMaterial({ map, color: 0xffffff, ...opts });
}

export function tiled(tex, tileM, w, h) {
  const t = tex.clone();
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(w / tileM, h / tileM);
  return t;
}

/** Dark brown carpet — clearly not wall yellow */
export function createCarpetTexture() {
  return canvasTex((ctx, size) => {
    ctx.fillStyle = "#4a3818";
    ctx.fillRect(0, 0, size, size);
    for (let y = 0; y < size; y += 3) {
      for (let x = 0; x < size; x += 3) {
        const v = 88 + ((x * 17 + y * 31) % 30);
        ctx.fillStyle = `rgb(${v + 2},${v - 8},${v - 36})`;
        ctx.fillRect(x, y, 2, 2);
      }
    }
    for (let i = 0; i < 120; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      ctx.fillStyle = `rgba(20,14,6,${0.06 + Math.random() * 0.1})`;
      ctx.fillRect(x, y, 4 + Math.random() * 6, 3 + Math.random() * 5);
    }
  });
}

/** Light ceiling tiles — visible grid vs yellow walls */
export function createCeilingTexture() {
  return canvasTex((ctx, size) => {
    const tile = 28;
    for (let y = 0; y < size; y += tile) {
      for (let x = 0; x < size; x += tile) {
        const v = 238 + ((x + y) % 7);
        ctx.fillStyle = `rgb(${v},${v - 2},${v - 10})`;
        ctx.fillRect(x + 1, y + 1, tile - 2, tile - 2);
        ctx.strokeStyle = "rgba(100,92,72,0.55)";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, tile, tile);
      }
    }
  });
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
