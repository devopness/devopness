---
'@devopness/ui-react': patch
---

Add 'addUrl' to the Pick<CardProps, ...> union in CardListProps.data so consumers can pass addUrl per card item and have it reach the underlying Card component via the existing {...props} spread.
