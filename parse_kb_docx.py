# Parse unzipped docx: ordered paragraphs + tables; merge ZH/EN; emit knowledgeBase.js
# 中文版目录: .tmp_docx_en/word/document.xml  |  英文版: .tmp_docx_zh/word/document.xml

import json
import re
import xml.etree.ElementTree as ET
from pathlib import Path

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
REF_STOP = re.compile(r"^引用的著作\s*$")
re_major = re.compile(r"^(\d)\s+(.+)$")
re_minor = re.compile(r"^(\d+)\.(\d+)\s+(.+)$")

PARENT_IDS = [
    "orbital-quantum-foundation",
    "multi-electron-atoms",
    "atom-model-history",
    "molecular-bonding-core",
    "molecular-symmetry-mo",
    "reactivity-spectroscopy",
    "intermolecular-solids",
    "lorbital-application-layer",
]


def strip_citations(s: str) -> str:
    s = re.sub(r"\s*\[\s*\d+\s*,\s*\d+\s*\]", "", s)
    s = re.sub(r"\s*\[\s*\d+\s*\]\s*", "", s)
    return s


def para_text(p_el) -> str:
    texts = []
    for t in p_el.iter(W + "t"):
        if t.text:
            texts.append(t.text)
        if t.tail:
            texts.append(t.tail)
    return "".join(texts).strip()


def table_to_rows(tbl_el) -> list[list[str]]:
    rows = []
    for tr in tbl_el.findall(W + "tr"):
        cells = []
        for tc in tr.findall(W + "tc"):
            tx = []
            for t in tc.iter(W + "t"):
                if t.text:
                    tx.append(t.text)
                if t.tail:
                    tx.append(t.tail)
            cells.append("".join(tx).strip().replace("\n", " "))
        if cells:
            rows.append(cells)
    return rows


def read_ordered_blocks(xml_path: Path) -> list[tuple[str, object]]:
    root = ET.parse(xml_path).getroot()
    body = root.find(W + "body")
    if body is None:
        return []
    blocks = []
    for el in body:
        if el.tag == W + "p":
            s = para_text(el)
            if s:
                blocks.append(("p", s))
        elif el.tag == W + "tbl":
            rows = table_to_rows(el)
            if rows:
                blocks.append(("tbl", rows))
    return blocks


def is_false_major_en(title_rest: str) -> bool:
    if not title_rest:
        return True
    c = title_rest[0]
    return "a" <= c <= "z"


def table_to_html(rows: list[list[str]]) -> str:
    if not rows:
        return ""
    sb = ['<table class="kb-table">']
    for ri, row in enumerate(rows):
        sb.append("<tr>")
        tag = "th" if ri == 0 else "td"
        for c in row:
            cell = strip_citations((c or " ").strip())
            cell = re.sub(r"\s+\d{1,3}。\s*$", "。", cell)
            sb.append(f"<{tag}>{cell}</{tag}>")
        sb.append("</tr>")
    sb.append("</table>")
    return "".join(sb)


def parse_doc(blocks: list[tuple[str, object]], lang: str) -> list[dict]:
    i = 0

    def at_stop_p(text: str) -> bool:
        return bool(REF_STOP.match(text))

    while i < len(blocks):
        if blocks[i][0] != "p":
            i += 1
            continue
        line = blocks[i][1]
        if at_stop_p(line):
            break
        m = re_major.match(line)
        if m and not re_minor.match(line) and m.group(1) == "1":
            if lang == "en" and is_false_major_en(m.group(2)):
                i += 1
                continue
            break
        i += 1

    sections: list[dict] = []
    cur: dict | None = None
    cur_child: dict | None = None

    while i < len(blocks):
        kind, data = blocks[i]
        if kind == "p" and at_stop_p(data):
            break

        if kind == "p":
            line = data
            mm = re_minor.match(line)
            mj = re_major.match(line)

            if mj and not re_minor.match(line):
                title_rest = mj.group(2)
                if lang == "en" and is_false_major_en(title_rest):
                    if cur_child is not None:
                        cur_child["body"].append({"type": "p", "text": line})
                    i += 1
                    continue
                num = mj.group(1)
                full_title = f"{num} {title_rest.strip()}"
                cur = {"key": num, "title": full_title, "children": []}
                sections.append(cur)
                cur_child = None
                i += 1
                continue

            if mm:
                a, b, title = mm.group(1), mm.group(2), mm.group(3)
                if cur is None:
                    i += 1
                    continue
                if a != cur["key"]:
                    i += 1
                    continue
                cur_child = {
                    "key": f"{a}.{b}",
                    "title": f"{a}.{b} {title.strip()}",
                    "body": [],
                }
                cur["children"].append(cur_child)
                i += 1
                continue

            if cur_child is not None:
                cur_child["body"].append({"type": "p", "text": line})
            i += 1
            continue

        # table
        if cur_child is not None:
            cur_child["body"].append({"type": "tbl", "rows": data})
        i += 1

    return sections


def merge_docs(zh_sections: list[dict], en_sections: list[dict]) -> list[dict]:
    by_key = {s["key"]: s for s in en_sections}
    merged = []
    for zs in zh_sections:
        k = zs["key"]
        es = by_key[k]
        zc = {c["key"]: c for c in zs["children"]}
        ec = {c["key"]: c for c in es["children"]}
        if set(zc) != set(ec):
            raise SystemExit(f"children mismatch sec {k}: {set(zc)^set(ec)}")
        children = []
        for ck in sorted(zc.keys(), key=lambda x: tuple(map(int, x.split(".")))):
            children.append(
                {
                    "key": ck,
                    "title_zh": zc[ck]["title"],
                    "title_en": ec[ck]["title"],
                    "body_zh": zc[ck]["body"],
                    "body_en": ec[ck]["body"],
                }
            )
        merged.append(
            {
                "key": k,
                "title_zh": zs["title"],
                "title_en": es["title"],
                "children": children,
            }
        )
    return merged


