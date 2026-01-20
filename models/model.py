import torch
import numpy as np
import os
import math
from tqdm import tqdm

class QuantumOrbitalEngine:
    """量子轨道模型教授级生成器 V3.0 - 工业级资源分类与全命名系统"""
    
    def __init__(self, root_dir, device=None):
        self.root_dir = root_dir
        self.device = device if device else ("cuda" if torch.cuda.is_available() else "cpu")
        
        # 玻璃内雕风格：柔和浅粉/浅蓝
        self.COLOR_POS = [255, 160, 160] 
        self.COLOR_NEG = [160, 210, 255]

        print(f"| 系统 | 引擎已启动。计算设备: {self.device}")

    def gen_laguerre(self, k, alpha, x):
        if k == 0: return torch.ones_like(x)
        if k == 1: return (alpha + 1 - x)
        L0, L1 = torch.ones_like(x), (alpha + 1 - x)
        for n in range(2, k + 1):
            Ln = ((2 * n + alpha - 1 - x) * L1 - (n + alpha - 1) * L0) / n
            L0, L1 = L1, Ln
        return L1

    def get_radial_part(self, n, l, r):
        rho = 2.0 * r / n
        laguerre = self.gen_laguerre(n - l - 1, 2 * l + 1, rho)
        return (rho ** l) * laguerre * torch.exp(-rho / 2.0)

    def get_angular_data(self, l, m_idx, theta, phi):
        """核心：全轨道学术命名映射"""
        cos_t, sin_t = torch.cos(theta), torch.sin(theta)
        cos_p, sin_p = torch.cos(phi), torch.sin(phi)
        
        # s (l=0)
        if l == 0: return torch.ones_like(theta), "s"
        
        # p (l=1)
        elif l == 1:
            names = ["pz", "px", "py"]
            funcs = [cos_t, sin_t * cos_p, sin_t * sin_p]
            return funcs[m_idx], names[m_idx]
            
        # d (l=2)
        elif l == 2:
            names = ["dz2", "dxz", "dyz", "dx2-y2", "dxy"]
            funcs = [
                3 * cos_t**2 - 1,
                sin_t * cos_t * cos_p,
                sin_t * cos_t * sin_p,
                (sin_t**2) * torch.cos(2*phi),
                (sin_t**2) * torch.sin(2*phi)
            ]
            return funcs[m_idx], names[m_idx]
            
        # f (l=3)：orb_name 保持；在 sample_and_save 做 fxx2-3y2→x(x2-3y2)、fyy2-3x2→y(x2-z2) 及去 f 前缀
        elif l == 3:
            names = ["fz3", "fxz2", "fyz2", "fzx2-y2", "fxyz", "fxx2-3y2", "fyy2-3x2"]
            funcs = [
                cos_t * (5 * cos_t**2 - 3),
                sin_t * (5 * cos_t**2 - 1) * cos_p,
                sin_t * (5 * cos_t**2 - 1) * sin_p,
                cos_t * (sin_t**2) * torch.cos(2*phi),
                cos_t * (sin_t**2) * torch.sin(2*phi),
                (sin_t**3) * torch.cos(3*phi),
                (sin_t**3) * torch.sin(3*phi)
            ]
            return funcs[m_idx], names[m_idx]

        # g (l=4) - 查阅学术资料后的完整实现
        elif l == 4:
            names = ["gz4", "gxz3", "gyz3", "gz2x2-y2", "gxyz2", "gxzx2-3y2", "gyzy2-3x2", "gx4+y4", "gxyx2-y2"]
            funcs = [
                35 * cos_t**4 - 30 * cos_t**2 + 3,                 # gz4
                sin_t * cos_t * (7 * cos_t**2 - 3) * cos_p,       # gxz3
                sin_t * cos_t * (7 * cos_t**2 - 3) * sin_p,       # gyz3
                sin_t**2 * (7 * cos_t**2 - 1) * torch.cos(2*phi), # gz2(x2-y2)
                sin_t**2 * (7 * cos_t**2 - 1) * torch.sin(2*phi), # gxyz2
                sin_t**3 * cos_t * torch.cos(3*phi),              # gxz(x2-3y2)
                sin_t**3 * cos_t * torch.sin(3*phi),              # gyz(y2-3x2)
                sin_t**4 * torch.cos(4*phi),                      # gx4+y4
                sin_t**4 * torch.sin(4*phi)                       # gxy(x2-y2)
            ]
            return funcs[m_idx], names[m_idx]

        return torch.ones_like(theta), "error"

    def sample_and_save(self, n, l, m_idx, num_points=250000):
        l_char = "spdfg"[l]
        _, orb_name = self.get_angular_data(l, m_idx, torch.tensor([0.0]), torch.tensor([0.0]))
        # 1. full_name：s/p 不变；d/f/g 用 {n}{d|f|g}_{suffix}，suffix=去首字母，f 先做 fxx2-3y2→x(x2-3y2)、fyy2-3x2→y(x2-z2)
        if l == 0:
            full_name = f"{n}s"
        elif l == 1:
            full_name = f"{n}{orb_name}"  # 2px, 2py, 2pz
        else:
            if l == 3 and orb_name in ("fxx2-3y2", "fyy2-3x2"):
                suffix = "x(x2-3y2)" if orb_name == "fxx2-3y2" else "y(x2-z2)"
            else:
                suffix = orb_name[1:]  # 去首字母 d/f/g
            full_name = f"{n}{l_char}_{suffix}"  # 3d_z2, 4f_z3, 5g_z4 等

        # 2. 目录：models/model++/{type}/{orbitalId}/，与 README 一致
        dir_path = os.path.join(self.root_dir, l_char, full_name)
        os.makedirs(dir_path, exist_ok=True)

        # 3. 采样逻辑
        r_limit = n * (n + l) * 0.9
        points, colors = [], []
        batch_size = max(num_points, 150000)
        
        # 预估 PDF
        test_r = torch.linspace(0, r_limit, 300, device=self.device)
        max_pdf = (self.get_radial_part(n, l, test_r)**2).max().item() * 1.8

        with tqdm(total=num_points, desc=f"生成 {full_name}", leave=False) as pbar:
            while len(points) < num_points:
                r = torch.rand(batch_size, device=self.device) * r_limit
                cos_t = torch.rand(batch_size, device=self.device) * 2 - 1
                theta = torch.acos(cos_t)
                phi = torch.rand(batch_size, device=self.device) * 2 * math.pi
                
                R_val = self.get_radial_part(n, l, r)
                Y_val, _ = self.get_angular_data(l, m_idx, theta, phi)
                psi = R_val * Y_val
                pdf = psi**2
                
                accept = (torch.rand(batch_size, device=self.device) * max_pdf) < pdf
                
                x = (r[accept] * torch.sin(theta[accept]) * torch.cos(phi[accept])).cpu().numpy()
                y = (r[accept] * torch.sin(theta[accept]) * torch.sin(phi[accept])).cpu().numpy()
                z = (r[accept] * cos_t[accept]).cpu().numpy()
                psi_np = psi[accept].cpu().numpy()

                for i in range(len(x)):
                    if len(points) >= num_points: break
                    points.append([x[i], y[i], z[i]])
                    colors.append(self.COLOR_POS if psi_np[i] > 0 else self.COLOR_NEG)
                    pbar.update(1)

        # 5. 写入 PLY
        save_path = os.path.join(dir_path, f"{full_name}.ply")
        with open(save_path, 'w') as f:
            f.write(f"ply\nformat ascii 1.0\nelement vertex {len(points)}\n")
            f.write("property float x\nproperty float y\nproperty float z\n")
            f.write("property uchar red\nproperty uchar green\nproperty uchar blue\nend_header\n")
            for p, c in zip(points, colors):
                f.write(f"{p[0]:.4f} {p[1]:.4f} {p[2]:.4f} {c[0]} {c[1]} {c[2]}\n")

# --- 任务编排 ---
if __name__ == "__main__":
    # 项目内路径：models/model++，与 README 的 models/model++/{type}/{orbitalId}/ 一致
    _script_dir = os.path.dirname(os.path.abspath(__file__))
    BASE_URL = os.path.join(_script_dir, "model++")
    engine = QuantumOrbitalEngine(BASE_URL)

    # 定义全量任务 [n_range, l, 简并度]
    task_config = [
        (range(1, 8), 0, 1),  # 1s - 7s
        (range(2, 7), 1, 3),  # 2p - 6p（px,py,pz）
        (range(3, 7), 2, 5),  # 3d - 6d → 3d_z2 等
        (range(4, 6), 3, 7),  # 4f - 5f → 4f_z3 等
        (range(5, 6), 4, 9),  # 5g → 5g_z4 等
    ]

    for n_range, l, m_count in task_config:
        for n in n_range:
            for m_idx in range(m_count):
                engine.sample_and_save(n, l, m_idx)

    print(f"\n| 教授 | 任务完美完成！模型已按 models/model++/{{type}}/{{orbitalId}}/ 存储在: {BASE_URL}")