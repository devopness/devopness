# Plugins

This directory contains custom MDX plugins for Docusaurus documentation processing.

## Available Plugins

- `intro-content-plugin`: Extracts and displays intro text from frontmatter
- `mention-post-plugin`: Converts [/docs/path/to/doc] to MentionPost in docs posts
- `related-links-plugin`: Automatically adds related links sections to documents
- `required-permissions-plugin`: Adds a RequiredPermissions component to the docs
- `static-content-links-escape-plugin`: Escapes Docusaurus SPA redirects on links to static folder content

## Plugin Development

Plugins in this directory follow the [unified](https://unifiedjs.com/) ecosystem conventions and work with Docusaurus's MDX processing pipeline.

## Related Documentation

- [Docusaurus Plugin System](https://docusaurus.io/docs/api/plugin-methods)
- [MDX in Docusaurus](https://docusaurus.io/docs/markdown-features/react)
- [Creating Plugins](https://docusaurus.io/docs/api/plugin-methods#creating-plugins) 