def enrich_text_zh(s: str) -> str:
    s = strip_citations(s)
    s = re.sub(
        r"[\x00-\x1F]arepsilon",
        lambda _m: chr(92) + "varepsilon",
        s,
    )
    s = s.replace("不确定性原理（）", "不确定性原理（\\(\\Delta x\\,\\Delta p \\geq \\hbar/2\\)）")
    s = re.sub(
        r"提出能量量子化假说（），", r"提出能量量子化假说（\\(E=h\\nu\\)），", s
    )
    s = s.replace("轨道角动量是量子化的（）", "轨道角动量是量子化的（\\(L=n\\hbar\\)）")
    s = s.replace("能级跃迁（）之间", "能级跃迁（\\(\\Delta E=h\\nu\\)）之间")
    s = re.sub(
        r"具有质量\s+和速度\s+的运动粒子都伴随着特定的波长\s*，即德布罗意关系式：\s*",
        r"具有质量 \\(m\\) 和速度 \\(v\\) 的运动粒子都伴随着特定的波长 \\(\\lambda\\)，即德布罗意关系式：",
        s,
    )
    s = re.sub(
        r"波函数\s+本身不具有", r"波函数 \\(\\psi\\) 本身不具有", s
    )
    s = re.sub(
        r"但其模的平方\s*（或\s*）",
        r"但其模的平方 \\(|\\psi|^2\\)（或概率密度）",
        s,
         1,
    )
    s = re.sub(r"体积元\s+处", r"体积元 \\(d\\tau\\) 处", s)
    s = s.replace("动能算符（）与势能算符（）", "动能算符（\\(\\hat{T}\\)）与势能算符（\\(\\hat{V}\\)）")
    s = re.sub(r"其中，\s*为哈密顿", r"其中，\\(\\hat{H}\\) 为哈密顿", s)
    s = re.sub(r"，\s*则是体系的总能量", r"，\\(E\\) 则是体系的总能量", s)
    s = s.replace("能量的量子化现象（）", "能量的量子化现象（离散能级）")
    s = re.sub(
        r"（如\s*,\s*）",
        r"（如 \\(\\mathrm{He}^+\\)、\\(\\mathrm{Li}^{2+}\\)）",
        s,
        count=1,
    )
    s = re.sub(
        r"由于势能项\s+具有球对称性",
        r"由于势能项 \\(V(r)=-Ze^2/(4\\pi\\varepsilon_0 r)\\) 具有球对称性",
        s,
        count=1,
    )
    s = s.replace("球极坐标系（）中", "球极坐标系 \\((r,\\theta,\\phi)\\) 中")
    s = re.sub(
        r"波函数\s+被分解为径向波函数\s+和角向波函数\s+的乘积",
        r"波函数 \\(\\psi_{nlm}\\) 被分解为径向波函数 \\(R_{nl}(r)\\) 和角向波函数 \\(Y_{l}^{m}(\\theta,\\phi)\\) 的乘积",
        s,
        count=1,
    )
    s = re.sub(r"主量子数\s*：", r"主量子数 \\(n\\)：", s)
    s = re.sub(r"角量子数\s*：", r"角量子数 \\(l\\)：", s)
    s = s.replace("轨道的空间形状（）", "轨道的空间形状（\\(s,p,d,f\\)）")
    s = re.sub(r"其取值受限于\s*，为\s*", r"其取值受限于 \\(0 \\leq l \\leq n-1\\)，为 ", s)
    s = re.sub(r"磁量子数\s*：", r"磁量子数 \\(m\\)：", s)
    s = re.sub(
        r"其取值受限于\s*，为\s+",
        r"其取值受限于 \\(|m|\\leq l\\)，为 ",
        s,
        count=1,
    )
    s = re.sub(
        r"类氢原子的能量仅由主量子数\s+决定：",
        r"类氢原子的能量仅由主量子数 \\(n\\) 决定：",
        s,
    )
    s = re.sub(
        r"节点的总数为\s*，其中包含\s*个角向节点",
        r"节点总数 \\(n-1\\)，其中包含 \\(l\\) 个角向节点",
        s,
        count=1,
    )
    s = re.sub(r"和\s*个径向节点", r"和 \\(n-l-1\\) 个径向节点", s, count=1)
    s = re.sub(
        r"因\s+始终为非负值",
        r"因 \\(|\\psi|^2\\) 始终为非负值",
        s,
    )
    s = re.sub(
        r"库仑斥力项（），",
        r"库仑斥力项（\\(e^2/(4\\pi\\varepsilon_0 r_{ij})\\)），",
        s,
        count=1,
    )
    s = s.replace("“有效核电荷（）”", "“有效核电荷（\\(Z_{\\mathrm{eff}}\\)）”")
    s = re.sub(
        r"在距离核\s+处极薄球壳",
        r"在距离核 \\(r\\) 处极薄球壳",
        s,
        count=1,
    )
    s = re.sub(r"可以观察到\s+轨道的电子云", r"可以观察到 \\(s\\) 轨道的电子云", s, count=1)
    s = re.sub(
        r"穿透效应”使得\s+轨道电子",
        r"穿透效应”使得 \\(s\\) 轨道电子",
        s,
        count=1,
    )
    s = re.sub(
        r"比同层\s+轨道或\s+轨道",
        r"比同层 \\(p\\) 轨道或 \\(d\\) 轨道",
        s,
        count=1,
    )
    s = re.sub(
        r"多电子原子中\s+的能量顺序",
        r"多电子原子中 \\(E_{ns}<E_{np}\\) 等的能量顺序",
        s,
        count=1,
    )
    s = s.replace("自旋相反（）", "自旋相反（\\(\\uparrow\\downarrow\\)）")
    s = re.sub(
        r"如三个\s+轨道",
        r"如三个 \\(p\\) 轨道",
        s,
        count=1,
    )
    s = re.sub(
        r"共价键（如\s*,\s*）",
        r"共价键（如 \\(\\mathrm{H}_2\\)、\\(\\mathrm{O}_2\\)）",
        s,
        count=1,
    )
    s = re.sub(
        r"如\s+体系以及过渡金属",
        r"如 \\(\\mathrm{H}_3\\mathrm{N}\\to\\mathrm{BF}_3\\) 体系以及过渡金属",
        s,
        count=1,
    )
    s = re.sub(
        r"重叠积分（Overlap integral,\s*）",
        r"重叠积分 \\(S=\\int \\psi_a\\psi_b\\,d\\tau\\)",
        s,
    )
    s = re.sub(r"一个\s+轨道与多个\s+轨道", r"一个 \\(s\\) 轨道与多个 \\(p\\) 轨道", s, count=1)
    s = re.sub(r"杂化：1个\s+与3个", r"\\(sp^3\\) 杂化：1个 \\(s\\) 与3个 \\(p\\)", s)
    s = re.sub(r"夹角为\s+的杂化", r"夹角为 \\(109.5^\\circ\\) 的杂化", s, count=1)
    s = re.sub(r"杂化：生成3个", r"\\(sp^2\\) 杂化：生成3个", s, count=1)
    s = re.sub(r"夹角\s*），剩余", r"夹角 \\(120^\\circ\\)），剩余", s, count=1)
    s = re.sub(
        r"杂化：生成2个直线型", r"\\(sp\\) 杂化：生成2个直线型", s, count=1
    )
    s = re.sub(r"（夹角\s*），常用于", r"（夹角 \\(180^\\circ\\)），常用于", s, count=1)
    s = re.sub(
        r"定域的\s+键，而未参与杂化的\s+轨道",
        r"定域的 \\(\\sigma\\) 键，而未参与杂化的 \\(p\\) 轨道",
        s,
        count=1,
    )
    s = re.sub(
        r"侧向重叠形成\s+键",
        r"侧向重叠形成 \\(\\pi\\) 键",
        s,
        count=1,
    )
    s = re.sub(
        r"LCAO），\s*个原子轨道重叠产生\s*个分子轨道",
        r"LCAO），\\(N\\) 个原子轨道重叠产生 \\(N\\) 个分子轨道",
        s,
        count=1,
    )
    s = re.sub(
        r"键级（Bond Order）来衡量：\s*1。",
        r"键级 \\(\\mathrm{BO}=(N_b-N_a)/2\\) 来衡量。",
        s,
    )
    s = re.sub(r"（恒等\s*、旋转\s*", r"（恒等 \\(E\\)、旋转 \\(C_n\\)", s, count=1)
    s = re.sub(r"镜面\s*、反演\s*", r"镜面 \\(\\sigma\\)、反演 \\(i\\)", s)
    def _water_repl(_m: re.Match) -> str:
        b = chr(92)
        return (
            "水分子拥有 (E, \\(C_2\\), \\("
            + b
            + "sigma_v\\), \\("
            + b
            + "sigma_v'\\)) 四个操作"
        )

    s = re.sub(r"水分子拥有\s+四个操作", _water_repl, s, count=1)
    s = re.sub(
        r"属于\s+点群",
        r"属于 \\(C_{2v}\\) 点群",
        s,
        count=1,
    )
    s = re.sub(
        r"线\s+与高能\s*粒子",
        r"\\(\\alpha\\) 线与高能 \\(\\alpha\\) 粒子",
        s,
        count=1,
    )
    s = re.sub(r"匹配分子特定占据轨道与未占轨道之间的能隙", r"\\(h\\nu\\) 匹配分子特定占据轨道与未占轨道之间的能隙", s, count=1)
    s = re.sub(
        r"跃迁：常见于",
        r"\\(\\pi\\to\\pi^*\\) 跃迁：常见于",
        s,
        count=1,
    )
    s = re.sub(
        r"跃迁：杂原子",
        r"\\(n\\to\\pi^*\\) 跃迁：杂原子",
        s,
        count=1,
    )
    s = re.sub(
        r"向空置的\s+轨道跃迁",
        r"向空置的 \\(\\pi^*\\) 轨道跃迁",
        s,
        count=1,
    )
    s = re.sub(
        r"因为\s+轨道与\s+轨道",
        r"因为 \\(n\\) 轨道与 \\(\\pi^*\\) 轨道",
        s,
        count=1,
    )
    s = re.sub(
        r"摩尔吸光系数\s*）",
        r"摩尔吸光系数 \\(\\varepsilon\\)）",
        s,
        count=1,
    )
    s = s.replace(
        "拉波特选择定则（Laporte Selection Rule, ）：",
        "拉波特选择定则（Laporte, \\(g\\leftrightarrow u\\)）：",
    )
    s = s.replace(
        "不同宇称（）的轨道间跃迁",
        "不同宇称（\\(g\\) 与 \\(u\\)）的轨道间跃迁",
    )
    s = re.sub(
        r"配合物中的\s+跃迁",
        r"配合物中的 \\(d\\!-\\!d\\) 跃迁",
        s,
        count=1,
    )
    s = s.replace("自旋选择定则（Spin Selection Rule, ）：", "自旋选择定则：")
    s = re.sub(
        r"微弱\s+吸收",
        r"微弱 \\(d\\!-\\!d\\) 吸收",
        s,
    )
    s = s.replace(
        "比尔-朗伯定律（Beer-Lambert Law）：", "比尔-朗伯定律："
    )
    s = re.sub(r"其中\s+为吸光度", r"其中 \\(A\\) 为吸光度", s)
    s = re.sub(r"，\s*为浓度", r"，\\(c\\) 为浓度", s, count=1)
    s = re.sub(r"，\s*为光程", r"，\\(l\\) 为光程", s, count=1)
    _bz = chr(92)
    s = s.replace(
        "摩尔吸光系数（）",
        "摩尔吸光系数（\\("
        + _bz
        + "varepsilon\\)，单位 \\(\\mathrm{L\\,mol^{-1}\\,cm^{-1}}\\)）",
    )
    s = re.sub(
        r"允许的\s+跃迁\s+常在\s+之间",
        r"允许的 \\(\\pi\\to\\pi^*\\) 跃迁 \\(\\varepsilon\\) 常在 \\(10^4\\!\\sim\\!10^5\\) 之间",
        s,
        count=1,
    )
    s = re.sub(
        r"禁阻的\s+跃迁\s+通常仅为",
        r"禁阻的 \\(d\\!-\\!d\\) 跃迁 \\(\\varepsilon\\) 通常仅为",
        s,
        count=1,
    )
    s = re.sub(
        r"孤对电子（）向供体反键轨道（）",
        r"孤对电子向供体 \\(\\sigma^*\\) 反键轨道",
        s,
        count=1,
    )
    s = re.sub(
        r"晶体视为包含\s+个原子的巨型体系（）",
        r"晶体视为包含 \\(N\\) 个原子的巨型体系（超分子）",
        s,
        count=1,
    )
    s = re.sub(r"当\s+个原子轨道重叠", r"当 \\(N\\) 个原子轨道重叠", s, count=1)
    s = re.sub(
        r"会生成\s+个极度密集的分子轨道",
        r"会生成 \\(N\\) 个极度密集的分子轨道",
        s,
        count=1,
    )
    s = re.sub(
        r"受波矢\s+的调制",
        r"受布洛赫波矢 \\(\\mathbf{k}\\) 的调制",
        s,
        count=1,
    )
    s = re.sub(r"费米能级（Fermi Level,\s*）", r"费米能级 \\(E_\\mathrm{F}\\)", s)
    s = re.sub(r"带隙宽（通常\s*）", r"带隙宽（通常 \\(>3\\!\\sim\\!4\\,\\mathrm{eV}\\)）", s, count=1)
    s = re.sub(
        r"带隙较窄（通常\s*）",
        r"带隙较窄（通常 \\(<3\\,\\mathrm{eV}\\)）",
        s,
        count=1,
    )
    s = re.sub(
        r"双分子亲核取代反应（）中",
        r"双分子亲核取代（\\(S_N2\\)）中",
        s,
        count=1,
    )
    s = re.sub(
        r"在氨（）与硼烷（）",
        r"在氨（\\(\\mathrm{NH}_3\\)）与硼烷（\\(\\mathrm{BH}_3\\)）",
        s,
        count=1,
    )
    s = re.sub(r"向\s+的 LUMO", r"向 \\(\\mathrm{BH}_3\\) 的 LUMO", s)
    s = re.sub(r"LUMO（空\s+轨道）", r"LUMO（空 \\(p\\) 轨道）", s, count=1)
    s = re.sub(
        r"绕\s+键旋转\s*，两个",
        r"绕 \\(\\mathrm{C}=\\mathrm{C}\\) \\(\\pi\\) 键旋转 \\(90^\\circ\\)，两个",
        s,
        count=1,
    )
    s = re.sub(r"导致重叠积分\s*，", r"导致 \\(\\pi\\) 重叠积分为零，", s, count=1)
    s = re.sub(
        r"促使乙烯中的一个电子发生\s+跃迁",
        r"促使乙烯中的一个电子发生 \\(\\pi\\to\\pi^*\\) 跃迁",
        s,
        count=1,
    )
    s = re.sub(
        r"反键轨道\s+被占据",
        r"反键轨道 \\(\\pi^*\\) 被占据",
        s,
        count=1,
    )
    s = re.sub(r"系统的总键级降为\s*0", r"\\(\\pi\\) 键级近似降为 \\(0\\)", s, count=1)
    s = re.sub(
        r"不在受到\s+键的刚性约束",
        r"不再受到 \\(\\pi\\) 键的刚性约束",
        s,
        count=1,
    )
    s = s.replace("\\(p\\)  轨道组合", "\\(p\\) 轨道组合")
    s = s.replace("杂化轨道（如 ）。", "杂化轨道（如 \\(\\mathrm{CH}_4\\)）。")
    return s


