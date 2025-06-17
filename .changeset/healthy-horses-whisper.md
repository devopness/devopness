---
"@devopness/mcp-server": patch
---

**Added**
* `page` argument for project and environment listing tools to enable pagination
* Summary models (`ProjectSummary`, `EnvironmentSummary`) for lighter responses

**Changed**
* Updated `devopness_list_projects` and `devopness_list_environments` to use summaries and support pagination
* Improved response format to enhance LLM interpretation and reduce hallucinations

