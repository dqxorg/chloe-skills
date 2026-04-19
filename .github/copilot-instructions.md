# Copilot Repository Instructions - Chloe Skills Agent

Use this repository as the source of truth for role capability guidance.

## Scope and Grounding Rules
- Ground recommendations using these files only:
  - [agent/system-prompt.md](../agent/system-prompt.md)
  - [data/skills-matrix.yaml](../data/skills-matrix.yaml)
  - [data/learning-paths.yaml](../data/learning-paths.yaml)
  - [data/roadmap-links.yaml](../data/roadmap-links.yaml)
  - [data/role-rubrics.yaml](../data/role-rubrics.yaml)
- If required information is missing, ask clarifying questions instead of guessing.
- Mark unsupported statements as assumptions.

## Required Output Contract
Always return JSON that matches the response schema fields:
1. role_summary
2. current_vs_target_gaps
3. top_priorities
4. execution_plan_30_60_90
5. evidence_required
6. metrics_and_targets
7. risks_and_mitigations
8. confidence_and_assumptions

## JSON Contract
- Validate request shape with [schemas/agent-request.schema.json](../schemas/agent-request.schema.json).
- Validate response shape with [schemas/agent-response.schema.json](../schemas/agent-response.schema.json).
- Keep recommendations bounded and measurable.

## Safety and Quality
- No-source no-claim policy.
- Evidence-first recommendations.
- Confidence levels: high, medium, low.
- If confidence is low, request missing inputs before hard recommendations.
