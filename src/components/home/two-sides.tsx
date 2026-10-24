"use client"

import { useState } from "react"
import { PROMISES } from "@/content/demo"
import { cn } from "@/lib/utils"

type Mode = "external" | "internal" | "compare"

const MODES: { id: Mode; label: string }[] = [
  { id: "external", label: "Снаружи" },
  { id: "internal", label: "Изнутри" },
  { id: "compare", label: "Сравнить" },
]

const NOTE: Record<Mode, string> = {
  external: "Оценка HR-бренда: отзывы, соцсети, медиа и ответы нейросетей. Это видят кандидаты и рынок.",
  internal: "Дашборд здоровья культуры: опросы, анонимная обратная связь и интервью. Это переживают сотрудники.",
  compare: "Разница показывает, где репутация опережает реальность, а где вы недорассказываете о сильных сторонах.",
}

const ITEMS = PROMISES.filter((p) => ["career", "flex", "team", "learning", "indexation", "salary"].includes(p.id))

/** Один список обещаний, три взгляда на него */
export function TwoSides() {
  const [mode, setMode] = useState<Mode>("compare")

  return (
    <div className="surface-raised p-5 md:p-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div role="tablist" aria-label="Сторона бренда" className="inline-flex w-fit rounded-xl bg-muted p-1">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              role="tab"
              aria-selected={mode === m.id}
              onClick={() => setMode(m.id)}
              className={cn(
                "rounded-lg px-3.5 py-1.5 text-sm transition-colors",
                mode === m.id ? "bg-card font-medium shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="flex gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-chart-1" /> снаружи
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-chart-2" /> изнутри
          </span>
        </div>
      </div>
      <p className="mt-4 min-h-10 text-sm text-muted-foreground">{NOTE[mode]}</p>

      <ul className="mt-4 flex flex-col gap-4">
        {ITEMS.map((p) => {
          const gap = p.internal - p.external
          return (
            <li key={p.id} className="grid gap-2 sm:grid-cols-[170px_1fr_170px] sm:items-center">
              <span className="text-sm font-medium">{p.title}</span>
              <div className="flex flex-col gap-1.5">
                {mode !== "internal" && (
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-chart-1 transition-all duration-500" style={{ width: `${p.external}%` }} />
                  </div>
                )}
                {mode !== "external" && (
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-chart-2 transition-all duration-500" style={{ width: `${p.internal}%` }} />
                  </div>
                )}
              </div>
              <span className="text-xs tabular-nums sm:text-right">
                {mode === "compare" ? (
                  Math.abs(gap) < 10 ? (
                    <span className="text-muted-foreground">без разрыва</span>
                  ) : gap < 0 ? (
                    <span className="text-status-bad">переобещаете · {gap}</span>
                  ) : (
                    <span className="text-chart-2">недорассказываете · +{gap}</span>
                  )
                ) : (
                  <span className="text-muted-foreground">{mode === "external" ? p.external : p.internal}%</span>
                )}
              </span>
            </li>
          )
        })}
      </ul>
      <p className="mt-6 text-xs text-muted-foreground">Пример на условных данных</p>
    </div>
  )
}