def enrich_text_en(s: str) -> str:
    s = strip_citations(s)
    # Word/export may insert control chars before “arepsilon” (broken \varepsilon)
    s = re.sub(
        r"[\x00-\x1F]arepsilon",
        lambda _m: chr(92) + "varepsilon",
        s,
    )
    s = s.replace(
        "uncertainty principle ():",
        "uncertainty principle (\\(\\Delta x\\,\\Delta p \\geq \\hbar/2\\)):",
    )
    s = s.replace(
        "energy quantization hypothesis ()",
        "energy quantization hypothesis (\\(E=h\\nu\\))",
    )
    s = s.replace(
        "orbital angular momentum is quantized ()",
        "orbital angular momentum is quantized (\\(L=n\\hbar\\))",
    )
    s = s.replace(
        "spectral lines and energy level transitions ()",
        "spectral lines and energy level transitions (\\(\\Delta E=h\\nu\\))",
    )
    s = re.sub(
        r"with mass\s+and velocity\s+is accompanied by a specific wavelength\s*,",
        r"with mass \\(m\\) and velocity \\(v\\) is accompanied by wavelength \\(\\lambda\\),",
        s,
    )
    s = re.sub(
        r"de Broglie relation:\s*\.1",
        r"de Broglie relation \\(\\lambda=h/p\\).",
        s,
    )
    s = re.sub(
        r"the wavefunction\s+itself does not",
        r"the wavefunction \\(\\psi\\) itself does not",
        s,
    )
    s = re.sub(
        r"modulus squared\s+\(or \)",
        r"modulus squared \\(|\\psi|^2\\)",
        s,
    )
    s = re.sub(
        r"volume element\s+in space",
        r"volume element \\(d\\tau\\) in space",
        s,
    )
    s = re.sub(
        r"Here,\s+is the Hamiltonian operator.*?potential energy operator \(\),\s*while\s+is",
        r"Here, \\(\\hat{H}\\) is the Hamiltonian operator, including \\(\\hat{T}\\) and \\(\\hat{V}\\), while \\(E\\) is",
        s,
        flags=re.DOTALL,
    )
    s = s.replace(
        "kinetic energy operator () and the potential energy operator ()"
    , "kinetic energy operator (\\(\\hat{T}\\)) and the potential energy operator (\\(\\hat{V}\\))")
    s = re.sub(r"while\s+is the total energy eigenvalue", r"while \\(E\\) is the total energy eigenvalue", s)
    s = s.replace("Here,  is the Hamiltonian", "Here, \\(\\hat{H}\\) is the Hamiltonian")
    s = re.sub(
        r"quantization \(\)\.",
        r"quantization (discrete \\(E_n\\)).",
        s,
    )
    s = re.sub(
        r"potential energy term\s+possesses spherical symmetry",
        r"potential \\(V(r)\\propto -1/r\\) possesses spherical symmetry",
        s,
    )
    s = re.sub(
        r"spherical polar coordinates\s*\.1",
        r"spherical coordinates \\((r,\\theta,\\phi)\\).",
        s,
    )
    s = re.sub(
        r"The wavefunction\s+is separated into.*?angular wavefunction\s+\.",
        r"The wavefunction \\(\\psi_{nlm}\\) separates into radial \\(R_{nl}(r)\\) and angular \\(Y_l^{m}(\\theta,\\phi)\\).",
        s,
        flags=re.DOTALL,
    )
    s = re.sub(r"Principal quantum number\s*:", r"Principal quantum number \\(n\\):", s)
    s = re.sub(
        r"Azimuthal.*?quantum number\s*:.*?shape of the orbital \(s, p, d, f\).*?restricted by\s*,",
        r"Azimuthal quantum number \\(l\\): shape \\(s,p,d,f\\); restricted by \\(l<n\\),",
        s,
        flags=re.DOTALL,
    )
    s = re.sub(r"Magnetic quantum number\s*:", r"Magnetic quantum number \\(m\\):", s)
    s = re.sub(
        r"restricted by\s*, ranging from",
        r"restricted by \\(|m|\\le l\\), ranging from",
        s,
    )
    s = re.sub(
        r"determined solely by the principal quantum number\s*:",
        r"determined solely by \\(n\\): \\(E_n=-R_\\infty Z^2/n^2\\);",
        s,
    )
    s = re.sub(
        r"The total number of nodes is\s*,",
        r"Node count is \\(n-1\\),",
        s,
    )
    s = re.sub(
        r"which comprises\s+angular nodes",
        r"with \\(l\\) angular nodes",
        s,
    )
    s = re.sub(
        r"and\s+radial nodes",
        r"and \\(n-l-1\\) radial nodes",
        s,
    )
    s = re.sub(
        r"since\s+is always non-negative",
        r"since \\(|\\psi|^2\\) is always non-negative",
        s,
    )
    s = re.sub(
        r"repulsion term \(\)",
        r"repulsion (\\(e^2/4\\pi\\varepsilon_0 r_{ij}\\))",
        s,
    )
    s = s.replace(
        "effective nuclear charge (Zeff)",
        "effective nuclear charge \\(Z_{\\mathrm{eff}}\\)",
    )
    s = re.sub(
        r"thin spherical shell at distance r from the nucleus,\s*\)",
        r"thin shell at radius \\(r\\), \\(4\\pi r^2|R|^2\\)",
        s,
    )
    s = re.sub(
        r"electron cloud of s orbitals",
        r"\\(s\\)-orbital electron cloud",
        s,
    )
    s = re.sub(
        r"This mechanism.*?resulting in the energy ordering\s+",
        r"This yields \\(E_{ns}<E_{np}\\) type ordering ",
        s,
        flags=re.DOTALL,
    )
    s = s.replace(
        "opposite spins ()",
        "opposite spins (\\(\\uparrow\\downarrow\\))",
    )
    s = re.sub(
        r"such as the three p orbitals\)",
        r"such as the three \\(p\\) orbitals)",
        s,
    )
    s = re.sub(
        r"overlap integral between orbitals \(\)",
        r"overlap integral \\(S\\)",
        s,
    )
    s = re.sub(
        r"one s orbital and multiple p orbitals",
        r"one \\(s\\) and multiple \\(p\\) orbitals",
        s,
    )
    s = re.sub(
        r"sp3 hybridization:",
        r"\\(sp^3\\) hybridization:",
        s,
    )
    s = re.sub(
        r"sp2 hybridization:",
        r"\\(sp^2\\) hybridization:",
        s,
    )
    s = re.sub(
        r"sp hybridization:",
        r"\\(sp\\) hybridization:",
        s,
    )
    s = re.sub(
        r"Bond Order:\s*\.1",
        r"Bond order \\(\\mathrm{BO}=(N_b-N_a)/2\\).",
        s,
    )
    s = re.sub(
        r"overlap of N atomic orbitals.*?produces N molecular orbitals",
        r"overlap of \\(N\\) AOs yields \\(N\\) MOs",
        s,
    )
    s = re.sub(
        r"energy of an incident photon\s+perfectly",
        r"photon energy \\(h\\nu\\) perfectly",
        s,
    )
    _b = chr(92)

    def _beer_repl(_m: re.Match) -> str:
        # Callable repl: re.sub 不会对替换串再做 \v 等转义
        return (
            "Beer–Lambert law "
            + _b
            + "(A="
            + _b
            + "varepsilon c l"
            + _b
            + "):"
        )

    s = re.sub(r"Beer-Lambert Law:", _beer_repl, s)
    s = re.sub(
        r"Where\s+is the dimensionless absorbance",
        r"Where \\(A=-\\log_{10}(I/I_0)\\)",
        s,
    )
    s = re.sub(
        r"molar absorptivity \(\)",
        r"molar absorptivity \\(\\varepsilon\\)",
        s,
    )
    s = re.sub(
        r"Laporte Selection Rule \(\):",
        r"Laporte rule (\\(g\\leftrightarrow u\\)):",
        s,
    )
    s = re.sub(
        r"orbitals of different parity \(\)",
        r"orbitals of different parity (\\(g,u\\))",
        s,
    )
    s = re.sub(
        r"transitions in ideal octahedral",
        r"\\(d\\!-\\!d\\) transitions in ideal octahedral",
        s,
    )
    s = re.sub(
        r"The faint\s+absorptions",
        r"Feeble \\(d\\!-\\!d\\) absorptions",
        s,
    )
    s = re.sub(
        r"giant system containing N atoms \(\)\.",
        r"crystal as \\(N\\)-atom system.",
        s,
    )
    s = re.sub(
        r"When N atomic orbitals overlap.*?generate N densely",
        r"\\(N\\) AOs yield \\(N\\) dense",
        s,
    )
    s = re.sub(
        r"wave vector\s+\.",
        r"wavevector \\(\\mathbf{k}\\).",
        s,
    )
    s = re.sub(
        r"Fermi Level \(\)\.",
        r"Fermi level \\(E_\\mathrm{F}\\).",
        s,
    )
    s = re.sub(
        r"typically > 3 to 4 eV\)",
        r"typically \\(>3\\!\\sim\\!4\\) eV)",
        s,
    )
    s = re.sub(
        r"gap is narrow \(typically < 3 eV\)",
        r"narrow gap (\\(<3\\) eV)",
        s,
    )
    s = re.sub(
        r"lone pair \(\) to the donor",
        r"lone pair to \\(\\sigma^*\\)",
        s,
    )
    s = re.sub(
        r"rotate 90 degrees around the C=C bond.*?overlap integral of",
        r"rotate \\(90^\\circ\\) about \\(\\mathrm{C}=\\mathrm{C}\\), \\(\\pi\\) overlap",
        s,
    )
    s = re.sub(
        r"a\s+transition to an excited state",
        r"a \\(\\pi\\to\\pi^*\\) transition",
        s,
    )
    s = re.sub(
        r"antibonding\s+orbital is populated",
        r"\\(\\pi^*\\) is populated",
        s,
    )
    s = re.sub(
        r"reducing the total pi bond order to 0",
        r"\\(\\pi\\) bond order drops toward \\(0\\)",
        s,
    )
    s = re.sub(
        r"no longer constrained by the rigidity of the pi bond",
        r"\\(\\pi\\) constraint is lifted",
        s,
    )
    s = re.sub(
        r"binucleophilic substitution \(SN2\)",
        r"\\(S_N2\\)",
        s,
        flags=re.I,
    )
    return s


