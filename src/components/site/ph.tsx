import { cn } from "@/lib/utils"

/** Условный текст, который нужно заменить на реальный. Подсвечивается, пока включён переключатель в подвале. */
export function Ph({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("ph", className)}>{children}</span>
}
