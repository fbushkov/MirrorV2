import { SitePage, siteMetadata } from "@/site/page"

// Mirror — сверяем обещания работодателя с реальностью. Разметка: prototype/home/pages/index.html
export const metadata = siteMetadata("home")

export default function HomePage() {
  return <SitePage name="home" />
}
