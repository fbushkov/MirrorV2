"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Ph } from "@/components/site/ph"
import { CONTACTS } from "@/content/site"
import { cn } from "@/lib/utils"

const FORMATS = {
  scan: { label: "Бесплатный срез", title: "Заявка на бесплатный срез", text: "Через 3 рабочих дня пришлём внешний срез: карту обещаний, графики и сравнение с конкурентами. Потом созвонимся на 30 минут." },
  diagnostics: { label: "Диагностика", title: "Обсудить диагностику", text: "Расскажите о компании и задаче — в течение рабочего дня предложим план внутренней проверки и стоимость." },
  support: { label: "Сопровождение", title: "Обсудить сопровождение", text: "Расскажите, какие изменения планируете, — предложим формат работы эксперта." },
  monitoring: { label: "Мониторинг", title: "Подключить мониторинг", text: "Регулярный замер индекса и сигналы о просадках. Ответим в течение рабочего дня." },
  agency: { label: "Агентствам: пилот", title: "Обсудить пилот для агентства", text: "Расскажите, с какими клиентами работаете. Три отчёта — бесплатно." },
} as const
type FormatId = keyof typeof FORMATS

const INDUSTRIES = [
  "IT/Телеком",
  "Финансы/Банк/Страхование",
  "Консалтинг/аудит",
  "Ритейл/E-commerce",
  "Производство/Промышленность",
  "Логистика/Транспорт",
  "Медиа/Развлечения",
  "Образование",
  "Здравоохранение/Фарма",
  "Государственное и муниципальное управление",
  "Другое",
]
const ROLES = [
  "Собственник/управленец",
  "HR-директор/HRBP",
  "Руководитель по HR-бренду/внутренним коммуникациям",
  "Эксперт по корпоративной культуре",
  "Маркетинг/PR",
  "Агентство/консультант",
  "Другое",
]
const SIZES = ["до 300", "300–1000", "больше 1000"]
const CHANNELS = ["E-mail", "Телефон", "Телеграм", "Макс"]

type Errors = Partial<Record<string, string>>

