import { SitePage, siteMetadata } from "@/site/page"

// Цены — Mirror. Разметка: prototype/home/pages/pricing.html
export const metadata = siteMetadata("pricing")

export default function PricingPage() {
  return <SitePage name="pricing" />
}
