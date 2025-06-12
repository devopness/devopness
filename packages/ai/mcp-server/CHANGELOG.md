# @devopness/mcp-server

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