function Field({ id, label, required, error, children, className }: { id: string; label: string; required?: boolean; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor={id} className="text-sm">
        {label}
        {required && <span className="text-brand-200">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

function Choice({ id, value, onChange, options, placeholder, invalid }: { id: string; value: string; onChange: (v: string) => void; options: string[]; placeholder: string; invalid?: boolean }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger id={id} aria-invalid={invalid || undefined} className="h-11 w-full rounded-xl data-[size=default]:h-11">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((o) => (
          <SelectItem key={o} value={o}>
            {o}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function RequestForm() {
  const params = useSearchParams()
  const initial = (params.get("type") ?? "scan") as FormatId
  const [format, setFormat] = useState<FormatId>(initial in FORMATS ? initial : "scan")
  const [data, setData] = useState({
    lastName: "",
    name: "",
    email: "",
    phone: "",
    channel: "",
    telegram: "",
    company: "",
    hh: "",
    site: "",
    industry: "",
    size: "",
    role: "",
    competitors: "",
    comment: "",
  })
  const [agree, setAgree] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [sent, setSent] = useState(false)

  const set = (k: keyof typeof data) => (v: string) => setData((d) => ({ ...d, [k]: v }))
  const input = (k: keyof typeof data) => ({
    id: k,
    value: data[k],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(k)(e.target.value),
    "aria-invalid": errors[k] ? true : undefined,
    className: "h-11 rounded-xl",
  })

  function validate() {
    const e: Errors = {}
    const req = "Заполните обязательное поле"
    if (!data.name.trim()) e.name = req
    if (!data.company.trim()) e.company = req
    if (!data.email.trim()) e.email = req
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) e.email = "Укажите корректный e-mail"
    if (data.phone && data.phone.replace(/\D/g, "").length < 10) e.phone = "Неверный формат номера телефона"
    if (!data.channel) e.channel = req
    if (data.channel === "Телеграм" && !data.telegram.trim()) e.telegram = "Укажите ссылку на Telegram"
    if (format !== "agency" && !data.size) e.size = req
    if (!agree) e.agree = "Необходимо дать согласие"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function onSubmit(ev: React.FormEvent) {
    ev.preventDefault()
    if (!validate()) return
    // Тестовая версия: заявка никуда не отправляется. В рабочей версии — API / Telegram-бот / CRM.
    setSent(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const f = FORMATS[format]

  if (sent) {
    return (
      <div className="glass mx-auto flex max-w-2xl flex-col items-start gap-4 rounded-3xl p-8 md:p-10">
        <CheckCircle2 className="size-10 text-status-ok" />
        <h1 className="text-3xl font-semibold">Заявка принята</h1>
        <p>Спасибо, {data.name}. Ваша заявка «{f.label}» зарегистрирована.</p>
        <ul className="flex flex-col gap-1.5 text-muted-foreground">
          <li>• В течение одного рабочего дня мы свяжемся с вами по указанным контактам</li>
          {format === "scan" ? (
            <li>• Уточним конкурентов и каналы компании — и через 3 рабочих дня пришлём срез</li>
          ) : (
            <>
              <li>• Уточним задачу и запросим реквизиты компании</li>
              <li>• Направим счёт и договор на e-mail вашей бухгалтерии</li>
            </>
          )}
        </ul>
        <p className="text-sm text-muted-foreground">
          По всем вопросам пишите в{" "}
          <a href={CONTACTS.telegram} target="_blank" rel="noreferrer" className="text-brand-200 underline underline-offset-4">
            Telegram
          </a>{" "}
          или на {CONTACTS.email}.
        </p>
        <p className="text-xs text-muted-foreground">
          <Ph>Тестовая версия: данные формы никуда не отправляются.</Ph>
        </p>
        <Button asChild variant="outline" size="xl" className="rounded-xl">
          <Link href="/">На главную</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <div className="flex flex-col gap-5">
        <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{f.title}</h1>
        <p className="text-lg text-muted-foreground">{f.text}</p>
        {format !== "scan" && format !== "agency" && (
          <div className="glass rounded-3xl p-6 text-sm text-muted-foreground">
            <p className="mb-2 font-medium text-foreground">Как происходит оплата</p>
            <ol className="flex list-decimal flex-col gap-1.5 pl-5">
              <li>Вы оставляете заявку (заявка не является договором).</li>
              <li>Менеджер запрашивает реквизиты компании.</li>
              <li>Мы выставляем счёт и договор на e-mail бухгалтерии.</li>
              <li>После оплаты по безналичному расчёту начинаем работу.</li>
            </ol>
          </div>
        )}
        <p className="text-sm text-muted-foreground">Мы не отправляем рекламу и спам.</p>
      </div>

      <form onSubmit={onSubmit} noValidate className="glass grid gap-5 rounded-3xl p-6 md:grid-cols-2 md:p-8">
        <Field id="format" label="Формат" required className="md:col-span-2">
          <Select value={format} onValueChange={(v) => setFormat(v as FormatId)}>
            <SelectTrigger id="format" className="h-11 w-full rounded-xl data-[size=default]:h-11">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(FORMATS).map(([id, x]) => (
                <SelectItem key={id} value={id}>
                  {x.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Field id="lastName" label="Фамилия">
          <Input {...input("lastName")} placeholder="Введите фамилию" autoComplete="family-name" />
        </Field>
        <Field id="name" label="Имя" required error={errors.name}>
          <Input {...input("name")} placeholder="Введите имя" autoComplete="given-name" />
        </Field>
        <Field id="email" label="E-mail" required error={errors.email}>
          <Input {...input("email")} type="email" placeholder="email@example.ru" autoComplete="email" />
        </Field>
        <Field id="phone" label="Телефон" error={errors.phone}>
          <Input {...input("phone")} type="tel" placeholder="+7 (999) 999-99-99" autoComplete="tel" />
        </Field>
        <Field id="channel" label="Удобный способ связи" required error={errors.channel}>
          <Choice id="channel" value={data.channel} onChange={set("channel")} options={CHANNELS} placeholder="Выберите" invalid={!!errors.channel} />
        </Field>
        <Field id="telegram" label="Telegram" required={data.channel === "Телеграм"} error={errors.telegram}>
          <Input {...input("telegram")} placeholder="@username" />
        </Field>
        <Field id="company" label={format === "agency" ? "Агентство" : "Компания"} required error={errors.company}>
          <Input {...input("company")} placeholder="Название компании" autoComplete="organization" />
        </Field>
        <Field id="role" label="Ваша роль">
          <Choice id="role" value={data.role} onChange={set("role")} options={ROLES} placeholder="Выберите" />
        </Field>
        {format !== "agency" && (
          <>
            <Field id="hh" label="Ссылка на страницу работодателя на hh.ru">
              <Input {...input("hh")} placeholder="https://hh.ru/employer/…" />
            </Field>
            <Field id="site" label="Сайт компании">
              <Input {...input("site")} placeholder="https://example.ru" />
            </Field>
            <Field id="industry" label="Отрасль">
              <Choice id="industry" value={data.industry} onChange={set("industry")} options={INDUSTRIES} placeholder="Укажите отрасль" />
            </Field>
            <Field id="size" label="Численность" required error={errors.size}>
              <Choice id="size" value={data.size} onChange={set("size")} options={SIZES} placeholder="Выберите" invalid={!!errors.size} />
            </Field>
            <Field id="competitors" label="Конкуренты за сотрудников (если знаете)" className="md:col-span-2">
              <Input {...input("competitors")} placeholder="2–3 компании через запятую — или подберём сами" />
            </Field>
          </>
        )}
        <Field id="comment" label={format === "agency" ? "С какими клиентами работаете" : "Комментарий (уточнение задачи)"} className="md:col-span-2">
          <Textarea
            id="comment"
            value={data.comment}
            onChange={(e) => set("comment")(e.target.value)}
            placeholder={format === "scan" ? "Ссылки на сообщества VK, карьерный сайт или что-то ещё, что поможет поиску" : "Расскажите о задаче"}
            className="min-h-28 rounded-xl"
          />
        </Field>
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="flex items-start gap-3 text-sm">
            <Checkbox checked={agree} onCheckedChange={(v) => setAgree(v === true)} aria-invalid={errors.agree ? true : undefined} className="mt-0.5" />
            <span>
              Я ознакомлен(а) с{" "}
              <a href="/docs/privacy-policy" target="_blank" className="underline underline-offset-4">
                Политикой обработки персональных данных
              </a>{" "}
              и даю согласие на обработку моих персональных данных
            </span>
          </label>
          {errors.agree && <p className="text-xs text-destructive">{errors.agree}</p>}
        </div>
        <div className="flex flex-col items-start gap-3 md:col-span-2">
          <Button type="submit" variant="glow" size="xl">
            {format === "scan" ? "Получить бесплатный срез" : "Отправить заявку"}
          </Button>
          <p className="text-xs text-muted-foreground">
            <Ph>Тестовая версия: данные формы никуда не отправляются.</Ph>
          </p>
        </div>
      </form>
    </div>
  )
}
