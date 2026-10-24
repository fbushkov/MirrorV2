import Link from "next/link"
import { CONTACTS, FOOTER_COLUMNS, LEGAL_LINKS } from "@/content/site"
import { Logo } from "./logo"
import { Ph } from "./ph"
import { PhToggle } from "./ph-toggle"

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] md:px-6">
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            Показываем, совпадают ли обещания работодателя с тем, что видят люди. Снаружи и изнутри.
          </p>
        </div>
        {FOOTER_COLUMNS.map((col) => (
          <div key={col.title}>
            <p className="mb-3 text-sm font-medium">{col.title}</p>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              {col.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-foreground">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <p className="mb-3 text-sm font-medium">Связаться</p>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            <li>
              <a href={`mailto:${CONTACTS.email}`} className="hover:text-foreground">
                {CONTACTS.email}
              </a>
            </li>
            <li>
              <a href={CONTACTS.phoneHref} className="hover:text-foreground">
                {CONTACTS.phone}
              </a>{" "}
              <span className="text-xs">({CONTACTS.phoneNote})</span>
            </li>
            <li>
              <a href={CONTACTS.telegram} target="_blank" rel="noreferrer" className="hover:text-foreground">
                Telegram {CONTACTS.telegramLabel}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
          <p className="shrink-0">
            © 2026 Mirror · <Ph>ООО «Миррор» · ИНН 0000000000</Ph>
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            {LEGAL_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-foreground">
                {l.title}
              </Link>
            ))}
            <PhToggle />
          </div>
        </div>
      </div>
    </footer>
  )
}
