# AGENTS.md

## Cursor Cloud specific instructions

This is a client-only Three.js + Vite single-page app (Backrooms Level 0 walking demo). There is no backend, database, or test suite.

### Services & commands
- **Dev server**: `npm run dev` (Vite, serves on `http://localhost:5173`). This is the only long-running service.
- **Build**: `npm run build` (output to `dist/`). A `prebuild` step requires `public/assets/wallpaper2.jpg` and `public/assets/bottom2.jpg` to exist or the build fails.
- **Preview prod build**: `npm run preview`.
- **Lint / tests**: none are configured in this repo.

### Non-obvious notes
- `base` path defaults to `./` locally; CI sets `VITE_BASE=/backroom/` for GitHub Pages. Don't set `VITE_BASE` for local dev or asset paths break.
- The app uses pointer-lock: you must click the canvas/overlay to start, then WASD/mouse to move. On first load it shows a click-to-start overlay.
- Large `.glb`/audio assets live in `public/assets/`; they are required at runtime and are committed to the repo.
- `npm run generate:textures` needs Python 3 but is not part of normal dev; textures are already committed.
