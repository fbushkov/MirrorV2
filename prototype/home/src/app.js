/* Общий скрипт всех страниц: меню, форма, шейдер, типограф.
   Скрипт страницы (например, FAQ на главной) идёт раньше — типограф
   запускается последним и обрабатывает уже готовую разметку. */
/* Вопросы: группы из FAQ_GROUPS (src/content.js), один открытый на группу
   data-groups="general,brand" — несколько блоков; "payment+plans" — один блок из нескольких групп
   (название и описание — первой группы или из data-desc). Номер-тег показываем, только если блоков больше одного. */
const faqRoot = document.getElementById("faq-list");
if (faqRoot) {
  const plus = document.getElementById("ico-plus").innerHTML;
  const blocks = faqRoot.dataset.groups.split(",").map((spec) => {
    const parts = spec.trim().split("+").map((k) => FAQ_GROUPS[k]);
    return { ...parts[0], items: parts.flatMap((g) => g.items) };
  });
  if (faqRoot.dataset.desc) blocks[0].desc = faqRoot.dataset.desc;
  blocks.forEach((g, gi) => {
    const sec = document.createElement("div");
    sec.className = "faq-group";
    const tag = blocks.length > 1 ? `<span class="faq-group__tag">${g.tag}</span>` : "";
    sec.innerHTML = `<div class="faq-group__info">${tag}<div><h3 class="faq-group__title">${g.title}</h3><p class="faq-group__desc">${g.desc}</p></div></div><div class="faq-list"></div>`;
    const list = sec.querySelector(".faq-list");
    g.items.forEach(([q, a], i) => {
      const id = `qa-${gi}-${i}`;
      const el = document.createElement("div");
      el.className = "qa";
      el.innerHTML = `<button class="qa__q" type="button" aria-expanded="false" aria-controls="${id}"><span>${q}</span><i class="qa__icon">${plus}</i></button><div class="qa__a" id="${id}" role="region"><div><p>${a}</p></div></div>`;
      el.querySelector("button").addEventListener("click", () => {
        const willOpen = !el.classList.contains("is-open");
        list.querySelectorAll(".qa").forEach((o) => { o.classList.remove("is-open"); o.querySelector("button").setAttribute("aria-expanded", "false"); });
        if (willOpen) { el.classList.add("is-open"); el.querySelector("button").setAttribute("aria-expanded", "true"); }
      });
      list.appendChild(el);
    });
    faqRoot.appendChild(sec);
  });
}

/* Мега-меню: клик, Esc, клик вне, одно открытое */
const header = document.querySelector(".header");
const mega = document.getElementById("mega");
const triggers = [...document.querySelectorAll("[data-panel]")];
let current = null;
function setMenu(id) {
  current = id;
  mega.classList.toggle("is-open", !!id);
  triggers.forEach((t) => t.setAttribute("aria-expanded", String(t.dataset.panel === id)));
  if (id) mega.querySelectorAll(".mega__panel").forEach((p) => p.classList.toggle("is-active", p.dataset.id === id));
}
triggers.forEach((t) => t.addEventListener("click", (e) => { e.stopPropagation(); setMenu(current === t.dataset.panel ? null : t.dataset.panel); }));
/* Наведение на пункт со стрелкой открывает панель; уходим со всей шапки — закрываем с задержкой */
const canHover = matchMedia("(hover: hover) and (pointer: fine)").matches;
let closeT = 0;
if (canHover) {
  document.querySelectorAll(".nav__item[data-panel]").forEach((t) => t.addEventListener("pointerenter", () => { clearTimeout(closeT); setMenu(t.dataset.panel); }));
  document.querySelectorAll(".nav__item:not([data-panel]), .header__cta, .logo").forEach((el) => el.addEventListener("pointerenter", () => { if (current && current !== "mobile") { clearTimeout(closeT); closeT = setTimeout(() => setMenu(null), 120); } }));
  header.addEventListener("pointerenter", () => clearTimeout(closeT));
  header.addEventListener("pointerleave", () => { if (current && current !== "mobile") closeT = setTimeout(() => setMenu(null), 180); });
}
mega.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(null); });
document.addEventListener("click", (e) => { if (current && !header.contains(e.target)) setMenu(null); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && current) { const t = triggers.find((x) => x.dataset.panel === current); setMenu(null); t && t.focus(); } });
addEventListener("scroll", () => header.classList.toggle("is-stuck", scrollY > 40), { passive: true });

