# Devopness documentation
Devopness maintains its documentation in an open source repository, so feel free to contribute to this project!

# Contribution guidelines
Make sure all files created in this folder adhere to the following basic rules:
1. Are defined as `Markdown` files (.md)
2. Use front matter headers, see the list of available headers in [this topic](#predefined-variables)
3. **DO NOT** set heading level one (a single `#` in `Markdown` content), as it is reserved for the documentation article title. Headings inside the documentation article content must start from heading level two (`##`). Please refer to [Markdown basic syntax](https://www.markdownguide.org/basic-syntax/#headings) for examples and detailed instructions
4. **DO NOT** use `HTML` tags in `Markdown` content

# Documentation authoring guidelines
## What to document?
We should document use cases that will help our users successfully achieve their goals while using Devopness platform.

## How to document?
1. Adopt a **Step by step** approach, making it super easy for readers to follow along:
    - Each step should be clear, with a short sentence.
    - If a process is long, break it down into multiple small steps.
    - That will help the reader to understand each step without pressure, then breath, then move on to the next step.
2. **Be brief**: Use short sentences and paragraphs
    - Stick to the principle of one main idea per sentence, plus one additional point if needed.
    - Each paragraph should address one main idea.
    - Remember the basic structure of a paragraph is: Introduction, body, and conclusion.
3. Use **Simple English**. Use **simple words**
    - Use simple words to increase reader comprehension and reduce ambiguity
    - Follow these tips for making good word choices:
      - Avoid jargon: Write for your audience, using everyday language where possible, and technical terms where appropriate.
      - Avoid clichés, idioms, and metaphors.
      - **Be consistent**: Use one term for each concept and use it consistently along the documentation.
      - Avoid “fancy” words and phrases: If there is a simpler word or phrase, use it.
      - Keep documentation simple and accessible to everyone, as Devopness itself. ;-) 

## What should NOT be included in the documentation?
1. Do not go too deep into business rules that are already validated and communicated by the API as Devopness product is built with an API-first approach. We strive for keeping API responses and validation messages easily understood by machines and humans alike, there's no need to repeat ourselves in the docs explaining which field values are valid or not.
It is Devopness API responsibility to communicate the validation rules to the end users in a clear way, so that should not require extra documentation to explain API messages.
* We might, however, want to produce `Overview` or `Deep dive` articles to conceptually give users detailed explanation on specific topics that fall beyond the more common use-case-based step by step.

## Predefined variables
Here is a list of predefined variables that can be set in the `front-matter` block of a documentation topic:

| Variable               | Description                               | Required  |
|------------------------|-------------------------------------------|-----------|
| `title`                | The title of the documentation topic      | Yes       |
| `description`          | Page meta description                     | No        |
| `pagination_prev`      | Previous link in pagination               | No        |
| `pagination_next`      | Next link in pagination                   | No        |
| `links.related`        | Related links to other topics             | No        |
| `required_permissions` | Required permissions to follow the steps  | No        |

Links represent a relative path to the documentation root (`/docs`) without the file extension, e.g. `actions/view-action` represents `/docs/actions/view-action.md` file.

For more details on available frontmatter options, see the [Docusaurus Content Docs Plugin documentation](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs#markdown-front-matter).

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

**Why**: Use standard Docusaurus pagination variables.

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

The `/docs/` prefix is required to differentiate between internal links and external links.

See [Docusaurus Content Docs Plugin documentation](https://docusaurus.io/docs/api/plugins/@docusaurus/plugin-content-docs#markdown-front-matter) for more details on finding the id of a documentation page.

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

To learn more about admonitions, you can check the [Docusaurus Admonitions Plugin documentation](https://docusaurus.io/docs/markdown-features/admonitions).