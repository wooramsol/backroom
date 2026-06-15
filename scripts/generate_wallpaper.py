"""Generate tileable Backrooms Level 0 wallpaper — chevron / dashed band pattern."""
from PIL import Image, ImageDraw, ImageFilter
import random
import os

W, H = 512, 512
# Classic Level 0 — pale sickly yellow (#E5E4AD)
BASE = (229, 228, 173)
DARK = (158, 152, 118)
MID = (194, 190, 148)

img = Image.new("RGB", (W, H), BASE)
draw = ImageDraw.Draw(img)

band_w = 56
for bx in range(0, W, band_w):
    cx = bx + band_w // 2

    for y in range(0, H, 10):
        draw.rectangle([cx - 1, y, cx + 1, y + 5], fill=DARK)

    chev_h = 44
    for y in range(0, H, chev_h):
        cy = y + chev_h // 2
        phase = (bx // band_w) % 2
        cy += chev_h // 4 if phase else -chev_h // 6
        half = band_w // 3
        pts = [
            (cx, cy - chev_h // 3),
            (cx - half, cy + chev_h // 8),
            (cx - half // 2, cy + chev_h // 8),
            (cx, cy - chev_h // 12),
            (cx + half // 2, cy + chev_h // 8),
            (cx + half, cy + chev_h // 8),
        ]
        draw.polygon(pts, fill=MID)
        draw.polygon(pts, outline=DARK)

img = img.filter(ImageFilter.GaussianBlur(radius=0.35))
pixels = img.load()
random.seed(7)
for _ in range(4000):
    px = random.randint(0, W - 1)
    py = random.randint(0, H - 1)
    r, g, b = pixels[px, py]
    n = random.randint(-8, 8)
    pixels[px, py] = (
        max(0, min(255, r + n)),
        max(0, min(255, g + n)),
        max(0, min(255, b + n - 1)),
    )

out = os.path.join(os.path.dirname(__file__), "..", "public", "assets", "wallpaper.png")
os.makedirs(os.path.dirname(out), exist_ok=True)
img.save(out, optimize=True)
print(f"Saved {out}")