def blocks_to_bilingual_content(
    body_zh: list[dict], body_en: list[dict]
) -> list[dict]:
    if len(body_zh) != len(body_en):
        raise SystemExit(
            f"body block count mismatch: zh={len(body_zh)} en={len(body_en)}"
        )
    out = []
    for bz, be in zip(body_zh, body_en):
        if bz["type"] != be["type"]:
            raise SystemExit(f"block type mismatch {bz} vs {be}")
        if bz["type"] == "p":
            tz = enrich_text_zh(bz["text"])
            te = enrich_text_en(be["text"])
            if tz.strip() or te.strip():
                out.append({"zh": tz, "en": te})
        else:
            hz = table_to_html(bz["rows"])
            he = table_to_html(be["rows"])
            out.append({"zh": hz, "en": he})
    return out


def polish_symmetry_compare_tables(zh: str, en: str) -> tuple[str, str]:
    """Fill missing MO/table tokens for subsection 5.4 (CH4, CO2, HCN, XeF2)."""
    z = zh
    z = z.replace(
        "<td>甲烷 ()</td><td></td>",
        "<td>甲烷 (\\(\\mathrm{CH}_4\\))</td><td>\\(T_d\\)</td>",
    )
    z = z.replace("假设碳采用  杂化", "假设碳采用 \\(sp^3\\) 杂化")
    z = z.replace("形成4个能量等价的定域  键", "形成4个能量等价的定域 \\(\\sigma\\) 键")
    z = z.replace("碳轨道分为  与 。", "碳轨道分为 \\(a_1\\)（\\(2s\\)）与 \\(t_2\\)（\\(2p\\)）。")
    z = z.replace("生成  与  SALCs", "生成 \\(a_1\\) 与 \\(t_2\\) SALCs")
    z = z.replace("无节面的  成键轨道与三个简并的  成键轨道", "无节面的 \\(1a_1\\) 成键轨道与三个简并的 \\(1t_2\\) 成键轨道")
    z = z.replace(
        "<td>二氧化碳 ()</td><td>(可代以 )</td>",
        "<td>二氧化碳 (\\(\\mathrm{CO}_2\\))</td><td>\\(D_{\\infty h}\\)（或用 \\(D_{2h}\\)）</td>",
    )
    z = z.replace("杂化形成  键和局部定域的  键", "\\(sp\\) 杂化形成 \\(\\sigma\\) 键与定域 \\(\\pi\\) 键")
    z = z.replace("中心碳具有  对称性轨道", "中心碳具有 \\(a_g,b_{1u},b_{2u},b_{3u}\\) 等成分轨道")
    z = z.replace("离域  和  键", "离域 \\(\\sigma\\) 与 \\(\\pi\\) 键")
    z = z.replace("离域的  体系", "离域 \\(\\pi\\) 体系")
    z = z.replace(
        "<td>氢氰酸 ()</td><td></td>",
        "<td>氢氰酸 (\\(\\mathrm{HCN}\\))</td><td>\\(C_{\\infty v}\\)</td>",
    )
    z = z.replace("杂化，三键定域在  和  之间", "\\(sp\\) 杂化，三重键局域在 \\(\\mathrm{C{-}N}\\) 之间")
    z = z.replace("与氢  及氮的  SALC", "与氢 \\(1s\\) 及氮的 \\(\\sigma\\)-SALC")
    z = z.replace("形成离域  骨架，其  轨道进一步形成离域  系统", "形成离域 \\(\\sigma\\) 骨架，其 \\(\\pi\\) 轨道进一步形成离域 \\(\\pi\\) 体系")
    z = z.replace(
        "<td>二氟化氙 ()</td><td></td>",
        "<td>二氟化氙 (\\(\\mathrm{XeF}_2\\))</td><td>\\(D_{\\infty h}\\)</td>",
    )
    z = z.replace("高能的  轨道参与  杂化", "高能的 \\(5d\\) 轨道参与 \\(sp^3d\\) 杂化")
    z = z.replace("氟的  生成  和  SALC", "氟的 \\(p_z\\) 生成 \\(\\sigma_g\\) 与 \\(\\sigma_u\\) SALC")
    z = z.replace("氙的  与氟的  组合", "氙的 \\(5p_z\\)（\\(\\sigma_u\\)）与氟的 \\(\\sigma_u\\) 组合")
    z = z.replace("无需引入高能  轨道即可", "无需引入高能 \\(d\\) 轨道即可")

    en = en
    en = en.replace(
        "<td>Methane (CH4)</td><td>Td</td>",
        "<td>Methane (\\(\\mathrm{CH}_4\\))</td><td>\\(T_d\\)</td>",
    )
    en = en.replace("Assumes carbon uses sp3 hybridization", "Assumes \\(sp^3\\) hybridization")
    en = en.replace(
        "localized C-H bonds",
        "localized \\(\\mathrm{C{-}H}\\) \\(\\sigma\\) bonds",
    )
    en = en.replace(
        "Carbon orbitals are divided into A1 (2s) and T2 (2p).",
        "Carbon orbitals divide into \\(a_1\\) (\\(2s\\)) and \\(t_2\\) (\\(2p\\)).",
    )
    en = en.replace("in-phase A1 group orbital", "in-phase \\(a_1\\) SALC")
    en = en.replace(
        "Carbon Dioxide (CO2)</td><td>Dinfh (or D2h)</td>",
        "Carbon dioxide (\\(\\mathrm{CO}_2\\))</td><td>\\(D_{\\infty h}\\) (or \\(D_{2h}\\))</td>",
    )
    en = en.replace(
        "Hydrogen Cyanide (HCN)</td><td>Cinfv</td>",
        "Hydrogen cyanide (\\(\\mathrm{HCN}\\))</td><td>\\(C_{\\infty v}\\)</td>",
    )
    en = en.replace(
        "Xenon Difluoride (XeF2)</td><td>Dinfh</td>",
        "Xenon difluoride (\\(\\mathrm{XeF}_2\\))</td><td>\\(D_{\\infty h}\\)</td>",
    )
    return z, en


