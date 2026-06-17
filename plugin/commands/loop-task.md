Run a Loop Engineering task from the corpus.

1. Ask which `task_id` if not provided (see `tasks/README.md` or `./scripts/task-prompt.sh --list`).
2. Read `tasks/<task_id>.yaml` from this workshop repo.
3. Reference rules: `@loop-discipline` `@loop-termination` `@loop-safety`
4. Invoke `/loop-engineering` and include the full task spec:

- task_id, rung, seeded_state
- verifier command (run after EVERY edit)
- regression gates (all must pass before done)
- budget: max iterations and blocked-after-same-error from YAML

5. Run the verifier on iteration 0 before any edits — confirm RED.
6. Enter act → verify → correct until green, blocked, or budget.

If no task_id and user is in a lab repo without corpus, help them craft a verifier with `/verifier-crafting` first.
