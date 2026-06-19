import * as THREE from "three";

function makeCanvasTexture(draw, size = 256) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  draw(ctx, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.generateMipmaps = false;
  tex.minFilter = THREE.LinearFilter;
  return tex;
}

export function createCarpetTexture() {
  return makeCanvasTexture((ctx, size) => {
    ctx.fillStyle = "#8b7355";
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 1800; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const shade = 65 + Math.random() * 45;
      ctx.fillStyle = `rgb(${shade + 12},${shade},${shade - 12})`;
      ctx.fillRect(x, y, 1.5, 1.5);
    }
  });
}

export function createBasementFloorTexture() {
  return makeCanvasTexture((ctx, size) => {
    ctx.fillStyle = "#5a5a52";
    ctx.fillRect(0, 0, size, size);
    for (let i = 0; i < 1200; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const v = 70 + Math.random() * 30;
      ctx.fillStyle = `rgb(${v},${v},${v - 5})`;
      ctx.fillRect(x, y, 2, 2);
    }
  });
}

export function createCeilingTexture() {
  return makeCanvasTexture((ctx, size) => {
    const tile = 32;
    for (let y = 0; y < size; y += tile) {
      for (let x = 0; x < size; x += tile) {
        const v = 198 + Math.floor(Math.random() * 12);
        ctx.fillStyle = `rgb(${v},${v},${v - 4})`;
        ctx.fillRect(x, y, tile, tile);
      }
    }
  });
}

export function loadWallpaperTexture(loader) {
  return new Promise((resolve, reject) => {
    loader.load(
      "./assets/backroom_wallpaper.webp",
      (tex) => {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.generateMipmaps = false;
        resolve(tex);
      },
      undefined,
      reject
    );
  });
}
