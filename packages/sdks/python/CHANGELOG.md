# @devopness/sdk-python

## 1.1.3

### Patch Changes

- [#1766](https://github.com/devopness/devopness/pull/1766) [`5145e20`](https://github.com/devopness/devopness/commit/5145e20fff6150087b081eb65118187c2cb19852) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Add validation for base_url in DevopnessClientConfig to ensure it starts with http:// or https://, raising a clear error if invalid.

## 1.1.2

### Patch Changes

- [#1751](https://github.com/devopness/devopness/pull/1751) [`830e13c`](https://github.com/devopness/devopness/commit/830e13cca7f4d4f4f93f8973551639aeb62e772c) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Make **url_slug** field optional to ensure compatibility with Prod and Dev API versions.

## 1.1.1

### Patch Changes

- [#1746](https://github.com/devopness/devopness/pull/1746) [`a7cbf6e`](https://github.com/devopness/devopness/commit/a7cbf6ef49ec80adf9dbe792ff5b21cb5afe917b) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Corrected the async client \_save_access_token method to use aread() instead of read() for reading response content, preventing runtime errors with async streams.

## 1.1.0

### Minor Changes

- [#1728](https://github.com/devopness/devopness/pull/1728) [`4b99969`](https://github.com/devopness/devopness/commit/4b999691964e897b3046d641db4a3ed86b656711) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Added the `architecture` field to the `CloudInstanceRelation` model, allowing access to the instance architecture (e.g., x86_64, arm64).

## 1.0.0

### Major Changes

- [#1708](https://github.com/devopness/devopness/pull/1708) [`17f7aa4`](https://github.com/devopness/devopness/commit/17f7aa482324d02e1cf49e05e983aefc47f9cfef) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Initial stable release of the Devopness SDK for Python (v1.0.0)

  This is the first official release published to PyPI.
  Previous versions (0.0.x) were only available on TestPyPI
  for internal testing and early integration.

  Now available at: https://pypi.org/project/devopness/

  The SDK allows developers to interact programmatically with the
  Devopness API, providing features such as infrastructure provisioning,
  server and application management, and credential handling.

  Breaking changes are expected to follow semantic versioning from this point onward.

## 0.0.79

### Patch Changes

- [#1694](https://github.com/devopness/devopness/pull/1694) [`a3f987f`](https://github.com/devopness/devopness/commit/a3f987f7f347d0113d60b63b0e0bde222f9e24ca) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Test changeset to confirm the Release - Packages workflow is triggered correctly for the Python SDK after project structure update.

## 0.0.78

### Patch Changes

- [#1688](https://github.com/devopness/devopness/pull/1688) [`812569c`](https://github.com/devopness/devopness/commit/812569cec88c9f19d46c82e18b6c624a6aa81b61) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Exposed new services through `DevopnessClient`, including: hooks, network_rules, organizations, resource_events, roles, social_accounts, ssl_certificates, static, and teams.

  Additionally, enhanced ActionService, EnvironmentService, and ProjectService to support broader use cases involving users, organizations, environments, and pipelines.

## 0.0.77

### Patch Changes

- [#1684](https://github.com/devopness/devopness/pull/1684) [`4280850`](https://github.com/devopness/devopness/commit/4280850374069b0c4f799efcac493a18bf6bdacd) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Added the sdk [dev version] into changesets
