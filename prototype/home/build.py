"""Сборка прототипа: каждая страница из pages/ → самодостаточный HTML в dist/.

Архитектура повторяет будущий Next.js:
  partials/layout.html  → src/app/layout.tsx (шапка + подвал общие)
  partials/header.html  → src/components/site/header.tsx
  partials/footer.html  → src/components/site/footer.tsx
  src/styles.css        → src/app/globals.css (+ классы компонентов)
  src/app.js            → клиентские компоненты (меню, форма, шейдер) + typograf
  ROUTES                → NAV / ROUTES в src/content/site.ts
  pages/*.html          → src/app/**/page.tsx
"""
import re, base64, pathlib
root = pathlib.Path(__file__).parent
DIST = root / "dist"

# Карта маршрутов. Ключ — id страницы, значение — путь в Next и файл прототипа (None — ещё не свёрстана)
ROUTES = {
    "home":                ("/",                          "index.html"),
    "about":               ("/about",                     "about.html"),
    "pricing":             ("/pricing",                   "index.html#pricing"),   # пока блок на главной
    "start":               ("/start",                     "index.html#request"),   # пока форма на главной
    "hr-brand":            ("/hr-brand",                  None),
    "hr-brand-demo":       ("/hr-brand/demo",             None),
    "methodology-brand":   ("/methodology#brand",         None),
    "culture-health":      ("/culture-health",            None),
    "culture-health-demo": ("/culture-health/demo",       None),
    "methodology-health":  ("/methodology#health",        None),
    "methodology":         ("/methodology",               None),
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

def render(page):
    text = page.read_text()
    meta = dict(kv.split("=", 1) for kv in re.match(r'<!-- page: (.*?) -->', text).group(1).split("; "))
    content = text.split("\n", 1)[1]
    out = (root / "partials/layout.html").read_text()
    out = out.replace("{{content}}", content).replace("{{title}}", meta["title"])
    out = re.sub(r'\{\{include:([^}]+)\}\}', lambda m: (root / m.group(1)).read_text(), out)
    def href(m):
        target = ROUTES[m.group(1)][1]
        if target is None: return "#"  # страница в плане, ещё не свёрстана
        if target.startswith(page.name + "#"): return target[len(page.name):]
        return target
    out = re.sub(r'\{\{href:([\w-]+)\}\}', href, out)
    out = re.sub(r'\{\{current:([\w-]+)\}\}', lambda m: ' aria-current="page"' if m.group(1) == meta["route"] else '', out)
    out = re.sub(r'\{\{svgc:([^}|]+)(?:\|([^}]+))?\}\}', svgc, out)
    out = re.sub(r'\{\{svg:([^}]+)\}\}', lambda m: raw(m.group(1)), out)
    out = re.sub(r'\{\{uri:([^}]+)\}\}', uri, out)
    assert '{{' not in out, re.findall(r'\{\{[^}]+\}\}', out)[:5]
    return out

DIST.mkdir(exist_ok=True)
for page in sorted((root / "pages").glob("*.html")):
    html = render(page)
    (DIST / page.name).write_text(html)
    print(f"dist/{page.name}  {len(html)//1024} КБ")
