// Восстановление контекста: при старте сессии, возобновлении и после сжатия
// подкладываем модели состояние проекта и последний снапшот.
import { existsSync, readFileSync, statSync } from "node:fs"
import path from "node:path"
import { log, paths, readInput } from "./lib.mjs"

function readCapped(file, max) {
  if (!existsSync(file)) return null
  const s = readFileSync(file, "utf8")
  return s.length > max ? s.slice(0, max) + "\n… (обрезано)" : s
}

try {
  const input = await readInput()
  const dirs = paths(input)
  const parts = []
  const state = readCapped(path.join(dirs.memory, "project-state.md"), 8000)
  if (state) parts.push("## Память проекта: .claude/memory/project-state.md\n\n" + state)

  const latest = path.join(dirs.snapshots, "latest.md")
  if (existsSync(latest)) {
    const ageH = ((Date.now() - statSync(latest).mtimeMs) / 3.6e6).toFixed(1)
    parts.push(`## Последний снапшот сессии (${ageH} ч назад): .claude/memory/snapshots/latest.md\n\n` + readCapped(latest, 8000))
  }
  if (input.source === "compact" || input.source === "resume") {
    parts.push(
      "## Восстановление\nКонтекст был сжат или сессия возобновлена. Сверь цель и следующий шаг со снапшотом выше, прежде чем продолжать; если что-то не сходится — спроси пользователя.",
    )
  }
  log(dirs, { event: "session.start", session_id: input.session_id ?? null, agent: { id: "main", instance: null }, status: "success", source: input.source ?? null, restored: parts.length > 0 })

  if (parts.length) {
    process.stdout.write(
      JSON.stringify({ hookSpecificOutput: { hookEventName: "SessionStart", additionalContext: parts.join("\n\n---\n\n") } }),
    )
  }
} catch (e) {
  process.stderr.write(`mirror session-start hook: ${e?.message ?? e}\n`)
}
process.exit(0)