/* Цены → предвыбор темы в форме
   На той же странице — по клику, с другой страницы — через ?topic= в адресе (в Next: /start?topic=…) */
const pickTopic = (topic) => { const r = document.querySelector(`input[name=topic][value="${topic}"]`); if (r) r.checked = true; };
document.querySelectorAll("[data-topic]").forEach((a) => a.addEventListener("click", () => pickTopic(a.dataset.topic)));
const urlTopic = new URLSearchParams(window.__QS ?? location.search).get("topic"); // __QS — параметры страницы в сборке сайта одним файлом (tools/bundle.py)
if (urlTopic) pickTopic(urlTopic);

/* Форма: проверка обязательных полей, экран успеха */
const form = document.querySelector("form.form");
if (form) form.addEventListener("submit", (e) => {
  e.preventDefault();
  let ok = true;
  form.querySelectorAll("input[required]").forEach((inp) => {
    const bad = inp.type === "checkbox" ? !inp.checked : !inp.value.trim();
    if (inp.type !== "checkbox") { inp.setAttribute("aria-invalid", String(bad)); const err = inp.parentElement.querySelector(".error"); if (err) err.hidden = !bad; }
    else inp.parentElement.style.color = bad ? "#d92d20" : "";
    if (bad) ok = false;
  });
  if (ok) form.classList.add("is-sent");
});

/* Шейдерный градиент на карточках направлений (WebGL, без зависимостей)
   Логика как у shadergradient.co: плавная «ткань» из шума, 3 цвета, зерно.
   Анимация идёт только при наведении/фокусе; reduced-motion — статичный кадр. */
const PALETTES = {
  brand:  ["#7a2fd1", "#4a1a8f", "#f0a6ff", "#8fb4ff"],
  health: ["#0e9384", "#0a5e57", "#b8f2e6", "#f5d38a"],
};
const VS = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
const FS = `precision highp float;uniform vec2 r;uniform float t;uniform vec2 m;uniform vec3 c0,c1,c2,c3;
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 perm(vec4 x){return mod289(((x*34.)+1.)*x);}vec4 tis(vec4 r){return 1.79284291400159-.85373472095314*r;}
float sn(vec3 v){const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);vec4 p=perm(perm(perm(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);vec4 norm=tis(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;vec4 mm=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);mm=mm*mm;return 42.*dot(mm*mm,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));}
void main(){vec2 uv=gl_FragCoord.xy/r;vec2 q=uv;q.x*=r.x/r.y;q+=(m-.5)*.18;
float w=sn(vec3(q*.9,t*.12));float w2=sn(vec3(q*1.6+w*.9,t*.18+7.));float w3=sn(vec3(q*2.4-w2,t*.1+19.));
float band=sin((q.x*1.4+q.y*.9)*2.2+w*2.4+t*.25)*.5+.5;
vec3 col=mix(c1,c0,smoothstep(.0,.85,band+uv.x*.25));
col=mix(col,c2,smoothstep(.35,.95,w2*.5+.5)*.75);
col=mix(col,c3,smoothstep(.55,1.,w3*.5+.5)*.45);
col*=.92+.12*smoothstep(-.4,.8,w);
float g=fract(sin(dot(gl_FragCoord.xy+t,vec2(12.9898,78.233)))*43758.5453);col+=(g-.5)*.07;
gl_FragColor=vec4(col,1.);}`;
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
document.querySelectorAll(".dir[data-shader]").forEach((card) => {
  const canvas = card.querySelector("canvas");
  const gl = canvas.getContext("webgl", { antialias: false, premultipliedAlpha: false });
  if (!gl) { card.classList.add("no-gl"); return; }
  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const prog = gl.createProgram(); gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { card.classList.add("no-gl"); return; }
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = (n) => gl.getUniformLocation(prog, n);
  PALETTES[card.dataset.shader].forEach((c, i) => gl.uniform3fv(U("c" + i), hex(c)));
  let raf = 0, t = Math.random() * 50, last = 0, mx = .5, my = .5, tx = .5, ty = .5, running = false;
  const size = () => { const dpr = Math.min(devicePixelRatio || 1, 1.5); const w = card.clientWidth * dpr, h = card.clientHeight * dpr; if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); gl.uniform2f(U("r"), w, h); } };
  const draw = () => { size(); mx += (tx - mx) * .06; my += (ty - my) * .06; gl.uniform1f(U("t"), t); gl.uniform2f(U("m"), mx, my); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); };
  const loop = (now) => { if (last) t += Math.min(now - last, 50) / 1000; last = now; draw(); if (running) raf = requestAnimationFrame(loop); };
  const start = () => { if (reduce) { draw(); return; } if (running) return; running = true; last = 0; raf = requestAnimationFrame(loop); };
  const stop = () => { running = false; setTimeout(() => { if (!running) cancelAnimationFrame(raf); }, 700); };
  card.addEventListener("pointerenter", start); card.addEventListener("focus", start);
  card.addEventListener("pointerleave", () => { tx = ty = .5; stop(); }); card.addEventListener("blur", stop);
  card.addEventListener("pointermove", (e) => { const b = card.getBoundingClientRect(); tx = (e.clientX - b.left) / b.width; ty = 1 - (e.clientY - b.top) / b.height; });
  // На сенсорных экранах ховера нет: показываем градиент, когда карточка в зоне видимости
  if (matchMedia("(hover: none)").matches) new IntersectionObserver(([en]) => { card.classList.toggle("is-live", en.isIntersecting); en.isIntersecting ? start() : stop(); }, { threshold: .5 }).observe(card);
  draw();
});

