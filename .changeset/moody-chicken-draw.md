---
"@devopness/mcp-server": patch
---

The devopness_deploy_application tool now allows deployments to be initiated using only the application ID.
If a pipeline ID is not provided, the tool will return a list of available pipelines for the given application, allowing the user to select one before proceeding.
