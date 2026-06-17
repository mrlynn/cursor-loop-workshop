# Loop Engineering — Cursor Plugin

Distributable harness: rules, skills, and slash commands for verifier-driven agentic loops.

## Install locally (dev)

From workshop repo root:

```bash
make build-plugin && make install-plugin
```

Restart Cursor → **Settings → Plugins** → enable **Loop Engineering**.

## What's included

| Asset | Items |
|-------|--------|
| Rules | `loop-discipline`, `loop-termination`, `loop-safety` |
| Skills | `loop-engineering`, `verifier-crafting`, `run-comparison`, `byo-loop-task` |
| Commands | `/loop-task`, `/loop-compare`, `/loop-verify`, `/byo-loop-task` |

## Usage in any repo

1. Enable the plugin (rules/skills/commands load globally or per policy).
2. Open your repo in Cursor.
3. `@loop-discipline @loop-termination` + `/loop-engineering` with a verifier.
4. Or `/byo-loop-task` to scaffold from your failing test.

For project-local copy (no plugin): `./scripts/copy-harness.sh /path/to/repo`

## Publish to marketplace

:::caution VERIFY
Confirm current publish flow at cursor.com/docs/plugins before submitting.
:::

Typical steps:

1. `./scripts/build-plugin.sh` — sync `.cursor/` → `plugin/`
2. Tag release: `git tag plugin-v0.1.0`
3. Submit `plugin/` directory or repo subpath via Cursor marketplace publish UI
4. Post-install CTA: run `/loop-verify` or read `BYO.md`

## Sync source of truth

- **Edit** harness in `.cursor/` at repo root
- **Build** plugin bundle: `./scripts/build-plugin.sh`
- Do not hand-edit `plugin/rules` without syncing back

## Changelog

### 0.1.0

- Initial plugin: 3 rules, 4 skills, 3 commands
- BYO loop task skill
- Workshop corpus task `oms-status-race-001`
