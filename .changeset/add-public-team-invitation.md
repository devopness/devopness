---
"@devopness/sdk-js": major
"@devopness/sdk-python": major
---

# Changes

- Added support for **Public Team Invitations**, allowing teams to generate shareable links that let any user with the link join the team.

## ⚠️ Breaking change

- The structure used to create team invitations has changed to include a new field defining the type of invitation (`"private"` or `"public"`).
- The email address is now optional and only required for private invitations.
- This change affects any process or integration that creates team invitations and requires adjustments to align with the new format.

## Additionally

- The process for accepting invitations now supports authorization via a token when handling public invitations.
