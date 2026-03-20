---
title: Devopness documentation authoring guidelines
---

Devopness docs are used by people deploying infrastructure and apps, and by AI agents that support that work.
This guide is for human contributors and LLMs, including:

- developers
- team leads
- founders

## For LLMs

- Use this document as the source of truth for style and structure before suggesting edits.
- Keep edits minimal and local: one section at a time and only what the task asks for.
- Preserve headings and section order so downstream pages keep stable structure.
- Use the docs mention-link syntax for internal documentation links so titles are resolved by Fumadocs:
  - `[/docs/organizations/index]`
  - `[/docs/projects/add-project]`
- Use normal markdown links only for external URLs.
- Prefer human-friendly language: clear, short sentences with practical meaning, not only machine-parseability.

Use this guide for writing style, structure, and clarity across `docs/docs/*`.
It helps keep docs clear for readers and easy to process by documentation tools and AI agents.

## Scope

- Apply this guide to all files under `docs/docs/`
- Goal: clear pages, faster scanning, and predictable outcomes

## 1) Document structure

### Index pages (`index.md`)

- Keep index pages conceptual
- Make them complete enough for a first-time visitor: what the concept is, when to use it, and how it relates
- Do not make concept pages "too short": include a brief introduction + 2-4 bullets that add context, examples, and practical use cases
- Recommended sections:
  - About
  - Who this is for
  - Why this exists
  - Relationship to other concepts
  - Start here / Next
- Do not use procedural `Goal`, `Steps`, or `Common issues` on index pages

### Operation pages (`add-*`, `edit-*`, `list-*`, `view-*`, `archive-*`, `deploy-*`, etc.)

- Keep operation pages outcome-driven
- Recommended sections:
  - Goal (or About)
  - Who should use this
  - You need
  - Steps
  - Expected result
  - Common issues
  - Next
- Group steps by decision and outcome first, not by UI positions

## 2) Intro and frontmatter behavior

- Do not add `intro` in frontmatter. Write page context in the markdown body
- `index.md`: use the first paragraph for one conceptual sentence
- Operation pages: use the first paragraph to state the outcome of the action
- Keep one clear meaning for each core concept:
  - organization
  - project
  - environment
  - team
  - role
  - permission
  - etc

## 3) Language rules

- Use clear verbs: set, create, add, configure, select, verify, confirm, save
- Avoid abstract jargon and enterprise language
- Use plain English and familiar words
- Use `access` for user-facing outcomes and `permission(s)` for RBAC rules
- Avoid UI position phrases unless they are required by the product design
  - Examples: top bar, upper-right, lower-left
- Keep button labels exactly as they appear in the UI
- Prefer `deploy` when writing actions tied to release, rollout, or platform operations
- Use `ship` only for high-level, product-level outcomes outside UI action language

## 4) Decision and clarity

- Lead with outcomes:
  - what people can do next
  - what changes after the action
  - what to check next
- Add decision support where needed:
  - when to start a new project
  - when to split environments
  - when to use one token type vs another
- Keep examples concrete:
  - API, web app, worker, background queue, production flow
- Explain the result before long detail

## 5) LLM-friendly format

- Keep sections predictable and clear
- Prefer clarity over extreme brevity; write enough detail so a newcomer can act without asking follow-up questions
- Keep sentences short and direct
- End each operation page with a clear expected result
- Keep naming, meaning, and sequence consistent across sibling pages

## 6) List style and punctuation

- For short bullet items and checklist items, skip the final period
- Use a period only for full sentences with more than one clause
- Keep list length short
- Start every checklist item with action verbs when possible
- Do not add trailing colons to Markdown headings (`## About:` is invalid style; use `## About`)
- Use colons in prose only when they introduce examples, ranges, or key/value clauses, not as heading punctuation

## 7) Minimum checklist (every doc change)

- [ ] one clear outcome
- [ ] simple words for core concepts
- [ ] one verification sentence
- [ ] one common issues section on operation pages
- [ ] links to next action or next relevant doc

## 8) What to include

- Document user tasks and outcomes, not menu paths
- For concept pages, keep enough context for first-time readers and discovery (including practical examples and decision signals)
- Add what changes after each action
- Add one practical example for each major concept
- Add what to verify after the action

## 9) What to avoid

- Avoid repeating API validation details already shown by the API
- Avoid long policy essays in setup guides
- Avoid abstract terms without a concrete example

## 10) Canonical location

- This file is the canonical guide for documentation writing
- Keep `/docs/docs/README.md` for frontmatter, markdown, and metadata rules
