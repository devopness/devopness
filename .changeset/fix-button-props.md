---
"@devopness/ui-react": patch
---

Revert Button breaking changes

The following changes were made in 2.153.1

```
-  noMargin?: boolean
+  $noMargin?: boolean
  /**
   * The button component has a 10px margin on its sides, to remove activate the "noIconMargin" property
   */
-  noIconMargin?: boolean
+  $noIconMargin?: boolean
  /**
   * The button component has a 15px padding on its sides, to remove activate the "noPadding" property
   */
-  noPadding?: boolean
+  $noPadding?: boolean
```

This version reverts the diff above

The ButtonProps will be compatible with 2.153.0, and any changes to props will not be released as a patch version in the future

