---
title: CLI Harness
description: Script reproducible loop runs with cursor-agent for cohort consistency
---

# CLI Harness

The Cursor CLI (`cursor-agent`) makes loop runs scriptable. V2 delivers one-command A/B/C; V0 workshops smoke-test the CLI and log manually.

## Why this matters

FR-3: harness must run a task under methods A, B, and C from a single command. Cohort facilitators cannot rebuild prompts per session. CLI + structured logging is how comparison evidence scales.

## What you'll learn

- You can install `cursor-agent` via the official install script
- You can describe headless flags for automation vs interactive TUI
- You can sketch the V2 `loop-harness.sh` interface
- You can work around known early-2026 `-p` hang issues with timeouts

## How it works

:::caution VERIFY
CLI flags and binary name change frequently. Verify against [cursor.com/docs/cli](https://cursor.com/docs/cli) before facilitating. The PRD's `npm i -g @cursor/cli` is stale — use the install script instead.
:::

- **Binary:** `cursor-agent` (not `cursor`)
- **Install:** `curl https://cursor.com/install -fsSL | bash`
- **Headless:** `-p` / `--print` for non-interactive scripts
- **Output:** `--output-format json` or `stream-json`
- **Auth:** `CURSOR_API_KEY` for CI/cohort machines
- **Respects:** `.cursor/rules`, `AGENTS.md`, configured MCP

**V2 harness shape (illustrative):**

```bash
./scripts/loop-harness.sh \
  --task oms-status-race-001 \
  --method B \
  --budget 8 \
  --log loop-runs/oms-status-race-001/$(date +%s).json
```

**V0 workshop path:** Facilitator runs Agent mode manually; appends same JSON schema by hand or via helper script.

## When to use this

| Method | Surface | Harness |
|--------|---------|---------|
| A — Prompt-only | Chat / IDE | Human logs |
| B — Agent loop | IDE Agent mode | Manual or CLI |
| C — Background | Cloud agent | CLI launch + PR review |

## Step-by-step

1. Install CLI: `curl https://cursor.com/install -fsSL | bash`
2. Verify: `cursor-agent --version`
3. Export API key if running headless in CI: `export CURSOR_API_KEY=...`
4. From atlas-oms root, test read-only: `cursor-agent -p "Summarize the orders module"` with `timeout 120`
5. Create `loop-runs/` directory (gitignored) for metric JSON
6. Run B arm manually in IDE; copy output schema from `run-comparison` skill
7. (V2) Wire `loop-harness.sh` to pass task YAML + rules path

## Example

Metric log schema (FR-4):

```json
{
  "task_id": "oms-status-race-001",
  "method": "B",
  "pass": true,
  "pass_at_1": false,
  "iterations_to_green": 4,
  "human_interventions": 1,
  "wall_clock_seconds": 312,
  "token_cost_usd": null,
  "regression_count": 0,
  "cursor_version": "VERIFY",
  "harness_version": "v0-manual"
}
```

Headless invocation (verify flags before use):

```bash
timeout 600 cursor-agent -p \
  --output-format json \
  -m "default" \
  "Run loop-engineering on task oms-status-race-001. Verifier: pytest tests/order/test_status_transition.py"
```

## Common mistakes

### Wrong package install
**Symptom:** `npm i -g @cursor/cli` — stale path from old docs.  
**Fix:** Official curl install script only.

### Headless without timeout
**Symptom:** `-p` hangs indefinitely (known early-2026 issue).  
**Fix:** Wrap in `timeout`; treat as non-blocking for demos.

### CLI without rules context
**Symptom:** Headless agent ignores loop discipline.  
**Fix:** Ensure `.cursor/rules` in repo root; reference in prompt.

:::tip Official Docs
[cursor.com/docs/cli](https://cursor.com/docs/cli)
:::

## Checklist

- [ ] `cursor-agent` installed and version recorded
- [ ] `loop-runs/` directory created and gitignored
- [ ] Manual B-arm log written in FR-4 schema
- [ ] CLI flags verified against current docs

## Next Steps

Continue to [Hooks and Guardrails →](./hooks-and-guardrails)
