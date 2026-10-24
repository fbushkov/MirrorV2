"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Ph } from "@/components/site/ph"
import { cn } from "@/lib/utils"

const TOPICS = [
  { id: "scan", label: "Бесплатный срез" },
  { id: "diagnostics", label: "Диагностика" },
  { id: "support", label: "Сопровождение" },
  { id: "other", label: "Другой вопрос" },
] as const
type Topic = (typeof TOPICS)[number]["id"]

function Field({ id, label, hint, error, children, className }: { id: string; label: string; hint?: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id}>
        {label}
        {hint && <span className="font-normal text-muted-foreground">{hint}</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

/** Заявка. compact — короткая форма в конце главной; full — страница /start. */
export function StartForm({ variant = "full" }: { variant?: "compact" | "full" }) {
  const params = useSearchParams()
  const fromUrl = params.get("type") as Topic | null
  const [topic, setTopic] = useState<Topic>(fromUrl && TOPICS.some((t) => t.id === fromUrl) ? fromUrl : "scan")
  const [data, setData] = useState({ name: "", company: "", contact: "", hh: "", comment: "" })
  const [agree, setAgree] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)

  const bind = (k: keyof typeof data) => ({
    id: `${variant}-${k}`,
    value: data[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setData((d) => ({ ...d, [k]: e.target.value })),
    "aria-invalid": errors[k] ? true : undefined,
  })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const err: Record<string, string> = {}
    if (variant === "full" && !data.name.trim()) err.name = "Как к вам обращаться?"
    if (!data.company.trim()) err.company = "Укажите компанию"
    const c = data.contact.trim()
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c)
    const isPhone = c.replace(/\D/g, "").length >= 10
    if (!c) err.contact = "Оставьте почту или телефон"
    else if (!isEmail && !isPhone) err.contact = "Похоже на опечатку: нужна почта или телефон"
    if (!agree) err.agree = "Без согласия мы не сможем обработать заявку"
    setErrors(err)
    if (Object.keys(err).length) return
    // Тестовая версия: заявка никуда не отправляется. В рабочей — API, почта или Telegram.
    setSent(true)
  }

  if (sent) {
    return (
      <div className="flex flex-col items-start gap-3" role="status">
        <CheckCircle2 className="size-9 text-status-ok" />
        <p className="text-2xl font-semibold">Заявка у нас</p>
        <p className="text-muted-foreground">
          Ответим в течение рабочего дня. {topic === "scan" ? "Уточним конкурентов, а через 3 рабочих дня пришлём срез." : "Обсудим задачу и предложим план."}
        </p>
        <p className="text-xs text-muted-foreground">
          <Ph>Тестовая версия: данные формы никуда не отправляются.</Ph>
        </p>
        <Button asChild variant="outline" className="mt-2">
          <Link href="/">На главную</Link>
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
      {variant === "full" && (
        <fieldset className="sm:col-span-2">
          <legend className="mb-2 text-sm font-medium">Что нужно</legend>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((t) => (
              <button
                key={t.id}
                type="button"
                aria-pressed={topic === t.id}
                onClick={() => setTopic(t.id)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                  topic === t.id ? "border-primary bg-secondary text-secondary-foreground" : "border-border hover:border-brand-200",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </fieldset>
      )}
      {variant === "full" && (
        <Field id={`${variant}-name`} label="Имя" error={errors.name}>
          <Input {...bind("name")} autoComplete="given-name" className="h-11 rounded-xl bg-card" />
        </Field>
      )}
      <Field id={`${variant}-company`} label="Компания" error={errors.company}>
        <Input {...bind("company")} autoComplete="organization" placeholder="Например, Банк N" className="h-11 rounded-xl bg-card" />
      </Field>
      <Field id={`${variant}-contact`} label="Почта или телефон" error={errors.contact} className={variant === "compact" ? "" : ""}>
        <Input {...bind("contact")} autoComplete="email" placeholder="name@company.ru" className="h-11 rounded-xl bg-card" />
      </Field>
      {topic === "scan" && (
        <Field id={`${variant}-hh`} label="Страница на hh.ru " hint="· необязательно" className={variant === "full" ? "" : "sm:col-span-2"}>
          <Input {...bind("hh")} placeholder="hh.ru/employer/…" className="h-11 rounded-xl bg-card" />
        </Field>
      )}
      {variant === "full" && (
        <Field id={`${variant}-comment`} label="Комментарий " hint="· необязательно" className="sm:col-span-2">
          <Textarea {...bind("comment")} placeholder="Что хотите проверить или с какими конкурентами сравнить" className="min-h-24 rounded-xl bg-card" />
        </Field>
      )}
      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <label className="flex items-start gap-3 text-sm text-muted-foreground">
          <Checkbox checked={agree} onCheckedChange={(v) => setAgree(v === true)} aria-invalid={errors.agree ? true : undefined} className="mt-0.5" />
          <span>
            Согласен на обработку персональных данных по{" "}
            <Link href="/docs/privacy-policy" className="underline underline-offset-4 hover:text-foreground">
              политике конфиденциальности
            </Link>
          </span>
        </label>
        {errors.agree && <p className="text-xs text-destructive">{errors.agree}</p>}
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" variant="glow" size="xl" className="w-full sm:w-auto">
          {topic === "scan" ? "Получить бесплатный срез" : "Отправить заявку"}
        </Button>
      </div>
    </form>
  )
}
