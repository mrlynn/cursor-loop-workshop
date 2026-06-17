---
name: verifier-crafting
description: >-
  Design a machine-checkable verifier for an agentic loop task. Use when
  defining definition-of-done, writing a new loop task, or when a loop fails
  because the success criterion is ambiguous.
---

# Verifier Crafting

The highest-leverage surface in Loop Engineering is the **verifier**. A loop is a prompt plus a signal the agent can iterate against.

## What makes a good verifier

| Property | Good | Bad |
|----------|------|-----|
| Output | Pass/fail exit code, unambiguous | Human judgment ("looks correct") |
| Scope | Tests the seeded pain point directly | Tests unrelated happy path only |
| Speed | Runs in seconds to low minutes | Full E2E suite per iteration |
| Stability | Deterministic on seeded state | Flaky or environment-dependent |
| Regression | Catches collateral breakage | Only checks the edited file |

## Procedure

### 1. Name the pain point

Write one sentence: what is broken in the seeded state? The verifier must fail **because of that pain**, not because of a missing dependency.

### 2. Choose verifier type

| Signal type | When to use | Example |
|-------------|-------------|---------|
| Unit / integration test | Logic bugs, race conditions, API contracts | `pytest tests/order/test_status_transition.py` |
| Type checker | Incorrect types, missing annotations | `mypy src/orders/` |
| Linter | Style + some correctness gates | `ruff check src/orders/` |
| Build | Compile errors, bundling | `npm run build` |
| Perf assertion | Regression on latency/throughput | `pytest tests/perf/ --benchmark-only` |

Prefer the **narrowest** verifier that still catches the root cause.

### 3. Confirm seeded-state red

Run the verifier on the unmodified codebase. It must fail. If it passes on the broken state, the verifier does not encode the pain point — redesign.

### 4. Confirm reference green

Apply the reference solution (or known-good patch). The verifier must pass. If it still fails, the verifier or reference is wrong.

### 5. Add regression gates

For rung 2+ tasks, add broader gates the agent must not break:

```
primary:   pytest tests/order/test_status_transition.py
regression: pytest tests/order/ && mypy src/orders/
```

### 6. Document in task spec

```yaml
task_id: oms-status-race-001
verifier: pytest tests/order/test_status_transition.py
regression_gates: mypy src/orders/ && ruff check src/orders/
expected_iters: 3-5
common_fails: agent patches assertion without fixing race
```

## Anti-patterns

- **Assertion-only fixes pass** — verifier tests symptom not cause; add a concurrent/stress case.
- **Over-broad suite** — 10-minute CI per iteration burns budget; scope to affected package.
- **No regression gate** — agent fixes one test and breaks three others; loop declares false green.
