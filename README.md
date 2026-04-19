# Chloe Skills Agent

AI-ready skill framework for IT organizations.

This repository contains a role-based skills intelligence pack that can be used by an AI agent to:
- assess role readiness,
- generate learning plans,
- suggest projects,
- identify gaps and upskilling priorities.

## Covered Roles (Minimal Set)
- Software Engineer
- Product Owner / Product Manager
- Business Enablement
- Quality Assurance
- UI/UX Designer
- IT Infrastructure
- Network & Security
- Database Administrator
- Database Engineer
- AI Engineer

## Repository Structure
- `agent/system-prompt.md`: system prompt for the skills agent
- `data/skills-matrix.yaml`: role-based competencies, tools, and proficiency targets
- `data/roadmap-links.yaml`: roadmap.sh-aligned role and topic links
- `data/learning-paths.yaml`: 30-60-90 day onboarding and upskilling plans
- `examples/sample-requests.md`: example prompts for HR, managers, and ICs

## Suggested Additional Roles
To make this more complete for most IT organizations:
- DevOps / SRE
- Cloud Engineer
- IT Support / Service Desk
- Data Analyst
- Security Operations (SOC)

## How To Use
1. Load `agent/system-prompt.md` as system instructions in your AI platform.
2. Provide `data/skills-matrix.yaml`, `data/roadmap-links.yaml`, and `data/learning-paths.yaml` as reference context.
3. Ask role-specific questions using examples from `examples/sample-requests.md`.

## Example Outcomes
- Skill gap report for a specific employee and target role.
- Quarter-based team upskilling plan.
- Learning roadmap aligned to roadmap.sh topics.
- Hiring rubric for each role.

## Notes
- Skills are roadmap.sh-aligned where possible and complemented with practical enterprise requirements.
- This repository is intentionally lightweight and can be expanded into a full competency platform.
