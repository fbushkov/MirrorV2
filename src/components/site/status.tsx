import { cn } from "@/lib/utils"
import { STATUS_LABEL, type PromiseStatus } from "@/content/demo"

const STYLES: Record<PromiseStatus, string> = {
  ok: "bg-status-ok/10 text-status-ok",
  warn: "bg-status-warn/10 text-status-warn",
  bad: "bg-status-bad/10 text-status-bad",
  none: "bg-status-none/10 text-status-none",
}

export function StatusPill({ status, className }: { status: PromiseStatus; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap", STYLES[status], className)}>
      <span className="size-1.5 rounded-full bg-current" />
      {STATUS_LABEL[status]}
    </span>
  )
}
