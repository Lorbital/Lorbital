from __future__ import annotations

import argparse
import json
from dataclasses import dataclass
from pathlib import Path

import numpy as np
from scipy.optimize import minimize
from pyscf import dft, gto
from pyscf.tools import cubegen


POS_COLOR = np.array([255, 160, 160], dtype=np.uint8)
NEG_COLOR = np.array([160, 210, 255], dtype=np.uint8)
DENSITY_COLOR = np.array([255, 225, 150], dtype=np.uint8)
RNG = np.random.default_rng(20260415)
ANGSTROM_PER_BOHR = 0.52917721092
BOHR_PER_ANGSTROM = 1.0 / ANGSTROM_PER_BOHR


def phi() -> float:
    return (1.0 + np.sqrt(5.0)) / 2.0


def make_icosahedron_vertices() -> np.ndarray:
    p = phi()
    verts = []
    for a in (-1.0, 1.0):
        for b in (-p, p):
            verts.append((0.0, a, b))
            verts.append((a, b, 0.0))
            verts.append((b, 0.0, a))
    return np.unique(np.array(verts, dtype=float), axis=0)


def make_dodecahedron_vertices() -> np.ndarray:
    p = phi()
    inv = 1.0 / p
    verts = []
    for x in (-1.0, 1.0):
        for y in (-1.0, 1.0):
            for z in (-1.0, 1.0):
                verts.append((x, y, z))
    for y in (-inv, inv):
        for z in (-p, p):
            verts.append((0.0, y, z))
    for x in (-inv, inv):
        for y in (-p, p):
            verts.append((x, y, 0.0))
    for x in (-p, p):
        for z in (-inv, inv):
            verts.append((x, 0.0, z))
    return np.unique(np.array(verts, dtype=float), axis=0)


def scale_to_edge_length(vertices: np.ndarray, edge_length: float) -> np.ndarray:
    diffs = vertices[:, None, :] - vertices[None, :, :]
    distances = np.linalg.norm(diffs, axis=2)
    positive = distances[distances > 1e-8]
    current = positive.min()
    return vertices * (edge_length / current)


def build_atom_string(symbols: list[str], coords: np.ndarray) -> str:
    lines = []
    for sym, xyz in zip(symbols, coords):
        lines.append(f"{sym} {xyz[0]:.10f} {xyz[1]:.10f} {xyz[2]:.10f}")
    return "\n".join(lines)


def write_ply(path: Path, points: np.ndarray, colors: np.ndarray) -> None:
    with path.open("w", encoding="utf-8") as f:
        f.write("ply\n")
        f.write("format ascii 1.0\n")
        f.write(f"element vertex {len(points)}\n")
        f.write("property float x\n")
        f.write("property float y\n")
        f.write("property float z\n")
        f.write("property uchar red\n")
        f.write("property uchar green\n")
        f.write("property uchar blue\n")
        f.write("end_header\n")
        for (x, y, z), (r, g, b) in zip(points, colors):
            f.write(f"{x:.6f} {y:.6f} {z:.6f} {int(r)} {int(g)} {int(b)}\n")


def write_xyz(path: Path, symbols: list[str], coords_angstrom: np.ndarray, title: str) -> None:
    with path.open("w", encoding="utf-8") as f:
        f.write(f"{len(symbols)}\n")
        f.write(f"{title}\n")
        for sym, xyz in zip(symbols, coords_angstrom):
            f.write(f"{sym} {xyz[0]:.10f} {xyz[1]:.10f} {xyz[2]:.10f}\n")


def read_xyz(path: Path) -> tuple[list[str], np.ndarray]:
    with path.open("r", encoding="utf-8") as f:
        lines = [line.strip() for line in f if line.strip()]

    atom_count = int(lines[0])
    atom_lines = lines[2 : 2 + atom_count]
    if len(atom_lines) != atom_count:
        raise ValueError(f"Incomplete XYZ file: {path}")

    symbols: list[str] = []
    coords: list[list[float]] = []
    for line in atom_lines:
        parts = line.split()
        if len(parts) < 4:
            raise ValueError(f"Malformed XYZ line in {path}: {line}")
        symbols.append(parts[0])
        coords.append([float(parts[1]), float(parts[2]), float(parts[3])])
    return symbols, np.array(coords, dtype=float)


