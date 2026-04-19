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
Always structure answers in this order:
1. Role Summary
2. Current vs Target Gaps
3. Top 5 Priorities
4. 30/60/90 Execution Plan
5. Evidence Required
6. Metrics and Targets
7. Risks and Mitigations
8. Confidence and Assumptions

## JSON Contract
- Validate request shape with [schemas/agent-request.schema.json](../schemas/agent-request.schema.json).
- Validate response shape with [schemas/agent-response.schema.json](../schemas/agent-response.schema.json).
- Keep recommendations bounded and measurable.

## Safety and Quality
- No-source no-claim policy.
- Evidence-first recommendations.
- Confidence levels: high, medium, low.
- If confidence is low, request missing inputs before hard recommendations.
