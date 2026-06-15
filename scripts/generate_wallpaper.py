"""Generate tileable Level 0 wallpaper — pale ikat chevron, 76 cm repeat width."""
from PIL import Image, ImageDraw, ImageFilter
import random
import os

# Square tile = one horizontal repeat (76 cm in world space)
W, H = 768, 768
BASE = (248, 244, 218)
SHADE = (228, 222, 192)
LINE = (210, 204, 172)
CHEV = (235, 228, 198)

img = Image.new("RGB", (W, H), BASE)
draw = ImageDraw.Draw(img)

cols = 4
band_w = W // cols

for i in range(cols):
    bx = i * band_w
    cx = bx + band_w // 2

    # Thin vertical line groups between columns
    for lx in (bx + 6, bx + 10, bx + band_w - 10, bx + band_w - 6):
        if 0 <= lx < W:
            draw.line([(lx, 0), (lx, H)], fill=LINE, width=1)

    # Dashed center stem (ikat bleed)
    for y in range(0, H, 14):
        draw.rectangle([cx - 1, y, cx + 1, y + 7], fill=LINE)

    chev_h = 52
    for y in range(-chev_h // 2, H + chev_h, chev_h):
        cy = y + chev_h // 2
        half = band_w // 3
        pts = [
            (cx, cy - chev_h // 3),
            (cx - half, cy + chev_h // 10),
            (cx - half // 2, cy + chev_h // 10),
            (cx, cy - chev_h // 14),
            (cx + half // 2, cy + chev_h // 10),
            (cx + half, cy + chev_h // 10),
        ]
        draw.polygon(pts, fill=CHEV)
        draw.polygon(pts, outline=SHADE)

# Soft ikat edges
img = img.filter(ImageFilter.GaussianBlur(radius=0.75))

pixels = img.load()
random.seed(11)
for _ in range(5000):
    px = random.randint(0, W - 1)
    py = random.randint(0, H - 1)
    r, g, b = pixels[px, py]
    n = random.randint(-6, 6)
    pixels[px, py] = (
        max(0, min(255, r + n)),
        max(0, min(255, g + n)),
        max(0, min(255, b + n - 1)),
    )

out = os.path.join(os.path.dirname(__file__), "..", "public", "assets", "wallpaper.png")
os.makedirs(os.path.dirname(out), exist_ok=True)
img.save(out, optimize=True)
print(f"Saved {out} ({W}x{H})")