def read_cube(path: Path) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    with path.open("r", encoding="utf-8") as f:
        lines = f.readlines()

    atom_line = lines[2].split()
    natm = abs(int(atom_line[0]))
    origin = np.array([float(atom_line[1]), float(atom_line[2]), float(atom_line[3])], dtype=float)

    axes = []
    shape = []
    for i in range(3):
        parts = lines[3 + i].split()
        shape.append(int(parts[0]))
        axes.append([float(parts[1]), float(parts[2]), float(parts[3])])
    shape = tuple(shape)
    axes = np.array(axes, dtype=float)

    data_tokens = " ".join(line.strip() for line in lines[6 + natm :]).split()
    data = np.array([float(x) for x in data_tokens], dtype=float).reshape(shape)
    return data, origin, axes, np.array(shape, dtype=int)


def cube_points_from_threshold(
    cube: np.ndarray,
    origin_bohr: np.ndarray,
    axes_bohr: np.ndarray,
    grid_shape: np.ndarray,
    *,
    target_count: int,
    min_quantile: float = 0.985,
    signed: bool = True,
    positive_color: np.ndarray = POS_COLOR,
    negative_color: np.ndarray = NEG_COLOR,
) -> tuple[np.ndarray, np.ndarray, float]:
    abs_cube = np.abs(cube) if signed else cube
    nonzero = abs_cube[abs_cube > 1e-10]
    threshold = float(np.quantile(nonzero, min_quantile))

    mask = abs_cube >= threshold
    indices = np.argwhere(mask)
    while len(indices) < target_count // 6 and threshold > nonzero.min():
        threshold *= 0.85
        mask = abs_cube >= threshold
        indices = np.argwhere(mask)

    weights = abs_cube[mask]
    weights = weights / weights.sum()
    chosen = RNG.choice(len(indices), size=target_count, replace=True, p=weights)
    ijk = indices[chosen]

    frac = RNG.random((target_count, 3))
    points_bohr = (
        origin_bohr[None, :]
        + (ijk[:, [0]] + frac[:, [0]]) * axes_bohr[0]
        + (ijk[:, [1]] + frac[:, [1]]) * axes_bohr[1]
        + (ijk[:, [2]] + frac[:, [2]]) * axes_bohr[2]
    )
    values = cube[ijk[:, 0], ijk[:, 1], ijk[:, 2]]
    if signed:
        colors = np.where(values[:, None] >= 0.0, positive_color, negative_color)
    else:
        colors = np.repeat(positive_color[None, :], target_count, axis=0)
    points_angstrom = points_bohr * ANGSTROM_PER_BOHR
    return points_angstrom.astype(np.float32), colors.astype(np.uint8), threshold


@dataclass
class MoleculeSpec:
    name: str
    orbital_id: str
    category: str
    charge: int
    spin: int
    edge_length: float
    xh_bond: float
    xc: str
    basis: str
    homo_grid_resolution: float
    density_grid_resolution: float
    homo_point_count: int
    density_point_count: int
    optimization_maxiter: int
    optimization_gtol: float
    optimization_grid_level: int
    final_grid_level: int
    vertices: np.ndarray
    atom_symbol: str
    display_name: str


def build_geometry(spec: MoleculeSpec) -> tuple[list[str], np.ndarray]:
    cage = scale_to_edge_length(spec.vertices, spec.edge_length)
    radial = cage / np.linalg.norm(cage, axis=1)[:, None]
    hydrogens = cage + radial * spec.xh_bond
    symbols = [spec.atom_symbol] * len(cage) + ["H"] * len(hydrogens)
    coords = np.vstack([cage, hydrogens])
    return symbols, coords


