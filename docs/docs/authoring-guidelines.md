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

| Reader                            | Primary sections                                       | What they need                                                              |
| --------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------- |
| Human using in-app `?` help       | Goal, What you need, After you save, Common issues     | Field meaning and decisions, not navigation to the form they are already on |
| MCP-connected agent               | Goal, Examples, Verify, What you need                  | Example prompts, scope, and success signals                                 |
| Website visitor browsing the docs | Goal, What you need, Examples, Verify, What to do next | A clear path from the task to the next step                                 |

**Documentation priority (not product stack priority):**

1. **Goal + Verify** — every page
2. **What you need** — form-backed operations and deploy dialogs
3. **Examples** — example prompts and expected outcomes
4. **After you save / What to do next** — follow-up actions

If an operation is **API-only today** (some webhooks and automation flows), say so upfront and link to the API reference site. Do not invent UI steps.

## 1) Document structure

### Index pages (`index.md`)

- Keep index pages conceptual
- Start with a brief introductory paragraph that explains the concept in plain language
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

### What to do next

- Use `## What to do next` for practical follow-up use cases that help readers avoid common mistakes or choose the right next step
- Keep it short and concrete
- Do not repeat the core `What you need`, `Examples`, `Verify`, or `Common issues` sections

### List and view pages

- Use the same heading set where possible
- Use `## What you see` or `## What you can change` for the main content, then explain what the user sees or can change inside that section

## 2) Intro and frontmatter behavior

- Do not add `intro` in frontmatter. Write page context in the markdown body
- `index.md`: use the first paragraph for one conceptual sentence
- Operation pages: use the first paragraph to state the outcome of the action
- Keep one clear meaning for each core concept:
  - **organization:** top-level workspace for one company, legal entity, or client portfolio
  - **project:** groups environments and resources for one product or client inside an organization
  - **environment:** separate infrastructure setup inside a project (own servers, applications, credentials, pipelines, files, and deploy settings). Names like Development, Staging, and Production are common; dev might use one or two servers while production uses many servers, load balancers, or serverless infrastructure. Deploy to dev first, then promote stable work to staging and production
  - **application:** one git repository (or one folder in a monorepo) connected to one environment, with its own build and deploy settings
  - team
  - role
  - permission
  - etc

### Words for "environment"

Prefer plain phrases that work for non-native English readers:

- **Good:** separate infrastructure setup, isolated space, separate copy of infrastructure, fully independent
- **Avoid:** boundary (abstract), container (conflicts with Docker in DevOps docs)

Use **stage** only when talking about release flow (dev → staging → production), not as the definition of environment.

Optional machine-parseable frontmatter:

| Field                  | Purpose                      | Example              |
| ---------------------- | ---------------------------- | -------------------- |
| `resource_type`        | Canonical Devopness resource | `application`        |
| `operation`            | CRUD or domain verb          | `add`, `deploy`      |
| `required_permissions` | RBAC gate                    | `application:deploy` |

## 3) Voice and first-time clarity

- Lead with a plain-language sentence a first-time reader understands before internal terms
- Use **you** and concrete examples (repo names, branches, stacks) before words like build target or source tree
- On index pages, include an ordered **path to success**, not only a flat link list
- Use **Think of it like this** or a short analogy when a concept is new
- Show stack variety in examples (Node, Python, PHP, Java, Ruby, Go, C#, React, Laravel, etc.) so readers see Devopness is not limited to one PaaS-style runtime
- Separate **Using Devopness MCP** from form guidance so humans on the `?` icon do not feel the page is only for agents
- Prefer encouraging, direct phrasing: "You are done when…" instead of only checklist bullets

### Typical application flow

Do not present **link server to application** as a required step before first deploy.
Recent Devopness versions link servers automatically during first deploy when needed.

Guide readers through:

1. Add application
2. Add configuration files (for example `.env`)
3. Deploy
4. Then branch by app type:
   - Public API or web app → virtual host
   - Private worker or batch job → daemon or cron job (no virtual host required)

## 4) Language rules

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

## 5) Decision and clarity

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

## 6) LLM-friendly format

- Keep sections predictable and clear. Agents and RAG chunk by H2 headings.
- Prefer clarity over extreme brevity. Write enough detail so a newcomer can act without follow-up questions.
- Keep sentences short and direct
- End each operation page with a clear **Verify** section, not `Result` or `Expected result`
- Keep naming, meaning, and sequence consistent across sibling pages
- On `Examples` sections, include a short lead-in like `Try these examples in Devopness MCP:` when it helps the reader
- On `What you need` sections, map UI labels to plain-language descriptions when helpful
- Do not put navigation-only steps at the top of pages used as in-app help

## 7) List style and punctuation

- For short bullet items and checklist items, skip the final period
- Use a period only for full sentences with more than one clause
- Keep list length short
- Start every checklist item with action verbs when possible
- Do not add trailing colons to Markdown headings (`## About:` is invalid style; use `## About`)
- Use colons in prose only when they introduce examples, ranges, or key/value clauses, not as heading punctuation

### Dashes and hyphens

- **Hyphens (`-`)** join compound words: `long-running`, `first-time`, `single-stack`
- **Colons (`:`)** introduce examples or lists after a complete clause:
  - Good: `One environment can host many applications: your API, frontend, worker`
  - Good: `**Application:** Devopness settings for one repo in one environment`
- **Avoid em dashes (`—`)** glued to words without spaces. Readers can misread `applications—your` as one word
- Prefer a colon, period, or parentheses instead of an em dash when adding an explanation or example
- If you use an em dash, put spaces around it: `applications — your API, frontend`
- In numbered steps, put the explanation after the link on a new phrase or use a colon, not an em dash:
  - Good: `1. Add an application: connect your repository to this environment`
  - Avoid: `1. Add an application — connect your repository`

## 8) Minimum checklist (every doc change)

- [ ] one clear outcome in the opening sentence
- [ ] **Verify** section with a concrete success signal
- [ ] **Examples** when an operation is available through MCP, or a brief note when MCP is not available
- [ ] **What you need** section on operation pages, not navigation steps
- [ ] `required_permissions` in frontmatter when the operation is permission-gated
- [ ] one **Common issues** section on operation pages
- [ ] links to next action or next relevant doc
- [ ] no `intro` in frontmatter

## 9) What to include

- Document outcomes and field decisions, not menu paths
- For concept pages, keep enough context for first-time readers and discovery, including practical examples and decision signals
- Add what changes after each action
- Add one practical example for each major concept
- Add MCP prompts that name scope: organization, project, environment, resource names

## 10) What to avoid

- Avoid repeating API validation details already shown by the API or OpenAPI
- Avoid long policy essays in setup guides
- Avoid abstract terms without a concrete example
- Avoid opening form help topics with "navigate to… click Add…"
- Avoid long API blocks on MCP-primary pages. Link to the API reference site instead.

## 11) Canonical location

- This file is the canonical guide for documentation writing
- Keep `/docs/docs/README.md` for frontmatter, markdown, and metadata rules
