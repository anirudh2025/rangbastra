# RANGBASTRA.LUXURY

# AGENTS

Version: 2.0  
Status: AI Entry Point  
Owner: Anirudh

---

## Purpose

This file defines how AI agents should work inside the Rangbastra repository.

It applies to Codex, ChatGPT, Copilot, Claude, Cursor and future AI development tools.

AI must never treat this repository as a normal website project.

Rangbastra is a luxury couture ecosystem built with the Cloutora Luxury Framework.

---

## First Rule

Before making meaningful changes, read:

1. `README.md`
2. `CLOUTORA.md`
3. Project documentation / knowledge files
4. Current task requirements
5. Existing code related to the task

Never guess architecture.

Never bypass documentation.

---

## Source of Truth

Priority order:

1. Founder Intent
2. Project Documentation
3. Design System
4. Development Rules
5. Existing Codebase
6. Current User Request
7. AI Suggestions

If documentation and request conflict, explain the conflict before acting.

---

## Protected Systems

Do not fundamentally change these without explicit founder approval:

- Architecture
- Design System
- Foundation Tokens
- Brand Identity
- Performance Standards
- Accessibility Standards
- Documentation Structure

Improve them carefully.

Never casually replace them.

---

## Execution Flow

Every AI task should follow:

Understand

↓

Inspect

↓

Plan

↓

Implement

↓

Review

↓

Optimize

↓

Recommend Documentation Update

Do not jump directly to code.

---

## Development Rules

Always:

- Reuse existing components before creating new ones.
- Use design tokens instead of hardcoded values.
- Keep one responsibility per file.
- Preserve accessibility.
- Preserve performance.
- Preserve responsiveness.
- Keep code readable.
- Keep architecture scalable.

Never:

- Add random colors.
- Add random spacing.
- Duplicate systems unnecessarily.
- Create oversized components.
- Hardcode repeatable business content.
- Ignore reduced motion.
- Sacrifice Lighthouse quality.
- Introduce technical debt for speed.

---

## Design Rules

Rangbastra should feel:

- Luxury
- Editorial
- Cinematic
- Minimal
- Timeless
- Confident
- Personal

Luxury comes from restraint.

Whitespace is a design element.

Typography leads the experience.

Motion must be intentional.

Nothing should feel template-like.

---

## Implementation Output

When editing files directly:

Return:

- Files changed
- Summary
- Important trade-offs
- Developer Control Guide when visual controls are introduced

Do not print huge code blocks unless direct editing is unavailable.

---

## Documentation Rule

If a decision becomes permanent, recommend updating:

- Architecture Decision Record
- Changelog & Evolution
- Relevant project documentation

Nothing important should exist only inside chat history.

---

## Dev Server

Use background mode when starting Astro locally:

```bash
astro dev --background
```

## Security Guardrails

- Run `npm run security` before release; secret, bundle, build, or high-severity dependency failures block release.
- Only `PUBLIC_*` publishable values may enter browser code. Service-role, provider, webhook, and database credentials are server-only and must never be logged.
- Every exposed database object requires explicit least-privilege grants, RLS in the same migration, and positive/negative cross-user tests.
- Client-side UI state is not authorization. Protected customer/operator functionality requires server-validated sessions and no-store responses.
- Uploads require byte/count limits, signature allowlists, private randomized storage, and an explicit malware/quarantine decision.
- Security-sensitive changes must update the security architecture, checklist, and dated audit or ADR.