def build_molecule(
    spec: MoleculeSpec,
    symbols: list[str],
    coords: np.ndarray,
    *,
    unit: str,
) -> gto.Mole:
    mol = gto.Mole()
    mol.atom = build_atom_string(symbols, coords)
    mol.unit = unit
    mol.charge = spec.charge
    mol.spin = spec.spin
    mol.basis = spec.basis
    mol.verbose = 0
    mol.symmetry = False
    mol.build()
    return mol


def build_rks(mol: gto.Mole, spec: MoleculeSpec, *, grid_level: int, conv_tol: float) -> dft.rks.RKS:
    mf = dft.RKS(mol).density_fit()
    mf.xc = spec.xc
    mf.grids.level = grid_level
    mf.max_cycle = 120
    mf.conv_tol = conv_tol
    return mf


class GradientObjective:
    def __init__(self, spec: MoleculeSpec, symbols: list[str], initial_coords_bohr: np.ndarray) -> None:
        self.spec = spec
        self.symbols = symbols
        mol = build_molecule(spec, symbols, initial_coords_bohr, unit="Bohr")
        self.scanner = build_rks(
            mol,
            spec,
            grid_level=spec.optimization_grid_level,
            conv_tol=1e-7,
        ).nuc_grad_method().as_scanner()
        self.last_x: np.ndarray | None = None
        self.last_energy: float | None = None
        self.last_grad: np.ndarray | None = None

    def _evaluate(self, flat_coords_bohr: np.ndarray) -> None:
        if self.last_x is not None and np.array_equal(flat_coords_bohr, self.last_x):
            return
        coords_bohr = flat_coords_bohr.reshape(-1, 3)
        mol = build_molecule(self.spec, self.symbols, coords_bohr, unit="Bohr")
        energy, grad = self.scanner(mol)
        self.last_x = flat_coords_bohr.copy()
        self.last_energy = float(energy)
        self.last_grad = np.asarray(grad, dtype=float).reshape(-1)

    def fun(self, flat_coords_bohr: np.ndarray) -> float:
        self._evaluate(flat_coords_bohr)
        return float(self.last_energy)

    def jac(self, flat_coords_bohr: np.ndarray) -> np.ndarray:
        self._evaluate(flat_coords_bohr)
        return np.array(self.last_grad, copy=True)


def optimize_geometry(spec: MoleculeSpec, symbols: list[str], initial_coords_angstrom: np.ndarray) -> tuple[np.ndarray, dict]:
    initial_coords_bohr = initial_coords_angstrom * BOHR_PER_ANGSTROM
    objective = GradientObjective(spec, symbols, initial_coords_bohr)
    initial_energy = objective.fun(initial_coords_bohr.reshape(-1))

    result = minimize(
        objective.fun,
        initial_coords_bohr.reshape(-1),
        jac=objective.jac,
        method="L-BFGS-B",
        options={
            "maxiter": spec.optimization_maxiter,
            "gtol": spec.optimization_gtol,
            "ftol": 1e-7,
            "maxls": 40,
        },
    )

    optimized_coords_angstrom = result.x.reshape(-1, 3) * ANGSTROM_PER_BOHR
    optimization_meta = {
        "backend": "scipy.optimize L-BFGS-B + PySCF analytic nuclear gradients",
        "converged": bool(result.success),
        "message": str(result.message),
        "iterations": int(getattr(result, "nit", 0)),
        "functionEvaluations": int(getattr(result, "nfev", 0)),
        "gradientEvaluations": int(getattr(result, "njev", 0)),
        "initialEnergyHartree": float(initial_energy),
        "finalEnergyHartree": float(result.fun),
        "finalGradientNorm": float(np.linalg.norm(result.jac)),
    }
    return optimized_coords_angstrom, optimization_meta


