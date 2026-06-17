# Loop Engineering Workshop

Cursor workshop for teaching **Loop Engineering** — moving developers from prompt mode to agentic loops with machine-checkable verifiers. Based on [PRD.md](./PRD.md).

**Repository:** [github.com/mrlynn/cursor-loop-workshop](https://github.com/mrlynn/cursor-loop-workshop)

```bash
git clone https://github.com/mrlynn/cursor-loop-workshop.git
cd cursor-loop-workshop
make install-plugin   # optional: global harness via plugin
make site             # curriculum at http://localhost:3000
```

**Workshop repo** = curriculum + harness + task corpus. **Lab repo** (`atlas-oms`) = optional seeded codebase for facilitated labs — BYO works without it ([BYO.md](./BYO.md)).

## Repository layout

```
cursor-loop-workshop/
├── PRD.md
├── AGENTS.md              # Agent briefing — open this repo in Cursor
├── ADVANCED.md            # 15-minute skip path
├── BYO.md                 # Bring your own repo playbook
├── Makefile               # make help
├── .cursor/               # Harness source of truth
│   ├── rules/ skills/ commands/
├── plugin/                # Cursor plugin bundle (make build-plugin)
├── tasks/                 # Corpus + _template.yaml
├── scripts/
└── site/                  # Docusaurus workshop
```

## Fastest paths

| You are… | Start here |
|----------|------------|
| Advanced Cursor user | `ADVANCED.md` or `make install-plugin` → `/byo-loop-task` |
| BYO on your repo | [BYO.md](./BYO.md) → `make scaffold` → `make prompt-copy` |
| Facilitator | `make setup` → `site/npm start` |
| Team rollout | `make install-plugin` (plugin) or `make harness LAB=.` |

## Plugin install (recommended for teams)

```bash
make build-plugin
make install-plugin    # ~/.cursor/plugins/local/loop-engineering
```

Restart Cursor → **Settings → Plugins** → **Loop Engineering**.

Includes: 3 rules, 4 skills (`byo-loop-task` included), 4 commands. See [plugin/README.md](./plugin/README.md).

## BYO — your repo in 15 minutes

```bash
make scaffold                                    # tasks/your-id.yaml
./scripts/copy-harness.sh /path/to/your/repo     # or use plugin
make prompt-copy TASK=your-id
```

Full guide: [BYO.md](./BYO.md) · Site: `/bring-your-own-repo`

## Two-repo model (facilitated labs)

```bash
make setup WORKSHOP=~/code/loop-workshop
make harness LAB=~/code/loop-workshop/atlas-oms
# workshop clone lands in ~/code/loop-workshop/cursor-loop-workshop/
```

## Workshop site

```bash
make site
# http://localhost:3000/cursor-loop-workshop/ — start at /quick-reference
```

**Hosted:** [mrlynn.github.io/cursor-loop-workshop](https://mrlynn.github.io/cursor-loop-workshop/)

## Task corpus

```bash
./scripts/task-prompt.sh --list
make prompt TASK=oms-status-race-001
make loop TASK=oms-status-race-001 ITERS=4
```

| Task | Rung | Use |
|------|------|-----|
| `oms-status-race-001` | 2 | atlas-oms lab |
| `lint-gate-stale-import-001` | 2 | BYO lint pattern |
| `type-narrowing-handler-001` | 1 | BYO mypy pattern |
| `comparison-prompt-baseline-001` | 0 | Arm A demo |

## Releases

- `git tag v0.1.0` — workshop snapshot
- `git tag plugin-v0.1.0` — plugin bundle
- Run `make build-plugin` before tagging plugin releases

## Content status

First-draft — `:::caution VERIFY` blocks need cursor.com/docs confirmation.
