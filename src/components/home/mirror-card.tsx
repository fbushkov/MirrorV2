"use client"

import { useEffect, useState } from "react"
import { StatusPill } from "@/components/site/status"
import { MIRROR_EXAMPLES } from "@/content/demo"
import { cn } from "@/lib/utils"

const BAR: Record<string, string> = { ok: "bg-status-ok", warn: "bg-status-warn", bad: "bg-status-bad", none: "bg-status-none" }

/** «Зеркало»: обещание компании слева, что пишут люди — справа, внизу вердикт. Листается само и по клику. */
export function MirrorCard() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const ex = MIRROR_EXAMPLES[i]

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const t = setInterval(() => setI((n) => (n + 1) % MIRROR_EXAMPLES.length), 5000)
    return () => clearInterval(t)
  }, [paused])

  return (
    <div
      className="surface-raised overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
    >
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <p className="text-sm font-medium">Проверка обещания</p>
        <div className="flex gap-1.5" role="tablist" aria-label="Примеры обещаний">
          {MIRROR_EXAMPLES.map((e, n) => (
            <button
              key={e.promise}
              type="button"
              role="tab"
              aria-selected={n === i}
              aria-label={e.promise}
              onClick={() => setI(n)}
              className={cn("h-1.5 rounded-full transition-all", n === i ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-brand-200")}
            />
          ))}
        </div>
      </div>

      <div key={ex.promise} className="grid animate-in fade-in duration-500 sm:grid-cols-2">
        <div className="flex flex-col gap-3 p-5 sm:border-r sm:border-border">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Вы обещаете</p>
          <p className="text-xl font-semibold">{ex.promise}</p>
          <p className="rounded-xl bg-muted px-3 py-2.5 text-sm text-muted-foreground">
            <span className="mb-1 block text-xs">Из вакансии</span>«{ex.vacancy}»
          </p>
        </div>
        <div className="flex flex-col gap-3 border-t border-border p-5 sm:border-t-0">
          <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">Люди видят</p>
          {ex.quotes.map((q) => (
            <figure key={q.text} className="rounded-xl border border-border px-3 py-2.5 text-sm">
              <blockquote>«{q.text}»</blockquote>
              <figcaption className="mt-1 text-xs text-muted-foreground">{q.source}</figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-border bg-muted/50 px-5 py-4">
        <StatusPill status={ex.status} />
        <div className="h-2 min-w-24 flex-1 overflow-hidden rounded-full bg-border">
          <div className={cn("h-full rounded-full transition-all duration-700", BAR[ex.status])} style={{ width: `${ex.value}%` }} />
        </div>
        <p className="text-sm tabular-nums">
          <span className="font-semibold">{ex.value}%</span> <span className="text-muted-foreground">упоминаний подтверждают</span>
        </p>
      </div>
    </div>
  )
}
