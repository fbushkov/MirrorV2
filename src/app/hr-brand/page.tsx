import { SitePage, siteMetadata } from "@/site/page"

// Оценка HR-бренда и индекс культуры — Mirror. Разметка: prototype/home/pages/hr-brand.html
export const metadata = siteMetadata("hr-brand")

export default function HrBrandPage() {
  return <SitePage name="hr-brand" />
}
