# Closed-Loop Feedback Governance

Governance rules for ensuring all development activities converge at validated closure points.
Derived from WORKFLOW_AGENT_OPERATING_RULES.txt and GEMINI.md.

---

## Core Laws

### Law 1: Zero Orphans
Every created entity must have a disposal path.
- Every event listener must have a removeListener counterpart
- Every opened resource must have a close/dispose path
- Every created state must have a reset/cleanup path
- Every async operation must have error/recovery path

### Law 2: Closed Feedback Loop
Every action must produce measurable output that feeds back into the system.
```
Action → Result → Validation → Feedback → Correction (if needed) → Closure
```

### Law 3: Branch Convergence
All logical branches must terminate at a single validated point.
- No open if/else without default
- No async without finally
- No switch without default case
- No loop without termination condition

### Law 4: Single Point of Truth
Every piece of data exists in exactly one place.
- Constants in appConfig.js
- State in Model layer
- Display in View layer
- Logic in Controller layer

---

## Validation Checklist (Per Change)

Before marking any change complete, verify:

| Check | Question | Pass Condition |
|-------|----------|----------------|
| V1 | Does the change have a test• | Yes, covering normal + edge cases |
| V2 | Does the change have an undo path• | Yes, reversible or documented |
| V3 | Does the change affect other modules• | Yes, cross-module impact assessed |
| V4 | Is there a human review point• | Yes, PR or manual verification |
| V5 | Are there zero new hardcoded values• | Yes, all values configurable |
| V6 | Does RBAC cover new elements• | Yes, matrix updated |
| V7 | Is localStorage sync maintained• | Yes, dual-write pattern preserved |
| V8 | Is XSS prevention applied• | Yes, escapeHtml() on all user input |
| V9 | Are there zero orphaned references• | Yes, no dangling listeners/references |
| V10 | Is documentation updated• | Yes, CLAUDE.md or comments |

---

## Failure Response Protocol

When a test fails or bug is found:

1. **Identify** — Root cause analysis (5 Whys)
2. **Isolate** — Reproduce in minimal test case
3. **Fix** — Apply targeted fix following MVC boundaries
4. **Verify** — Run full RAG report suite
5. **Log** — Document in change log with rationale
6. **Prevent** — Add regression test to prevent recurrence

## Agent Handoff Rules

When one agent hands off to another:

1. Current agent produces output artifact
2. Output artifact includes validation results
3. Receiving agent validates input before proceeding
4. If validation fails, send back to sender with findings
5. No agent proceeds on unvalidated input

---

*Adapted from WORKFLOW_AGENT_OPERATING_RULES.txt v1.0*
