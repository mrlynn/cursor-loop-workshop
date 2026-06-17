# Advanced user — 15 minutes to first loop

You already use Agent mode. Skip the 3-hour curriculum unless you're facilitating.

## 1. Install harness (2 min)

```bash
./scripts/copy-harness.sh /path/to/your-lab-repo   # or atlas-oms
```

Open the **lab repo** in Cursor, not this workshop root.

## 2. Pick or write a verifier (5 min)

You need a command that returns pass/fail on real pain:

```bash
pytest path/to/test_file.py -x    # example
```

Red on broken, green on fixed. No verifier → use `/verifier-crafting` first.

## 3. Run the loop (5 min)

```bash
# From workshop repo — prints copy-paste prompt
./scripts/task-prompt.sh oms-status-race-001
```

In Agent mode on the lab repo:

```text
@loop-discipline @loop-termination @loop-safety
/loop-engineering
<paste task-prompt output>
```

Or type `/loop-task` if commands are installed in this workspace.

## 4. Log and judge (3 min)

```bash
./scripts/loop-harness.sh --task oms-status-race-001 --method B \
  --log-only --pass true --iterations N --interventions 0 \
  --log loop-runs/$(whoami)-$(date +%s).json
```

Ask: did the verifier close the loop, or did you?

## Bring your own repo

1. Copy `.cursor/` from this repo into yours
2. Add one failing test that encodes real tech debt
3. Add `tasks/my-task.yaml` using `oms-status-race-001.yaml` as template
4. Run `./scripts/task-prompt.sh my-task`

## What to read if you want depth

| Page | Why |
|------|-----|
| [Quick reference](site/docs/quick-reference.mdx) | Cheat sheet — rules, skills, commands |
| [Developer journey](site/docs/getting-started/developer-journey.mdx) | Continuum diagrams |
| [Comparison arm](site/docs/measurement/comparison-arm.mdx) | A/B demo script |
| Full PRD | `PRD.md` §5–§9 |

## What advanced users still miss

- Termination budgets (loops without stop conditions burn trust)
- Regression gates (primary green ≠ done)
- Honest cost reporting in adoption conversations

The workshop exists to make those legible with data, not slides.
