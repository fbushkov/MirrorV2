import { SitePage, siteMetadata } from "@/site/page"

// Как считаем индекс культуры — Оценка HR-бренда — Mirror. Разметка: prototype/home/pages/methodology-brand.html
export const metadata = siteMetadata("methodology-brand")

export default function MethodologyBrandPage() {
  return <SitePage name="methodology-brand" />
}
