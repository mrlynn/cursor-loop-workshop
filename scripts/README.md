# Loop Engineering scripts

| Script | Purpose |
|--------|---------|
| `setup-workshop.sh` | Clone/copy workshop + `atlas-oms` lab repo side by side |
| `copy-harness.sh` | Install `.cursor/rules` and `.cursor/skills` into a lab checkout |
| `build-plugin.sh` | Sync `.cursor/` → `plugin/` for marketplace |
| `scaffold-byo-task.sh` | Interactive BYO task YAML |
| `task-prompt.sh` | YAML → copy-paste Agent prompt (`--copy` for clipboard) |
| `loop-harness.sh` | Comparison harness — V0: `--log-only`; V2: automated `cursor-agent` (stub) |

## Quick start (facilitator)

```bash
# From workshop repo root
chmod +x scripts/*.sh

# Learner machine (or local dev)
./scripts/setup-workshop.sh ~/code/loop-workshop
# → ~/code/loop-workshop/cursor-loop-workshop/ (cloned from GitHub)
./scripts/copy-harness.sh ~/code/loop-workshop/atlas-oms
```

Published workshop: `https://github.com/mrlynn/cursor-loop-workshop`

## Log a manual B-arm run (V0)

After completing a loop in the IDE:

```bash
./scripts/loop-harness.sh \
  --task oms-status-race-001 \
  --method B \
  --log-only \
  --pass true \
  --iterations 4 \
  --interventions 0 \
  --log loop-runs/my-run.json
```

Set `ATLAS_OMS_REPO` before `setup-workshop.sh` if your organization uses a fork.
