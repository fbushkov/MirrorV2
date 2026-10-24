import { CULTURE_CODE, PULSE_GAP, PULSE_METRICS, normScore, pulseLevel } from "@/content/pulse"
import { cn } from "@/lib/utils"
import { LevelBadge } from "./parts"

const GAP_TEXT = { ok: "совпадает", warn: "частичный разрыв", bad: "разрыв" }

/** Два слоя культуры и разрыв между ними: нормы культурного кода против переживаемого опыта */
export function CultureLayers() {
  return (
    <div className="surface-raised overflow-hidden">
      <div className="grid border-b border-border text-sm md:grid-cols-[1fr_auto_1fr]">
        <div className="p-5 md:p-6">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Заявленная культура</p>
          <p className="mt-1 text-muted-foreground">Ценности и нормы из культурного кода</p>
        </div>
        <div className="hidden items-center px-6 md:flex">
          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">разрыв</span>
        </div>
        <div className="border-t border-border p-5 md:border-t-0 md:p-6 md:text-right">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Переживаемая культура</p>
          <p className="mt-1 text-muted-foreground">Опыт и поведение людей, балл по метрикам</p>
        </div>
      </div>
      <ul>
        {CULTURE_CODE.map((c) => {
          const score = normScore(c.metrics)
          const level = pulseLevel(score)
          const names = PULSE_METRICS.filter((m) => c.metrics.includes(m.id)).map((m) => m.name)
          return (
            <li key={c.norm} className="grid items-center gap-3 border-b border-border px-5 py-4 last:border-b-0 md:grid-cols-[1fr_auto_1fr] md:px-6">
              <p className="text-lg font-semibold">«{c.norm}»</p>
              <div className="flex items-center gap-2 md:justify-center">
                <span className={cn("h-px w-10", level === "ok" ? "bg-status-ok" : level === "warn" ? "bg-status-warn" : "bg-status-bad")} aria-hidden />
                <span className="text-xs text-muted-foreground">{GAP_TEXT[level]}</span>
                <span className={cn("h-px w-10", level === "ok" ? "bg-status-ok" : level === "warn" ? "bg-status-warn" : "bg-status-bad")} aria-hidden />
              </div>
              <div className="flex flex-wrap items-center gap-3 md:justify-end">
                <span className="text-sm text-muted-foreground">{names.join(" · ")}</span>
                <span className="text-lg font-semibold tabular-nums">{score}</span>
                <LevelBadge score={score} />
              </div>
            </li>
          )
        })}
      </ul>
      <div className="flex flex-wrap items-center justify-between gap-3 bg-muted/60 px-5 py-4 md:px-6">
        <p className="font-medium">
          Разрыв: {PULSE_GAP.diverge} из {PULSE_GAP.total} норм расходятся с опытом, ещё {PULSE_GAP.partial} — частично
        </p>
        <p className="text-xs text-muted-foreground">Пример на демо-данных</p>
      </div>
    </div>
  )
}
