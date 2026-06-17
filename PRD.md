# PRD — Loop Engineering Framework

| | |
|---|---|
| **Author** | Michael (AI Adoption Engineer, Customer Education — Pillar 3) |
| **Status** | Draft for review |
| **Reviewers** | Niyati (VP, Customer Education); Pillar 3 stakeholders |
| **Last updated** | June 17, 2026 |
| **Related** | `PRD-Cursor-101-Workshop.md`, `atlas-oms` reference repo |

---

## 1. Summary

Most developers adopting Cursor plateau at *prompt mode*: they ask, read the output, judge it themselves, and ask again. They are the feedback loop. The step-change in value comes when the developer hands that loop to the agent — goal in, agent acts, agent reads a machine-checkable signal, corrects, and repeats until done.

This PRD proposes the **Loop Engineering Framework**: a reusable substrate, harness, and measurement layer that lets us *teach* and *prove* agentic loops against traditional prompting. It is the technical backbone for moving developers up the autonomy slider in Cursor 101, hackathons, and Customer Developer Days, and it produces the evidence (loop vs. prompt deltas on a fixed task) that makes the case credible to a skeptical engineering audience.

The core thesis: **a loop is a prompt plus a verifier the agent can iterate against.** The unit of engineering shifts from crafting the prompt to crafting the verifier and the spec. Loop Engineering is the discipline of designing tasks, verifiers, rules, and termination conditions so an agent can reliably close its own feedback loop.

---

## 2. Background & problem

Cursor's product center of gravity has moved from completion to agents — most usage now runs through Agent mode rather than tab. But adoption in the field lags the product: developers reach for one-shot prompting because it is familiar and because the leap to agentic loops feels risky and unmeasurable.

Two gaps block adoption:

1. **No teachable substrate.** Loops only work when the agent has an objective signal to iterate against. Without a verifier, a "loop" is repeated guessing — and agents over-build poorly specified tasks, which burns trust on first contact. We lack a curated set of tasks engineered specifically to make the loop legible.
2. **No evidence layer.** Adoption conversations rely on assertion ("agents are better") rather than data. We cannot currently show a developer the same task solved prompt-only vs. loop, with the deltas in pass rate, iterations, and human touches.

Both gaps are addressable with one framework.

---

## 3. Opportunity & why now

- Agent mode, `.cursor/rules`, Hooks, Auto-review, the Cursor CLI, and Background/Cloud Agents now provide every primitive a disciplined loop needs. The framework assembles existing capability rather than requiring new product surface.
- Pillar 3's north-star metric is **sustained agentic weekly-active users**. The plateau at prompt mode is the single biggest leak in that funnel. A framework that reliably moves developers from prompting to looping is directly upstream of the metric.
- We already have `atlas-oms` — a deliberately aged B2B Order Management System with seeded pain points — which is most of the way to being the substrate. The seeded pain points become loop tasks once we attach verifiers.

---

## 4. Goals & non-goals

**Goals**
- Define and ship a reusable framework that lets a developer *implement* an agentic loop and *measure* it against prompt-only on an identical task.
- Provide a curated, versioned corpus of verifiable tasks built on `atlas-oms`.
- Produce a reproducible comparison harness that logs loop-vs-prompt metrics.
- Package the framework into Cursor 101, train-the-trainer, and challenge-round delivery.

**Non-goals**
- Building new Cursor product features (this composes existing primitives).
- A general-purpose agent benchmark or leaderboard (the measurement arm is a teaching/evidence tool, not a public eval).
- Replacing prompt-based interaction — Tab and Cmd+K remain the right tools for many edits. The framework teaches *when* to escalate to a loop.

---

## 5. Concept: what "Loop Engineering" is

A traditional prompt is one-shot; the human closes the loop. An agentic loop is: **goal → act → observe a machine-checkable signal → correct → repeat until a termination condition.** Agent mode already executes this when it runs commands and tests and iterates on the result.

The framework formalizes four engineering surfaces that determine whether a loop succeeds:

