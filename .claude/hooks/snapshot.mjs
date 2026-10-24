// Контекстный снапшот: сжатое состояние сессии для восстановления после сжатия контекста,
// новой сессии или переключения на другую модель. Пишется в .claude/memory/snapshots/.
import { execSync } from "node:child_process"
import { createHash } from "node:crypto"
import { readdirSync, renameSync, unlinkSync, writeFileSync } from "node:fs"
import path from "node:path"
import { humanPrompts, lastAssistantTexts, readTranscript, redact, touchedFiles, usageOf } from "./lib.mjs"

function git(root, args) {
  try {
    return execSync(`git ${args}`, { cwd: root, timeout: 3000, stdio: ["ignore", "pipe", "ignore"] }).toString().trim()
  } catch {
    return ""
  }
}

// Атомарная запись: сначала во временный файл, потом переименование — снапшот не бывает «наполовину записан»
function writeAtomic(file, data) {
  const tmp = file + ".tmp"
  writeFileSync(tmp, data)
  renameSync(tmp, file)
}

export function writeSnapshot(dirs, input, reason, extra = {}) {
  const entries = readTranscript(input.transcript_path)
  const { total, model, lastContext } = usageOf(entries)
  const prompts = humanPrompts(entries)
  const { files, commands } = touchedFiles(entries)
  const snap = {
    snapshot_version: 1,
    session_id: input.session_id ?? null,
    created_at: new Date().toISOString(),
    reason,
    model,
    context_tokens: lastContext,
    tokens: total,
    git: {
      branch: git(dirs.root, "rev-parse --abbrev-ref HEAD"),
      head: git(dirs.root, "log -1 --format=%h\\ %s"),
      status: git(dirs.root, "status --short").split("\n").filter(Boolean).slice(0, 30),
      recent: git(dirs.root, "log --oneline -8").split("\n").filter(Boolean),
    },
    first_request: prompts[0] ? redact(prompts[0].text, 1500) : null,
    recent_requests: prompts.slice(-6).map((p) => ({ ts: p.ts, text: redact(p.text, 1500) })),
    last_assistant: lastAssistantTexts(entries, 2).map((t) => ({ ts: t.ts, text: redact(t.text, 2500) })),
    files_touched: files.slice(-40),
    recent_commands: commands.map((c) => redact(c, 300)),
    compact_summary: extra.summary ? redact(extra.summary, 12000) : null,
  }
  const body = JSON.stringify(snap, null, 2)
  snap.checksum = "sha256:" + createHash("sha256").update(body).digest("hex")
  const json = JSON.stringify(snap, null, 2)
  const stamp = snap.created_at.replace(/[:.]/g, "-")
  const sid = (snap.session_id ?? "nosession").slice(0, 8)
  writeAtomic(path.join(dirs.snapshots, `${stamp}-${sid}-${reason}.json`), json)
  writeAtomic(path.join(dirs.snapshots, "latest.json"), json)
  writeAtomic(path.join(dirs.snapshots, "latest.md"), toMarkdown(snap))

  // Храним последние 30 снапшотов
  const all = readdirSync(dirs.snapshots).filter((f) => /^\d{4}-.*\.json$/.test(f)).sort()
  for (const f of all.slice(0, Math.max(0, all.length - 30))) {
    try {
      unlinkSync(path.join(dirs.snapshots, f))
    } catch {}
  }
  return snap
}

export function toMarkdown(s) {
  const lines = [
    `# Снапшот сессии ${s.session_id ?? ""}`,
    "",
    `- Время: ${s.created_at} · причина: ${s.reason} · модель: ${s.model ?? "?"}`,
    `- Контекст на момент снапшота: ~${s.context_tokens} токенов; за сессию: вход ${s.tokens.input + s.tokens.cache_read + s.tokens.cache_write}, выход ${s.tokens.output}, запросов ${s.tokens.requests}`,
    `- Git: ${s.git.branch} · ${s.git.head}`,
    "",
  ]
  if (s.compact_summary) lines.push("## Сводка сжатия контекста", "", s.compact_summary, "")
  if (s.first_request) lines.push("## Первый запрос сессии", "", s.first_request, "")
  if (s.recent_requests.length) {
    lines.push("## Последние запросы пользователя", "")
    for (const r of s.recent_requests) lines.push(`- (${r.ts}) ${r.text.replace(/\n+/g, " ")}`)
    lines.push("")
  }
  if (s.last_assistant.length) {
    lines.push("## Последние ответы", "")
    for (const a of s.last_assistant) lines.push(a.text, "")
  }
  if (s.files_touched.length) lines.push("## Изменённые файлы", "", ...s.files_touched.map((f) => `- ${f}`), "")
  if (s.git.status.length) lines.push("## Незакоммиченные изменения", "", ...s.git.status.map((f) => `- ${f}`), "")
  if (s.git.recent.length) lines.push("## Последние коммиты", "", ...s.git.recent.map((c) => `- ${c}`), "")
  return lines.join("\n")
}
