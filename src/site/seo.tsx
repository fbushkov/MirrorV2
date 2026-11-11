import type { Metadata } from "next"
import { CONTACTS, ROUTES, SITE_NAME, SITE_URL } from "@/content/site"

/** Превью ссылки в мессенджерах и соцсетях. Картинка общая: public/og.png (scripts/og-image.mjs). */
export function openGraph(title: string, description: string | undefined, path: string): Pick<Metadata, "openGraph" | "twitter"> {
  const images = [{ url: "/og.png", width: 1200, height: 630, alt: "Mirror. Сверяем обещания работодателя с реальностью" }]
  return {
    openGraph: { type: "website", locale: "ru_RU", siteName: SITE_NAME, title, description, url: path, images },
    twitter: { card: "summary_large_image", title, description, images: images.map((i) => i.url) },
  }
}

/** Структурированные данные для поисковиков. Символ «<» экранируется, чтобы текст не закрыл тег script. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
}

export const ORGANIZATION_LD = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icon.svg`,
  email: CONTACTS.email,
  telephone: CONTACTS.phone,
}

/** Хлебные крошки страницы по карте маршрутов: от главной до неё самой. Для главной и неизвестного адреса — ничего. */
export function breadcrumbsLd(path: string) {
  const chain: { path: string; title: string }[] = []
  for (let r = ROUTES.find((x) => x.path === path); r; r = ROUTES.find((x) => x.path === r!.parent)) chain.unshift(r)
  if (chain.length < 2) return null
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: chain.map((r, i) => ({ "@type": "ListItem", position: i + 1, name: r.title, item: `${SITE_URL}${r.path === "/" ? "" : r.path}` })),
  }
}
