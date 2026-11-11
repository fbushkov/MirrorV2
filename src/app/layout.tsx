import type { Metadata } from "next"
import "./fonts.css"
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

// Оформление и разметка страниц — из прототипа prototype/home (ADR-0008): шрифты Onest и JetBrains Mono лежат у нас (fonts.css, public/fonts), стили src/site/styles.css
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  )
}
