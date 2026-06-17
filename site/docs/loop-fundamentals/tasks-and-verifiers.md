---
title: Tasks and Verifiers
description: Scope goals and attach machine-checkable verifiers that fail on seeded state
---

# Tasks and Verifiers

The task names the pain; the verifier proves you fixed it. Together they replace vague prompts with a contract the agent can iterate against.

## Why this matters

Enterprise developers dismiss toy demos. `atlas-oms` pain points are realistic — aged codebase, integration tests, race conditions. The verifier must encode that realism in a pass/fail signal, or the loop looks like magic and fails in production adoption.

## What you'll learn

- You can write a task spec with `task_id`, `seeded_state`, and `definition_of_done`
- You can design a verifier that fails on seed and passes on reference solution
- You can add regression gates for rung 2+ tasks
- You can document `common_fails` so facilitators field hard questions

## How it works

**Task scoping** follows INVEST-ish discipline adapted for agents:

- **Independent** — one pain point per task; no multi-bug laundry lists
- **Negotiable** — files-to-touch hints, not micromanaged steps
- **Valuable** — maps to a real maintenance scenario
- **Estimable** — `expected_iters` guides facilitator timing
- **Small** — completable within iteration budget
- **Testable** — verifier is the testable contract

**Verifier design** uses `/verifier-crafting`:

1. Run on unmodified code → must **fail**
2. Run with reference patch → must **pass**
3. Run in under ~2 minutes for workshop pacing
4. Return exit code 0/1 — no human interpretation

## When to use this

| Verifier type | Best for | Workshop pacing |
|---------------|----------|-----------------|
| Single integration test | Logic bugs, races | ✓ Preferred |
| Type checker gate | API contract drift | ✓ Fast |
| Lint-only | Style tasks | Weak alone — pair with test |
| Full CI | Rung 3 production | Too slow for live demo |

## Step-by-step

1. Read the seeded pain point description on the task branch.
2. Run candidate verifier commands until one fails for the **right reason** (read the assertion).
3. Record the exact command in `task_id` metadata.
4. Apply reference solution — confirm verifier passes.
5. Add regression gate: broader test directory or `mypy` on touched package.
6. Document `common_fails` from past cohorts (symptom-fix vs root-cause).
7. Commit task metadata as `tasks/oms-status-race-001.yaml` in corpus.

## Example

<PromptBlock
  title="Agent loop prompt with embedded verifier"
  prompt={`Fix the order status race in atlas-oms.

Seeded state: concurrent status updates can leave an order inconsistent.
Verifier (run after EVERY edit):
  pytest tests/order/test_status_transition.py -x
Regression gates (must pass before done):
  mypy src/orders/ && pytest tests/order/ -q

Do not stop until all verifiers are green. Budget: 8 iterations.`}
/>

Minimal verifier-crafting checklist:

```text
[ ] Verifier fails on unmodified branch
[ ] Verifier passes with reference patch
[ ] Failure message mentions the seeded pain (not import error)
[ ] Regression gate catches symptom-only fixes
[ ] expected_iters documented (e.g., 3-5)
```

## Common mistakes

### Symptom-only verifier
**Symptom:** Agent patches assertion text; test green; `test_concurrent_fulfilment` still fails.  
**Fix:** Add concurrent/stress case to verifier scope.

### Import/setup failures mask pain
**Symptom:** Verifier fails because `ModuleNotFoundError`, not because of the bug.  
**Fix:** Fix environment first — verifier must fail on **logic**, not setup.

### Human-judged "done"
**Symptom:** No command to run; facilitator eyeballs diff.  
**Fix:** Every workshop task needs FR-1: runnable pass/fail verifier.

:::tip Official Docs
Testing in agent workflows: [cursor.com/docs/agent/terminal](https://cursor.com/docs/agent/terminal)
:::

## Checklist

- [ ] Task spec written with seeded state paragraph
- [ ] Verifier confirmed red on seed branch
- [ ] Reference solution confirmed green
- [ ] Regression gates defined for rung 2+
- [ ] `common_fails` documented for facilitators

<StatementBlock background="bg_3">
  Tasks and verifiers are the contract. Next: set termination so the loop cannot run forever.
</StatementBlock>

## Next Steps

Continue to [Termination & Budget →](./termination-budget)
