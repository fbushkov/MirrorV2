import { BLIND_SPOTS } from "@/content/demo"
import { cn } from "@/lib/utils"

const TONE = {
  negative: { label: "чаще негатив", cls: "bg-status-bad/10 text-status-bad", bar: "bg-status-bad/70" },
  mixed: { label: "по-разному", cls: "bg-status-warn/10 text-status-warn", bar: "bg-status-warn/70" },
  neutral: { label: "нейтрально", cls: "bg-muted text-muted-foreground", bar: "bg-status-none/60" },
}

/** Темы, которые люди обсуждают, а компания в своих текстах не упоминает */
export function BlindSpots({ compact = false }: { compact?: boolean }) {
  const max = Math.max(...BLIND_SPOTS.map((b) => b.share))
  return (
    <ul className="flex flex-col gap-4">
      {BLIND_SPOTS.map((b) => {
        const t = TONE[b.tone]
        return (
          <li key={b.topic} className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-medium">{b.topic}</span>
              <span className="flex items-center gap-2 text-xs">
                <span className={cn("rounded-full px-2 py-0.5 font-medium", t.cls)}>{t.label}</span>
                <span className="text-muted-foreground">в ваших текстах — ни разу</span>
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div className={cn("h-full rounded-full", t.bar)} style={{ width: `${(b.share / max) * 100}%` }} />
              </div>
              <span className="w-28 shrink-0 text-right text-xs text-muted-foreground tabular-nums">{b.share}% упоминаний</span>
            </div>
            {!compact && <p className="text-sm text-muted-foreground">«{b.quote}»</p>}
          </li>
        )
      })}
    </ul>
  )
}
