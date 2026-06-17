---
name: byo-loop-task
description: >-
  Scaffold a bring-your-own-repo loop task: find a failing verifier, write
  tasks/<id>.yaml, and run the loop in the user's codebase. Use when applying
  Loop Engineering outside atlas-oms or when the user says BYO or "my own repo."
---

# BYO Loop Task

Apply Loop Engineering to the **user's repo**, not a workshop lab.

## Prerequisites

- Loop harness installed: `loop-discipline`, `loop-termination`, `loop-safety` rules
- User repo open as Cursor workspace
- A command that returns pass/fail on real pain

## Procedure

### 1. Find the verifier candidate

Ask or discover:

- A **failing test**, **lint error**, or **type error** on current branch
- Or tech debt they want fixed with objective done

Run the candidate command. It must **fail** for the right reason before looping.

### 2. Scaffold task YAML

From workshop repo (if available):

```bash
./scripts/scaffold-byo-task.sh --id <kebab-id> --verifier "<command>"
```

Or copy `tasks/_template.yaml` → `tasks/<id>.yaml` in the workshop repo, or `tasks/<id>.yaml` in the user repo under a `tasks/` folder they commit.

Minimum fields: `task_id`, `rung`, `seeded_state`, `verifier`, `termination.max_iterations`, `common_fails`.

### 3. Set rung

| Situation | Rung |
|-----------|------|
| User judges every output | 0 — comparison only |
| Agent runs verifier, user approves each step | 1 |
| Rules + verifier loop, user reviews at green | 2 (default) |
| Background agent + PR review | 3 |

### 4. Run the loop

```text
@loop-discipline @loop-termination @loop-safety
/loop-engineering
```

Include full task spec. Use `/verifier-crafting` first if the verifier is weak.

### 5. Log (optional)

```bash
./scripts/loop-harness.sh --task <id> --method B --log-only --pass true --iterations N --log loop-runs/<id>.json
```

## Anti-patterns

- Looping without a failing verifier on seed
- Verifier that only checks happy path
- Skipping regression gates on multi-file fixes

## Reference

Workshop guide: `BYO.md` · Template: `tasks/_template.yaml`
