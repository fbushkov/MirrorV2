import Link from "next/link"

/** Временный знак Mirror: два зеркальных полукруга — «как вы себя видите» и «как видят вас». */
export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="Mirror — на главную">
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true">
        <rect width="26" height="26" rx="8" fill="var(--brand-500)" />
        <path d="M12 6.5a6.5 6.5 0 0 0 0 13z" fill="#fff" />
        <path d="M14 6.5a6.5 6.5 0 0 1 0 13z" fill="#fff" fillOpacity="0.45" />
      </svg>
      <span className="text-[19px] font-semibold tracking-tight">mirror</span>
    </Link>
  )
}
