"use client"

import { useState } from "react"
import { ChevronRight } from "lucide-react"
import { GROUPS, PULSE_METRICS, type MetricGroup, type PulseMetric } from "@/content/pulse"
import { MetricDialog } from "./metric-dialog"
import { MetricIcon } from "./parts"

/** 10 метрик в трёх группах; по клику — подробное описание и источники */
export function MetricCards() {
  const [open, setOpen] = useState<PulseMetric | null>(null)
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-3">
        {(Object.keys(GROUPS) as MetricGroup[]).map((g) => (
          <div key={g} className="flex flex-col gap-3">
            <p className="text-sm font-medium text-muted-foreground">{GROUPS[g]}</p>
            {PULSE_METRICS.filter((m) => m.group === g).map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setOpen(m)}
                className="surface group flex items-start gap-3 p-4 text-left transition-colors hover:border-brand-200 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none"
              >
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                  <MetricIcon icon={m.icon} />
                </span>
                <span className="flex-1">
                  <span className="block font-medium">{m.name}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">{m.short}</span>
                </span>
                <ChevronRight className="mt-1 size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden />
              </button>
            ))}
          </div>
        ))}
      </div>
      <MetricDialog metric={open} mode="about" open={open !== null} onOpenChange={(v) => !v && setOpen(null)} />
    </>
  )
}
