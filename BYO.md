# Bring your own repo (BYO)

Apply Loop Engineering to **your** codebase Monday morning — no `atlas-oms` required.

## The bar

You need one command that returns **pass/fail** on real pain:

```bash
pytest tests/billing/test_refund.py -x   # example
npm test -- --grep "checkout"            # example
mypy src/payments/                       # example
```

If it does not fail on the broken state, you do not have a loop yet — you have a prompt.

## 15-minute BYO checklist

| Step | Action | Done when |
|------|--------|-----------|
| 1 | Pick a failing test, lint, or type error | Command fails for the **right** reason |
| 2 | `./scripts/copy-harness.sh .` in your repo | `.cursor/rules` + skills + commands exist |
| 3 | `./scripts/scaffold-byo-task.sh` from workshop repo | `tasks/<your-id>.yaml` created |
| 4 | `./scripts/task-prompt.sh <your-id> --copy` | Prompt on clipboard |
| 5 | Agent mode → paste → loop to green | All regression gates pass |
| 6 | Log run (optional) | `loop-runs/<id>.json` written |

## Scaffold a task

**Interactive:**

```bash
cd /path/to/cursor-loop-workshop
./scripts/scaffold-byo-task.sh
```

**Non-interactive:**

```bash
./scripts/scaffold-byo-task.sh \
  --id refund-rounding-001 \
  --verifier "pytest tests/billing/test_refund.py -x" \
  --rung 2 \
  --area billing
```

Edit the generated YAML: add `regression_gates`, `common_fails`, and `byo.files_likely_touched`.

## Where to put task YAML

| Layout | When |
|--------|------|
| In **your repo** `tasks/` | Team owns tasks beside code — recommended for BYO |
| In **workshop** `tasks/` | Shared corpus for facilitated sessions |

Either works. `task-prompt.sh` reads from workshop `tasks/`; copy the YAML locally or point users to generate prompts manually from the template.

## Plugin path (no copy-harness)

```bash
# From workshop repo
make build-plugin && make install-plugin
```

Restart Cursor → Settings → Plugins → enable **Loop Engineering**.

In **your** repo: `/byo-loop-task` with `@loop-discipline` and `@loop-termination`.

## Choosing rung

| Your comfort | Rung | Human role |
|--------------|------|------------|
| "I still want to judge every diff" | 1 | Approve each agent iteration |
| "Run tests until green, I'll review at end" | 2 | Review at green (default) |
| "Ship a PR from background agent" | 3 | Review PR + full verifier |

## Example BYO tasks (generic patterns)

| Pattern | Verifier shape | Common fail |
|---------|----------------|-------------|
| Flaky test | single test file | Agent mocks instead of fixes race |
| Lint debt | `ruff check path/` | Agent disables rule |
| Type error | `mypy package/` | Agent adds `# type: ignore` |
| API contract | integration test | Agent patches assertion only |

## Honest expectations

- Writing a good verifier takes longer than writing a good prompt
- Loops may cost more tokens
- You win when the task will need **multiple iterations** anyway and you want **fewer human interventions**

## Next

- Cheat sheet: `site` → `/quick-reference` (`npm run start` in `site/`)
- Skill: `/byo-loop-task`
- Full workshop: `ADVANCED.md` if you skip curriculum
