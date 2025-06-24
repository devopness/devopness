---
"@devopness/mcp-server": patch
---

Changes:

* Refactor listing tools to enforce pagination with a maximum of 5 resources per page.
* Introduce simplified data models for MCP Server resources to reduce payload size and minimize LLM hallucinations.
* Standardize output formatting across all listing tools using utility functions, including consistent web app links and next step suggestions.
* Update deployment tools to require `pipeline_id` and `server_ids` list, with uniform communication on tracking deployment actions.
* Refactor creation tools to use utility helpers for consistent presentation of newly created resource data.
* Add utility methods for generating clear, consistent instructions and formatted output for LLM interactions.
