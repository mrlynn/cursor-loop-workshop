---
title: Termination and Budget
description: Define when loops stop — green, blocked, or budget ceiling — before the first edit
---

# Termination and Budget

An infinite loop is a billing incident. Termination conditions are part of the task spec, encoded in `@loop-termination`, and non-negotiable for workshop safety (FR-5, FR-7).

## Why this matters

Skeptics ask "what stops it from going forever?" If you cannot answer with concrete budgets, they stay on prompt mode. Honest cost reporting — iterations, tokens, wall-clock — builds credibility when loops win on pass rate and human interventions.

## What you'll learn

- You can define four stop conditions: green, blocked, max iterations, budget ceiling
- You can configure the `@loop-termination` rule for your repo
- You can log when a loop stopped and why (success vs blocked vs budget)
- You can explain regression count as a first-class metric

## How it works

**Green:** All verifiers and regression gates pass. Agent summarizes diff and iteration count.

**Blocked:** Same verifier error for 3 iterations with no change in failure mode. Agent stops and requests human decision — does not burn remaining budget.

**Max iterations:** Hard cap (e.g., 8). Agent reports best partial state and remaining errors.

**Budget ceiling:** Token or wall-clock limit for rung 3 / background runs.

Regression handling: if a fix breaks a previously passing test, the loop is **not** green. Count it in `regression_count` for measurement.

## When to use this

| Stop type | Typical threshold | Facilitator action |
|-----------|-------------------|-------------------|
| Green | All gates pass | Review diff, log metrics |
| Blocked | 3× same error | Pause cohort, discuss hypothesis |
| Max iter | 8 (workshop default) | Compare to `expected_iters` |
| Token ceiling | Org policy | Re-arm with higher budget if justified |

## Step-by-step

1. Add `termination:` block to task YAML (see Loop Fundamentals overview example).
2. Confirm `@loop-termination` rule is in `.cursor/rules/`.
3. In Agent prompt, repeat budget: "Stop after 8 iterations or if blocked 3× on same error."
4. During loop, track iteration count manually or via harness logs.
5. At stop, record stop reason in `loop-runs/<task_id>.json`.
6. Debrief: blocked loops are teaching moments — review verifier and hypothesis quality.

## Example

`@loop-termination` rule excerpt (committed in workshop repo):

```markdown
If the **same error** persists for 3 consecutive iterations with no progress:
1. Stop editing.
2. Summarize: what you tried, what the verifier still reports.
3. Do not burn the iteration budget on repeated guessing.
```

Metric log snippet:

```json
{
  "task_id": "oms-status-race-001",
  "stop_reason": "green",
  "iterations_to_green": 4,
  "regression_count": 1,
  "human_interventions": 0
}
```

## Common mistakes

### Declaring green on primary only
**Symptom:** Lint or sibling tests fail; facilitator catches in review.  
**Fix:** Termination requires **all** gates in task spec.

### Extending budget silently
**Symptom:** Learners think loops are "unbounded money."  
**Fix:** Visible iteration counter; facilitator announces extensions.

### Ignoring regressions
**Symptom:** Pass rate looks good; quality debt hidden.  
**Fix:** Increment `regression_count`; loop continues until suite green.

:::tip Official Docs
Usage and limits: [cursor.com/docs/account/pricing](https://cursor.com/docs/account/pricing)
:::

## Checklist

- [ ] Task spec includes termination block
- [ ] `@loop-termination` rule deployed
- [ ] Workshop default budget communicated (8 iterations)
- [ ] Stop reason logged per run
- [ ] Regression count tracked

<KnowledgeCheck
  courseId="loop-engineering"
  quizId="lf-termination-quiz"
  questions={[
    {
      id: 'q1',
      prompt: 'When should a rung-2 loop declare success?',
      options: [
        { id: 'a', label: 'When the primary test passes' },
        { id: 'b', label: 'When the agent says it is done' },
        { id: 'c', label: 'When all verifiers and regression gates pass' },
        { id: 'd', label: 'When max iterations is reached' },
      ],
      correctId: 'c',
      explanation:
        'Termination requires full task spec gates — primary verifier plus any regression gates.',
    },
  ]}
/>

## Next Steps

Continue to [Rules & Skills →](../rules-and-skills/overview)
