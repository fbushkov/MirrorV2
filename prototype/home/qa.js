const { chromium } = require('playwright');
const base = 'file://' + __dirname + '/dist/'; // запуск: node prototype/home/qa.js (после python3 build.py)
(async () => {
  const b = await chromium.launch();
  const out = {};
  for (const [w, h] of [[1920, 1080], [1440, 900], [1280, 800], [1024, 768], [390, 844]]) {
    for (const p of ['index.html', 'about.html', 'pricing.html']) {
      const pg = await b.newPage({ viewport: { width: w, height: h } });
      const errs = []; pg.on('pageerror', e => errs.push(e.message)); pg.on('console', m => m.type() === 'error' && errs.push(m.text()));
      await pg.goto(base + p); await pg.waitForTimeout(400);
      const sw = await pg.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      out[`${p}@${w}`] = { overflow: sw, errs };
      if (w === 1920 && p === 'about.html') await pg.screenshot({ path: 'shots/about-1920.png', fullPage: true });
      if (w === 390 && p === 'about.html') await pg.screenshot({ path: 'shots/about-390.png', fullPage: true });
      if (w === 1920 && p === 'index.html') {
        // меню: позиция карточек в обеих панелях
        const pos = {};
        for (const id of ['brand', 'health']) {
          await pg.hover(`.nav__item[data-panel=${id}]`); await pg.waitForTimeout(450);
          pos[id] = await pg.evaluate((id) => [...document.querySelectorAll(`.mega__panel[data-id=${id}] .mega__card`)].map(c => { const r = c.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.width), Math.round(r.height)]; }), id);
          await pg.screenshot({ path: `shots/menu-${id}.png`, clip: { x: 0, y: 0, width: 1920, height: 330 } });
        }
        out.menu = pos;
        await pg.mouse.move(5, 900); await pg.waitForTimeout(400);
        // FAQ ховер
        const qa = pg.locator('.qa').first(); await qa.scrollIntoViewIfNeeded(); await qa.hover(); await pg.waitForTimeout(300);
        const box = await pg.locator('.faq-group').first().boundingBox();
        await pg.screenshot({ path: 'shots/faq-hover.png', clip: { x: box.x + box.width - 1000, y: box.y, width: 1000, height: 300 } });
        out.icon = await pg.evaluate(() => { const s = getComputedStyle(document.querySelector('.qa .qa__icon')); return [s.backgroundColor, s.boxShadow, s.color]; });
        // типограф: сколько неразрывных пробелов появилось
        out.nbsp = await pg.evaluate(() => (document.body.textContent.match(/ /g) || []).length);
        out.sample = await pg.evaluate(() => document.querySelector('.hero__text').textContent.replace(/ /g, '⍽'));
      }
      await pg.close();
    }
  }
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})();
