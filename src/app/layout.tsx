import type { Metadata } from "next"
import "@/site/styles.css"

export const metadata: Metadata = {
  metadataBase: new URL("https://mirror-com.ru"),
  title: {
    default: "Mirror — сверяем обещания работодателя с реальностью",
    template: "%s — Mirror",
  },
  description:
    "Mirror сверяет обещания работодателя с тем, что видят кандидаты и переживают сотрудники. Первый внешний срез HR-бренда бесплатно.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
  },
}

// Оформление и разметка страниц — из прототипа prototype/home (ADR-0008): шрифты Onest и JetBrains Mono, стили src/site/styles.css
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- шрифты для всех страниц, как в прототипе */}
        <link href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
