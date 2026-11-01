import { describe, expect, it } from "vitest"
import { INDUSTRY_MIN_PEERS, MIN_GROUP, PROMISE_CONFIRMED_FROM, PROMISE_MIN_MENTIONS, PROMISE_PARTIAL_FROM, ZONE_OK_FROM, ZONE_WARN_FROM } from "@/lib/report/methodology"
import { GLOSSARY } from "./glossary"

// Подсказки называют пороги методики словами: если порог в коде поменяется, тест напомнит поправить текст
describe("словарь терминов", () => {
  it("пороги в текстах совпадают с методикой", () => {
    expect(GLOSSARY.promiseStatus.text).toContain(`от ${PROMISE_CONFIRMED_FROM}%`)
    expect(GLOSSARY.promiseStatus.text).toContain(`меньше ${PROMISE_PARTIAL_FROM}%`)
    expect(GLOSSARY.promiseStatus.text).toContain(`Меньше ${PROMISE_MIN_MENTIONS} упоминаний`)
    expect(GLOSSARY.industry.text).toContain(`${INDUSTRY_MIN_PEERS} и больше компаний`)
    expect(GLOSSARY.zones.text).toContain(`В норме от ${ZONE_OK_FROM}, внимание от ${ZONE_WARN_FROM}`)
    expect(GLOSSARY.respondents.text).toContain(`не меньше ${MIN_GROUP}`)
  })
})
