"""Документы проекта в HTML для чтения и пересылки: один источник — Markdown в docs/product, HTML собирается из него.

  pip install markdown        # один раз
  python3 scripts/docs-html.py

  docs/product/business-rules.md → docs/html/business-logic.html  «Бизнес-логика Mirror»
  docs/product/admin.md          → docs/html/admin.html           «Админка Mirror»

HTML руками не правим: правка — в Markdown, потом пересборка.
"""
import html, pathlib, re
import markdown

root = pathlib.Path(__file__).resolve().parent.parent
DOCS = [
    ("docs/product/business-rules.md", "docs/html/business-logic.html", "Бизнес-логика Mirror"),
    ("docs/product/admin.md", "docs/html/admin.html", "Админка Mirror"),
]

# Короткие слова не остаются в конце строки — то же правило, что typograf() в src/lib/typograf.ts
SHORT = re.compile(r"(^|[\s («\"„—–/])([−+]?[A-Za-zА-Яа-яЁё0-9№]{1,3}%?) +(?=\S)")
def typograf(text: str) -> str:
    prev = None
    while prev != text:
        prev, text = text, SHORT.sub("\\1\\2 ", text)
    return re.sub(r" +([—–])", " \\1", text)

def typograf_html(h: str) -> str:
    parts = re.split(r"(<[^>]+>)", h)
    inside_code = False
    for i, p in enumerate(parts):
        if p.startswith("<"):
            if re.match(r"<(code|pre)\b", p): inside_code = True
            elif re.match(r"</(code|pre)>", p): inside_code = False
        elif not inside_code:
            parts[i] = typograf(p)
    return "".join(parts)

def slug(text: str, used: set) -> str:
    s = re.sub(r"[^\wа-яё-]+", "-", text.lower()).strip("-") or "section"
    base, n = s, 2
    while s in used: s, n = f"{base}-{n}", n + 1
    used.add(s)
    return s

CSS = """
:root { --page: #f7f7fb; --surface: #fff; --well: #ecebf1; --ink: #17142b; --ink2: #5f5b76; --ink4: #8a86a0; --line: #e5e4ec;
  --violet: #7a2fd1; --violet-soft: #eee5fa; --teal: #0e9384; --zebra: #faf9fe;
  --sans: "Onest", ui-sans-serif, system-ui, sans-serif; --mono: "JetBrains Mono", ui-monospace, monospace; color-scheme: light; }
* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; background: var(--page); color: var(--ink); font: 400 15px/1.6 var(--sans); -webkit-font-smoothing: antialiased; }
.wrap { display: grid; grid-template-columns: 260px minmax(0, 1fr); gap: 32px; max-width: 1320px; margin: 0 auto; padding: 32px max(16px, 2vw) 64px; }
.toc { position: sticky; top: 24px; align-self: start; max-height: calc(100vh - 48px); overflow: auto; padding: 20px; border-radius: 12px; background: var(--surface); }
.toc b { display: block; margin-bottom: 8px; font: 400 12px/18px var(--mono); color: var(--ink4); }
.toc a { display: block; padding: 6px 8px; border-radius: 8px; color: var(--ink2); text-decoration: none; font-size: 14px; line-height: 20px; }
.toc a:hover { background: var(--page); color: var(--violet); }
.doc { min-width: 0; padding: 40px clamp(20px, 4vw, 56px); border-radius: 12px; background: var(--surface); }
.doc__brand { display: flex; align-items: center; gap: 10px; font: 400 12px/18px var(--mono); color: var(--ink4); }
.doc__brand i { width: 10px; height: 10px; border-radius: 3px; background: var(--violet); }
h1 { margin: 12px 0 8px; font: 600 clamp(28px, 3vw, 40px)/1.15 var(--sans); letter-spacing: -.01em; text-wrap: balance; }
h1 + p { margin-top: 0; color: var(--ink2); }
h2 { margin: 48px 0 12px; padding-top: 24px; border-top: 1px solid var(--line); font: 600 22px/1.3 var(--sans); text-wrap: balance; }
h3 { margin: 28px 0 8px; font: 600 17px/1.4 var(--sans); }
p, ul, ol { margin: 10px 0; max-width: 78ch; }
li { margin: 4px 0; }
li::marker { color: var(--ink4); }
strong { font-weight: 600; }
a { color: var(--violet); }
code { padding: 1px 6px; border-radius: 6px; background: var(--page); font: 400 13px/1.5 var(--mono); color: var(--ink2); }
pre { overflow-x: auto; padding: 16px; border-radius: 8px; background: var(--page); }
pre code { padding: 0; background: none; }
.table { overflow-x: auto; margin: 12px 0 16px; border-radius: 10px; background: var(--well); padding: 8px; }
table { width: 100%; border-collapse: separate; border-spacing: 0; font-size: 14px; line-height: 20px; font-variant-numeric: tabular-nums; }
th { padding: 8px 12px 10px; text-align: left; vertical-align: bottom; font: 400 12px/16px var(--mono); color: var(--ink4); }
td { padding: 10px 12px; vertical-align: top; background: var(--surface); }
tbody tr:nth-child(even) td { background: var(--zebra); }
tbody tr:first-child td:first-child { border-top-left-radius: 8px; } tbody tr:first-child td:last-child { border-top-right-radius: 8px; }
tbody tr:last-child td:first-child { border-bottom-left-radius: 8px; } tbody tr:last-child td:last-child { border-bottom-right-radius: 8px; }
td:first-child { font-weight: 500; }
.foot { margin-top: 48px; padding-top: 16px; border-top: 1px solid var(--line); font: 400 12px/18px var(--mono); color: var(--ink4); }
@media (max-width: 960px) { .wrap { grid-template-columns: 1fr; } .toc { position: static; max-height: none; } }
@media print { body { background: #fff; } .wrap { display: block; padding: 0; } .toc { display: none; } .doc { padding: 0; }
  h2 { break-after: avoid; } .table { break-inside: avoid; background: #fff; border: 1px solid var(--line); } }
"""

def build(src: str, out: str, title: str) -> None:
    text = (root / src).read_text()
    body = markdown.markdown(text, extensions=["tables", "sane_lists"])
    body = body.replace("<table>", '<div class="table"><table>').replace("</table>", "</table></div>")
    used, toc = set(), []
    def head(m):
        level, inner = m.group(1), m.group(2)
        sid = slug(re.sub(r"<[^>]+>", "", inner), used)
        if level == "2": toc.append((sid, re.sub(r"<[^>]+>", "", inner)))
        return f'<h{level} id="{sid}">{inner}</h{level}>'
    body = re.sub(r"<h([23])>(.*?)</h\1>", head, body)
    body = re.sub(r"<h1>(.*?)</h1>", lambda m: f"<h1>{title}</h1>", body, count=1)
    body = typograf_html(body)
    toc_html = "".join(f'<a href="#{sid}">{typograf(html.escape(t, quote=False))}</a>' for sid, t in toc)
    page = f"""<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
<style>{CSS}</style>
</head>
<body>
<div class="wrap">
<nav class="toc" aria-label="Содержание"><b>Содержание</b>{toc_html}</nav>
<main class="doc">
<p class="doc__brand"><i></i>Mirror · внутренний документ</p>
{body}
<p class="foot">Источник: {src} · собрано scripts/docs-html.py</p>
</main>
</div>
</body>
</html>
"""
    (root / out).parent.mkdir(parents=True, exist_ok=True)
    (root / out).write_text(page)
    print(f"{out}  {len(page.encode()) // 1024} КБ")

if __name__ == "__main__":
    for src, out, title in DOCS:
        build(src, out, title)
