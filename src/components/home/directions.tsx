import Link from "next/link"
import { ArrowRight, Building2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DIRECTIONS } from "@/content/directions"
import { cn } from "@/lib/utils"

const STYLE = {
  brand: {
    card: "border-brand-200 bg-gradient-to-b from-brand-50 to-card",
    side: "bg-brand-500 text-white",
    icon: "bg-brand-100 text-brand-700",
    mark: "bg-brand-500",
    Icon: Eye,
  },
  health: {
    card: "border-health-200 bg-gradient-to-b from-health-50 to-card",
    side: "bg-health-500 text-white",
    icon: "bg-health-100 text-health-700",
    mark: "bg-health-500",
    Icon: Building2,
  },
}

/** Посадочный блок: два направления Mirror рядом */
export function Directions() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {DIRECTIONS.map((d, i) => {
        const s = STYLE[d.id]
        return (
          <article key={d.id} className={cn("flex flex-col gap-6 rounded-3xl border p-6 md:p-8", s.card)}>
            <div className="flex items-center justify-between gap-3">
              <span className={cn("inline-flex size-11 items-center justify-center rounded-2xl", s.icon)}>
                <s.Icon className="size-5" aria-hidden />
              </span>
              <span className={cn("rounded-full px-3 py-1 text-xs font-medium", s.side)}>
                Направление {i + 1} · {d.side}
              </span>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="text-2xl font-semibold md:text-[1.75rem] md:leading-tight">{d.name}</h3>
              <p className="text-lg text-pretty">{d.question}</p>
              <p className="text-muted-foreground">{d.text}</p>
            </div>
            <ul className="flex flex-col gap-3">
              {d.bullets.map((b) => (
                <li key={b.t} className="flex gap-3">
                  <span className={cn("mt-2 size-1.5 shrink-0 rounded-full", s.mark)} aria-hidden />
                  <span>
                    <span className="font-medium">{b.t}</span> <span className="text-muted-foreground">— {b.d}</span>
                  </span>
                </li>
              ))}
            </ul>
            <dl className="mt-auto grid gap-3 border-t border-border pt-5 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted-foreground">Источники</dt>
                <dd>{d.sources}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Формат</dt>
                <dd>{d.meta}</dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-2">
              <Button asChild variant={d.id === "brand" ? "glow" : "default"} size="lg" className={cn(d.id === "health" && "bg-health-500 text-white hover:bg-health-700")}>
                <Link href={d.overview}>
                  Подробнее <ArrowRight data-icon="inline-end" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="bg-card">
                <Link href={d.demo}>{d.demoLabel}</Link>
              </Button>
            </div>
          </article>
        )
      })}
    </div>
  )
}
