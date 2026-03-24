# 本地运行站点（给 Agent 的速查）

**目标**：用最少步骤起静态 HTTP 服务，**不要**先全文搜索 / 猜构建方式。

## 项目类型

- 纯静态站：HTML + ES 模块 + Three.js，**无** `package.json`、**无**打包步骤。
- 必须经 **http(s)** 打开（ES 模块与资源路径），不要直接双击 `index.html`。

## 网站根目录（必须含 `index.html`）

若当前工作区是内层 `...\Lorbital\Lorbital`，则 `index.html` 在 **上一级** `...\Lorbital\`。

## 一键启动（推荐）

在终端执行（PowerShell / cmd 均可；**不要用** `&&`，旧版 PowerShell 会报错）：

```powershell
python -m http.server 8000 --directory ".."
```

说明：`--directory ".."` 指向含 `index.html` 的目录，避免依赖 `cd` 到中文路径。

若 `python` 不可用，可试 `py -m http.server 8000 --directory ".."`.

## 后台运行

需要长期占用终端时，用 Cursor/IDE 的 **后台运行** 该命令即可。

## 验证

浏览器打开：<http://127.0.0.1:8000/>  
主要入口：`/`、`/explorer.html`、`/knowledge.html`、`/story.html`

## 停止

在运行该命令的终端里 **Ctrl+C**。

## 端口被占用

改用其他端口，例如：

```powershell
python -m http.server 8001 --directory ".."
```

---

*若仓库布局变化：以存在 `index.html` 与 `explorer.html` 的目录为 `--directory` 目标。*
