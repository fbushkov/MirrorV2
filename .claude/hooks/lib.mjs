// Общие функции хуков Mirror: чтение входа, маскирование, JSON-логи, разбор транскрипта.
// Хуки не должны ломать сессию: все ошибки перехватываются в вызывающем коде.
import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

export const SNAPSHOT_EVERY_STEPS = Number(process.env.MIRROR_SNAPSHOT_STEPS ?? 20)
export const SNAPSHOT_CONTEXT_TOKENS = Number(process.env.MIRROR_SNAPSHOT_TOKENS ?? 120000)

export async function readInput() {
  let raw = ""
  for await (const chunk of process.stdin) raw += chunk
  try {
    return JSON.parse(raw || "{}")
  } catch {
    return {}
  }
}

export function paths(input) {
  const root = process.env.CLAUDE_PROJECT_DIR || input.cwd || process.cwd()
  const dirs = {
    root,
    logs: path.join(root, ".claude/logs"),
    state: path.join(root, ".claude/logs/.state"),
    memory: path.join(root, ".claude/memory"),
    snapshots: path.join(root, ".claude/memory/snapshots"),
  }
  for (const d of [dirs.logs, dirs.state, dirs.snapshots]) mkdirSync(d, { recursive: true })
  return dirs
}

// Маскирование персональных данных и секретов (152-ФЗ): в логи и снапшоты не попадают в открытом виде
const REDACTIONS = [
  [/[\w.+-]+@[\w-]+\.[\w.-]+/g, "[email]"],
  [/(?:\+7|\b8)[\s(-]*\d{3}[\s)-]*\d{3}[\s-]*\d{2}[\s-]*\d{2}\b/g, "[phone]"],
  [/\b(?:sk-[A-Za-z0-9_-]{16,}|ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|xox[abp]-[A-Za-z0-9-]{10,})\b/g, "[secret]"],
  [/(Bearer\s+)[A-Za-z0-9._-]{16,}/g, "$1[secret]"],
  [/((?:password|passwd|secret|token|api[_-]?key|DB_PASS|SESSION_PASSWORD)\s*[=:]\s*)\S+/gi, "$1[secret]"],
]

export function redact(value, max = 2000) {
  if (value == null) return value
  let s = typeof value === "string" ? value : JSON.stringify(value)
  for (const [re, rep] of REDACTIONS) s = s.replace(re, rep)
  return s.length > max ? s.slice(0, max) + `… [+${s.length - max} симв.]` : s
}

export function agentOf(input) {
  return {
    id: input.agent_type || (input.agent_id ? "subagent" : "main"),
    instance: input.agent_id ?? null,
  }
}

export function log(dirs, event) {
  const day = new Date().toISOString().slice(0, 10)
  const line = JSON.stringify({ ts: new Date().toISOString(), ...event })
  appendFileSync(path.join(dirs.logs, `${day}.jsonl`), line + "\n")
}

export function loadState(dirs, sessionId) {
  const f = path.join(dirs.state, `${sessionId || "unknown"}.json`)
  try {
    return { file: f, ...JSON.parse(readFileSync(f, "utf8")) }
  } catch {
    return { file: f, lastLine: 0, stepsSinceSnapshot: 0, seenMessages: [] }
  }
}

export function saveState(state) {
  const { file, ...rest } = state
  rest.seenMessages = (rest.seenMessages ?? []).slice(-500)
  writeFileSync(file, JSON.stringify(rest))
}

export function readTranscript(file) {
  if (!file || !existsSync(file)) return []
  const out = []
  for (const line of readFileSync(file, "utf8").split("\n")) {
    if (!line.trim()) continue
    try {
      out.push(JSON.parse(line))
    } catch {}
  }
  return out
}

/** Токены по ответам модели. Один ответ пишется в транскрипт несколькими строками — считаем по message.id один раз. */
export function usageOf(entries, seen = new Set()) {
  const total = { input: 0, output: 0, cache_read: 0, cache_write: 0, requests: 0 }
  let model = null
  let lastContext = 0
  for (const e of entries) {
    if (e.type !== "assistant" || !e.message?.usage) continue
    const id = e.message.id || e.requestId || e.uuid
    const u = e.message.usage
    lastContext = (u.input_tokens ?? 0) + (u.cache_read_input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0)
    model = e.message.model || e.requestedModel || model
    if (seen.has(id)) continue
    seen.add(id)
    total.input += u.input_tokens ?? 0
    total.output += u.output_tokens ?? 0
    total.cache_read += u.cache_read_input_tokens ?? 0
    total.cache_write += u.cache_creation_input_tokens ?? 0
    total.requests += 1
  }
  return { total, model, lastContext }
}

export function textBlocks(content) {
  if (typeof content === "string") return [content]
  if (!Array.isArray(content)) return []
  return content.filter((b) => b?.type === "text" && b.text).map((b) => b.text)
}

/** Сообщения, которые написал человек (без результатов инструментов и служебных вставок) */
export function humanPrompts(entries) {
  return entries
    .filter((e) => e.type === "user" && !e.isMeta && !e.isSidechain && (e.origin?.kind === "human" || e.turnOrigin === "human"))
    .map((e) => ({ ts: e.timestamp, text: textBlocks(e.message?.content).join("\n") }))
    .filter((p) => p.text && !p.text.startsWith("<"))
}

export function lastAssistantTexts(entries, n = 3) {
  const texts = []
  for (const e of entries) {
    if (e.type !== "assistant" || e.isSidechain) continue
    for (const t of textBlocks(e.message?.content)) texts.push({ ts: e.timestamp, text: t })
  }
  return texts.slice(-n)
}

export function touchedFiles(entries) {
  const files = new Set()
  const commands = []
  for (const e of entries) {
    if (e.type !== "assistant" || !Array.isArray(e.message?.content)) continue
    for (const b of e.message.content) {
      if (b?.type !== "tool_use") continue
      const fp = b.input?.file_path
      if (fp && ["Edit", "Write", "NotebookEdit", "MultiEdit"].includes(b.name)) files.add(fp)
      if (b.name === "Bash" && b.input?.command) commands.push(b.input.command)
    }
  }
  return { files: [...files], commands: commands.slice(-8) }
}
