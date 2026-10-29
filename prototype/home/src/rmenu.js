/* Полоса разделов (.rmenu): общий скрипт для отчётов, обзоров и методик.
   На первом экране все якоря серые; дальше подсвечен раздел на экране.
   Полоса листается внутри себя, маска по краям — только там, где есть скрытые пункты */
const menu = document.getElementById("rmenu"), scroller = document.getElementById("rmenu-scroll");
const alinks = [...menu.querySelectorAll(".rmenu__links a")], secs = alinks.map((a) => document.querySelector(a.getAttribute("href")));
const headerEl = document.querySelector(".header");
let activeIdx = -1;
function fade() {
  const max = scroller.scrollWidth - scroller.clientWidth;
  scroller.classList.toggle("is-fade-l", scroller.scrollLeft > 2);
  scroller.classList.toggle("is-fade-r", scroller.scrollLeft < max - 2);
}
function sync() {
  const top = headerEl ? headerEl.getBoundingClientRect().bottom : 0;
  menu.classList.toggle("is-stuck", menu.getBoundingClientRect().top <= top + 1);
  const line = top + menu.offsetHeight + 120;
  let cur = -1; secs.forEach((s, i) => { if (s.getBoundingClientRect().top <= line) cur = i; });
  if (cur === activeIdx) return;
  activeIdx = cur;
  alinks.forEach((a, i) => { a.classList.toggle("is-active", i === cur); if (i === cur) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); });
  if (cur < 0) { scroller.scrollTo({ left: 0, behavior: "smooth" }); return; }
  const a = alinks[cur], l = a.offsetLeft - scroller.offsetLeft;
  // пункт виден без прокрутки — возвращаем полосу в начало
  if (l + a.offsetWidth <= scroller.clientWidth - 48) scroller.scrollTo({ left: 0, behavior: "smooth" });
  else if (l < scroller.scrollLeft + 48 || l + a.offsetWidth > scroller.scrollLeft + scroller.clientWidth - 48) scroller.scrollTo({ left: l - scroller.clientWidth / 3, behavior: "smooth" });
}
scroller.addEventListener("scroll", fade, { passive: true });
// При наведении колесо мыши листает полосу вбок; у края полосы прокручивается страница
scroller.addEventListener("wheel", (e) => {
  if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
  const max = scroller.scrollWidth - scroller.clientWidth;
  if ((e.deltaY > 0 && scroller.scrollLeft >= max - 1) || (e.deltaY < 0 && scroller.scrollLeft <= 0)) return;
  e.preventDefault(); scroller.scrollBy({ left: e.deltaY, behavior: "auto" });
}, { passive: false });
addEventListener("scroll", sync, { passive: true }); addEventListener("resize", () => { fade(); sync(); });
fade(); sync();
