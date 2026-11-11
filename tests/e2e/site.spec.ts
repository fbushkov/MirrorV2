import { expect, test, type Page } from "@playwright/test"

// Поведение сайта: форма заявки, меню, FAQ, фильтры демо-дашборда, данные для поисковиков и превью ссылок

test.describe("форма заявки", () => {
  test("пустая форма: ошибки текстом, фокус на первом поле с ошибкой, заявка не уходит", async ({ page }) => {
    await page.goto("/start")
    await page.getByRole("button", { name: "Отправить заявку" }).click()
    await expect(page.locator("#e-company")).toBeVisible()
    await expect(page.locator("#e-contact")).toHaveText("Оставьте контакт")
    await expect(page.locator("#e-consent")).toBeVisible()
    await expect(page.locator("#f-company")).toBeFocused()
    await expect(page.locator("#f-company")).toHaveAttribute("aria-invalid", "true")
    await expect(page.locator(".form__done")).toBeHidden()
  })

  test("контакт не похож на почту, Телеграм или телефон", async ({ page }) => {
    await page.goto("/start")
    await page.locator("#f-company").fill("Банк N")
    await page.locator("#f-contact").fill("позвоните мне")
    await page.locator("input[name=consent]").check()
    await page.getByRole("button", { name: "Отправить заявку" }).click()
    await expect(page.locator("#e-contact")).toHaveText(/почту, ник в\sТелеграме или телефон/)
    await expect(page.locator(".form__done")).toBeHidden()
  })

  for (const contact of ["hr@bank-n.ru", "@bank_hr", "t.me/bank_hr", "+7 912 000-00-00"]) {
    test(`заявка с контактом ${contact} принимается`, async ({ page }) => {
      await page.goto("/start")
      await page.locator("#f-company").fill("Банк N")
      await page.locator("#f-contact").fill(contact)
      await page.locator("input[name=consent]").check()
      await page.getByRole("button", { name: "Отправить заявку" }).click()
      await expect(page.locator(".form__done")).toBeVisible()
      await expect(page.locator(".form__done")).toBeFocused()
    })
  }

  test("после отправки на месте формы подтверждение с отправленным, форму можно заполнить заново", async ({ page }) => {
    await page.goto("/start?topic=monitoring")
    await page.locator("#f-company").fill("Банк N")
    await page.locator("#f-contact").fill("hr@bank-n.ru")
    await page.locator("input[name=consent]").check()
    await page.getByRole("button", { name: "Отправить заявку" }).click()
    const done = page.locator(".form__done")
    await expect(done).toBeVisible()
    await expect(done.locator("[data-sent=topic]")).toHaveText("Мониторинг")
    await expect(done.locator("[data-sent=company]")).toHaveText("Банк N")
    await expect(done.locator("[data-sent=contact]")).toHaveText("hr@bank-n.ru")
    await expect(done.getByRole("heading", { name: "Заявка принята" })).toBeInViewport()
    const headerBottom = (await page.locator(".header").boundingBox())!.height
    expect((await done.boundingBox())!.y, "подтверждение не под шапкой").toBeGreaterThanOrEqual(headerBottom)
    await page.getByRole("button", { name: "Отправить ещё одну заявку" }).click()
    await expect(done).toBeHidden()
    await expect(page.locator("#f-company")).toHaveValue("")
    await expect(page.locator("#f-company")).toBeFocused()
  })

  test("ссылка с тарифа выбирает тему заявки", async ({ page }) => {
    await page.goto("/start?topic=diagnostics")
    await expect(page.locator("input[name=topic][value=diagnostics]")).toBeChecked()
  })
})

test.describe("FAQ", () => {
  test("вопросы есть в разметке без скриптов и описаны как FAQPage", async ({ request }) => {
    const html = await (await request.get("/pricing")).text()
    expect(html).toContain("Как оплатить?")
    expect(html).toContain("По счёту и договору.")
    const ld = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map((m) => JSON.parse(m[1]))
    const faq = ld.find((d) => d["@type"] === "FAQPage")
    expect(faq.mainEntity.length).toBeGreaterThan(5)
  })

  test("открыт один ответ на группу", async ({ page }) => {
    await page.goto("/pricing")
    const questions = page.locator("#faq-list .qa__q")
    await questions.nth(0).click()
    await expect(questions.nth(0)).toHaveAttribute("aria-expanded", "true")
    await questions.nth(1).click()
    await expect(questions.nth(0)).toHaveAttribute("aria-expanded", "false")
    await expect(questions.nth(1)).toHaveAttribute("aria-expanded", "true")
  })
})

test.describe("данные для поисковиков и превью ссылок", () => {
  test("Open Graph, организация и хлебные крошки", async ({ request }) => {
    const html = await (await request.get("/hr-brand/demo")).text()
    expect(html).toMatch(/<meta property="og:title" content="[^"]+"/)
    expect(html).toMatch(/<meta property="og:image" content="https:\/\/mirror-com\.ru\/og\.png"/)
    const ld = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map((m) => JSON.parse(m[1]))
    expect(ld.some((d) => d["@type"] === "Organization")).toBe(true)
    const crumbs = ld.find((d) => d["@type"] === "BreadcrumbList")
    expect(crumbs.itemListElement.map((i: { item: string }) => i.item)).toEqual([
      "https://mirror-com.ru",
      "https://mirror-com.ru/hr-brand",
      "https://mirror-com.ru/hr-brand/demo",
    ])
  })

  test("картинка превью отдаётся", async ({ request }) => {
    const res = await request.get("/og.png")
    expect(res.status()).toBe(200)
    expect(res.headers()["content-type"]).toBe("image/png")
  })

  test("заголовки безопасности", async ({ request }) => {
    const headers = (await request.get("/")).headers()
    expect(headers["x-frame-options"]).toBe("DENY")
    expect(headers["x-content-type-options"]).toBe("nosniff")
    expect(headers["x-powered-by"]).toBeUndefined()
  })
})

