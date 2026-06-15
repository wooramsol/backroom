#!/usr/bin/env python3
"""Wallpaper is user-provided — do not auto-generate or modify it.

Place your seamless tile image at:
  public/assets/backroom_wallpaper.webp

The image is used as-is (one file = one repeat). Horizontal width in-game is 0.76 m;
vertical repeat keeps the original aspect ratio.
"""
import sys

print(__doc__, file=sys.stderr)
print(
    "Error: wallpaper must be provided by the user at public/assets/backroom_wallpaper.webp",
    file=sys.stderr,
)
sys.exit(1)
