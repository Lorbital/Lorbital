from __future__ import annotations

import json
from pathlib import Path

import numpy as np


POS_COLOR = np.array([255, 160, 160], dtype=np.uint8)
RNG = np.random.default_rng(20260415)


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


def normalize_vertices(vertices: np.ndarray, target_radius: float) -> np.ndarray:
    radii = np.linalg.norm(vertices, axis=1)
    return vertices * (target_radius / radii.mean())


def build_edges(vertices: np.ndarray) -> list[tuple[int, int]]:
    diffs = vertices[:, None, :] - vertices[None, :, :]
    distances = np.linalg.norm(diffs, axis=2)
    positive = distances[distances > 1e-8]
    edge_length = positive.min()
    threshold = edge_length * 1.05
    edges = []
    for i in range(len(vertices)):
        for j in range(i + 1, len(vertices)):
            if distances[i, j] <= threshold:
                edges.append((i, j))
    return edges


def orthonormal_basis(direction: np.ndarray) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    e1 = direction / np.linalg.norm(direction)
    seed = np.array([1.0, 0.0, 0.0], dtype=float)
    if abs(np.dot(seed, e1)) > 0.9:
        seed = np.array([0.0, 1.0, 0.0], dtype=float)
    e2 = np.cross(e1, seed)
    e2 /= np.linalg.norm(e2)
    e3 = np.cross(e1, e2)
    e3 /= np.linalg.norm(e3)
    return e1, e2, e3


def sample_vertex_shells(vertices: np.ndarray, points_per_vertex: int, radial_sigma: float, tangential_sigma: float) -> np.ndarray:
    clouds = []
    for vertex in vertices:
        radial, tangential_a, tangential_b = orthonormal_basis(vertex)
        radial_offset = RNG.normal(loc=0.08, scale=radial_sigma, size=(points_per_vertex, 1))
        tangential_offset = RNG.normal(scale=tangential_sigma, size=(points_per_vertex, 2))
        pts = (
            vertex
            + radial_offset * radial
            + tangential_offset[:, [0]] * tangential_a
            + tangential_offset[:, [1]] * tangential_b
        )
        clouds.append(pts)
    return np.vstack(clouds)


def sample_edge_bridges(vertices: np.ndarray, edges: list[tuple[int, int]], points_per_edge: int, thickness: float) -> np.ndarray:
    clouds = []
    for i, j in edges:
        start = vertices[i]
        end = vertices[j]
        direction = end - start
        edge_axis, normal_a, normal_b = orthonormal_basis(direction)
        t = RNG.uniform(0.18, 0.82, size=(points_per_edge, 1))
        base = start + t * direction
        noise = (
            RNG.normal(scale=thickness, size=(points_per_edge, 1)) * normal_a
            + RNG.normal(scale=thickness, size=(points_per_edge, 1)) * normal_b
            + RNG.normal(scale=thickness * 0.25, size=(points_per_edge, 1)) * edge_axis
        )
        clouds.append(base + noise)
    return np.vstack(clouds)


def sample_points(vertices: np.ndarray, edges: list[tuple[int, int]], count: int) -> tuple[np.ndarray, np.ndarray]:
    vertex_target = int(round(count * 0.7))
    edge_target = count - vertex_target

    points_per_vertex = vertex_target // len(vertices)
    points_per_edge = edge_target // len(edges)

    vertex_points = sample_vertex_shells(vertices, points_per_vertex, radial_sigma=0.12, tangential_sigma=0.20)
    edge_points = sample_edge_bridges(vertices, edges, points_per_edge, thickness=0.085)

    points = np.vstack([vertex_points, edge_points]).astype(np.float32)

    if len(points) < count:
        missing = count - len(points)
        extra = sample_vertex_shells(vertices[:1], missing, radial_sigma=0.12, tangential_sigma=0.20)
        points = np.vstack([points, extra.astype(np.float32)])
    elif len(points) > count:
        points = points[:count]

    colors = np.repeat(POS_COLOR[None, :], len(points), axis=0).astype(np.uint8)
    return points, colors


def write_ply(path: Path, points: np.ndarray, colors: np.ndarray) -> None:
    with path.open('w', encoding='utf-8') as f:
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


def write_model(root: Path, category: str, orbital_id: str, meta: dict, vertices: np.ndarray) -> None:
    vertices = normalize_vertices(vertices, target_radius=3.4 if category == "dodec" else 3.1)
    edges = build_edges(vertices)
    points, colors = sample_points(vertices, edges, count=72000)

    model_dir = root / category / orbital_id
    model_dir.mkdir(parents=True, exist_ok=True)
    write_ply(model_dir / f"{orbital_id}.ply", points, colors)

    meta["pointCount"] = int(len(points))
    meta["vertexCount"] = int(len(vertices))
    meta["edgeCount"] = int(len(edges))
    meta["recommendedScale"] = 1.0
    meta["opacity"] = 0.84
    meta["physicalDiameter"] = round(float(np.max(np.linalg.norm(points, axis=1)) * 2.0), 3)

    with (model_dir / "meta.json").open("w", encoding="utf-8") as f:
        json.dump(meta, f, ensure_ascii=False, indent=2)


def main() -> None:
    root = Path(__file__).resolve().parent / "model++"
    write_model(
        root=root,
        category="dodec",
        orbital_id="dodec_C20H20",
        vertices=make_dodecahedron_vertices(),
        meta={
            "id": "dodec_C20H20",
            "displayName": "C20H20",
            "molecule": "C20H20",
            "symmetry": "Ih",
            "charge": 0,
            "multiplicity": 1,
            "displayTarget": "Uniform Ih-symmetric cage point cloud",
            "method": "LCAO topology approximation",
            "basis": "20 idealized dodecahedral cage vertices",
            "source": "Generated from a uniform Ih-symmetric superposition on the dodecahedral cage"
        },
    )
    write_model(
        root=root,
        category="icosa",
        orbital_id="icosa_B12H12",
        vertices=make_icosahedron_vertices(),
        meta={
            "id": "icosa_B12H12",
            "displayName": "B12H12^2-",
            "molecule": "B12H12^2-",
            "symmetry": "Ih",
            "charge": -2,
            "multiplicity": 1,
            "displayTarget": "Uniform Ih-symmetric cage point cloud",
            "method": "LCAO topology approximation",
            "basis": "12 idealized icosahedral cage vertices",
            "source": "Generated from a uniform Ih-symmetric superposition on the icosahedral cage"
        },
    )


if __name__ == "__main__":
    main()
