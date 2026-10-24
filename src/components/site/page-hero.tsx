import { Eyebrow } from "./section"

/** Первый экран внутренних страниц: заголовок по центру, сетка и мягкое свечение. */
export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <section className="relative overflow-hidden pt-32 pb-12 md:pt-40 md:pb-16">
      <div className="hero-glow pointer-events-none absolute inset-0 -z-10" />
      <div className="grid-bg pointer-events-none absolute inset-0 -z-10" />
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-5 px-4 text-center md:px-6">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <h1 className="text-4xl font-semibold md:text-6xl md:leading-[1.05]">{title}</h1>
        {description && <p className="max-w-2xl text-lg text-pretty text-muted-foreground">{description}</p>}
        {children}
      </div>
    </section>
  )
}