1. **Task** — a well-scoped goal with an unambiguous definition of done.
2. **Verifier** — the objective signal the agent iterates against: a failing test, a type error, a lint gate, a build, or a perf assertion. This is the highest-leverage surface and the thing most developers neglect.
3. **Rules** — the loop discipline, encoded so it is not left to chance (e.g., *after every edit, run the relevant verifier; do not stop until green or blocked*).
4. **Termination & budget** — when to stop: green, blocked, max iterations, or token/time ceiling.

The teaching payload: leverage has moved from prompt-crafting to **verifier-crafting**. Developers who invest in the success criterion get reliable loops; those who don't get expensive guessing.

---

## 6. The framework

Four components, each a deliverable.

### 6.1 Substrate — verifiable task corpus
A versioned set of loop tasks built on `atlas-oms`. Each task ships with:
- a seeded failing state (the pain point),
- a machine-checkable verifier,
- a known-good reference solution,
- a difficulty rung (see §7),
- metadata (domain area, expected iteration count, common failure modes).

### 6.2 Loop harness — turning Agent mode into a disciplined loop
- A `.cursor/rules` set encoding the act→verify→correct→repeat discipline and termination conditions.
- Guardrails via Hooks and Auto-review so unattended loops stay safe (approval gates on destructive commands; contextual slow-down at meaningful boundaries).
- A Cursor CLI wrapper so loop runs are scripted and reproducible across a cohort rather than hand-driven.

### 6.3 Comparison arm — the measurement layer
Holds the task constant and varies only the method:
- **A — Prompt-only**: no verifier execution; human judges output.
- **B — Agent loop**: harness runs the verifier and iterates to green.
- **C — Background/Cloud agent**: the loop run asynchronously.

Each run logs the metrics in §9 to a structured file for side-by-side comparison and cohort aggregation.

### 6.4 Curriculum layer — adoption packaging
- Cursor 101 module: live prompt-vs-loop demo on one `atlas-oms` task.
- Hands-on lab: learner attaches a verifier to a seeded task and runs the loop.
- Train-the-trainer kit: the corpus, harness, and facilitation notes so SEs can deliver it.
- Challenge-round reuse: the same corpus doubles as hiring/skills substrate.

---

## 7. The autonomy ladder (loop rungs)

The framework maps tasks to Cursor's autonomy slider so developers progress deliberately rather than jumping straight to full autonomy and getting burned.

| Rung | Mode | Verifier | Human role |
|---|---|---|---|
| 0 | Prompt-only (Chat / Cmd+K) | none / human eyeballs | closes the loop |
| 1 | Agent mode, supervised | single test file | approves each iteration |
| 2 | Agent mode, loop rules on | test suite + lint | reviews at green |
| 3 | Background / Cloud agent | full verifier + budget | reviews the PR |

Curriculum walks learners up the rungs; the corpus tags each task with the rung it is designed to teach.

---

## 8. Functional requirements

- **FR-1** Each task in the corpus MUST include a runnable verifier that returns an unambiguous pass/fail.
- **FR-2** Each task MUST ship a reference solution and an expected-iteration estimate.
- **FR-3** The harness MUST run a task under all three methods (A/B/C) from a single command.
- **FR-4** The harness MUST log, per run: method, pass/fail, iterations-to-green, human interventions, wall-clock, token cost, and regression count.
- **FR-5** Loop runs MUST honor termination conditions (green, blocked, max iterations, budget ceiling).
- **FR-6** The `.cursor/rules` loop discipline MUST be portable to a learner's own repo with minimal edits.
- **FR-7** Destructive actions MUST pass through approval gates / Auto-review; no task requires disabling safety to complete.
- **FR-8** The corpus MUST be versioned so cohorts run identical task definitions.

---

## 9. Success metrics

**Framework-level (per task, loop vs. prompt):**

| Metric | What it shows |
|---|---|
| Pass@1 | Does the method reach correct on first complete attempt |
| Iterations-to-green | Efficiency of the loop |
| Human interventions | Cognitive load / true autonomy |
| Wall-clock time | Practical speed |
| Token / dollar cost | Economic trade-off (loops cost more model calls) |
| Regression count | Did fixing X break Y |