/* Подсказки: кнопка с data-tip
   Наведение и фокус показывают, уход и Esc прячут; на тач-экранах — по нажатию. Над кнопкой,
   если сверху мало места — под ней. Связь для скринридеров — aria-describedby. */
const tip = document.createElement("div");
tip.className = "tip"; tip.id = "tip"; tip.setAttribute("role", "tooltip");
document.body.appendChild(tip);
let tipFor = null;
function showTip(btn) {
  tipFor = btn;
  tip.textContent = btn.dataset.tip;
  if (typeof typograf === "function") typograf(tip);
  btn.setAttribute("aria-describedby", "tip"); if (btn.matches("button")) btn.setAttribute("aria-expanded", "true");
  tip.classList.add("is-shown");
  const b = btn.getBoundingClientRect(), t = tip.getBoundingClientRect(), gap = 12;
  const left = Math.min(Math.max(16, b.left + b.width / 2 - t.width / 2), innerWidth - t.width - 16);
  const above = b.top - t.height - gap > 8;
  tip.dataset.side = above ? "top" : "bottom";
  tip.style.left = left + "px";
  tip.style.top = (above ? b.top - t.height - gap : b.bottom + gap) + "px";
  tip.style.setProperty("--tip-arrow", (b.left + b.width / 2 - left) + "px");
}
function hideTip() {
  if (!tipFor) return;
  tipFor.removeAttribute("aria-describedby"); if (tipFor.matches("button")) tipFor.setAttribute("aria-expanded", "false");
  tip.classList.remove("is-shown"); tipFor = null;
}
// Делегирование: подсказки работают и у элементов, которые страница дорисовала позже (бейджи статуса в дашборде)
document.querySelectorAll("button[data-tip]").forEach((btn) => btn.setAttribute("aria-expanded", "false"));
const tipTarget = (e) => (e.target instanceof Element ? e.target.closest("[data-tip]") : null);
let lastPointer = "mouse";
document.addEventListener("pointerdown", (e) => { lastPointer = e.pointerType; }, true);
document.addEventListener("pointerover", (e) => { const t = tipTarget(e); if (e.pointerType === "mouse" && t && t !== tipFor) showTip(t); });
document.addEventListener("pointerout", (e) => { if (e.pointerType === "mouse" && tipFor && !tipFor.contains(e.relatedTarget)) hideTip(); });
document.addEventListener("focusin", (e) => { const t = tipTarget(e); if (t && t.matches(":focus-visible")) showTip(t); }); // только с клавиатуры: нажатие обработает click
document.addEventListener("focusout", (e) => { if (tipTarget(e)) hideTip(); });
document.addEventListener("click", (e) => {
  const t = tipTarget(e);
  // кнопка «i» — сама подсказка; бейдж внутри карточки-кнопки клик не перехватывает
  if (t && t.matches("button")) { if (lastPointer !== "mouse" && tipFor === t) hideTip(); else showTip(t); return; }
  hideTip();
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") hideTip(); });
addEventListener("scroll", hideTip, { passive: true });
document.querySelectorAll(".cmp").forEach((c) => c.addEventListener("scroll", hideTip, { passive: true }));

/* Типограф: короткие слова не висят в конце строки
   Правило: слово из 1–3 символов (предлог, союз, частица, число, «№1») связываем
   неразрывным пробелом со следующим словом, а тире — с предыдущим.
   «в отчёте», «и ответы», «3 рабочих дня», «от 5 человек», «срез — бесплатно».
   В продакшене то же делает typograf() в src/lib/typograf.ts на этапе контента. */
function typograf(root) {
  const skip = "script,style,textarea,code,pre,input,[data-no-typograf]";
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (n.parentElement.closest(skip) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  const short = /(^|[\s\u00a0(«"„—–/])([−+]?[A-Za-zА-Яа-яЁё0-9№]{1,3}%?)[ ]+(?=\S)/g; // «−8 за», «34% сигналов» тоже не висят
  let n;
  while ((n = walker.nextNode())) {
    let t = n.nodeValue, prev;
    if (!t.trim()) continue;
    do { prev = t; t = t.replace(short, "$1$2\u00a0"); } while (t !== prev); // «и в», «а с» — подряд
    t = t.replace(/ +([—–])/g, "\u00a0$1");
    if (t !== n.nodeValue) n.nodeValue = t;
  }
}
typograf(document.body);

/* Выпадающий список по образцу Select из библиотеки: кнопка в стиле .select и скруглённое меню.
   Нативный select остаётся источником значения: выбор меняет его и шлёт change */
const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
document.querySelectorAll("select.select").forEach((sel, n) => {
  const box = document.createElement("div"), btn = document.createElement("button"), list = document.createElement("ul");
  box.className = "csel"; btn.type = "button"; btn.className = "select csel__btn"; btn.id = "csel-" + n;
  btn.setAttribute("aria-haspopup", "listbox"); btn.setAttribute("aria-expanded", "false");
  list.className = "csel__list"; list.setAttribute("role", "listbox"); list.tabIndex = -1; list.hidden = true;
  const label = sel.closest("label"); if (label) { label.htmlFor = btn.id; list.setAttribute("aria-label", label.querySelector(".label")?.textContent || ""); }
  sel.replaceWith(box); box.append(sel, btn, list); sel.hidden = true; sel.tabIndex = -1;
  let active = 0;
  const sync = () => { btn.textContent = sel.options[sel.selectedIndex]?.text || ""; };
  const mark = () => [...list.children].forEach((li, i) => li.classList.toggle("is-active", i === active));
  const close = (focus) => { list.hidden = true; btn.setAttribute("aria-expanded", "false"); box.classList.remove("is-open"); if (focus) btn.focus(); };
  const open = () => {
    list.innerHTML = [...sel.options].map((o, i) => `<li role="option" id="${btn.id}-${i}" aria-selected="${i === sel.selectedIndex}">${o.text}${CHECK}</li>`).join("");
    active = Math.max(0, sel.selectedIndex); mark(); list.setAttribute("aria-activedescendant", btn.id + "-" + active);
    list.hidden = false; btn.setAttribute("aria-expanded", "true"); box.classList.add("is-open"); list.focus();
  };
  const pick = (i) => { if (i !== sel.selectedIndex) { sel.selectedIndex = i; sel.dispatchEvent(new Event("change", { bubbles: true })); } sync(); close(true); };
  btn.addEventListener("click", () => (list.hidden ? open() : close()));
  btn.addEventListener("keydown", (e) => { if (["ArrowDown", "ArrowUp"].includes(e.key)) { e.preventDefault(); open(); } });
  list.addEventListener("click", (e) => { const li = e.target.closest("li"); if (li) pick([...list.children].indexOf(li)); });
  list.addEventListener("pointermove", (e) => { const li = e.target.closest("li"); if (li) { active = [...list.children].indexOf(li); mark(); } });
  list.addEventListener("keydown", (e) => {
    const last = list.children.length - 1;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); active = Math.min(last, Math.max(0, active + (e.key === "ArrowDown" ? 1 : -1))); }
    else if (e.key === "Home" || e.key === "End") { e.preventDefault(); active = e.key === "Home" ? 0 : last; }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pick(active); return; }
    else if (e.key === "Escape") { e.preventDefault(); close(true); return; }
    else if (e.key === "Tab") { close(); return; }
    mark(); list.setAttribute("aria-activedescendant", btn.id + "-" + active); list.children[active].scrollIntoView({ block: "nearest" });
  });
  document.addEventListener("pointerdown", (e) => { if (!list.hidden && !box.contains(e.target)) close(); });
  sel.addEventListener("change", sync); sync();
});
