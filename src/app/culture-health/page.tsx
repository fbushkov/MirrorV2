import { SitePage, siteMetadata } from "@/site/page"

// Дашборд здоровья корпоративной культуры — Mirror. Разметка: prototype/home/pages/culture-health.html
export const metadata = siteMetadata("culture-health")

export default function CultureHealthPage() {
  return <SitePage name="culture-health" />
}
