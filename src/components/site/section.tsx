import { cn } from "@/lib/utils"

export function Section({
  id,
  className,
  containerClassName,
  children,
}: {
  id?: string
  className?: string
  containerClassName?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className={cn("relative py-16 md:py-24", className)}>
      <div className={cn("mx-auto w-full max-w-6xl px-4 md:px-6", containerClassName)}>{children}</div>
    </section>
  )
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-white/[0.04] px-3 py-1 text-xs font-medium tracking-wide text-brand-50/90",
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-brand-accent shadow-[0_0_10px_2px_rgb(168_71_184/0.7)]" />
      {children}
    </span>
  )
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  description?: React.ReactNode
  align?: "center" | "left"
  className?: string
}) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-4 md:mb-14",
        align === "center" ? "mx-auto max-w-3xl items-center text-center" : "max-w-3xl items-start",
        className,
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="text-3xl font-semibold tracking-tight text-balance md:text-[2.6rem] md:leading-[1.1]">{title}</h2>
      {description && <p className="text-base text-pretty text-muted-foreground md:text-lg">{description}</p>}
    </div>
  )
}
