---
name: loop-engineering
description: >-
  Run a disciplined agentic loop on a verifiable task: goal → act → verify →
  correct → repeat until green or blocked. Use when executing a loop task with
  a machine-checkable verifier, or when the user asks to "run the loop."
---

# Loop Engineering

Execute a task using the Loop Engineering discipline. The verifier closes the feedback loop — not the human.

## Prerequisites

Before starting, confirm you have:

1. **Task spec** — goal, seeded state, definition of done
2. **Verifier command** — returns unambiguous pass/fail (e.g., `pytest tests/order/test_status_transition.py`)
3. **Regression gates** — optional broader suite, lint, or typecheck
4. **Budget** — max iterations and optional token/time ceiling
5. **Active rules** — `@loop-discipline`, `@loop-termination`, `@loop-safety` (or equivalent in context)

## Procedure

### 1. Baseline the verifier

Run the verifier **before** any edits. Confirm it fails as expected on the seeded state. Record the failure output — this is iteration 0.

### 2. Enter the loop

For each iteration until green or blocked:

```
EDIT → RUN VERIFIER → READ OUTPUT → HYPOTHESIS → (repeat)
```

Follow `@loop-discipline`: smallest change, one hypothesis, no skipping verification.

### 3. Check termination

After each verifier run, evaluate:

| Condition | Action |
|-----------|--------|
| All verifiers green, no regressions | **Success** — summarize changes and iteration count |
| Same error 3× with no progress | **Blocked** — summarize per `@loop-termination` |
| Budget ceiling hit | **Budget stop** — report partial state |
| Regression introduced | Continue loop — fix regression before declaring green |

### 4. Log metrics

At end of run, report:

- Iterations to green (or N/A if blocked)
- Human interventions required
- Regression count
- Final verifier output (last 20 lines if failed)

## Example invocation

```
@loop-engineering

Task: oms-status-race-001
Verifier: pytest tests/order/test_status_transition.py && mypy src/orders/
Budget: 8 iterations
Seeded state: concurrent status updates leave orders inconsistent; one integration test is red.
```

## Escalation

If the task spec is missing a verifier, **stop** and help the user craft one (`@verifier-crafting`) before looping. A loop without a verifier is repeated guessing.
