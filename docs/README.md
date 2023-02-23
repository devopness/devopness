# Devopness documentation
Devopness maintains its documentation in an open source repository, so feel free to contribute to this project!

# Contributing
Make sure all files created in this folder adhere to the following basic rules:
1. Are defined as `Markdown` files (.md)
2. Use front matter headers, see the list of available headers in [this topic](#available-header-to-use-in-front-matter)
3. **NOT** use only one `#` in `Markdown` content to define a header, prefer to use `##`
4. **NOT** use `HTML` tags in `Markdown` content


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

## Available header to use in front matter
* `title`: is title of page and is required
* `intro`: is description of page but is not required
