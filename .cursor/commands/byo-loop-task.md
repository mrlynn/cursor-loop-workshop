Scaffold and run a loop task in the user's own repo (BYO).

1. Load `/byo-loop-task` skill procedure.
2. Help find a failing verifier in the **current workspace** (test, lint, mypy, build).
3. Confirm verifier is RED before any edits.
4. Scaffold `tasks/<id>.yaml` from `tasks/_template.yaml` (or run workshop `scaffold-byo-task.sh` if available).
5. Reference `@loop-discipline` `@loop-termination` `@loop-safety`.
6. Run `/loop-engineering` with the task spec.

If no failing command exists, use `/loop-verify` or `/verifier-crafting` first — do not loop without a signal.

Guide: `BYO.md` in loop-engineering workshop repo.
