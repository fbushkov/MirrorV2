"""Прототип личного кабинета клиента (docs/product/cabinet.md, ADR-0010) — один файл dist/cabinet.html.

  python3 prototype/cabinet/build.py

  src/index.html    → оболочка: полоса прототипа (роль, услуга), шаблоны иконок, скрипты
  src/cabinet.css   → стили кабинета поверх стилей сайта (prototype/home/src/styles.css), размеры shadcn
  src/app.js        → разделы, права по ролям и услугам, маршруты #/раздел
  src/data.js       → живые записи кабинета (команда, ход работы, встречи, ссылки опроса, документы)
  src/metrics.js    → 10 метрик: названия и источники
  vendor/report.json → демо-отчёт «Банка N» по схеме src/lib/schemas/report.ts (node prototype/cabinet/tools/report-build.mjs)

Иконки и ECharts берутся из прототипа сайта. В Next кабинет не выгружается: это образец для разработки на React.
"""
import re, pathlib, sys
root = pathlib.Path(__file__).parent
sys.path.insert(0, str(root.parent / "home"))
import build as home   # svgc и raw: иконки из prototype/home/assets

def include(m):
    return (root / m.group(1)).read_text()

if __name__ == "__main__":
    out = (root / "src/index.html").read_text()
    out = re.sub(r"\{\{include:([^}]+)\}\}", include, out)
    out = re.sub(r"\{\{svgc:([^}|]+)(?:\|([^}]+))?\}\}", home.svgc, out)
    assert "{{" not in re.sub(r"<script>.*?</script>", "", out, flags=re.S), re.findall(r"\{\{[^}]+\}\}", out)[:5]
    (root / "dist").mkdir(exist_ok=True)
    (root / "dist/cabinet.html").write_text(out)
    print(f"dist/cabinet.html  {len(out.encode()) // 1024} КБ")
