"""Сборка прототипа — источник дизайна сайта (ADR-0008).

  python3 build.py         → dist/*.html: самодостаточные страницы для просмотра и согласования
  python3 build.py --next  → выгрузка в Next.js: src/site/ (страницы, оболочка, стили) и public/site/ (скрипты)
                             с адресами Next из ROUTES; Next отдаёт эту разметку по своим маршрутам

  partials/layout.html  → оболочка страницы прототипа; partials/layout-next.html — то же для Next
  partials/header.html, footer.html, request.html → общие блоки
  src/styles.css        → src/site/styles.css (подключается в src/app/layout.tsx)
  src/app.js            → public/site/ (меню, форма, подсказки, typograf)
  src/faq.json          → вопросы и ответы: при сборке попадают в разметку страницы (faq_html), в Next ещё и в данные FAQPage
  tools/bundle.py       → сайт одним файлом dist/mirror-site.html (запуск после build.py)
  vendor/echarts.mirror.min.js → своя сборка ECharts (tools/echarts-entry.js, пересборка: node tools/echarts-build.mjs)
  ROUTES                → ROUTES в src/content/site.ts (адреса, карта сайта, смоук-тесты)
  pages/*.html          → src/site/pages/*.html → src/app/**/page.tsx (SitePage из src/site/page.tsx)
"""
import re, base64, json, pathlib, shutil, sys
from html import escape
root = pathlib.Path(__file__).parent
DIST = root / "dist"

# Карта маршрутов. Ключ — id страницы, значение — путь в Next и файл прототипа (None — ещё не свёрстана)
ROUTES = {
    "home":                ("/",                          "index.html"),
    "about":               ("/about",                     None),   # страница убрана из меню, вернётся позже
    "pricing":             ("/pricing",                   "pricing.html"),
    "start":               ("/start",                     "start.html"),   # на главной форма своя — ссылка ведёт к ней (#request)
    "hr-brand":            ("/hr-brand",                  "hr-brand.html"),
    "hr-brand-demo":       ("/hr-brand/demo",             "hr-brand-demo.html"),
    "methodology-brand":   ("/hr-brand/methodology",      "methodology-brand.html"),
    "culture-health":      ("/culture-health",            "culture-health.html"),
    "culture-health-demo": ("/culture-health/demo",       "culture-health-demo.html"),
    "methodology-health":  ("/culture-health/methodology", "methodology-health.html"),
    "methodology":         ("/hr-brand/methodology",      "methodology-brand.html"),   # общей страницы нет; старый /methodology — редирект 301 сюда
    "privacy":             ("/docs/privacy-policy",       None),
    "terms":               ("/docs/terms-of-use",         None),
    "consent":             ("/docs/data-processing-consent", None),
}

def raw(name):
    s = (root / "assets" / name).read_text()
    s = re.sub(r'<\?xml[^>]*>', '', s)
    s = re.sub(r'\s(preserveAspectRatio|overflow|style)="[^"]*"', '', s, count=3)
    return s.strip()
def svgc(m):
    name, cls = m.group(1), m.group(2)
    s = raw(name)
    s = re.sub(r'(fill|stroke)="#[0-9A-Fa-f]{3,8}"', r'\1="currentColor"', s)
    s = re.sub(r'\sid="[^"]*"', '', s)
    return s.replace('<svg ', '<svg aria-hidden="true" focusable="false" ' + (f'class="{cls}" ' if cls else ''), 1)
def uri(m):
    return "data:image/svg+xml;base64," + base64.b64encode((root / "assets" / m.group(1)).read_bytes()).decode()

NEXT_SCRIPTS = ["vendor/echarts.mirror.min.js", "src/app.js"]   # → public/site/

FAQ = json.loads((root / "src/faq.json").read_text())
FAQ_SLOT = re.compile(r'<div class="faq" id="faq-list" data-groups="([^"]+)"(?: data-desc="([^"]*)")?></div>')

def faq_blocks(spec, desc):
    """data-groups="general,brand" — несколько блоков; "payment+plans" — один блок из нескольких групп
    (название и описание — первой группы или из data-desc)."""
    blocks = []
    for part in spec.split(","):
        groups = [FAQ[k] for k in part.strip().split("+")]
        blocks.append({**groups[0], "items": [qa for g in groups for qa in g["items"]]})
    if desc: blocks[0]["desc"] = desc
    return blocks

def faq_html(m):
    """Вопросы и ответы сразу в разметке: их видят поисковики и читалки без скриптов. Раскрытие — в app.js.
    Номер-тег показываем, только если блоков больше одного."""
    blocks, esc = faq_blocks(m.group(1), m.group(2)), lambda t: escape(t, quote=False)
    out = ['<div class="faq" id="faq-list">']
    for gi, g in enumerate(blocks):
        tag = f'<span class="faq-group__tag">{esc(g["tag"])}</span>' if len(blocks) > 1 else ""
        out.append(f'<div class="faq-group"><div class="faq-group__info">{tag}<div><h3 class="faq-group__title">{esc(g["title"])}</h3><p class="faq-group__desc">{esc(g["desc"])}</p></div></div><div class="faq-list">')
        for i, (q, a) in enumerate(g["items"]):
            out.append(f'<div class="qa"><button class="qa__q" type="button" aria-expanded="false" aria-controls="qa-{gi}-{i}"><span>{esc(q)}</span><i class="qa__icon">{{{{svgc:plus.svg}}}}</i></button><div class="qa__a" id="qa-{gi}-{i}" role="region"><div><p>{esc(a)}</p></div></div></div>')
        out.append("</div></div>")
    return "\n".join(out) + "\n</div>"

