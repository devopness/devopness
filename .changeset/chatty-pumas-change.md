---
"@devopness/sdk-js": patch
"@devopness/sdk-python": patch
---

**Changes**

- Added support for a target query parameter to filter variables by target in the listing endpoint
- Added a query parameter to allow exclusion of Devopness-generated virtual variables from the listing
- Fixed the documentation for the variable.created_by_user field to indicate it is nullable, which applies to virtual variables
