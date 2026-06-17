Facilitate a prompt-only vs agent-loop comparison on the same task.

Follow the `/run-comparison` skill procedure:

**Arm A — Prompt-only (Rung 0)**
- Fresh Chat thread, NOT Agent mode
- Goal only — no verifier command in the prompt
- Human applies fix and runs verifier manually
- Log: pass/fail, human_interventions, wall_clock

**Arm B — Agent loop (Rung 2)**
- Fresh Agent thread
- `@loop-discipline` `@loop-termination` `@loop-safety`
- `/loop-engineering` with full task spec from `tasks/<task_id>.yaml`
- Log: iterations_to_green, regression_count, human_interventions

Hold the task constant. Reset git to the same seed commit between arms.

Report cost and wall-clock honestly alongside pass rate.

To log manually after arm B:
`./scripts/loop-harness.sh --task <id> --method B --log-only --pass true --iterations N --log loop-runs/demo.json`