def fix_en_section6(e: str, child_key: str) -> str:
    if child_key == "6.4":
        if e.startswith("transitions: Typically"):
            e = "\\(\\pi\\to\\pi^*\\) " + e
        elif e.startswith("transitions: Involves"):
            e = "\\(n\\to\\pi^*\\) " + e
        if "Thus,  " in e and "Laporte" in e:
            e = e.replace("Thus,  ", "Thus, ", 1)
        e = e.replace(
            "Spin Selection Rule ():",
            "Spin selection rule (\\(\\Delta S=0\\)):",
        )
    if child_key == "6.5":
        b = chr(92)
        e = e.replace(
            "Where \\(A=-\\log_{10}(I/I_0)\\),  is the concentration, and  is the path length",
            "Where \\(A=-\\log_{10}(I/I_0)\\), \\(c\\) is concentration, and \\(l\\) path length",
        )
        e = e.replace("allowed  transitions", "allowed \\(\\pi\\to\\pi^*\\) transitions")
        e = e.replace("forbidden  transitions", "forbidden \\(d\\!-\\!d\\) transitions")
        e = e.replace("exhibit an  of", "exhibit \\(" + b + "varepsilon\\) of")
        e = e.replace("display an  of", "display \\(" + b + "varepsilon\\) of")
    return e


