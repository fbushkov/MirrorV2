import Link from "next/link"

export function Logo() {
  return (
    <Link href="/" className="flex items-center" aria-label="Mirror — на главную">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/img/logo_header.svg" alt="mirror" width={124} height={23} className="h-[23px] w-auto" />
    </Link>
  )
}
