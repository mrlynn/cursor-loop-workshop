---
title: Metrics and Evidence
description: Interpret pass rate, iterations, interventions, cost, and regressions for adoption decisions
---

# Metrics and Evidence

Metrics turn facilitation into evidence. Adoption-level success is rung movement (0–1 → 2–3), not one demo applause moment.

## Why this matters

Pillar 3 north star: sustained agentic weekly-active users. The comparison arm is upstream of that funnel. Framework metrics explain *why* a team should invest in verifier-crafting; adoption metrics prove the workshop worked.

## What you'll learn

- You can interpret each metric in §9 without over-claiming
- You can build a one-slide "honest comparison" for stakeholders
- You can track pre/post rung self-assessment per cohort
- You can explain when loops are not worth the cost

## How it works

**Per-run metrics (log every arm):**

```json
{
  "pass_at_1": false,
  "iterations_to_green": 4,
  "human_interventions": 0,
  "wall_clock_seconds": 312,
  "token_cost_usd": null,
  "regression_count": 1
}
```

**When loops win (typical):**

- Higher pass rate on tasks with real verifiers
- Fewer human interventions during execution
- Repeatable cohort results (FR-8 versioning)

**When loops lose (report anyway):**

- Higher token spend (more model calls per iteration)
- Sometimes higher wall-clock on simple tasks
- Up-front cost of verifier authoring

**Adoption metrics (V4):**

- Pre/post rung self-assessment
- Downstream agentic WAU (org analytics, not in workshop repo)

## When to use this

| Metric | Decision it informs |
|--------|---------------------|
| Human interventions | "Can I walk away during execution?" |
| Pass@1 | "Do I need the loop or is one good prompt enough?" |
| Iterations-to-green | Facilitator task difficulty tuning |
| Regression count | Verifier quality / agent discipline |
| Token cost | Budget approval for rung 2–3 default |

## Step-by-step

1. Collect `loop-runs/**/*.json` after session.
2. Aggregate by `task_id` and `method`.
3. Compute pass rate, mean iterations, mean interventions.
4. Add token/wall-clock if available from org dashboard.
5. Build honest summary table — include where A wins on speed.
6. Survey learners: rung before vs after (0–3 scale).
7. File facilitator notes: common_fails observed.

## Example

Stakeholder one-pager (template):

```text
Task: oms-status-race-001 (n=24 learners)

Prompt-only (A):  29% pass  | 4.1 avg human steps
Agent loop (B):   71% pass  | 0.5 avg human steps | 3.9 avg iterations
Cost:            B used ~35% more tokens than A

Recommendation: Use loops for verifiable maintenance tasks;
keep prompt mode for exploration and one-liner edits.
```

## Common mistakes

### Single demo as proof
**Symptom:** One lucky B run; no aggregate.  
**Fix:** Versioned tasks + cohort logs.

### Ignoring regression_count
**Symptom:** Green headline, broken suite in prod.  
**Fix:** Regression gate in termination; metric in every B/C log.

### No pre/post rung survey
**Symptom:** Cannot show adoption movement.  
**Fix:** V4 instrumentation — 30-second ladder self-assess.

:::tip Official Docs
[Usage](https://cursor.com/docs/account/pricing)
:::

## Checklist

- [ ] All runs logged in FR-4 schema
- [ ] Aggregation includes cost and failures
- [ ] Stakeholder summary uses honest framing
- [ ] Pre/post rung captured if V4 enabled

<KnowledgeCheck
  courseId="loop-engineering"
  quizId="measure-quiz"
  questions={[
    {
      id: 'q1',
      prompt: 'Loops most often win decisively on which metric?',
      options: [
        { id: 'a', label: 'Lowest token cost' },
        { id: 'b', label: 'Fastest wall-clock always' },
        { id: 'c', label: 'Human interventions and pass rate with a real verifier' },
        { id: 'd', label: 'Fewest lines of code changed' },
      ],
      correctId: 'c',
      explanation:
        'PRD §9 honest framing: loops may cost more tokens; they win on autonomy and pass rate when verifiers are real.',
    },
  ]}
/>

## Next Steps

Continue to [Hands-on Labs →](../hands-on-labs/overview)
