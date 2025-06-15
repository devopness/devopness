---
"@devopness/mcp-server": patch
---

### Added
- New MCP tools for cloud service discovery:
  - `devopness_get_regions_of_cloud_service`
  - `devopness_get_instance_types_of_cloud_service_region`

### Changed
- Enhanced `devopness_create_cloud_server` with explicit parameters and improved validation
- Refined response formats for better LLM interaction in:
  - `devopness_list_projects`
  - `devopness_list_environments`
