#!/usr/bin/env python3
"""
Batch-generate PNG/WebP poster images for periodic-table hover previews.

Expected output layout (site root):
  public/previews/orbitals/<orbitalId>.webp
  public/previews/orbitals/<orbitalId>.png

Naming: use the same `orbitalId` strings as in `src/data/modelRegistry.js` (e.g. 3d_z2, 4f_xyz).

This script does not render 3D by default — it documents the pipeline. Options:
1) Export stills from your existing Three.js / Blender / offline PLY viewer with a fixed camera.
2) Use `cairosvg` / Pillow to composite if you already have pre-rendered frames.
3) Integrate with `trimesh` + `pyrender` to load PLY and save PNG (add dependencies as needed).

Example stub (uncomment after installing dependencies):
  # import trimesh, pyrender
  # mesh = trimesh.load("path/to/model.ply")
  # ...

Run from repo root:
  python3 models/generate_orbital_posters.py
"""

from __future__ import annotations

from pathlib import Path

# Import orbital ids from a small duplicate list or read from JS — keep in sync with EXISTING_ORBITALS
ORBITAL_IDS = [
    "1s",
    "2s",
    "3s",
    "4s",
    "5s",
    "6s",
    "7s",
    "2px",
    "2py",
    "2pz",
    "3px",
    "3py",
    "3pz",
    "4px",
    "4py",
    "4pz",
    "5px",
    "5py",
    "5pz",
    "6px",
    "6py",
    "6pz",
    "3d_z2",
    "3d_xz",
    "3d_yz",
    "3d_x2-y2",
    "3d_xy",
    "4d_z2",
    "4d_xz",
    "4d_yz",
    "4d_x2-y2",
    "4d_xy",
    "5d_z2",
    "5d_xz",
    "5d_yz",
    "5d_x2-y2",
    "5d_xy",
    "6d_z2",
    "6d_xz",
    "6d_yz",
    "6d_x2-y2",
    "6d_xy",
    "4f_z3",
    "4f_xz2",
    "4f_yz2",
    "4f_zx2-y2",
    "4f_xyz",
    "4f_x(x2-3y2)",
    "4f_y(x2-z2)",
    "5f_z3",
    "5f_xz2",
    "5f_yz2",
    "5f_zx2-y2",
    "5f_xyz",
    "5f_x(x2-3y2)",
    "5f_y(x2-z2)",
    "5g_z4",
    "5g_xz3",
    "5g_yz3",
    "5g_z2x2-y2",
    "5g_xyz2",
    "5g_xzx2-3y2",
    "5g_yzy2-3x2",
    "5g_x4+y4",
    "5g_xyx2-y2",
    "dodec_C20H20",
    "icosa_B12H12",
]


def main() -> None:
    root = Path(__file__).resolve().parents[1]
    out_dir = root / "public" / "previews" / "orbitals"
    out_dir.mkdir(parents=True, exist_ok=True)
    readme = out_dir / "README.md"
    readme.write_text(
        "# Orbital poster assets\n\n"
        "Add `&lt;orbitalId&gt;.webp` (preferred) and optional `&lt;orbitalId&gt;.png` fallback.\n"
        "See `models/generate_orbital_posters.py`.\n",
        encoding="utf-8",
    )
    print(f"Prepared directory: {out_dir}")
    print(f"Orbital id count (reference): {len(ORBITAL_IDS)}")
    print("Add rendered images manually or extend the script to render from PLY.")


if __name__ == "__main__":
    main()
