import { ArrowRight } from "lucide-react"
import { LevelBadge } from "@/components/pulse/parts"
import { CROSS_CHECKS } from "@/content/bridge"
import { cn } from "@/lib/utils"

const KIND = {
  both: "bg-status-bad/10 text-status-bad",
  strength: "bg-status-ok/10 text-status-ok",
  early: "bg-status-warn/10 text-status-warn",
}

/** Совпадения тем снаружи и изнутри. Показатели направлений не смешиваем — только сверяем темы. */
export function CrossChecks({ limit }: { limit?: number }) {
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {CROSS_CHECKS.slice(0, limit).map((c) => (
        <li key={c.outside.what} className="surface flex min-w-0 flex-col gap-4 p-5">
          <span className={cn("w-fit rounded-full px-2.5 py-0.5 text-xs font-medium", KIND[c.kind])}>{c.label}</span>
          <div className="grid items-stretch gap-2 sm:grid-cols-[1fr_auto_1fr]">
            <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-3">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="size-1.5 rounded-full bg-brand-500" aria-hidden /> Снаружи
              </p>
              <p className="mt-1 text-sm font-medium">{c.outside.what}</p>
              <p className="mt-1 text-sm text-muted-foreground tabular-nums">{c.outside.value}</p>
            </div>
            <ArrowRight className="hidden size-4 self-center text-muted-foreground sm:block" aria-hidden />
            <div className="rounded-2xl border border-health-100 bg-health-50/70 p-3">
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="size-1.5 rounded-full bg-health-500" aria-hidden /> Изнутри
              </p>
              <p className="mt-1 text-sm font-medium">{c.inside.what}</p>
              <p className="mt-1 flex items-center gap-2 text-sm tabular-nums">
                {c.inside.score} <LevelBadge score={c.inside.score} />
              </p>
            </div>
          </div>
          <p className="text-[15px]">{c.verdict}</p>
        </li>
      ))}
    </ul>
  )
}
