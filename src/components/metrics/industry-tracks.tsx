import { INDUSTRY } from "@/content/demo"

/** Место в отрасли по базовым темам: где вы на шкале среди работодателей отрасли и региона */
export function IndustryTracks({ showOverall = true }: { showOverall?: boolean }) {
  return (
    <div className="flex flex-col gap-5">
      {showOverall && (
        <div className="flex items-baseline gap-3">
          <span className="text-gradient text-5xl font-semibold tabular-nums">{INDUSTRY.overall}</span>
          <span className="text-sm text-muted-foreground">
            условия лучше, чем у {INDUSTRY.overall}% работодателей
            <br />
            отрасли: {INDUSTRY.segment}
          </span>
        </div>
      )}
      <ul className="flex flex-col gap-3.5">
        {INDUSTRY.topics.map((t) => (
          <li key={t.topic} className="grid grid-cols-[110px_1fr_36px] items-center gap-3">
            <span className="text-sm">{t.topic}</span>
            <div className="relative h-2 rounded-full bg-gradient-to-r from-status-bad/25 via-status-warn/25 to-status-ok/30">
              <span className="absolute top-1/2 left-1/2 h-4 w-px -translate-y-1/2 bg-foreground/25" aria-hidden />
              <span
                className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-card bg-primary shadow-[0_2px_6px_rgb(113_43_125/0.4)]"
                style={{ left: `${t.value}%` }}
                aria-hidden
              />
            </div>
            <span className="text-right text-sm tabular-nums">{t.value}</span>
          </li>
        ))}
      </ul>
      <div className="flex justify-between pl-[122px] pr-12 text-[11px] text-muted-foreground">
        <span>хуже рынка</span>
        <span>медиана</span>
        <span>лучше</span>
      </div>
    </div>
  )
}