test.describe("навигация", () => {
  test("ссылка «К содержанию» первой получает фокус и ведёт к основной части", async ({ page }) => {
    await page.goto("/")
    await page.keyboard.press("Tab")
    const skip = page.locator("a.skip")
    await expect(skip).toBeFocused()
    await expect(skip).toHaveAttribute("href", "#main")
    await expect(page.locator("main#main")).toHaveCount(1)
  })

  test("меню направления: наведение открывает, клик не закрывает, Esc закрывает", async ({ page, isMobile }) => {
    test.skip(isMobile, "на телефоне меню открывается кнопкой-гамбургером")
    await page.goto("/")
    const trigger = page.locator(".nav__item[data-panel=brand]")
    await trigger.hover()
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await trigger.click()
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await expect(page.locator("#mega a[href='/hr-brand/demo']").first()).toBeVisible()
    await page.keyboard.press("Escape")
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
  })

  test("меню направления с клавиатуры: Enter открывает и закрывает", async ({ page, isMobile }) => {
    test.skip(isMobile, "на телефоне меню открывается кнопкой-гамбургером")
    await page.goto("/")
    const trigger = page.locator(".nav__item[data-panel=brand]")
    await trigger.focus()
    await page.keyboard.press("Enter")
    await expect(trigger).toHaveAttribute("aria-expanded", "true")
    await page.keyboard.press("Enter")
    await expect(trigger).toHaveAttribute("aria-expanded", "false")
  })

  test("шрифты и скрипты грузятся только с нашего адреса", async ({ page, baseURL }) => {
    const foreign: string[] = []
    page.on("request", (r) => { if (!r.url().startsWith(baseURL!) && !r.url().startsWith("data:") && !r.url().startsWith("blob:")) foreign.push(r.url()) })
    await page.goto("/hr-brand/demo")
    await page.waitForLoadState("networkidle")
    expect(foreign).toEqual([])
  })
})

// Фильтры — свой выпадающий список поверх скрытого select (app.js): открываем кнопкой, выбираем пункт
async function choose(page: Page, selectId: string, option: string) {
  const box = page.locator(`#${selectId}`).locator("xpath=..")
  await box.locator("button").click()
  await box.getByRole("option", { name: option, exact: true }).click()
  await expect(box.locator("button")).toHaveAttribute("aria-expanded", "false")   // после выбора список закрыт
  await expect(box.locator("button")).toHaveText(option)
}

test.describe("демо-дашборд здоровья культуры", () => {
  test("маленькая группа скрыта: показываем уровень выше и объясняем почему", async ({ page }) => {
    await page.goto("/culture-health/demo")
    await choose(page, "f-dept", "ИТ")
    await choose(page, "f-stage", "До найма")
    await expect(page.locator("#privacy-text")).toContainText("меньше 5 человек")
    await expect(page.locator("#privacy-text")).toContainText("ИТ · все этапы")
  })

  test("большая группа показывается без предупреждения", async ({ page }) => {
    await page.goto("/culture-health/demo")
    await choose(page, "f-dept", "Продажи")
    await expect(page.locator("#privacy-text")).toBeHidden()
  })

  // Правила движения (design-system.html, раздел 12): блоки стоят на месте, меняется только содержимое
  test("после фильтра блоки и подписи не двигаются: проявляется только изменившееся содержимое", async ({ page }) => {
    await page.goto("/culture-health/demo")
    await choose(page, "f-period", "90 дней")
    const state = await page.evaluate(() => {
      const names = (el: Element) => el.getAnimations().map((a) => (a as CSSAnimation).animationName).filter(Boolean)
      const all = [...document.querySelectorAll("main *")]
      return {
        cards: [...document.querySelectorAll(".rkpi, .mtile, .ralert, .rblock, .rblock__title")].filter((el) => names(el).length).length,
        staticHint: names(document.querySelector(".rblock__hint")!).length,
        shifted: all.filter((el) => !el.closest(".csel") && names(el).some((n) => n !== "fade")).length,
        swapped: document.querySelectorAll(".fx-swap").length,
      }
    })
    expect(state).toMatchObject({ cards: 0, staticHint: 0, shifted: 0 })
    expect(state.swapped).toBeGreaterThan(0)
  })
})

test("смена примера в карточке сверки: карточка на месте, проявляется текст", async ({ page }) => {
  await page.goto("/hr-brand")
  const card = page.locator("#mirror-demo")
  const before = await card.boundingBox()
  await card.locator(".mirror__dots button").nth(1).click()
  await expect(card.locator("[data-m=promise]")).toHaveClass(/fx-swap/)
  expect(await card.boundingBox()).toEqual(before)
  expect(await card.evaluate((el) => el.getAnimations().length)).toBe(0)
})
