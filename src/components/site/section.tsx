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
    <section id={id} className={cn("relative scroll-mt-36 py-16 md:py-28", className)}>
      <div className={cn("mx-auto w-full max-w-6xl px-4 md:px-6", containerClassName)}>{children}</div>
    </section>
  )
}

export function Eyebrow({ children, className, tone }: { children: React.ReactNode; className?: string; tone?: "health" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-[0_1px_2px_rgb(26_19_32/0.04)]",
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", tone === "health" ? "bg-health-500" : "bg-primary")} />
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
        align === "center" ? "mx-auto max-w-2xl items-center text-center" : "max-w-2xl items-start",
        className,
      )}
    >
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2 className="text-3xl font-semibold md:text-[2.75rem] md:leading-[1.1]">{title}</h2>
      {description && <p className="text-base text-pretty text-muted-foreground md:text-lg">{description}</p>}
    </div>
  )
}
