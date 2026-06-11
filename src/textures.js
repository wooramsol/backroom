import * as THREE from "three";

function makeCanvasTexture(draw, size = 512) {
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  draw(ctx, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function createCarpetTexture() {
  return makeCanvasTexture((ctx, size) => {
    ctx.fillStyle = "#8b7355";
    ctx.fillRect(0, 0, size, size);

    for (let i = 0; i < 12000; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const len = 2 + Math.random() * 5;
      const angle = Math.random() * Math.PI;
      const shade = 70 + Math.random() * 40;
      ctx.strokeStyle = `rgb(${shade + 20},${shade},${shade - 15})`;
      ctx.lineWidth = 0.5 + Math.random();
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
      ctx.stroke();
    }

    for (let i = 0; i < 3000; i++) {
      const x = Math.random() * size;
      const y = Math.random() * size;
      const r = 1 + Math.random() * 3;
      ctx.fillStyle = `rgba(${60 + Math.random() * 30},${50 + Math.random() * 25},${35 + Math.random() * 20},0.15)`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

export function createCeilingTexture() {
  return makeCanvasTexture((ctx, size) => {
    const tile = 64;
    for (let y = 0; y < size; y += tile) {
      for (let x = 0; x < size; x += tile) {
        const v = 200 + Math.floor(Math.random() * 15);
        ctx.fillStyle = `rgb(${v},${v},${v - 5})`;
        ctx.fillRect(x + 1, y + 1, tile - 2, tile - 2);
        ctx.strokeStyle = "#b0b0a8";
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, tile, tile);
      }
    }
  });
}

export function loadWallpaperTexture(loader) {
  return new Promise((resolve, reject) => {
    loader.load(
      "./assets/wallpaper.png",
      (tex) => {
        tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.anisotropy = 4;
        resolve(tex);
      },
      undefined,
      reject
    );
  });
}
