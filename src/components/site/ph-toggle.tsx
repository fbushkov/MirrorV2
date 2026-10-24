"use client"

import { useSyncExternalStore } from "react"
import { Switch } from "@/components/ui/switch"

export const PH_STORAGE_KEY = "mirror:ph"
const EVENT = "mirror:ph-change"

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback)
  return () => window.removeEventListener(EVENT, callback)
}

const getSnapshot = () => document.documentElement.dataset.ph !== "off"
const getServerSnapshot = () => true

/** Переключатель подсветки условных текстов (как в прототипе v4). Состояние живёт в data-ph на <html>. */
export function PhToggle() {
  const on = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  function toggle(next: boolean) {
    document.documentElement.dataset.ph = next ? "on" : "off"
    try {
      localStorage.setItem(PH_STORAGE_KEY, next ? "on" : "off")
    } catch {}
    window.dispatchEvent(new Event(EVENT))
  }

  return (
    <label className="inline-flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
      <Switch checked={on} onCheckedChange={toggle} />
      <span>
        Подсветка условных текстов <span className="ph px-1">вот так</span>
      </span>
    </label>
  )
}
