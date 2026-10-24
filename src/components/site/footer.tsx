import Link from "next/link"
import { CONTACTS, FOOTER_COLUMNS, LEGAL_LINKS } from "@/content/site"
import { Logo } from "./logo"
import { Ph } from "./ph"
import { PhToggle } from "./ph-toggle"

export function Footer() {
  return (
    <footer className="relative mt-8 border-t border-border bg-brand-800/60">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.3fr_repeat(4,1fr)] md:px-6">
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">
            Диагностика бренда работодателя и независимый индекс культуры компании. Помогаем обещать людям только то,
            что выдержит проверку.
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
          <p className="mb-3 text-sm font-medium">Контакты</p>
          <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
            <li>
              <a href={`mailto:${CONTACTS.email}`} className="hover:text-foreground">
                {CONTACTS.email}
              </a>
            </li>
            <li>
              <a href={CONTACTS.phoneHref} className="hover:text-foreground">
                {CONTACTS.phone}
              </a>
              <span className="block text-xs">({CONTACTS.phoneNote})</span>
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
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {LEGAL_LINKS.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-foreground">
                {l.title}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-3 md:items-end">
            <PhToggle />
            <p>
              © 2026 Mirror · <Ph>ООО «Миррор» · ИНН 0000000000</Ph>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