**Adoption-level (the reason this exists):**
- Movement of workshop participants from Rung 0–1 to Rung 2–3 (pre/post).
- Contribution to **sustained agentic weekly-active users** (Pillar 3 north star), tracked downstream of delivered sessions.

The honest framing for skeptics: loops usually cost more tokens and sometimes more wall-clock; they win decisively on human interventions and on pass rate for tasks with a real verifier. The data should show *both*, so the recommendation is credible.

---

## 10. Users & stories

- **Developer learner** — "As a developer new to agents, I want to see the same task done prompt-only and as a loop so I can judge whether the loop is worth it for my work."
- **Workshop facilitator / SE** — "As a facilitator, I want a versioned corpus and a one-command harness so I can run a reproducible demo without rebuilding it each time."
- **Train-the-trainer SE** — "As an SE enabling others, I want facilitation notes and known failure modes so I can field hard questions."
- **Hiring panel** — "As an interviewer, I want the same tasks as challenge-round substrate so the skills we teach map to the skills we hire for."

---

## 11. Built on (Cursor primitive mapping)

- **Agent mode** — the loop engine (runs commands/tests, iterates).
- **`.cursor/rules`** — encodes loop discipline and termination.
- **Hooks + Auto-review** — guardrails for unattended runs.
- **Cursor CLI** — reproducible, scriptable harness; cohort consistency.
- **Background / Cloud agents + worktrees** — the Rung-3 asynchronous arm.

---

## 12. Milestones

- **V0 — Reference task (1–2 wks):** one `atlas-oms` task with verifier, reference solution, loop rules, and a manual A/B comparison. Proof of concept for review.
- **V1 — Corpus (2–4 wks):** 8–12 tasks across rungs 0–3, versioned.
- **V2 — Harness (parallel with V1):** CLI wrapper, structured metric logging, one-command A/B/C runs.
- **V3 — Curriculum (post-corpus):** Cursor 101 module, hands-on lab, train-the-trainer kit.
- **V4 — Instrument adoption:** wire pre/post rung movement and downstream agentic-WAU tracking.

---

## 13. Risks & mitigations

- **Loops look worse on cost/time and we hide it.** → Report cost and wall-clock honestly alongside the wins; credibility depends on it.
- **Tasks too synthetic to convince enterprise devs.** → Anchor on `atlas-oms`' realistic aged-codebase pain points, not toy katas.
- **Verifier quality varies and skews results.** → Reference solutions and expected-iteration estimates gate task inclusion (FR-2).
- **Safety incidents during unattended loops in workshops.** → FR-7; no task requires disabling guardrails.
- **Framework drifts from product as Cursor ships fast.** → Pin the primitive mapping (§11) per release; treat the corpus as versioned.

---

## 14. Open questions / decisions needed

1. Corpus size and rung distribution for V1 — is 8–12 the right first cut?
2. Where does the comparison-arm metric data live, and is any of it shareable externally (ties to the open data-sharing clause)?
3. Does the Cursor 101 content-ownership boundary cover this framework, or is it a separate asset (pending VP ratification)?
4. Should the measurement arm ever surface externally as a marketing artifact, or stay an internal teaching/evidence tool (current assumption: internal)?

---

## Appendix A — Example loop task spec

```
task_id:        oms-status-race-001
rung:           2
area:           order lifecycle
seeded_state:   concurrent status updates can leave an order in an
                inconsistent state; one integration test is red.
verifier:       pytest tests/order/test_status_transition.py  (must pass)
                + mypy clean + no new lint errors
reference:      patches/oms-status-race-001.patch
expected_iters: 3–5
common_fails:   agent fixes the symptom (the failing assertion) without
                addressing the underlying race; regression appears in
                test_concurrent_fulfilment.
termination:    green AND no regressions; budget 8 iterations / $X tokens.
```

**Loop rule excerpt (`.cursor/rules`):**
> After each edit, run the task verifier. If red, read the failure, form one hypothesis, apply the smallest change that tests it, and re-run. Do not declare done until the verifier is green with no new failures. If blocked for 3 iterations on the same error, stop and summarize.
