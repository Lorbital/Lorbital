# Orbital poster assets (PNG / WebP)

Hover previews load files named after each `orbitalId`:

- `<orbitalId>.webp` (preferred)
- `<orbitalId>.png` (fallback)

Examples: `3d_z2.webp`, `4f_xyz.png`.

**Regenerate from PLY** (numpy, matplotlib, scipy, pillow):

```bash
python3 models/render_orbital_posters.py
```

Optional: `python3 models/render_orbital_posters.py --limit 5` for a quick test.

Legacy notes-only script: [`models/generate_orbital_posters.py`](../../models/generate_orbital_posters.py).
