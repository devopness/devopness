# @devopness/mcp-server

## 0.0.20

### Patch Changes

- [#1889](https://github.com/devopness/devopness/pull/1889) [`9f13df2`](https://github.com/devopness/devopness/commit/9f13df21224cccc77d0729caa338c63246e970f0) Thanks [@Diegiwg](https://github.com/Diegiwg)! - **Changes**
  - Added support for listing and creating pipeline steps.

## 0.0.19

### Patch Changes

- [#1887](https://github.com/devopness/devopness/pull/1887) [`5394f56`](https://github.com/devopness/devopness/commit/5394f5695be5aac404192d0905db88ebf086f1c8) Thanks [@Diegiwg](https://github.com/Diegiwg)! - **Changes**
  - Added support for listing, creating, and deploying `daemon` and `virtual-host` resources.
  - Improved resource listing instructions by switching from numbered to bullet-point format to prevent miscommunication.
  - Enhanced `list-projects` and `list-environments` instructions to ensure LLMs request user confirmation before using `project_id` and `environment_id`.

## 0.0.18

### Patch Changes

- [#1881](https://github.com/devopness/devopness/pull/1881) [`ad9dbfc`](https://github.com/devopness/devopness/commit/ad9dbfc8e6fa4a349f588166877cdc724d3920e4) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Changes:
  - Refactor listing tools to enforce pagination with a maximum of 5 resources per page.
  - Introduce simplified data models for MCP Server resources to reduce payload size and minimize LLM hallucinations.
  - Standardize output formatting across all listing tools using utility functions, including consistent web app links and next step suggestions.
  - Update deployment tools to require `pipeline_id` and `server_ids` list, with uniform communication on tracking deployment actions.
  - Refactor creation tools to use utility helpers for consistent presentation of newly created resource data.
  - Add utility methods for generating clear, consistent instructions and formatted output for LLM interactions.

## 0.0.17

### Patch Changes

- [#1879](https://github.com/devopness/devopness/pull/1879) [`59bba96`](https://github.com/devopness/devopness/commit/59bba96f07ccd49e8f74aa95c8fab9a632605608) Thanks [@Diegiwg](https://github.com/Diegiwg)! - - Bumped `devopness` dependency to version `1.2.1`

## 0.0.16

### Patch Changes

- [#1873](https://github.com/devopness/devopness/pull/1873) [`6817f9c`](https://github.com/devopness/devopness/commit/6817f9c8c51601025baca546a8887f1db054adc0) Thanks [@Diegiwg](https://github.com/Diegiwg)! - **Changed**
  - Improved the `create application` tool by adding parameter-level validation with clear error messages
  - Enhanced the tool response with suggested next steps after application creation
  - Introduced `get_available_language_runtimes` tool to list supported programming languages, versions, and frameworks

## 0.0.15

### Patch Changes

- [#1870](https://github.com/devopness/devopness/pull/1870) [`dfe647e`](https://github.com/devopness/devopness/commit/dfe647e04b6f5d4fd9ca63ea2c08d08ccb276ec6) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Set a custom `User-Agent` header for all outgoing HTTP requests made by the MCP.

  This helps improve observability and debugging by allowing the Devopness Team to identify MCP usage and runtime environment metadata.

  The `User-Agent` format looks like:

  ```
  devopness-mcp-server/1.0.0 +https://github.com/devopness/devopness (python/3.13.0 Linux)
  ```

## 0.0.14

### Patch Changes

- [#1862](https://github.com/devopness/devopness/pull/1862) [`1a14adb`](https://github.com/devopness/devopness/commit/1a14adb767e06eabeb84067852cb718710528be7) Thanks [@Diegiwg](https://github.com/Diegiwg)! - **Added**
  - `page` argument for project and environment listing tools to enable pagination
  - Summary models (`ProjectSummary`, `EnvironmentSummary`) for lighter responses

  **Changed**
  - Updated `devopness_list_projects` and `devopness_list_environments` to use summaries and support pagination
  - Improved response format to enhance LLM interpretation and reduce hallucinations

## 0.0.13

### Patch Changes

- [#1863](https://github.com/devopness/devopness/pull/1863) [`9211452`](https://github.com/devopness/devopness/commit/9211452c255b592fb7cc0bfc34641a84b53f3216) Thanks [@Diegiwg](https://github.com/Diegiwg)! - **New**
  - Added `tool_create_application_variable` to allow creation of application environment variables
  - Added `tool_create_application_config_file` to allow creation of application configuration files

## 0.0.12

### Patch Changes

- [#1858](https://github.com/devopness/devopness/pull/1858) [`79a62f4`](https://github.com/devopness/devopness/commit/79a62f412ea2400eafce3eb05d8e48e3ba3a8423) Thanks [@Diegiwg](https://github.com/Diegiwg)! - **Internal**
  - Refactored MCP server code structure
  - Extracted service logic into dedicated classes

## 0.0.11

### Patch Changes

- [#1852](https://github.com/devopness/devopness/pull/1852) [`c66fcdc`](https://github.com/devopness/devopness/commit/c66fcdc2fe3c2a8e945b804e9361e94585518529) Thanks [@Diegiwg](https://github.com/Diegiwg)!

### Added

- New MCP tools for cloud service discovery:
  - `devopness_get_regions_of_cloud_service`
  - `devopness_get_instance_types_of_cloud_service_region`

### Changed

- Enhanced `devopness_create_cloud_server` with explicit parameters and improved validation
- Refined response formats for better LLM interaction in:
  - `devopness_list_projects`
  - `devopness_list_environments`

## 0.0.10

### Patch Changes

- [#1839](https://github.com/devopness/devopness/pull/1839) [`c1c2dd4`](https://github.com/devopness/devopness/commit/c1c2dd412f1df8f93210a1bfc94ee033461ea64d) Thanks [@Diegiwg](https://github.com/Diegiwg)! - - New MCP tools for service management:
  - **devopness_list_services:** List all available services
  - **devopness_create_service:** Support for multiple operations as create service, list service types, list service type versions
  - **devopness_deploy_service:** Support for multiple operations as deploy service, list service deploy pipelines, list service linked servers

## 0.0.7

### Patch Changes

- [#1826](https://github.com/devopness/devopness/pull/1826) [`653a5bc`](https://github.com/devopness/devopness/commit/653a5bc0102f21d50252e4df55bbb7d5c9ee58cf) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Add tool's to create and deploy SSH Keys

## 0.0.6

### Patch Changes

- [#1824](https://github.com/devopness/devopness/pull/1824) [`9296c2e`](https://github.com/devopness/devopness/commit/9296c2ec4b4f1a32169031999bc9a2b02d3a3d04) Thanks [@Diegiwg](https://github.com/Diegiwg)! - The devopness_deploy_application tool now allows deployments to be initiated using only the application ID.
  If a pipeline ID is not provided, the tool will return a list of available pipelines for the given application, allowing the user to select one before proceeding.

## 0.0.5

### Patch Changes

- [#1821](https://github.com/devopness/devopness/pull/1821) [`274e260`](https://github.com/devopness/devopness/commit/274e26006d53eba37b37753af0fa9e3386f2a639) Thanks [@Diegiwg](https://github.com/Diegiwg)! - chore: bump patch versions to test release system

## 0.0.4

### Patch Changes

- [#1814](https://github.com/devopness/devopness/pull/1814) [`ea79701`](https://github.com/devopness/devopness/commit/ea797010793bfe404b7e06afb7e222e716f602de) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Initial release of Devopness MCP Server package with foundational infrastructure for AI agent integration.

  Added CI workflow for automated build and lint checks, refactored release workflow to support Python package management, restructured project with proper directory organization, and implemented automated PyPI publishing capabilities.