def run_single_point(
    spec: MoleculeSpec,
    output_dir: Path,
    *,
    skip_optimization: bool,
    reuse_optimized_geometry: bool,
) -> dict:
    symbols, initial_coords_angstrom = build_geometry(spec)
    optimized_xyz_path = output_dir / f"{spec.orbital_id}_optimized.xyz"

    if reuse_optimized_geometry:
        loaded_symbols, optimized_coords_angstrom = read_xyz(optimized_xyz_path)
        if loaded_symbols != symbols:
            raise ValueError(f"Optimized XYZ symbols do not match {spec.orbital_id}")
        optimization_meta = {
            "backend": "reused existing optimized geometry",
            "converged": True,
            "message": f"Loaded coordinates from {optimized_xyz_path.name}",
            "iterations": 0,
            "functionEvaluations": 0,
            "gradientEvaluations": 0,
            "initialEnergyHartree": None,
            "finalEnergyHartree": None,
            "finalGradientNorm": None,
        }
    elif skip_optimization:
        optimized_coords_angstrom = initial_coords_angstrom.copy()
        optimization_meta = {
            "backend": "skipped",
            "converged": False,
            "message": "Geometry optimization skipped by CLI flag",
            "iterations": 0,
            "functionEvaluations": 0,
            "gradientEvaluations": 0,
            "initialEnergyHartree": None,
            "finalEnergyHartree": None,
            "finalGradientNorm": None,
        }
    else:
        optimized_coords_angstrom, optimization_meta = optimize_geometry(spec, symbols, initial_coords_angstrom)

    write_xyz(
        output_dir / f"{spec.orbital_id}_initial.xyz",
        symbols,
        initial_coords_angstrom,
        f"{spec.display_name} initial idealized cage geometry",
    )
    write_xyz(
        output_dir / f"{spec.orbital_id}_optimized.xyz",
        symbols,
        optimized_coords_angstrom,
        f"{spec.display_name} geometry after DFT optimization",
    )

    mol = build_molecule(spec, symbols, optimized_coords_angstrom, unit="Angstrom")
    mf = build_rks(mol, spec, grid_level=spec.final_grid_level, conv_tol=1e-8)
    energy = mf.kernel()
    if not mf.converged:
        raise RuntimeError(f"SCF did not converge for {spec.orbital_id}")

    occ = mf.mo_occ
    homo_idx = int(np.where(occ > 0)[0][-1])
    lumo_idx = homo_idx + 1 if homo_idx + 1 < len(occ) else homo_idx
    target_idx = homo_idx

    homo_cube_path = output_dir / f"{spec.orbital_id}_homo.cube"
    cubegen.orbital(
        mol,
        str(homo_cube_path),
        mf.mo_coeff[:, target_idx],
        resolution=spec.homo_grid_resolution,
        margin=4.0,
    )

    density_cube_path = output_dir / f"{spec.orbital_id}_density.cube"
    cubegen.density(
        mol,
        str(density_cube_path),
        mf.make_rdm1(),
        resolution=spec.density_grid_resolution,
        margin=4.0,
    )

    homo_cube, origin, axes, grid_shape = read_cube(homo_cube_path)
    homo_points, homo_colors, homo_threshold = cube_points_from_threshold(
        homo_cube,
        origin,
        axes,
        grid_shape,
        target_count=spec.homo_point_count,
    )
    write_ply(output_dir / f"{spec.orbital_id}.ply", homo_points, homo_colors)

    density_cube, density_origin, density_axes, density_shape = read_cube(density_cube_path)
    density_points, density_colors, density_threshold = cube_points_from_threshold(
        density_cube,
        density_origin,
        density_axes,
        density_shape,
        target_count=spec.density_point_count,
        min_quantile=0.975,
        signed=False,
        positive_color=DENSITY_COLOR,
    )
    write_ply(output_dir / f"{spec.orbital_id}_density.ply", density_points, density_colors)

    combined_points = np.vstack([homo_points, density_points])
    optimized_displacement = np.linalg.norm(optimized_coords_angstrom - initial_coords_angstrom, axis=1)

    meta = {
        "id": spec.orbital_id,
        "displayName": spec.display_name,
        "molecule": spec.display_name,
        "charge": spec.charge,
        "multiplicity": spec.spin + 1,
        "symmetry": "Geometry optimized from an idealized Ih starting cage",
        "displayTarget": "Geometry-optimized electron-density and HOMO point clouds",
        "method": f"PySCF RKS/{spec.xc}",
        "basis": spec.basis,
        "pointCount": int(len(combined_points)),
        "recommendedScale": 1.0,
        "opacity": 0.84,
        "physicalDiameter": round(float(np.max(np.linalg.norm(combined_points, axis=1)) * 2.0), 3),
        "homoIndex": homo_idx,
        "lumoIndex": lumo_idx,
        "targetOrbitalIndex": target_idx,
        "targetOrbitalLabel": "HOMO",
        "orbitalEnergyHartree": float(mf.mo_energy[target_idx]),
        "totalEnergyHartree": float(energy),
        "cubeThreshold": float(homo_threshold),
        "densityCubeThreshold": float(density_threshold),
        "gridResolutionBohr": spec.homo_grid_resolution,
        "densityGridResolutionBohr": spec.density_grid_resolution,
        "source": "Geometry optimization plus final DFT point clouds on a polyhedral cage molecule",
        "atomCount": len(symbols),
        "vertexCount": len(spec.vertices),
        "initialGeometryPath": f"{spec.orbital_id}_initial.xyz",
        "optimizedGeometryPath": f"{spec.orbital_id}_optimized.xyz",
        "geometryOptimization": optimization_meta,
        "maxCoordinateShiftAngstrom": round(float(np.max(optimized_displacement)), 4),
        "meanCoordinateShiftAngstrom": round(float(np.mean(optimized_displacement)), 4),
        "layers": [
            {
                "id": "density",
                "label": "Electron density",
                "path": f"{spec.orbital_id}_density.ply",
                "pointCount": int(len(density_points)),
                "opacity": 0.38,
                "sizeScale": 1.08,
                "defaultVisible": True,
            },
            {
                "id": "homo",
                "label": "HOMO",
                "path": f"{spec.orbital_id}.ply",
                "pointCount": int(len(homo_points)),
                "opacity": 0.42,
                "sizeScale": 0.96,
                "defaultVisible": False,
            },
        ],
    }
    with (output_dir / "meta.json").open("w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)

    return meta


def get_specs() -> dict[str, MoleculeSpec]:
    return {
        "dodec": MoleculeSpec(
            name="C20H20 dodecahedrane",
            orbital_id="dodec_C20H20",
            category="dodec",
            charge=0,
            spin=0,
            edge_length=1.54,
            xh_bond=1.09,
            xc="PBE",
            basis="6-31g",
            homo_grid_resolution=0.35,
            density_grid_resolution=0.12,
            homo_point_count=54000,
            density_point_count=38000,
            optimization_maxiter=22,
            optimization_gtol=2.5e-3,
            optimization_grid_level=1,
            final_grid_level=2,
            vertices=make_dodecahedron_vertices(),
            atom_symbol="C",
            display_name="C20H20",
        ),
        "icosa": MoleculeSpec(
            name="B12H12^2- closo borane",
            orbital_id="icosa_B12H12",
            category="icosa",
            charge=-2,
            spin=0,
            edge_length=1.77,
            xh_bond=1.19,
            xc="PBE",
            basis="def2-svp",
            homo_grid_resolution=0.32,
            density_grid_resolution=0.12,
            homo_point_count=56000,
            density_point_count=36000,
            optimization_maxiter=24,
            optimization_gtol=2.5e-3,
            optimization_grid_level=1,
            final_grid_level=2,
            vertices=make_icosahedron_vertices(),
            atom_symbol="B",
            display_name="B12H12^2-",
        ),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--molecule", choices=["dodec", "icosa", "all"], default="all")
    parser.add_argument("--skip-optimization", action="store_true")
    parser.add_argument("--reuse-optimized-geometry", action="store_true")
    args = parser.parse_args()

    root = Path(__file__).resolve().parent / "model++"
    specs = get_specs()
    keys = ["dodec", "icosa"] if args.molecule == "all" else [args.molecule]
    for key in keys:
        spec = specs[key]
        out_dir = root / spec.category / spec.orbital_id
        out_dir.mkdir(parents=True, exist_ok=True)
        run_single_point(
            spec,
            out_dir,
            skip_optimization=args.skip_optimization,
            reuse_optimized_geometry=args.reuse_optimized_geometry,
        )


if __name__ == "__main__":
    main()
