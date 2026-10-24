import type { Metadata } from "next"
import { Manrope } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Header } from "@/components/site/header"
import { Footer } from "@/components/site/footer"
import "./globals.css"

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
})

export const metadata: Metadata = {
  title: {
    default: "Mirror — диагностика HR-бренда и индекс культуры",
    template: "%s | Mirror",
  },
  description:
    "Mirror сравнивает внешний и внутренний бренд работодателя: что вы обещаете, что о вас пишут и что говорят сотрудники. Первый внешний срез — бесплатно.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
  },
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${manrope.variable} antialiased`} data-ph="on" suppressHydrationWarning>
      <head>
        {/* Восстанавливаем выбор подсветки условных текстов до отрисовки */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("mirror:ph")==="off")document.documentElement.dataset.ph="off"}catch(e){}`,
          }}
        />
      </head>
      <body className="flex min-h-svh flex-col overflow-x-clip">
        <TooltipProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toaster theme="light" />
        </TooltipProvider>
      </body>
    </html>
  )
}
