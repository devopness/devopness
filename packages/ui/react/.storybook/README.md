# .storybook

Storybook configuration files

## File structure

```
.storybook
├── devopness.ts
# Devopness custom Storybook’s UI theme
├── main.ts
# Defines your Storybook project's behavior, including the location of your stories, the addons you use, feature flags and other project-specific settings
├── manager.ts
# Control the layout of Storybook’s UI (sidebar, toolbar, theme, ...)
├── preview-head.html
# Extra elements added to the head of the component preview iframe
├── preview.ts
# Control the way stories are rendered
└── README.md
# this file
```

## Read More

| File                            | Documentation                                                          |
| :------------------------------ | :--------------------------------------------------------------------- |
| main.ts, manager.ts, preview.ts | https://storybook.js.org/docs/configure                                |
| devopness.ts                    | https://storybook.js.org/docs/configure/user-interface/theming         |
| preview-head.html               | https://storybook.js.org/docs/configure/story-rendering#adding-to-head |

> Small doc contribution by Wallan — May 2025.
