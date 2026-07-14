---
"@devopness/ui-react": patch
---

Fix `ViewDetailsContent`'s `IconProps` being silently shadowed by an unrelated same-named type

The package exported two different types both named `IconProps` (one from `Icon`, one from `ViewDetailsContent`), and TypeScript's explicit named re-export for `Icon`'s `IconProps` always won over the wildcard re-export of `ViewDetailsContent`'s, with no compile error. `ViewDetailsContent`'s icon type is now exported as `DetailsIconProps` instead, resolving the ambiguity.
