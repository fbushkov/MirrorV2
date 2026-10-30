import { typograf } from "@/lib/typograf"
import { SiteShell } from "@/site/shell"

export default function NotFound() {
  return (
    <SiteShell>
      <main data-no-typograf>
        <section className="page-hero" aria-labelledby="page-title">
          <div className="page-hero__head">
            <h1 className="hero__title" id="page-title">Такой страницы нет</h1>
            <p className="page-hero__lead">{typograf("Возможно, её перенесли. Начните с главной.")}</p>
            <div className="dir-hero__actions">
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- полная загрузка: скрипты страниц прототипа запускаются при открытии */}
              <a className="btn btn--primary" href="/">На главную</a>
            </div>
          </div>
        </section>
      </main>
    </SiteShell>
  )
}
