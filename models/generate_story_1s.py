#!/usr/bin/env python3
"""
从现有的 1s.ply 中采样生成故事页专用的轻量版
使用随机采样减少点数从 250000 到 18000，大幅减小文件体积
"""
import os
import random

def sample_ply(input_path, output_path, target_points=18000):
    """从 PLY 文件中随机采样指定数量的点"""
    print(f"| 系统 | 从 {input_path} 采样生成轻量版...")
    
    with open(input_path, 'r') as f:
        lines = f.readlines()
    
    # 找到 header 结束位置
    header_end = 0
    vertex_count = 0
    for i, line in enumerate(lines):
        if line.startswith('element vertex'):
            vertex_count = int(line.split()[2])
        if line.strip() == 'end_header':
            header_end = i + 1
            break
    
    # 读取所有顶点数据
    vertices = []
    for line in lines[header_end:]:
        line = line.strip()
        if line:
            parts = line.split()
            if len(parts) >= 6:  # x y z r g b
                vertices.append(line)
    
    print(f"| 信息 | 原始文件包含 {len(vertices)} 个顶点")
    
    # 随机采样
    if len(vertices) > target_points:
        sampled = random.sample(vertices, target_points)
    else:
        sampled = vertices
    
    print(f"| 信息 | 采样后包含 {len(sampled)} 个顶点")
    
    # 写入新文件
    with open(output_path, 'w') as f:
        f.write("ply\n")
        f.write("format ascii 1.0\n")
        f.write(f"element vertex {len(sampled)}\n")
        f.write("property float x\n")
        f.write("property float y\n")
        f.write("property float z\n")
        f.write("property uchar red\n")
        f.write("property uchar green\n")
        f.write("property uchar blue\n")
        f.write("end_header\n")
        for vertex in sampled:
            f.write(vertex + "\n")
    
    print(f"| 完成 | 轻量版已保存至: {output_path}")

if __name__ == "__main__":
    script_dir = os.path.dirname(os.path.abspath(__file__))
    input_path = os.path.join(script_dir, "model++", "s", "1s", "1s.ply")
    output_path = os.path.join(script_dir, "model++", "s", "1s", "1s-story.ply")
    
    if not os.path.exists(input_path):
        print(f"| 错误 | 未找到输入文件: {input_path}")
        sys.exit(1)
    
    sample_ply(input_path, output_path, target_points=18000)
