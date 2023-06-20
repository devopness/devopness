# Devopness documentation
Devopness maintains its documentation in an open source repository, so feel free to contribute to this project!

# Contributing
Make sure all files created in this folder adhere to the following basic rules:
1. Are defined as `Markdown` files (.md)
1. Follow the [Github's Content Markup Reference](https://github.com/github/docs/blob/main/contributing/content-markup-reference.md)
1. Use front matter headers, see the list of available headers in [this topic](#predefined-variables)
1. **DO NOT** set heading level one only one (`#`) in `Markdown` content, as it is reserved for the documentation article title. Headings inside the documentation article content must start from heading level two (`##`). Please refer to [Markdown basic syntax](https://www.markdownguide.org/basic-syntax/#headings) for examples and detailed instructions
1. **DO NOT** use `HTML` tags in `Markdown` content

# Documentation guidelines
## What to document?
We should document use cases that will help our users successfully achieve their goals while using Devopness platform.

## How to document?
Step by step. Each step should be clear, with a short sentence.
If a process is long, break it down into multiple small steps.
That will help the reader to understand each step without pressure, then breath, then move on to the next step.

## What should NOT be included in the documentation?
1. Do not go too deep into business rules that are already validated and communicated by the API as Devopness product is built with an API-first approach. We strive for keeping API responses and validation messages easily understood by machines and humans alike, there's no need to repeat ourselves in the docs explaining which field values are valid or not.
It is Devopness API responsibility to communicate the validation rules to the end users in a clear way, so that should not require extra documentation to explain API messages.
* We might, however, want to produce `Overview` or `Deep dive` articles to conceptually give users detailed explanation on specific topics that fall beyond the more common use-case-based step by step.

## Predefined variables
Here is a list of predefined variables that can be set in the `front-matter` block of a documentation topic:

| Variable | Description                               | Required       |
|----------|-------------------------------------------|----------------|
| `title`  | The title of the documentation topic      | Yes            |
| `intro`  | A short paragraph introducing the topic   | No             |
