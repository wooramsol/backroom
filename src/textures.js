import * as THREE from "three";

/** One wallpaper tile ≈ 30 cm × 30 cm in world space */
export const WALL_TILE_M = 0.3;
export const CARPET_TILE_M = 0.5;
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

export function createTiledMaterial(tex, widthM, heightM, opts = {}) {
  const map = tex.clone();
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(widthM / WALL_TILE_M, heightM / WALL_TILE_M);
  return new THREE.MeshLambertMaterial({ map, ...opts });
}

export function tiled(tex, tileM, w, h) {
  const t = tex.clone();
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(w / tileM, h / tileM);
  return t;
}

/** Damp moist office carpet — Level 0 */
export function createCarpetTexture() {
  return canvasTex((ctx, size) => {
    ctx.fillStyle = "#9a8468";
    ctx.fillRect(0, 0, size, size);
    for (let y = 0; y < size; y += 3) {
      for (let x = 0; x < size; x += 3) {
        const v = 118 + ((x * 17 + y * 31) % 36);
        ctx.fillStyle = `rgb(${v + 10},${v + 4},${v - 8})`;
        ctx.fillRect(x, y, 2, 2);
      }
    }
    for (let i = 0; i < 280; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      ctx.fillStyle = `rgba(70,80,55,${0.03 + Math.random() * 0.07})`;
      ctx.fillRect(x, y, 4 + Math.random() * 8, 3 + Math.random() * 6);
    }
  });
}

/** Acoustic drop-ceiling tiles */
export function createCeilingTexture() {
  return canvasTex((ctx, size) => {
    const tile = 28;
    for (let y = 0; y < size; y += tile) {
      for (let x = 0; x < size; x += tile) {
        const v = 210 + ((x + y) % 12);
        ctx.fillStyle = `rgb(${v},${v},${v - 4})`;
        ctx.fillRect(x + 1, y + 1, tile - 2, tile - 2);
        ctx.strokeStyle = "rgba(150,150,145,0.35)";
        ctx.strokeRect(x, y, tile, tile);
      }
    }
  });
}

export function loadWallpaper(loader) {
  return new Promise((resolve, reject) => {
    loader.load(
      "./assets/wallpaper.png",
      (tex) => {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
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
    return canvasTex((ctx, size) => {
      ctx.fillStyle = "#c4a85a";
      ctx.fillRect(0, 0, size, size);
      for (let y = 0; y < size; y += 8) {
        ctx.strokeStyle = "rgba(90,75,40,0.15)";
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(size, y);
        ctx.stroke();
      }
    });
  }
}
