"""Сайт одним файлом: dist/mirror-site.html.

Все страницы прототипа (кроме «О нас») упакованы в один HTML. Общие куски (стили, ECharts,
скрипты) хранятся один раз, всё сжато gzip и распаковывается в браузере (DecompressionStream).
Страница открывается во фрейме, ссылки между страницами работают через адрес #/pricing.html.
Запуск после build.py: python3 tools/bundle.py
"""
import base64, gzip, json, pathlib, re

root = pathlib.Path(__file__).resolve().parent.parent
dist = root / "dist"
PAGES = ["index.html", "pricing.html", "hr-brand.html", "hr-brand-demo.html", "methodology-brand.html",
         "culture-health.html", "culture-health-demo.html", "methodology-health.html"]
# Общие куски: подставляются вместо повторов во всех страницах
CHUNKS = {k: (root / p).read_text() for k, p in {
    "E": "vendor/echarts.mirror.min.js", "S": "src/styles.css", "A": "src/app.js",
    "C": "src/content.js", "H": "src/charts.js", "M": "src/rmenu.js"}.items()}

pages = {}
for name in PAGES:
    html = (dist / name).read_text()
    for k, text in CHUNKS.items():
        html = html.replace(text, "\u0001" + k + "\u0001")
    pages[name] = html
blob = base64.b64encode(gzip.compress(json.dumps({"chunks": CHUNKS, "pages": pages}, ensure_ascii=False).encode(), 9)).decode()

shell = """<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Mirror — прототип сайта</title>
<style>
html, body { margin: 0; height: 100%; background: #f7f7fb; }
#site { position: fixed; inset: 0; width: 100%; height: 100%; border: 0; }
#wait { position: fixed; inset: 0; display: grid; place-items: center; font: 400 17px/24px system-ui, sans-serif; color: #807c93; }
</style>
</head>
<body>
<div id="wait">Загружаем сайт…</div>
<script>
/* Сайт одним файлом: страницы распаковываются из архива ниже и открываются во фрейме */
const PACK = "__BLOB__";
let site = null;
async function unpack() {
  const bytes = Uint8Array.from(atob(PACK), (c) => c.charCodeAt(0));
  const text = await new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"))).text();
  return JSON.parse(text);
}
// Ссылки на другие страницы перехватываем и открываем через адрес #/имя.html
const HOOK = `<script>document.addEventListener("click", (e) => { const a = e.target.closest("a[href]"); if (!a) return; const h = a.getAttribute("href"); if (/^[\\\\w-]+\\\\.html/.test(h)) { e.preventDefault(); parent.location.hash = "/" + h; } }, true);<\\/script>`;
function render() {
  const route = decodeURIComponent(location.hash.replace(/^#\\/?/, "")) || "index.html";
  const m = route.match(/^([\\w-]+\\.html)(\\?[^#]*)?(#.*)?$/) || [];
  const name = site.pages[m[1]] ? m[1] : "index.html", query = m[2] || "", anchor = (m[3] || "").slice(1);
  let html = site.pages[name].replace(/\\u0001(\\w)\\u0001/g, (_, k) => site.chunks[k]);
  html = html.replace("<head>", `<head><script>window.__QS = ${JSON.stringify(query)};<\\/script>`).replace("</body>", HOOK + "</body>");
  const old = document.getElementById("site"), frame = document.createElement("iframe");
  frame.id = "site"; frame.title = "Mirror";
  frame.addEventListener("load", () => {
    const doc = frame.contentDocument; document.title = doc.title;
    if (anchor) { const el = doc.getElementById(anchor); if (el) el.scrollIntoView(); }
    if (old) old.remove();
  }, { once: true });
  frame.srcdoc = html;
  document.body.appendChild(frame);
}
unpack().then((data) => { site = data; document.getElementById("wait").remove(); render(); addEventListener("hashchange", render); });
</script>
</body>
</html>
"""
out = dist / "mirror-site.html"
out.write_text(shell.replace("__BLOB__", blob))
print(f"dist/mirror-site.html  {out.stat().st_size // 1024} КБ, страниц: {len(PAGES)}")
