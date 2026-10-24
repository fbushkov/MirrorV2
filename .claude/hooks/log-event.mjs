// Сквозное логирование: каждое событие сессии — строка JSON в .claude/logs/ГГГГ-ММ-ДД.jsonl.
// Здесь же триггеры снапшотов: каждые N шагов и при превышении порога контекста.
import { agentOf, loadState, log, paths, readInput, readTranscript, redact, saveState, SNAPSHOT_CONTEXT_TOKENS, SNAPSHOT_EVERY_STEPS, textBlocks, usageOf } from "./lib.mjs"
import { writeSnapshot } from "./snapshot.mjs"

try {
  const input = await readInput()
  const dirs = paths(input)
  const ev = input.hook_event_name
  const base = {
    event: ev,
    session_id: input.session_id ?? null,
    agent: agentOf(input),
    cwd: input.cwd ?? null,
  }
  const state = loadState(dirs, input.session_id)

  if (ev === "UserPromptSubmit") {
    log(dirs, { ...base, event: "user.prompt", status: "success", prompt: { text_redacted: redact(input.prompt, 4000) } })
  } else if (ev === "PostToolUse" || ev === "PostToolUseFailure") {
    const failed = ev === "PostToolUseFailure"
    log(dirs, {
      ...base,
      event: "tool.result",
      status: failed ? "error" : "success",
      tool: {
        name: input.tool_name,
        use_id: input.tool_use_id ?? null,
        input_redacted: redact(input.tool_input, 1500),
        result_summary: failed ? null : redact(input.tool_response, 800),
      },
      error: failed ? { message: redact(input.error ?? input.tool_response, 1000), interrupt: input.is_interrupt ?? false } : null,
    })
    state.stepsSinceSnapshot = (state.stepsSinceSnapshot ?? 0) + 1
    if (state.stepsSinceSnapshot >= SNAPSHOT_EVERY_STEPS && input.transcript_path) {
      const snap = writeSnapshot(dirs, input, "steps")
      state.stepsSinceSnapshot = 0
      log(dirs, { ...base, event: "snapshot.created", status: "success", snapshot: { reason: "steps", checksum: snap.checksum } })
    }
  } else if (ev === "SubagentStart") {
    log(dirs, { ...base, event: "subagent.start", status: "success" })
  } else if (ev === "SubagentStop" || ev === "Stop") {
    // Токены за отрезок с прошлого Stop: читаем транскрипт (у субагента — свой файл) и считаем новые ответы модели
    const file = ev === "SubagentStop" ? input.agent_transcript_path || input.transcript_path : input.transcript_path
    const entries = readTranscript(file)
    const seen = new Set(state.seenMessages ?? [])
    const { total, model, lastContext } = usageOf(entries, seen)
    state.seenMessages = [...seen]
    const lastText = input.last_assistant_message
      ? textBlocks(input.last_assistant_message).join("\n") || String(input.last_assistant_message)
      : [...entries].reverse().map((e) => (e.type === "assistant" ? textBlocks(e.message?.content).join("\n") : "")).find(Boolean)
    log(dirs, {
      ...base,
      event: ev === "Stop" ? "turn.end" : "subagent.stop",
      status: "success",
      model,
      tokens: { ...total, context: lastContext },
      completion: { text_redacted: redact(lastText ?? "", 2000) },
    })
    // Снапшот при каждом новом пороге контекста: 120k, 240k, 360k… После сжатия полоса сбрасывается вниз.
    const band = Math.floor(lastContext / SNAPSHOT_CONTEXT_TOKENS)
    if (ev === "Stop" && band < (state.contextBand ?? 0)) state.contextBand = band
    if (ev === "Stop" && band >= 1 && band > (state.contextBand ?? 0)) {
      const snap = writeSnapshot(dirs, input, "token_threshold")
      state.contextBand = band
      state.stepsSinceSnapshot = 0
      log(dirs, { ...base, event: "snapshot.created", status: "success", snapshot: { reason: "token_threshold", context: lastContext, checksum: snap.checksum } })
    }
  } else if (ev === "PreCompact") {
    const snap = writeSnapshot(dirs, input, `precompact_${input.trigger ?? "auto"}`)
    state.stepsSinceSnapshot = 0
    log(dirs, { ...base, event: "snapshot.created", status: "success", snapshot: { reason: "precompact", trigger: input.trigger ?? null, checksum: snap.checksum } })
  } else if (ev === "PostCompact") {
    // Сводку, которую построил сам Claude Code при сжатии, тоже сохраняем в снапшот
    const summary = input.summary ?? input.compact_summary ?? input.compaction_summary ?? null
    const snap = writeSnapshot(dirs, input, "postcompact", { summary })
    log(dirs, { ...base, event: "snapshot.created", status: "success", snapshot: { reason: "postcompact", has_summary: Boolean(summary), checksum: snap.checksum } })
  } else {
    log(dirs, { ...base, event: `hook.${ev ?? "unknown"}`, status: "success" })
  }
  saveState(state)
} catch (e) {
  process.stderr.write(`mirror log hook: ${e?.message ?? e}\n`)
}
process.exit(0)
