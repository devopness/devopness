# Devopness documentation

Devopness maintains its documentation in an open source repository, so feel free to contribute to this project!

# Contribution guidelines

Make sure all files created in this folder adhere to the following basic rules:

1. Are defined as `Markdown` files (.md)
2. Use front matter headers, see the list of available headers in [this topic](#predefined-variables)
3. **DO NOT** set heading level one (a single `#` in `Markdown` content), as it is reserved for the documentation article title. Headings inside the documentation article content must start from heading level two (`##`). Please refer to [Markdown basic syntax](https://www.markdownguide.org/basic-syntax/#headings) for examples and detailed instructions
4. **DO NOT** use `HTML` tags in `Markdown` content

# Documentation authoring guidelines

Use `docs/docs/authoring-guidelines.md` for writing structure, voice, and operational-vs-concept page conventions.

# Sidebar navigation (`meta.json`)

The docs site uses [Fumadocs page conventions](https://www.fumadocs.dev/docs/page-conventions) to build the sidebar from `meta.json` files.

## Root menu (`docs/docs/meta.json`)

The root `meta.json` defines top-level sidebar sections and folder order. Section labels use Fumadocs separators:

```json
"---Getting Started---"
```

Current sections:

| Section | Purpose |
| --- | --- |
| **Getting Started** | Linear first-setup path (org → project → environment → credential → app → file → deploy) plus the main index page |
| **Platform** | Org hierarchy and access (organizations, projects, environments, teams, roles, users) |
| **Applications & Deploy** | Shipping code and runtime exposure (applications, pipelines, files, variables, webhooks, virtual hosts, daemons, cron jobs) |
| **Infrastructure** | Servers, credentials, networking, SSL, resource links |
| **Operations** | Actions (deploy history, debugging) |
| **API & MCP** | MCP, API reference, API tokens |
| **Legal** | Security and legal pages |
| **Contributing** | Authoring guidelines for contributors |

You do **not** need separate sidebar sections such as Introduction, Quick Start, or Basics:

- **`index.md`** is the introduction and product overview
- **Getting Started** in `meta.json` is the quick-start path (specific operation pages in setup order)
- **Concept pages** (`<resource>/index.md`) under each folder are the “basics” for that resource
- **Operation pages** (`add-*`, `deploy-*`, etc.) are the task guides

Adding Introduction / Quick Start / Basics as separate nav sections would duplicate those roles and make the sidebar longer without helping readers.

When you add a new top-level folder under `docs/docs/`, add it to the root `meta.json` in the section where it belongs. Do not rely on alphabetical auto-discovery once `pages` is defined: unlisted folders will not appear in the sidebar.

## Folder `meta.json` (subdirectories)

Create `meta.json` inside a folder when **page order matters** or **alphabetical order is misleading**.

### Create a folder `meta.json` when

- The folder has several sibling pages and readers should follow a task order (for example `index` → `add-*` → `deploy-*` → `edit-*` → `remove-*`)
- Alphabetical order would put advanced or rare pages before common ones (for example `integrate-*` before `add-*`)
- The folder contains subfolders that need a defined order (for example `pipelines/steps`, `api-tokens/personal-access-tokens`)
- You want to deprioritize secondary pages (for example keep `list-*` and `view-*` after primary operations)

### Skip a folder `meta.json` when

- The folder has only an `index.md` or one operation page
- Alphabetical order is already good enough (for example `legal/`)
- You are fine with Fumadocs default discovery for that folder

### Conventions for folder `meta.json`

1. Put `index` first when the folder has an index page
2. Prefer task order over CRUD alphabet: add → list → view → edit → remove → domain-specific ops (`deploy-*`, `archive-*`, `link-*`)
3. List every page and subfolder you want visible. When `pages` is set, unlisted items are hidden
4. Do not list the same page URL in more than one `meta.json` tree (Fumadocs forbids duplicates)
5. Use paths without file extensions (`add-application`, not `add-application.md`)
6. Optional fields: `title` (folder label in sidebar), `defaultOpen`, `icon` — see Fumadocs docs

Example (`docs/docs/applications/meta.json`):

```json
{
  "pages": [
    "index",
    "add-application",
    "list-applications",
    "view-application",
    "edit-application",
    "deploy-application",
    "link-server-to-application",
    "deploy-application-using-incoming-hook",
    "integrate-application-deployments-to-ci-workflows"
  ]
}
```

After changing any `meta.json`, run `npm run dev` or `npm run build` locally and confirm the sidebar order.

## Predefined variables

Here is a list of predefined variables that can be set in the `front-matter` block of a documentation topic:

| Variable               | Description                              | Required |
| ---------------------- | ---------------------------------------- | -------- |
| `title`                | The title of the documentation topic     | Yes      |
| `description`          | Page meta description                    | No       |
| `pagination_prev`      | Previous link in pagination              | No       |
| `pagination_next`      | Next link in pagination                  | No       |
| `links.related`        | Related links to other topics            | No       |
| `required_permissions` | Required permissions to follow the steps | No       |

Links represent a relative path to the documentation root (`/docs`) without the file extension, e.g. `actions/view-action` represents `/docs/actions/view-action.md` file.

For more details on available frontmatter options, see the [Fumadocs MDX documentation](https://www.fumadocs.dev/docs/mdx).

### Deprecated Variables

The following variables are deprecated and are currently being transformed by our configuration. Here's how to migrate:

#### `intro`

**Why**: Content should be part of the main document body, not frontmatter.

Before:

```yaml
---
title: My Document
intro: This is an introduction to my document
---
```

After:

```yaml
---
title: My Document
---
This is an introduction to my document
```

#### `links.previous` and `links.next`

**Why**: Use standard pagination variables.

Before:

```yaml
---
title: My Document
links:
  previous: getting-started
  next: advanced-usage
---
```

After:

```yaml
---
title: My Document
pagination_prev: getting-started
pagination_next: advanced-usage
---
```

## Mentioning Other Posts

You can reference other documentation pages using the markdown reference link syntax: `[/docs/<id>]`. By default, the `id` is the "file path (including folders, without the extension)", e.g. `/docs/pipelines/run-pipeline.md` becomes `[/docs/pipelines/run-pipeline]`.

The `/docs/` prefix is required to differentiate between internal links and external links. This syntax is supported by the `remarkMentionLink` plugin (see `src/plugins/remark-mention-link.ts`), which automatically generates link text from the file path.

Examples:

```markdown
<!-- docs/virtual-hosts/edit-virtual-host.md -->

Follow the guide [/docs/virtual-hosts/edit-virtual-host]
```

```markdown
<!-- docs/users/subscriptions/faq/index.md -->

3. In environments using custom [/docs/roles/index] in their [/docs/environments/team-memberships/index], the membership will be updated to use the role “Read”, converting all users to read-only users.
```

This reference will be automatically converted into clickable links, using the post title as the link text.

## How to use Admonitions

Admonitions are a way to highlight important information in your documentation. They are a great way to call out important information, warnings, or tips.

To use admonitions, you can use the following syntax:

```markdown
:::note

This is the content of the note.

:::
```

To learn more about admonitions, you can check the [Fumadocs Remark Admonition documentation](https://www.fumadocs.dev/docs/headless/mdx/remark-admonition).