def polish_zh_footnotes(s: str) -> str:
    """去掉 Word 导出留在句末的数字角标（保守规则，不动年份等）。"""
    if not s or s.lstrip().startswith("<"):
        return s
    s = re.sub(r"）\s*\d{1,2}。", "）。", s)
    s = re.sub(r"([，、；：])\s*\d{1,2}。", r"\1", s)
    s = re.sub(r"(?<![0-9])\s+1。", "。", s)
    s = re.sub(r"([^\d\s：，])\s+\d{1,2}。", r"\1。", s)
    return s


def polish_en_footnotes(s: str) -> str:
    if not s or s.lstrip().startswith("<"):
        return s
    s = re.sub(r"(\)|[a-zäöüß])\.(\d{1,2})\s+", r"\1. ", s, flags=re.I)
    s = re.sub(r"\)\.(\d{1,2})\s+", "). ", s)
    s = re.sub(r"([a-z)])\.(\d{1,2})$", r"\1.", s, flags=re.I)
    return s


def polish_51_zh_full() -> str:
    return (
        "在多原子分子体系中，分子轨道构建往往涉及较多原子轨道的耦合。群论（Group Theory）为分析对称性、判断哪些轨道可以混合提供了系统工具。"
        "分子中的对称操作——恒等 \\(E\\)、真旋转 \\(C_n\\)、镜面反射 \\(\\sigma\\)、反演 \\(i\\)、非真旋转（旋转–反射）\\(S_n\\)——在乘法下封闭，构成该分子的点群（Point Group）。"
        "例如水分子具有 \\(E,\\,C_2,\\,\\sigma_v(xz),\\,\\sigma_v'(yz)\\) 等操作，归属 \\(C_{2v}\\) 点群。"
        "特征标表列出各个不可约表示（如 \\(A_1,\\,B_1,\\,B_2\\) 等）在对称操作下的本征值。"
        "量子力学对称性选律指出：唯有属于**同一**不可约表示的原子轨道或 SALC（群轨道）之间，重叠积分才可能非零，从而能有效线性组合成真正的分子轨道。"
    )


def polish_53_h2o_zh() -> str:
    return (
        "水（\\(\\mathrm{H}_2\\mathrm{O}\\)，点群 \\(C_{2v}\\)）："
        "氧的价层原子轨道可按 \\(C_{2v}\\) 不可约表示归类：\\(2s\\) 与 \\(2p_z\\) 属 \\(a_1\\)，\\(2p_x\\) 属 \\(b_1\\)，\\(2p_y\\) 属 \\(b_2\\)。"
        "两个氢原子的 \\(1s\\) 经 SALC 组合，得到同相的 \\(a_1\\) 与反相的 \\(b_2\\) 群轨道。"
        "在对称性匹配下，氧的 \\(a_1\\)、\\(b_2\\) 分量分别与相应的氢 \\(a_1\\)/\\(b_2\\) SALC 形成较强的 \\(\\sigma\\) 成键轨道；"
        "而 \\(b_1\\)（主要对应 \\(2p_x\\)）一侧没有对称性匹配的氢轨道，因而更接近**非键**特征，与孤对电子的图像一致。"
    )


def polish_53_nh3_zh() -> str:
    return (
        "氨（\\(\\mathrm{NH}_3\\)，点群 \\(C_{3v}\\)）："
        "氮的 \\(2s\\) 与 \\(2p_z\\) 属于 \\(a_1\\) 表示，\\(2p_x\\) 与 \\(2p_y\\) 简并，合称 \\(e\\)。"
        "三个氢的 \\(1s\\) 通过 SALC 形成一个 \\(a_1\\) 与两个简并的 \\(e\\) 群轨道。"
        "最高占据分子轨道（HOMO，常记为 \\(2a_1\\)）成键贡献较弱，电子密度仍显著定域在氮上，因而主要表现为**孤对电子**特征。"
    )


