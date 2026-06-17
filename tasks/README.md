# Task corpus

Versioned loop tasks for workshops, comparison demos, and BYO patterns.

## Index

| Task ID | Rung | Source | Verifier | Expected iters |
|---------|------|--------|----------|----------------|
| [oms-status-race-001](oms-status-race-001.yaml) | 2 | atlas-oms | `pytest tests/order/test_status_transition.py` | 3–5 |
| [lint-gate-stale-import-001](lint-gate-stale-import-001.yaml) | 2 | BYO pattern | `ruff check src/orders/` | 2–4 |
| [type-narrowing-handler-001](type-narrowing-handler-001.yaml) | 1 | BYO pattern | `mypy src/api/handlers/order.py` | 2–3 |
| [comparison-prompt-baseline-001](comparison-prompt-baseline-001.yaml) | 0 | Arm A | same as paired task | 1 |

Template: [_template.yaml](_template.yaml) · Machine index: [index.json](index.json)

## BYO — add your task

```bash
./scripts/scaffold-byo-task.sh
# or: make scaffold
```

See [BYO.md](../BYO.md) at repo root.

## Generate an Agent prompt

```bash
./scripts/task-prompt.sh oms-status-race-001
./scripts/task-prompt.sh oms-status-race-001 --copy   # macOS clipboard
./scripts/task-prompt.sh --list
make prompt TASK=oms-status-race-001
```

## Task YAML schema

See `_template.yaml` for all fields. Required for FR-1/FR-2: `task_id`, `verifier`, `seeded_state`, `expected_iters`, `common_fails`, `termination`.

## In Cursor

| Invoke | Purpose |
|--------|---------|
| `/loop-task` | Run corpus task by id |
| `/byo-loop-task` | Scaffold in your repo |
| `/loop-engineering` | Full loop procedure |
| `@loop-discipline` | Rules in every loop thread |
