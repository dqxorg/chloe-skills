# Chloe Skills Agent Usage Playbook

Goal: make your AI consistently act using your role-based skill framework, reduce hallucination risk, and stay customizable.

## 1) Load Order (Most Important)
Use this order when building your AI agent context:
1. System policy: `agent/system-prompt.md`
2. Skills knowledge: `data/skills-matrix.yaml`
3. Roadmap references: `data/roadmap-links.yaml`
4. Learning execution plans: `data/learning-paths.yaml`
5. Evaluation rubric: `data/role-rubrics.yaml`

Why: this gives stable behavior first, then facts, then execution guidance, then scoring criteria.

## 2) Recommended Agent Pipeline
For each user request, force your orchestrator to run this pipeline:
1. Intent parse
- Extract target role, seniority, business goal, timeline, constraints.

2. Role grounding
- Load only matching role section from skills matrix, learning paths, roadmap links, and rubric.
- If role data is missing, return clarification request instead of guessing.

3. Gap analysis
- Compare current skills (user evidence) vs expected role competencies.
- Rank top 5 gaps by business impact and risk.

4. Plan generation
- Produce 30/60/90 plan from learning-paths.
- Add concrete deliverables and measurable KPIs.

5. Evidence check
- Map each recommendation to rubric evidence.
- If no evidence path exists, label recommendation as low confidence.

6. Safety and confidence gate
- Add confidence score: high, medium, low.
- Add assumptions list.
- Add unknowns list.

7. Response output
- Return structured output template only (avoid free-form long answers unless asked).

## 3) Output Contract (Use Every Time)
Require AI output in this strict structure:
1. Role Summary
2. Current vs Target Gaps
3. Top 5 Priorities
4. 30/60/90 Execution Plan
5. Evidence Required
6. Metrics and Targets
7. Risks and Mitigations
8. Confidence and Assumptions

## 4) Anti-Hallucination Controls
Apply these controls in your orchestrator:
1. Retrieval-only role facts
- The model can use only retrieved role sections from your YAML files.

2. No-source no-claim rule
- If a claim cannot be linked to the loaded files, mark it as assumption.

3. Confidence threshold rule
- If confidence is low, do not provide hard recommendation. Ask for missing inputs first.

4. Evidence-first recommendation rule
- Every suggested action must include expected proof artifact.

5. Bounded suggestions
- Maximum 5 priorities, 3 risks, and 3 KPIs per response.

## 5) Customization Model
You can customize without changing prompt behavior:
1. Add or edit competencies in `data/skills-matrix.yaml`
2. Adjust learning sequencing in `data/learning-paths.yaml`
3. Update roadmap references in `data/roadmap-links.yaml`
4. Tighten assessment rigor in `data/role-rubrics.yaml`

Tip: keep role keys consistent across all YAML files.

## 6) Recommended Runtime Prompt Wrapper
Use this wrapper in your app as a developer message:

You are Chloe Skills Agent.
Always ground role advice using the provided role YAML files.
Never invent competencies, certifications, or standards not present in context.
If required context is missing, ask targeted clarification questions before advising.
Return output in the 8-section output contract.
Include confidence, assumptions, unknowns, and evidence required.

## 7) Example Runtime Input
Use this as user input shape for stable results:
- target_role: AI Engineer
- current_level: intermediate
- team_stack: Python, AWS, PostgreSQL
- business_goal: reduce support ticket volume by 25 percent
- timeline: 90 days
- constraints: no new headcount, moderate budget
- current_evidence: two production automations, no model monitoring yet

## 8) Quality Checklist (Before Returning Response)
Your orchestrator should validate:
1. Role exists in all required YAML files
2. Output has all 8 required sections
3. At least 3 measurable metrics present
4. All recommendations include evidence artifacts
5. Confidence is stated and justified

## 9) Maturity Upgrade Path
When ready, expand to:
1. Role-specific certification mapping
2. Auto scoring service from role-rubrics
3. Team-level capability heatmap
4. Quarterly workforce planning reports
