#!/bin/bash
cd "$(dirname "$0")"
echo "正在启动 Lorbital 本地服务器..."
echo "访问 http://localhost:8000/index.html"
echo "按 Ctrl+C 停止"
echo ""
python3 -m http.server 8000
