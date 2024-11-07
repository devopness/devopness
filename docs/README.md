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

| Variable               | Description                                              | Required       |
|------------------------|----------------------------------------------------------|----------------|
| `title`                | The title of the documentation topic                     | Yes            |
| `intro`                | A short paragraph introducing the topic                  | No             |
| `required_permissions` | List of Role permissions required to follow the post [1] | No             |

[1] For expected format, see section [Permissions](#permissions)

## Permissions

see [PERMISSIONS.md](./PERMISSIONS.md) for the List of Role permissions, use this documentation when adding `required_permissions` field on frontmatter

The documentation was generated from Static Permissions Data, using the following commands:

```bash
node generate_permissions_docs.mjs > PERMISSIONS.md 2>/dev/null
```

```ts
// generate_permissions_docs.mjs

import staticPermissions from './response.json' assert { type: "json" };

console.log('# Permissions')

for(const resourceType of staticPermissions){
  console.log(`
## ${resourceType.human_readable}`)

  for(const permission of resourceType.permissions){
    console.log(`
### ${resourceType.human_readable} ${permission.human_readable}

${permission.hint}

permission: \`${resourceType.resource_type}:${permission.name}\``)
  }
}
```
