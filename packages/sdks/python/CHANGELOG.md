# @devopness/sdk-python

## 1.3.2

### Patch Changes

- [#1968](https://github.com/devopness/devopness/pull/1968) [`4ba5822`](https://github.com/devopness/devopness/commit/4ba582241185786eae2525fe3571240a72911deb) Thanks [@Diegiwg](https://github.com/Diegiwg)! - **Changes**

  Fix incorrect use of `optional` on required fields in generated SDK models, ensuring alignment with OpenAPI spec

## 1.3.1

### Patch Changes

- [#1966](https://github.com/devopness/devopness/pull/1966) [`edf00bf`](https://github.com/devopness/devopness/commit/edf00bfc4ad3f3a3c8f5ecefc733262dc57cc90c) Thanks [@Diegiwg](https://github.com/Diegiwg)! - **Changes**

  Fix action and action target field types

## 1.3.0

### Minor Changes

- [#1958](https://github.com/devopness/devopness/pull/1958) [`bf71ebe`](https://github.com/devopness/devopness/commit/bf71ebe6185b6319a0b8467cec05dda4945b350f) Thanks [@Diegiwg](https://github.com/Diegiwg)! - **Changes**

  Removed redundant `ActionData` union type in favor of direct `ActionDeploymentData` usage. No runtime behavior was changed.

## 1.2.2

### Patch Changes

- [#1942](https://github.com/devopness/devopness/pull/1942) [`4a57b88`](https://github.com/devopness/devopness/commit/4a57b88cd497c02f8f202bc130a834257d04f789) Thanks [@Diegiwg](https://github.com/Diegiwg)! - **Changes**
  - Added support for a target query parameter to filter variables by target in the listing endpoint
  - Added a query parameter to allow exclusion of Devopness-generated virtual variables from the listing
  - Fixed the documentation for the variable.created_by_user field to indicate it is nullable, which applies to virtual variables

## 1.2.1

### Patch Changes

- [#1877](https://github.com/devopness/devopness/pull/1877) [`46fa571`](https://github.com/devopness/devopness/commit/46fa571a0434bb8a3fd648195149f918ad2bd7e4) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Corrected validation rules for the `user name` field

## 1.2.0

### Minor Changes

- [#1868](https://github.com/devopness/devopness/pull/1868) [`6756d31`](https://github.com/devopness/devopness/commit/6756d3157aeabc72fdefca773a63c4d186906ea8) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Set a custom `User-Agent` header for all outgoing HTTP requests made by the SDK.

  This helps improve observability and debugging by allowing the Devopness Team to identify SDK usage and runtime environment metadata.

  The `User-Agent` format looks like:

  ```
  devopness-sdk-python/1.0.0 +https://github.com/devopness/devopness (python/3.13.0 Linux)
  ```

## 1.1.6

### Patch Changes

- [#1821](https://github.com/devopness/devopness/pull/1821) [`274e260`](https://github.com/devopness/devopness/commit/274e26006d53eba37b37753af0fa9e3386f2a639) Thanks [@Diegiwg](https://github.com/Diegiwg)! - chore: bump patch versions to test release system

## 1.1.5

### Patch Changes

- [#1788](https://github.com/devopness/devopness/pull/1788) [`5337e87`](https://github.com/devopness/devopness/commit/5337e87e0985ef98925f2b556bd0ed119cbd384b) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Improved how enum values (like hook types) appear when used in strings.
  For example, when building URLs or printing values, you'll now see `"incoming"` instead of something like `"HookTypeParam.INCOMING"`.

  This makes the SDK easier to use and outputs cleaner, more expected values in logs, strings, and requests.

## 1.1.4

### Patch Changes

- [#1786](https://github.com/devopness/devopness/pull/1786) [`0c52385`](https://github.com/devopness/devopness/commit/0c52385346df92b1c6cffc9452f5944057bb96e4) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Updated SDK methods that accept `hook_type` to use the `HookTypeParam` enum instead of plain strings.
  This change clearly defines the allowed values for this field, reducing the likelihood of user errors.

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
