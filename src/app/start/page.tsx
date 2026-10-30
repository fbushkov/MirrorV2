import { SitePage, siteMetadata } from "@/site/page"

// Заявка на бесплатный срез — Mirror. Разметка: prototype/home/pages/start.html
export const metadata = siteMetadata("start")

export default function StartPage() {
  return <SitePage name="start" />
}
