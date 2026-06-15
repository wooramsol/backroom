import * as THREE from "three";

/** User wallpaper — one image = one repeat; horizontal width 76 cm */
export const WALLPAPER_URL = "./assets/backroom_wallpaper.webp";
export const WALL_TILE_W = 0.76;
export const CARPET_TILE_M = 0.55;
/** ~62 cm acoustic drop-ceiling tile */
export const CEILING_TILE_M = 0.62;

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
  return new THREE.MeshStandardMaterial({
    map,
    roughness: 0.92,
    metalness: 0,
    ...opts,
  });
}

export function tiled(tex, tileM, w, h) {
  const t = tex.clone();
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(w / tileM, h / tileM);
  return t;
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

/**
 * Drop ceiling maps — color + localized emissive + bump so tile grid stays visible
 * when looking up (flat emissive was washing out the pattern).
 */
export function createCeilingMaps() {
  const size = 512;
  const tilePx = 42;
  const gap = 4;

  const color = document.createElement("canvas");
  const emissive = document.createElement("canvas");
  const bump = document.createElement("canvas");
  color.width = color.height = size;
  emissive.width = emissive.height = size;
  bump.width = bump.height = size;

  const cctx = color.getContext("2d");
  const ectx = emissive.getContext("2d");
  const bctx = bump.getContext("2d");

  cctx.fillStyle = "#d8d0a0";
  cctx.fillRect(0, 0, size, size);
  ectx.fillStyle = "#000000";
  ectx.fillRect(0, 0, size, size);
  bctx.fillStyle = "#808080";
  bctx.fillRect(0, 0, size, size);

  for (let ty = 0; ty < size; ty += tilePx) {
    for (let tx = 0; tx < size; tx += tilePx) {
      const hash = ((tx * 73 + ty * 41) % 97) / 97;
      const v = 218 + Math.floor(hash * 22);
      const inset = gap + 1;

      cctx.fillStyle = `rgb(${v},${v - 4},${v - 28})`;
      cctx.fillRect(tx + inset, ty + inset, tilePx - inset * 2, tilePx - inset * 2);

      for (let n = 0; n < 18; n++) {
        const nx = tx + inset + 2 + ((n * 29 + tx) % (tilePx - inset * 2 - 4));
        const ny = ty + inset + 2 + ((n * 47 + ty) % (tilePx - inset * 2 - 4));
        cctx.fillStyle = `rgba(90,80,45,${0.03 + (n % 5) * 0.012})`;
        cctx.fillRect(nx, ny, 2, 2);
      }

      cctx.fillStyle = "rgba(55,48,28,0.55)";
      cctx.fillRect(tx, ty, tilePx, gap);
      cctx.fillRect(tx, ty, gap, tilePx);

      ectx.fillStyle = `rgb(${200 + Math.floor(hash * 40)},${195 + Math.floor(hash * 35)},${150 + Math.floor(hash * 30)})`;
      ectx.fillRect(tx + inset, ty + inset, tilePx - inset * 2, tilePx - inset * 2);

      bctx.fillStyle = "#a8a090";
      bctx.fillRect(tx + inset, ty + inset, tilePx - inset * 2, tilePx - inset * 2);
      bctx.fillStyle = "#484038";
      bctx.fillRect(tx, ty, tilePx, gap);
      bctx.fillRect(tx, ty, gap, tilePx);
    }
  }

  const toTex = (canvas, srgb = true) => {
    const t = new THREE.CanvasTexture(canvas);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.generateMipmaps = true;
    return t;
  };

  return {
    color: toTex(color),
    emissive: toTex(emissive),
    bump: toTex(bump, false),
  };
}

/** @deprecated use createCeilingMaps */
export function createCeilingTexture() {
  return createCeilingMaps().color;
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
