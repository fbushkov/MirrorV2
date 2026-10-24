// Мостик между направлениями: показатели не смешиваем, только сверяем общие темы.
import { BANK_N, BLIND_SPOTS, PROMISES } from "./demo"
import { PULSE_METRICS } from "./pulse"

const promise = (id: string) => PROMISES.find((p) => p.id === id)!
const spot = (topic: string) => BLIND_SPOTS.find((b) => b.topic === topic)!
const metric = (id: string) => PULSE_METRICS.find((m) => m.id === id)!

export type CrossCheck = {
  kind: "both" | "strength" | "early"
  label: string
  outside: { what: string; value: string }
  inside: { what: string; score: number }
  verdict: string
}

/** Совпадения тем снаружи и изнутри для условного «Банка N» */
export const CROSS_CHECKS: CrossCheck[] = [
  {
    kind: "both",
    label: "Видно с двух сторон",
    outside: { what: `Слепая зона «${spot("Переработки").topic}»`, value: `${spot("Переработки").share}% упоминаний` },
    inside: { what: metric("energy").name, score: metric("energy").score },
    verdict: "Проблему видят и кандидаты, и сотрудники. Это не шум в отзывах. Начинать с нагрузки.",
  },
  {
    kind: "both",
    label: "Видно с двух сторон",
    outside: { what: `Слепая зона «${spot("Руководители").topic}»`, value: `${spot("Руководители").share}% упоминаний` },
    inside: { what: metric("voice").name, score: metric("voice").score },
    verdict: "Опыт сильно зависит от руководителя. Изнутри это видно по тому, что людей не слышат.",
  },
  {
    kind: "strength",
    label: "Сильная сторона",
    outside: { what: `Обещание «${promise("team").title}»`, value: `${promise("team").external}% подтверждений` },
    inside: { what: metric("belonging").name, score: metric("belonging").score },
    verdict: "Обещание подтверждается и изнутри. Его можно ставить в центр коммуникаций.",
  },
  {
    kind: "early",
    label: "Ранний сигнал",
    outside: { what: `Обещание «${promise("career").title}»`, value: `${promise("career").external}% подтверждений` },
    inside: { what: metric("growth").name, score: metric("growth").score },
    verdict: "Снаружи обещание пока выглядит убедительно, изнутри — слабее. Через полгода это может дойти до отзывов.",
  },
]

export const BRIDGE_COMPANY = `${BANK_N.name}, ${BANK_N.size}`
