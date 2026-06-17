---
name: run-comparison
description: >-
  Run prompt-only vs agent-loop vs background-agent comparison on the same
  task and log structured metrics. Use for workshop demos, A/B evidence, or
  cohort measurement.
---

# Run Comparison (A / B / C)

Hold the task constant. Vary only the method. Log metrics for side-by-side evidence.

## Methods

| Arm | Label | Human role | Verifier |
|-----|-------|------------|----------|
| A | Prompt-only | Closes the loop — judges output manually | None (human eyeballs) |
| B | Agent loop | Reviews at green; `@loop-engineering` + rules | Machine-checkable |
| C | Background / Cloud | Reviews the PR when agent finishes | Full verifier + budget |

## Procedure

### 1. Pin the task

Use a versioned task id from the corpus (e.g., `oms-status-race-001`). Same seeded state, same verifier, same budget for B and C.

### 2. Run arm A (prompt-only)

1. Open a **fresh thread** in Chat or Inline Edit — not Agent mode.
2. Paste the task goal **without** mentioning the verifier command.
3. Apply the suggested fix manually.
4. Human runs the verifier and records pass/fail.
5. Log: pass@1, human interventions, wall-clock, whether human ran verifier.

### 3. Run arm B (agent loop)

1. Fresh Agent mode thread.
2. Load loop rules: `@loop-discipline` `@loop-termination` `@loop-safety`.
3. Invoke `@loop-engineering` with full task spec including verifier.
4. Let the agent iterate until green, blocked, or budget.
5. Log: pass/fail, iterations-to-green, human interventions, wall-clock, regression count.

### 4. Run arm C (background) — optional

:::caution VERIFY
Confirm current Background/Cloud Agent UX and CLI flags against cursor.com/docs before facilitating arm C.
:::

1. Launch background agent with the same prompt + verifier spec as arm B.
2. Human reviews the resulting PR.
3. Run verifier on the branch; log same metrics as B.

### 5. Write metrics file

Append to `loop-runs/<task_id>/<timestamp>.json`:

```json
{
  "task_id": "oms-status-race-001",
  "method": "B",
  "pass": true,
  "pass_at_1": false,
  "iterations_to_green": 4,
  "human_interventions": 1,
  "wall_clock_seconds": 312,
  "regression_count": 0,
  "notes": "Agent fixed symptom first; regression caught by suite gate"
}
```

## Facilitation notes

- Run A before B so learners feel the cognitive load difference.
- Report **cost and wall-clock honestly** alongside pass rate — credibility depends on it.
- Same facilitator, same model selection across arms when possible.

## CLI harness

:::caution VERIFY
The one-command harness (`cursor-agent -p ...`) is V2 milestone. For V0 workshops, run arms manually and log to JSON. Re-verify CLI syntax at cursor.com/docs/cli.
:::

```bash
# Future one-command shape (illustrative)
./scripts/loop-harness.sh --task oms-status-race-001 --method B
```
