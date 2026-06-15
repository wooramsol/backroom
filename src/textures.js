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
    ctx.fillStyle = "#6d5a42";
    ctx.fillRect(0, 0, size, size);
    for (let y = 0; y < size; y += 3) {
      for (let x = 0; x < size; x += 3) {
        const v = 85 + ((x * 17 + y * 31) % 40);
        ctx.fillStyle = `rgb(${v + 8},${v},${v - 14})`;
        ctx.fillRect(x, y, 2, 2);
      }
    }
    for (let i = 0; i < 400; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      ctx.fillStyle = `rgba(45,55,40,${0.05 + Math.random() * 0.12})`;
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
        const v = 182 + ((x + y) % 14);
        ctx.fillStyle = `rgb(${v},${v},${v - 6})`;
        ctx.fillRect(x + 1, y + 1, tile - 2, tile - 2);
        ctx.strokeStyle = "rgba(120,120,115,0.5)";
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
