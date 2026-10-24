import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export function CheckList({ items, className }: { items: React.ReactNode[]; className?: string }) {
  return (
    <ul className={cn("flex flex-col gap-3", className)}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-[15px]">
          <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
            <Check className="size-3" />
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