def polish_23_zh_full() -> str:
    return (
        "在第四周期元素的电子排布中，\\(4s\\) 与 \\(3d\\) 轨道能量的相对高低是典型现象。"
        "对钾（K）、钙（Ca）而言，\\(4s\\) 穿透更强，能量通常低于 \\(3d\\)，故先占据 \\(4s\\)。"
        "进入过渡金属（如 Sc）后，随原子序数 \\(Z\\) 增大，\\(3d\\) 感受到的有效核电荷上升更明显而其能量可降至 \\(4s\\) 之下。"
        "尽管如此，Sc 的基态仍为 \\([\\mathrm{Ar}]\\,4s^2\\,3d^1\\)："
        "\\(3d\\) 更紧凑，若价电子全部挤入 \\(3d\\) 会显著增大电子–电子排斥；"
        "部分电子保留在更弥散的 \\(4s\\) 有利于降低总能量。"
        "过渡金属电离时，排斥减弱且 \\(Z_{\\mathrm{eff}}\\) 增大，\\(3d\\) 常稳定低于 \\(4s\\)；"
        "故阳离子（如 \\(\\mathrm{Fe}^{2+}\\) \\([\\mathrm{Ar}]\\,3d^6\\)）往往优先失去外层更弥散的 \\(4s\\) 电子。"
    )


def polish_content_item(item: dict, child_key: str) -> None:
    """Fix remaining Word-export gaps after enrichment."""
    z = item["zh"]
    e = fix_en_section6(item["en"], child_key)
    item["en"] = e
    if child_key == "5.1" and "瑕旋转" in z:
        item["zh"] = polish_zh_footnotes(polish_51_zh_full())
        item["en"] = polish_en_footnotes(item["en"])
        return
    if child_key == "5.3":
        if "水分子" in z:
            item["zh"] = polish_53_h2o_zh()
        elif "氨分子" in z:
            item["zh"] = polish_53_nh3_zh()
        item["zh"] = polish_zh_footnotes(item["zh"])
        item["en"] = polish_en_footnotes(item["en"])
        return
    if child_key == "2.3" and "第四周期元素的电子排布中" in z and " 与  轨道" in z:
        item["zh"] = polish_23_zh_full()
        item["en"] = polish_en_footnotes(item["en"])
        return
    if child_key == "6.4" and "（ 轨道）" in z:
        z = z.replace("孤对电子（ 轨道）", "孤对电子（\\(n\\) 轨道）")
        z = z.replace("由于  轨道与  轨道", "由于 \\(n\\) 轨道与 \\(\\pi^*\\) 轨道")
        item["zh"] = polish_zh_footnotes(z)
        e = e.replace("into an empty  orbital", "into an empty \\(\\pi^*\\) orbital")
        e = e.replace("the n orbital and the  orbital", "the \\(n\\) orbital and the \\(\\pi^*\\) orbital")
        e = e.replace(
            "(molar absorptivity )",
            "(molar absorptivity \\(" + chr(92) + "varepsilon\\))",
        )
        item["en"] = polish_en_footnotes(e)
        return
    if child_key == "2.4" and "根据类氢原子模型的最可几半径公式近似推导， 1" in z:
        z = z.replace(
            "根据类氢原子模型的最可几半径公式近似推导， 1。在同一周期内从左至右， 保持不变而  稳步增加",
            "由类氢近似可得 \\(r_{\\mathrm{mp}}\\propto n^2/Z_{\\mathrm{eff}}\\)。同一周期从左到右，\\(n\\) 不变而 \\(Z_{\\mathrm{eff}}\\) 增大",
        )
        z = z.replace(
            "尽管  略有增加，但主量子数  的增大占据主导地位",
            "尽管 \\(Z_{\\mathrm{eff}}\\) 也略增，但 \\(n\\)（或 \\(n^2\\)）增大更占主导",
        )
        item["zh"] = polish_zh_footnotes(z)
        item["en"] = polish_en_footnotes(e)
        return
    if z.lstrip().startswith("<table") and child_key == "5.4":
        nz, ne = polish_symmetry_compare_tables(z, e)
        item["zh"] = nz
        item["en"] = ne
        return
    if z.lstrip().startswith(("<table", "<div")):
        return
    z = z.replace("使得  轨道电子", "使得 \\(s\\) 轨道电子")
    z = z.replace(
        "在距离核 \\(r\\) 处极薄球壳内找到电子的概率 ），可以观察",
        "在距离核 \\(r\\) 处薄球壳内电子径向分布 \\(\\propto 4\\pi r^2|R_{nl}|^2\\)），可以观察",
    )
    z = z.replace(
        "磁量子数 \\(m\\)：决定了轨道在三维空间中的取向，其取值受限于 \\(0 \\leq l \\leq n-1\\)，为 1。",
        "磁量子数 \\(m\\)：决定轨道取向；满足 \\(|m|\\le l\\)，取值 \\(m=-l,\\ldots,+l\\)。",
    )
    z = z.replace(
        "类氢原子的能量仅由主量子数 \\(n\\) 决定：，呈现",
        "类氢原子能量仅由主量子数 \\(n\\) 决定：\\(E_n=-R_\\infty Z^2/n^2\\)，呈现",
    )
    z = z.replace("主量子数 \\(n\\)：决定了电子的能级和轨道的主要空间尺度， 1。", "主量子数 \\(n\\)：决定能级与轨道主要尺度。")
    z = z.replace("角量子数 \\(l\\)：决定了轨道的空间形状（\\(s,p,d,f\\)），其取值受限于 \\(0 \\leq l \\leq n-1\\)，为 1。", "角量子数 \\(l\\)：决定轨道形状（\\(s,p,d,f\\)），满足 \\(0\\le l\\le n-1\\)。")
    z = z.replace("德布罗意关系式：1。", "德布罗意关系式为 \\(\\lambda=h/p\\)。")
    e = e.replace(
        "at radius \\(r\\), \\(4\\pi r^2|R|^2\\), it can be observed",
        "proportional to \\(4\\pi r^2|R|^2\\) at radius \\(r\\). It can be observed",
    )
    e = e.replace(
        "resulting in the energy ordering  in multi-electron atoms",
        "yielding \\(E_{ns}<E_{np}\\) type ordering in multi-electron atoms",
    )
    e = e.replace(
        "Principal quantum number \\(n\\): Determines the primary energy level and the main spatial scale of the orbital; .1",
        "Principal quantum number \\(n\\): sets the main energy scale and radial extent.",
    )
    e = e.replace(
        "Azimuthal quantum number \\(l\\): shape \\(s,p,d,f\\); restricted by \\(l<n\\), taking values of .1",
        "Azimuthal quantum number \\(l\\): shapes \\(s,p,d,f\\); \\(0\\le l\\le n-1\\).",
    )
    e = e.replace(
        "Magnetic quantum number \\(m\\): Determines the orientation of the orbital in 3D space. Its value is restricted by \\(|m|\\le l\\), ranging from .1 The energy of a hydrogen-like atom is determined solely by \\(n\\): \\(E_n=-R_\\infty Z^2/n^2\\); , presenting",
        "Magnetic quantum number \\(m\\): orientation; \\(|m|\\le l\\). For hydrogen-like atoms, \\(E_n=-R_\\infty Z^2/n^2\\), presenting",
    )
    e = e.replace("基于类氢原子模型的最可几半径公式近似推导， 1。", "From hydrogenic scaling, \\(r_{\\mathrm{mp}}\\propto n^2/Z_{\\mathrm{eff}}\\).")
    e = e.replace(
        "principal quantum number squared ()",
        "factor \\(n^2\\)",
    )
    z = re.sub(
        r"有效核电荷\s+和主量子数\s+共同决定",
        r"有效核电荷 \\(Z_{\\mathrm{eff}}\\) 与主量子数 \\(n\\) 共同决定",
        z,
        count=1,
    )
    item["zh"] = polish_zh_footnotes(z)
    item["en"] = polish_en_footnotes(e)


