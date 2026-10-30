import { SitePage, siteMetadata } from "@/site/page"

// Как считаем переживаемую культуру — Дашборд здоровья культуры — Mirror. Разметка: prototype/home/pages/methodology-health.html
export const metadata = siteMetadata("methodology-health")

export default function MethodologyHealthPage() {
  return <SitePage name="methodology-health" />
}
