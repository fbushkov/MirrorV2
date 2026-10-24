import { cn } from "@/lib/utils"
import { STATUS_LABEL, type PromiseStatus } from "@/content/demo"

const STYLES: Record<PromiseStatus, string> = {
  ok: "bg-status-ok/12 text-status-ok ring-status-ok/30",
  warn: "bg-status-warn/12 text-status-warn ring-status-warn/30",
  bad: "bg-status-bad/12 text-status-bad ring-status-bad/30",
  none: "bg-status-none/12 text-status-none ring-status-none/30",
}

export function StatusPill({ status, className }: { status: PromiseStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset",
        STYLES[status],
        className,
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  )
}
