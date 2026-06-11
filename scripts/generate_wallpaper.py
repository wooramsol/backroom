"""Generate tileable Backrooms Level 0 wallpaper texture."""
from PIL import Image, ImageDraw, ImageFilter
import random
import os

W, H = 512, 512
BASE = (198, 178, 118)
PATTERN = (158, 138, 88)

img = Image.new("RGB", (W, H), BASE)
draw = ImageDraw.Draw(img)

# Vertical triple-line bands
band_w = 64
for x in range(0, W, band_w):
    for offset in (-2, 0, 2):
        draw.line([(x + band_w // 2 + offset, 0), (x + band_w // 2 + offset, H)], fill=PATTERN, width=1)

# Chevron / arrow motifs between bands
chevron_h = 48
for y in range(0, H, chevron_h):
    for x in range(band_w // 2, W, band_w):
        cx = x
        cy = y + chevron_h // 2
        pts = [
            (cx, cy - chevron_h // 3),
            (cx - band_w // 3, cy + chevron_h // 6),
            (cx - band_w // 6, cy + chevron_h // 6),
            (cx, cy),
            (cx + band_w // 6, cy + chevron_h // 6),
            (cx + band_w // 3, cy + chevron_h // 6),
        ]
        draw.polygon(pts, fill=PATTERN)

# Aged, fuzzy look
img = img.filter(ImageFilter.GaussianBlur(radius=0.6))
pixels = img.load()
random.seed(42)
for _ in range(8000):
    px = random.randint(0, W - 1)
    py = random.randint(0, H - 1)
    r, g, b = pixels[px, py]
    n = random.randint(-12, 12)
    pixels[px, py] = (
        max(0, min(255, r + n)),
        max(0, min(255, g + n)),
        max(0, min(255, b + n)),
    )

out = os.path.join(os.path.dirname(__file__), "..", "public", "assets", "wallpaper.png")
os.makedirs(os.path.dirname(out), exist_ok=True)
img.save(out, optimize=True)
print(f"Saved {out}")
