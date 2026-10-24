import Link from "next/link"
import { Eyebrow } from "./section"

export function PageHero({
  crumbs,
  eyebrow,
  title,
  description,
  children,
}: {
  crumbs?: { title: string; href?: string }[]
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <section className="relative overflow-hidden pt-28 pb-14 md:pt-36 md:pb-20">
      <div className="glow-bg pointer-events-none absolute inset-0 -z-10" />
      <div className="grid-bg pointer-events-none absolute inset-0 -z-10 opacity-60" />
      <div className="mx-auto w-full max-w-6xl px-4 md:px-6">
        {crumbs && (
          <nav aria-label="Хлебные крошки" className="mb-6 text-sm text-muted-foreground">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-foreground">
                  Главная
                </Link>
              </li>
              {crumbs.map((c) => (
                <li key={c.title} className="flex items-center gap-1.5">
                  <span aria-hidden>/</span>
                  {c.href ? (
                    <Link href={c.href} className="hover:text-foreground">
                      {c.title}
                    </Link>
                  ) : (
                    <span className="text-foreground/80">{c.title}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="flex max-w-3xl flex-col items-start gap-5">
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h1 className="text-4xl font-semibold tracking-tight text-balance md:text-6xl md:leading-[1.05]">{title}</h1>
          {description && <p className="text-lg text-pretty text-muted-foreground md:text-xl">{description}</p>}
          {children}
        </div>
      </div>
    </section>
  )
}