def faq_jsonld(content):
    """Данные FAQPage для поисковиков (только в Next)."""
    m = FAQ_SLOT.search(content)
    if not m: return ""
    items = [qa for g in faq_blocks(m.group(1), m.group(2)) for qa in g["items"]]
    data = {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in items]}
    return '<script type="application/ld+json">' + json.dumps(data, ensure_ascii=False).replace("</", "<\\/") + "</script>\n"

def fill(out, route, page_name, target):
    """Подставляет включения, ссылки и иконки. target: "proto" — файлы dist/, "next" — адреса Next."""
    out = re.sub(r'\{\{include:([^}]+)\}\}', lambda m: (root / m.group(1)).read_text(), out)
    out = FAQ_SLOT.sub(faq_html, out)
    has_form = 'id="request"' in out
    def href(m):
        key, query = m.group(1), m.group(2) or ""   # {{href:start?topic=scan}}
        if key == "start" and has_form: return "#request"   # на странице с формой — к ней, тему ставит скрипт по клику
        if target == "next":
            path, _, hash_ = ROUTES[key][0].partition("#")
            if key == route and hash_: return "#" + hash_
            return path + query + ("#" + hash_ if hash_ else "")
        file = ROUTES[key][1]
        if file is None: return "#"  # страница в плане, ещё не свёрстана
        path, _, hash_ = file.partition("#")
        if path == page_name and hash_: return "#" + hash_
        return path + query + ("#" + hash_ if hash_ else "")
    out = re.sub(r'\{\{href:([\w-]+)(\?[\w=&-]+)?\}\}', href, out)
    out = re.sub(r'\{\{current:([\w-]+)\}\}', lambda m: ' aria-current="page"' if m.group(1) == route else '', out)
    out = re.sub(r'\{\{svgc:([^}|]+)(?:\|([^}]+))?\}\}', svgc, out)
    out = re.sub(r'\{\{svg:([^}]+)\}\}', lambda m: raw(m.group(1)), out)
    out = re.sub(r'\{\{uri:([^}]+)\}\}', uri, out)
    assert '{{' not in out, re.findall(r'\{\{[^}]+\}\}', out)[:5]
    return out

def parse(page):
    text = page.read_text()
    meta = dict(kv.split("=", 1) for kv in re.match(r'<!-- page: (.*?) -->', text).group(1).split("; "))
    return meta, text.split("\n", 1)[1]

def render(page, target="proto"):
    meta, content = parse(page)
    if target == "next":   # ECharts — общим файлом, а не внутри каждой страницы
        content = content.replace("<script>\n{{include:vendor/echarts.mirror.min.js}}\n</script>", '<script src="/site/echarts.mirror.min.js"></script>')
        out = (root / "partials/layout-next.html").read_text().replace("{{content}}", faq_jsonld(content) + content)
    else:
        out = (root / "partials/layout.html").read_text().replace("{{content}}", content).replace("{{title}}", meta["title"])
    return meta, fill(out, meta["route"], page.name, target)

def export_next():
    """Выгрузка в Next.js: страницы, оболочка для страниц на React (документы, 404), стили и общие скрипты."""
    repo = root.parent.parent
    site, pub = repo / "src/site", repo / "public/site"
    shutil.rmtree(site / "pages", ignore_errors=True)
    (site / "pages").mkdir(parents=True); pub.mkdir(parents=True, exist_ok=True)
    manifest = []
    for page in sorted((root / "pages").glob("*.html")):
        meta, html = render(page, "next")
        path = ROUTES[meta["route"]][0]
        (site / "pages" / f"{meta['route']}.html").write_text(html)
        manifest.append({"path": path, "key": meta["route"], "title": meta["title"], "description": meta.get("description", "")})
        print(f"src/site/pages/{meta['route']}.html  {len(html.encode()) // 1024} КБ, адрес {path}")
    (site / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    shell = {k: fill((root / f"partials/{k}.html").read_text(), "", "", "next") for k in ("header", "footer")}
    shell["tail"] = fill((root / "partials/layout-next.html").read_text().split("</div>\n", 1)[1], "", "", "next")
    (site / "shell.json").write_text(json.dumps(shell, ensure_ascii=False) + "\n")
    shutil.copy(root / "src/styles.css", site / "styles.css")
    for f in NEXT_SCRIPTS: shutil.copy(root / f, pub / pathlib.Path(f).name)
    print(f"src/site/manifest.json, shell.json, styles.css; public/site/: {', '.join(pathlib.Path(f).name for f in NEXT_SCRIPTS)}")

if __name__ == "__main__":
    if "--next" in sys.argv:
        export_next(); sys.exit()
    DIST.mkdir(exist_ok=True)
    for page in sorted((root / "pages").glob("*.html")):
        _, html = render(page)
        (DIST / page.name).write_text(html)
        size = len(html.encode()) // 1024
        # Страница больше ~1,3 МБ может не открыться в просмотрщике целиком (скрипты в конце не выполнятся)
        print(f"dist/{page.name}  {size} КБ" + ("  ВНИМАНИЕ: больше 1200 КБ, облегчите страницу" if size > 1200 else ""))
