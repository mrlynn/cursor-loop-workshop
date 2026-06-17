---
title: Hooks and Guardrails
description: Keep unattended loops safe with Hooks, Auto-review, and loop-safety rules
---

# Hooks and Guardrails

Loops run terminal commands. FR-7: destructive actions pass through approval gates; no workshop task disables safety to complete.

## Why this matters

Unattended rung-3 demos without guardrails are how workshops become incident reports. Hooks and Auto-review are composable primitives — the harness treats them as first-class, not obstacles to bypass.

## What you'll learn

- You can explain `@loop-safety` rule vs Hooks vs Auto-review
- You can list destructive commands that require human approval
- You can describe how hook failures become verifier failures
- You can facilitate rung-3 without disabling Smart Mode or Auto-review

## How it works

**Three layers:**

1. **`loop-safety.mdc` rule** — agent pauses before `rm`, force-push, deploy, credential ops
2. **Cursor Hooks** — repo-level scripts on events (before shell, after edit, etc.)
3. **Auto-review / Smart Mode** — product-level command classification and blocks

A hook failure is a **verifier failure** — diagnose before retrying. Do not `--no-verify` past hooks unless human explicitly approves.

Workshop policy: if guardrails block legitimate progress, **stop and escalate** to facilitator — never weaken protections mid-cohort.

## When to use this

| Rung | Guardrail level |
|------|-----------------|
| 0–1 | Human approves each command |
| 2 | Rules + Auto-review on destructive ops |
| 3 | Rules + Hooks + full approval policy |

## Step-by-step

1. Read `@loop-safety` in workshop `.cursor/rules/`.
2. Check if atlas-oms defines `.cursor/hooks.json` — review with cohort.
3. In Agent mode, intentionally request a blocked command (e.g., `git push --force`) — observe Auto-review behavior.
4. Document org approval policy in facilitator notes.
5. For background runs: confirm worktree isolation and PR review gate.
6. Debrief: guardrails are why loops are trustworthy at rung 3.

## Example

`loop-safety.mdc` destructive list:

```markdown
Before running **destructive** commands, pause for human approval:
- rm, git reset --hard, git push --force, drop, truncate
- Package publishes, infra deploys, credential rotation
```

Hook failure handling in discipline cycle:

```text
Hook exits non-zero → treat as verifier RED → read stderr → one hypothesis → fix → re-run
```

## Common mistakes

### "Disable safety for the demo"
**Symptom:** FR-7 violation; learner learns bad habit.  
**Fix:** Redesign task to use non-destructive verifiers only.

### Ignoring hook stderr
**Symptom:** Agent retries same command 8 times.  
**Fix:** Counts toward blocked termination — read hook output first.

### Rung 3 without PR review
**Symptom:** Background diff merges unreviewed.  
**Fix:** Human reviews PR; full verifier on branch before merge.

:::tip Official Docs
[Hooks](https://cursor.com/docs/hooks) · [Agent security](https://cursor.com/docs/agent/security)
:::

## Checklist

- [ ] `@loop-safety` deployed and referenced in loop threads
- [ ] Facilitator knows org Auto-review policy
- [ ] No workshop task requires disabling guardrails
- [ ] Hook failure → diagnose workflow explained to cohort

<StatementBlock background="bg_6">
  Harness components are assembled. Next: measure prompt vs loop with honest metrics.
</StatementBlock>

## Next Steps

Continue to [Measurement →](../measurement/overview)
