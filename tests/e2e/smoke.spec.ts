import { expect, test } from "@playwright/test"
import { ROUTES } from "../../src/content/site"

// Смоук по всем публичным страницам из карты маршрутов: отвечает, без ошибок, без горизонтальной прокрутки
for (const route of ROUTES) {
  test(`${route.path} открывается без ошибок`, async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (e) => errors.push(e.message))
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()))

    const res = await page.goto(route.path)
    expect(res?.status()).toBe(200)
    await expect(page.locator("h1").first()).toBeVisible()
    await page.waitForLoadState("networkidle")

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow, "горизонтальная прокрутка").toBeLessThanOrEqual(0)
    expect(errors).toEqual([])
  })
}

test("несуществующая страница отдаёт 404", async ({ page }) => {
  const res = await page.goto("/no-such-page")
  expect(res?.status()).toBe(404)
})
