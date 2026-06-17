Design or validate a machine-checkable verifier for a loop task.

Load and follow `/verifier-crafting`.

Ask the user:
1. What is broken in the seeded state? (one sentence)
2. What command returns unambiguous pass/fail?

Then verify:
- [ ] Verifier fails on unmodified / seeded code
- [ ] Verifier passes with known-good fix
- [ ] Narrow enough for iteration budget (< ~2 min per run)
- [ ] Regression gate catches symptom-only fixes

If valid, offer to write `tasks/<task-id>.yaml` using the schema in `tasks/README.md`.

A loop without a verifier is repeated guessing — stop and fix the verifier before looping.
