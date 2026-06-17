# Loop Engineering — agent briefing

You are in the **loop-engineering** workshop repo. This file gives you enough context to run loops without reading the full curriculum.

## Thesis

**A loop = prompt + verifier the agent can iterate against.**

Engineering leverage is verifier-crafting, not prompt-crafting. The human stops being the feedback loop when a machine-checkable signal (test, lint, build) returns pass/fail.

## Harness (use in Agent mode)

| Asset | Invoke | Purpose |
|-------|--------|---------|
| Rule | `@loop-discipline` | act → verify → correct → repeat |
| Rule | `@loop-termination` | green, blocked, budget ceilings |
| Rule | `@loop-safety` | destructive command gates |
| Skill | `/loop-engineering` | run a full loop on a task spec |
| Skill | `/verifier-crafting` | design pass/fail verifiers |
| Skill | `/run-comparison` | A/B/C measurement procedure |
| Skill | `/byo-loop-task` | BYO repo — scaffold and run |
| Command | `/loop-task` | paste a task prompt from corpus |
| Command | `/loop-compare` | start prompt-vs-loop demo script |
| Command | `/loop-verify` | validate or design a verifier |
| Command | `/byo-loop-task` | BYO shortcut (same skill) |

Copy harness: `./scripts/copy-harness.sh /path/to/repo` · Plugin: `make install-plugin`

## Run a corpus task

```bash
./scripts/task-prompt.sh oms-status-race-001        # print Agent prompt
./scripts/task-prompt.sh oms-status-race-001 --copy # macOS clipboard
```

Or in Agent mode: `@loop-discipline @loop-termination @loop-safety` then `/loop-engineering` with the printed spec.

## Task catalog

See `tasks/README.md`. Each task is `tasks/<task_id>.yaml` with verifier, regression gates, rung, and `common_fails`.

## When to loop (advanced users)

| Do loop | Stay on Tab / Inline / one-shot |
|---------|----------------------------------|
| Failing test or lint you can run | Single-line completion |
| Multi-iteration fix with regression risk | Exploration / read-only Plan |
| You want measurable A/B vs prompt | No machine-checkable done |

## When loops lose (say this honestly)

- More tokens and sometimes more wall-clock than one good prompt
- Up-front cost to write a verifier worth iterating on
- Wins on pass rate and human interventions when the verifier is real

## Log a run

```bash
./scripts/loop-harness.sh --task oms-status-race-001 --method B \
  --log-only --pass true --iterations 4 --interventions 0 \
  --log loop-runs/my-run.json
```

## BYO (your repo)

`BYO.md` · `/byo-loop-task` · `make scaffold` · site `/bring-your-own-repo`

## Curriculum site

`cd site && npm run start` — full workshop at http://localhost:3000. Advanced users: start at `/quick-reference`.
