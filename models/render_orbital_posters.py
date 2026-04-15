#!/usr/bin/env python3
"""
Render PNG + WebP poster images from PLY point clouds for periodic-table hover previews.

Output: public/previews/orbitals/<orbitalId>.png and .webp
Uses the same folder/file naming as models/model++ (orbitalId → pathName for d/f/g).

Requires: numpy, matplotlib, scipy, pillow
Run from repo root:
  python3 models/render_orbital_posters.py
  python3 models/render_orbital_posters.py --limit 3   # smoke test
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
from PIL import Image
from scipy.spatial.transform import Rotation as SciRotation

# Must match src/data/modelRegistry.js EXISTING_ORBITALS
EXISTING_ORBITALS = [
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


def orbital_id_to_path_name(orbital_id: str) -> str:
    m = re.match(r"^(\d+)([dfg])_(.+)$", orbital_id)
    if m:
        n, t, suffix = m.groups()
        return f"{n}{t}_{t}{suffix}"
    return orbital_id


def get_orbital_type(orbital_id: str) -> str:
    if orbital_id.startswith("dodec_"):
        return "dodec"
    if orbital_id.startswith("icosa_"):
        return "icosa"
    if re.match(r"^\d+s$", orbital_id):
        return "s"
    if re.match(r"^\d+p[xyz]$", orbital_id):
        return "p"
    if re.match(r"^\d+d_", orbital_id):
        return "d"
    if re.match(r"^\d+f_", orbital_id):
        return "f"
    if re.match(r"^\d+g_", orbital_id):
        return "g"
    return "s"


def ply_path(repo_root: Path, orbital_id: str) -> Path:
    ot = get_orbital_type(orbital_id)
    pn = orbital_id_to_path_name(orbital_id)
    return repo_root / "models" / "model++" / ot / pn / f"{pn}.ply"


def read_ascii_ply_xyz_rgb(path: Path, max_points: int, seed: int) -> np.ndarray:
    """Return (N, 6) array x,y,z,r,g,b as float."""
    with path.open("r", encoding="utf-8", errors="replace") as f:
        header_lines: list[str] = []
        for line in f:
            header_lines.append(line)
            if line.strip() == "end_header":
                break
        n_vert = 0
        for line in header_lines:
            if line.startswith("element vertex"):
                n_vert = int(line.split()[-1])
                break
        if n_vert <= 0:
            raise ValueError(f"No vertex count in {path}")
        data = np.loadtxt(f, max_rows=n_vert)
    if data.ndim == 1:
        data = data.reshape(1, -1)
    if data.shape[1] < 6:
        raise ValueError(f"Expected >=6 columns, got {data.shape}")
    data = data[:, :6].astype(np.float64)
    if len(data) > max_points:
        rng = np.random.default_rng(seed)
        idx = rng.choice(len(data), size=max_points, replace=False)
        data = data[idx]
    return data


def render_poster(
    data: np.ndarray,
    out_png: Path,
    out_webp: Path,
    dpi: int = 120,
    fig_inches: tuple[float, float] = (4.0, 3.0),
) -> None:
    pts = data[:, :3].copy()
    rgb = np.clip(data[:, 3:6], 0, 255) / 255.0

    pts -= pts.mean(axis=0)
    mx = float(np.max(np.linalg.norm(pts, axis=1)))
    if mx > 1e-9:
        pts /= mx

    # Same view for all posters (degrees)
    rot = SciRotation.from_euler("zyx", [38, -32, 18], degrees=True)
    pts_r = rot.apply(pts)
    x = pts_r[:, 0]
    y = pts_r[:, 1]

    fig, ax = plt.subplots(figsize=fig_inches, dpi=dpi, facecolor="black")
    ax.set_facecolor("black")
    ax.scatter(
        x,
        y,
        c=rgb,
        s=0.35,
        linewidths=0,
        alpha=0.92,
        rasterized=True,
    )
    pad = 0.06
    xr = x.max() - x.min()
    yr = y.max() - y.min()
    span = max(xr, yr, 1e-6)
    cx = (x.max() + x.min()) / 2
    cy = (y.max() + y.min()) / 2
    half = span / 2 + pad
    ax.set_xlim(cx - half, cx + half)
    ax.set_ylim(cy - half, cy + half)
    ax.set_aspect("equal")
    ax.axis("off")
    plt.subplots_adjust(left=0, right=1, top=1, bottom=0)
    fig.savefig(out_png, facecolor="black", bbox_inches="tight", pad_inches=0.02)

    plt.close(fig)

    im = Image.open(out_png).convert("RGB")
    im.save(out_webp, format="WEBP", quality=82, method=6)


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=0, help="Only process first N orbitals (0=all)")
    ap.add_argument("--max-points", type=int, default=32000)
    args = ap.parse_args()

    repo_root = Path(__file__).resolve().parents[1]
    out_dir = repo_root / "public" / "previews" / "orbitals"
    out_dir.mkdir(parents=True, exist_ok=True)

    ids = EXISTING_ORBITALS[:]
    if args.limit > 0:
        ids = ids[: args.limit]

    ok = 0
    failed: list[str] = []
    for i, oid in enumerate(ids):
        ply = ply_path(repo_root, oid)
        if not ply.is_file():
            failed.append(f"{oid}: missing {ply}")
            continue
        seed = (abs(hash(oid)) % (2**32)) or 1
        try:
            data = read_ascii_ply_xyz_rgb(ply, max_points=args.max_points, seed=seed)
        except Exception as e:
            failed.append(f"{oid}: read error {e}")
            continue

        # Filename on disk matches orbitalId (may contain parentheses)
        safe_name = oid
        out_png = out_dir / f"{safe_name}.png"
        out_webp = out_dir / f"{safe_name}.webp"
        try:
            render_poster(data, out_png, out_webp)
        except Exception as e:
            failed.append(f"{oid}: render {e}")
            continue
        ok += 1
        print(f"[{ok}/{len(ids)}] {oid}")

    print(f"Done. Rendered {ok} posters to {out_dir}")
    if failed:
        print("Failures:", file=sys.stderr)
        for f in failed:
            print(f"  {f}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