def reference_appendix_js_chunks() -> list[str]:
    """Section 9 — Reference + AI-compilation notice (not from Word merge)."""
    title_zh = "9 Reference（参考文献）"
    title_en = "9 Reference"
    c1_title_zh = "9.1 参考文献"
    c1_title_en = "9.1 References"
    c1_zh = (
        "本知识库各章专题内容主要依据项目组提供的中英文原始文稿编写。更完整的引用格式、具体原典与版权信息请以原始 Word 稿件或作者提供的书目为准。"
        "重要公式与结论建议对照权威教材与原始研究论文复核。"
    )
    c1_en = (
        "The chapters in this knowledge base are based primarily on the Chinese and English "
        "source manuscripts supplied for the project. For full citation details, primary "
        "sources, and rights information, please refer to the original Word files or the "
        "bibliography provided by the authors. Key formulas and claims should be checked "
        "against standard textbooks and peer-reviewed literature."
    )
    c2_title_zh = "9.2 知识库整理说明"
    c2_title_en = "9.2 About this knowledge base"
    c2_zh = (
        "各章节正文在从源稿自动抽取与排版后，**由人工智能辅助**完成分段润色、中英对齐、"
        "以及公式与表格的格式统一与局部补全。AI 参与整理可能引入疏漏或不严谨的表述，"
        "不构成正式学术引用依据；如发现错误欢迎反馈勘误。"
    )
    c2_en = (
        "After extraction and initial typesetting from the source manuscripts, the text was "
        "**organized and edited with AI assistance** for paragraph polish, bilingual "
        "alignment, and consistent handling of formulas and tables. AI-assisted compilation "
        "may contain errors or oversimplifications and should not be treated as a formal "
        "academic citation; please report corrections if you find issues."
    )
    lines = [
        "  {",
        '    id: "kb-reference",',
        "    title: { zh: "
        + json.dumps(title_zh, ensure_ascii=False)
        + ", en: "
        + json.dumps(title_en, ensure_ascii=False)
        + " },",
        "    children: [",
        "      {",
        '        id: "m8-1",',
        "        title: { zh: "
        + json.dumps(c1_title_zh, ensure_ascii=False)
        + ", en: "
        + json.dumps(c1_title_en, ensure_ascii=False)
        + " },",
        "        content: [",
        "          { zh: "
        + json.dumps(c1_zh, ensure_ascii=False)
        + ", en: "
        + json.dumps(c1_en, ensure_ascii=False)
        + " },",
        "        ]",
        "      },",
        "      {",
        '        id: "m8-2",',
        "        title: { zh: "
        + json.dumps(c2_title_zh, ensure_ascii=False)
        + ", en: "
        + json.dumps(c2_title_en, ensure_ascii=False)
        + " },",
        "        content: [",
        "          { zh: "
        + json.dumps(c2_zh, ensure_ascii=False)
        + ", en: "
        + json.dumps(c2_en, ensure_ascii=False)
        + " },",
        "        ]",
        "      },",
        "    ]",
        "  },",
    ]
    return lines


def main():
    base = Path(__file__).resolve().parent
    zh_b = read_ordered_blocks(base / ".tmp_docx_en" / "word" / "document.xml")
    en_b = read_ordered_blocks(base / ".tmp_docx_zh" / "word" / "document.xml")
    zs = parse_doc(zh_b, "zh")
    es = parse_doc(en_b, "en")
    merged = merge_docs(zs, es)
    (base / "_kb_merged.json").write_text(
        json.dumps(merged, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    # build JS manually with formula append
    chunks = [
        "/**",
        " * 知识库：由中英 Word 稿解析；化学之美为独立页面 beauty.html（见 knowledgeSulfuring.js）；",
        " * 第 9 章为参考文献与整理说明（含 AI 辅助说明）；",
        " * 表格保留为 HTML；关键式以块级公式附于小节末。",
        " */",
        "window.KNOWLEDGE_BASE = [",
    ]
    display_formulas = {
        "1.1": "E = h\\nu,\\quad \\Delta E = \\frac{hc}{\\lambda}",
        "1.2": "\\lambda = \\frac{h}{p}",
        "1.3": "\\int |\\psi|^2\\, d\\tau = 1",
        "1.4": (
            "\\hat{H}\\Psi = i\\hbar\\frac{\\partial\\Psi}{\\partial t},\\quad "
            "\\hat{H}\\psi = E\\psi"
        ),
        "1.5": "\\psi_{nlm}(r,\\theta,\\phi)=R_{nl}(r)Y_l^m(\\theta,\\phi)",
        "2.4": "r_{\\mathrm{mp}} \\propto n^2/Z_{\\mathrm{eff}}",
        "3.3": "E_n = -\\frac{13.6\\,\\mathrm{eV}}{n^2}",
        "4.2": "S = \\int \\psi_a\\psi_b\\,d\\tau",
        "4.4": "\\mathrm{BO} = \\frac{N_b - N_a}{2}",
        "6.5": "A = " + chr(92) + "varepsilon c l",
    }
    for si, sec in enumerate(merged):
        pid = PARENT_IDS[si] if si < len(PARENT_IDS) else f"section-{sec['key']}"
        chunks.append("  {")
        chunks.append(f'    id: {json.dumps(pid, ensure_ascii=False)},')
        chunks.append(
            "    title: { zh: "
            + json.dumps(sec["title_zh"], ensure_ascii=False)
            + ", en: "
            + json.dumps(sec["title_en"], ensure_ascii=False)
            + " },"
        )
        chunks.append("    children: [")
        for ci, ch in enumerate(sec["children"]):
            mid = f"m{si}-{ci+1}"
            content = blocks_to_bilingual_content(ch["body_zh"], ch["body_en"])
            ck = ch["key"]
            for item in content:
                polish_content_item(item, ck)
            if ck in display_formulas:
                fm = display_formulas[ck]
                content.append({"zh": f'<div class="formula-box">$$ {fm} $$</div>', "en": f'<div class="formula-box">$$ {fm} $$</div>'})
            chunks.append("      {")
            chunks.append(f'        id: {json.dumps(mid, ensure_ascii=False)},')
            chunks.append(
                "        title: { zh: "
                + json.dumps(ch["title_zh"], ensure_ascii=False)
                + ", en: "
                + json.dumps(ch["title_en"], ensure_ascii=False)
                + " },"
            )
            chunks.append("        content: [")
            for item in content:
                chunks.append(
                    "          { zh: "
                    + json.dumps(item["zh"], ensure_ascii=False)
                    + ", en: "
                    + json.dumps(item["en"], ensure_ascii=False)
                    + " },"
                )
            chunks.append("        ]")
            chunks.append("      },")
        chunks.append("    ]")
        chunks.append("  },")
    chunks.extend(reference_appendix_js_chunks())
    chunks.append("];")
    out = base / "src" / "data" / "knowledgeBase.js"
    out.write_text("\n".join(chunks), encoding="utf-8")
    print("Wrote", out)


if __name__ == "__main__":
    main()
