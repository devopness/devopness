---
title: Devopness documentation authoring guidelines
---

Devopness docs are used by people deploying infrastructure and apps, and by AI agents connected through the Devopness MCP server.
This guide is for human contributors, including:

- developers
- team leads
- founders

Use this guide for writing style, structure, and clarity across `docs/docs/*`.
It helps keep docs clear for readers and easy to process by documentation tools and AI agents.

## Scope

- Apply this guide to all files under `docs/docs/`
- Goal: clear pages, predictable structure, and outcomes that work in the web app, in MCP sessions, and in automation scripts

## 0) Audiences and interface priority

Devopness has two main surfaces: the web app and MCP.
Organize docs around the task the reader wants to complete, not around Devopness internals.

Write each operation page for three readers:

| Reader                              | Primary sections                                   | What they need                                                               |
| ----------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------- |
| Human using in-app `?` help        | Goal, What you need, After you save, Common issues | Field meaning and decisions, not navigation to the form they are already on  |
| MCP-connected agent                | Goal, Examples, Verify, What you need              | Example prompts, scope, and success signals                                  |
| Website visitor browsing the docs   | Goal, What you need, Examples, Verify, What to do next | A clear path from the task to the next step                                 |

**Documentation priority (not product stack priority):**

1. **Goal + Verify** — every page
2. **What you need** — form-backed operations and deploy dialogs
3. **Examples** — example prompts and expected outcomes
4. **After you save / What to do next** — follow-up actions

If an operation is **API-only today** (some webhooks and automation flows), say so upfront and link to the API reference site. Do not invent UI steps.

## 1) Document structure

### Index pages (`index.md`)

- Keep index pages conceptual
- Make them complete enough for a first-time visitor: what the concept is, when to use it, and how it relates
- Do not make concept pages too short: include a brief introduction plus 2 to 4 bullets that add context, examples, and practical use cases
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

```markdown
## Goal

## Prerequisites

## What you need

## Examples

Try these examples in Devopness MCP:

## After you save

## Verify

## Common issues

## What to do next
```

- Group content by decision and outcome first, not by UI position
- Do not open with numbered navigation steps when the doc is linked from the matching form
- In `## What you need`, say what the reader needs to provide or choose in order to complete the action

### Deploy pages

- Keep `## Verify` tied to observable success, such as completed actions, reachable apps, or updated deployment history
- Keep `## Common issues` anchored to user-visible symptoms, such as a specific landing page or a failed action step
- Keep `## After deploy` when the action naturally leads to a next step, such as adding a virtual host or redeploying after config changes
- Keep any concrete product symptom that users will recognize in the UI or logs
- In follow-up sections, choose one style per line: either a task bullet or a short explanatory note, not both
- When a next step needs a doc link, keep the bullet itself simple and put the link in a separate sentence or note if needed
- Avoid generic page-menu headings like `Details`, `MCP`, and `Next` when a more descriptive phrase fits

### List and view pages

- Use the same heading set where possible
- Use `## What you see` or `## What you can change` for the main content, then explain what the user sees or can change inside that section

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

Optional machine-parseable frontmatter:

| Field                  | Purpose                      | Example              |
| ---------------------- | ---------------------------- | -------------------- |
| `resource_type`        | Canonical Devopness resource | `application`        |
| `operation`            | CRUD or domain verb          | `add`, `deploy`      |
| `required_permissions` | RBAC gate                    | `application:deploy` |

## 3) Language rules

- Use clear verbs: set, create, add, configure, select, verify, confirm, save, deploy
- Avoid abstract jargon and enterprise language
- Use plain English and familiar words
- Avoid awkward wording, overloaded terms, and phrases that sound unnatural in everyday English
- Avoid product-jargon terms that the docs do not otherwise use; prefer the plain user-facing phrase `package manager file` and explain the subfolder when root directory matters
- Use `access` for user-facing outcomes and `permission(s)` for RBAC rules
- Avoid UI position phrases unless they are required by the product design
  - Examples: top bar, upper-right, lower-left
- Keep button labels exactly as they appear in the UI when mentioning them
- Prefer `deploy` when writing actions tied to release, rollout, or platform operations
- Use `ship` only for high-level, product-level outcomes outside UI action language

## 4) Decision and clarity

- Lead with outcomes:
  - what people can do next
  - what changes after the action
  - what to check next
- In `## Goal`, state the result of the action, not the waiting, clicking, or verification steps
- Add decision support where needed:
  - when to start a new project
  - when to split environments
  - when to use one token type vs another
- Keep examples concrete:
  - API, web app, worker, background queue, production flow
- Explain the result before long detail

## 5) LLM-friendly format

- Keep sections predictable and clear. Agents and RAG chunk by H2 headings.
- Prefer clarity over extreme brevity. Write enough detail so a newcomer can act without follow-up questions.
- Keep sentences short and direct
- End each operation page with a clear **Verify** section, not `Result` or `Expected result`
- Keep naming, meaning, and sequence consistent across sibling pages
- On `Examples` sections, include a short lead-in like `Try these examples in Devopness MCP:` when it helps the reader
- On `What you need` sections, map UI labels to plain-language descriptions when helpful
- Do not put navigation-only steps at the top of pages used as in-app help

## 6) List style and punctuation

- For short bullet items and checklist items, skip the final period
- Use a period only for full sentences with more than one clause
- Keep list length short
- Start every checklist item with action verbs when possible
- Do not add trailing colons to Markdown headings (`## About:` is invalid style; use `## About`)
- Use colons in prose only when they introduce examples, ranges, or key/value clauses, not as heading punctuation

## 7) Minimum checklist (every doc change)

- [ ] one clear outcome in the opening sentence
- [ ] **Verify** section with a concrete success signal
- [ ] **Examples** when an operation is available through MCP, or a brief note when MCP is not available
- [ ] **What you need** section on operation pages, not navigation steps
- [ ] `required_permissions` in frontmatter when the operation is permission-gated
- [ ] one **Common issues** section on operation pages
- [ ] links to next action or next relevant doc
- [ ] no `intro` in frontmatter

## 8) What to include

- Document outcomes and field decisions, not menu paths
- For concept pages, keep enough context for first-time readers and discovery, including practical examples and decision signals
- Add what changes after each action
- Add one practical example for each major concept
- Add MCP prompts that name scope: organization, project, environment, resource names

## 9) What to avoid

- Avoid repeating API validation details already shown by the API or OpenAPI
- Avoid long policy essays in setup guides
- Avoid abstract terms without a concrete example
- Avoid opening form help topics with "navigate to… click Add…"
- Avoid long API blocks on MCP-primary pages. Link to the API reference site instead.

## 10) Canonical location

- This file is the canonical guide for documentation writing
- Keep `/docs/docs/README.md` for frontmatter, markdown, and metadata rules
