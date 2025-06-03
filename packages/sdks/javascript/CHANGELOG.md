# @devopness/sdk-js

## 2.164.2

### Patch Changes

- [#1786](https://github.com/devopness/devopness/pull/1786) [`0c52385`](https://github.com/devopness/devopness/commit/0c52385346df92b1c6cffc9452f5944057bb96e4) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Updated SDK methods that accept `hook_type` to use the `HookTypeParam` enum instead of plain strings.
  This change clearly defines the allowed values for this field, reducing the likelihood of user errors.

## 2.164.1

### Patch Changes

- [#1751](https://github.com/devopness/devopness/pull/1751) [`830e13c`](https://github.com/devopness/devopness/commit/830e13cca7f4d4f4f93f8973551639aeb62e772c) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Make **url_slug** field optional to ensure compatibility with Prod and Dev API versions.

## 2.164.0

### Minor Changes

- [#1728](https://github.com/devopness/devopness/pull/1728) [`4b99969`](https://github.com/devopness/devopness/commit/4b999691964e897b3046d641db4a3ed86b656711) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Added the `architecture` field to the `CloudInstanceRelation` model, allowing access to the instance architecture (e.g., x86_64, arm64).

## 2.163.7

### Patch Changes

- [#1673](https://github.com/devopness/devopness/pull/1673) [`fcb97e2`](https://github.com/devopness/devopness/commit/fcb97e2f616d550fd4e17e96ecb137785b96b8c9) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Fix ActionTarget Model to include ID prop

## 2.163.6

### Patch Changes

- [#1660](https://github.com/devopness/devopness/pull/1660) [`2038a77`](https://github.com/devopness/devopness/commit/2038a77aa7b3c971951483c03b2f68e12ef88c36) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Fix the Action Type Enum to include Rotate Key

## 2.163.5

### Patch Changes

- [#1658](https://github.com/devopness/devopness/pull/1658) [`3753d85`](https://github.com/devopness/devopness/commit/3753d858c017a1f08a3c2310fe497243061d503a) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Fix issues in sdk's models

## 2.163.4

### Patch Changes

- [#1653](https://github.com/devopness/devopness/pull/1653) [`934c4c4`](https://github.com/devopness/devopness/commit/934c4c48567cea490afd68c29fafb84acf17b7b0) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Fix documentation of Action Resource Data

## 2.163.3

### Patch Changes

- [#1651](https://github.com/devopness/devopness/pull/1651) [`7fa10ba`](https://github.com/devopness/devopness/commit/7fa10ba49132e899f143435f7434026e8a16eee8) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Remove unused 'provider_id' field from ActionDeploymentContent Model

## 2.163.2

### Patch Changes

- [#1643](https://github.com/devopness/devopness/pull/1643) [`429c6d6`](https://github.com/devopness/devopness/commit/429c6d6686084c07f953ca58f98d60d69a6ab9d5) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Fix server status field type

## 2.163.1

### Patch Changes

- [#1632](https://github.com/devopness/devopness/pull/1632) [`bcbfb36`](https://github.com/devopness/devopness/commit/bcbfb36b947143134c0c6b8f705f6cc5401d3a6a) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Add Azure Service to Credential and Provider List

## 2.163.0

### Minor Changes

- [#1587](https://github.com/devopness/devopness/pull/1587) [`f30e7be`](https://github.com/devopness/devopness/commit/f30e7be9d66de180a4e2caef2acb5cc190104729) Thanks [@Diegiwg](https://github.com/Diegiwg)!

  ## ⚠️ Breaking Change

  ### What changed?

  All `<ResourceType>` services that were previously accessed through the `EnvironmentService` (such as `applications`) have been moved to their respective standalone services (e.g., `ApplicationService`). Properties like `application` no longer exist in `EnvironmentService`.

  ### Why was this change made?

  This refactor simplifies the SDK structure by consolidating all `<ResourceType>` methods into their respective services. It eliminates redundancy, improves maintainability, and makes the SDK more intuitive and aligned with common API design principles.

  ### Previous usage example

  Previously, creating an application required accessing the method through `environment.application`:

  ```ts
  const apiClient = new DevopnessApiClient();
  const options =
    await apiClient.environment.application.addEnvironmentApplication();
  ```

  ### New usage example

  Now, all application-related methods are available directly under `application`:

  ```ts
  const apiClient = new DevopnessApiClient();
  const options = await apiClient.application.addEnvironmentApplication();
  ```

  ### Impact & Migration Guide

  Update all references that use `environment.<resourceType>` to the new direct service call format.
  For example:

  ```ts
  // Before
  apiClient.environment.application.listEnvironmentApplications();

  // After
  apiClient.application.listEnvironmentApplications();
  ```

  Repeat this migration for all affected `<ResourceType>` services.

## 2.162.2

### Patch Changes

- [#1573](https://github.com/devopness/devopness/pull/1573) [`5ffe0f5`](https://github.com/devopness/devopness/commit/5ffe0f5cd5d67ab5c29b476194a9c05c9b0b2bdb) Thanks [@Diegiwg](https://github.com/Diegiwg)! - add url_slug in user-relation model

- [#1573](https://github.com/devopness/devopness/pull/1573) [`5ffe0f5`](https://github.com/devopness/devopness/commit/5ffe0f5cd5d67ab5c29b476194a9c05c9b0b2bdb) Thanks [@Diegiwg](https://github.com/Diegiwg)! - add version of action-relation model without resource field

## 2.162.1

### Patch Changes

- [#1549](https://github.com/devopness/devopness/pull/1549) [`0302fb6`](https://github.com/devopness/devopness/commit/0302fb6671ae865b47ba1bd202dfe6d5b236c3d0) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Fix type of 'ID' field in UserUpdate

## 2.162.0

### Minor Changes

- [#1536](https://github.com/devopness/devopness/pull/1536) [`147c541`](https://github.com/devopness/devopness/commit/147c5411bfd29c0324584ad41ee60f07f5c74c76) Thanks [@Diegiwg](https://github.com/Diegiwg)!

  ## ⚠️ Breaking Change

  ### What changed?

  All static data services have been consolidated into `StaticService`, removing individual static service properties like `applicationOptions`.

  ### Why was this change made?

  This refactor simplifies the SDK structure by consolidating all static data retrieval methods into a single service. This reduces redundancy, improves maintainability, and ensures a more intuitive API design.

  ### How was it used before?

  Previously, retrieving static data required calling specific static services, such as:

  ```ts
  const apiClient = new DevopnessApiClient();
  const options =
    await apiClient.static.applicationOptions.getStaticApplicationOptions();
  ```

  ### How should it be used now?

  Now, all static data methods are centralized under `StaticService`:

  ```ts
  const apiClient = new DevopnessApiClient();
  const options = await apiClient.static.getStaticApplicationOptions();
  ```

  ### Impact & Migration

  Replace all occurrences of static service calls, e.g., `static.applicationOptions.getStaticApplicationOptions()` with `static.getStaticApplicationOptions()`.

- [#1536](https://github.com/devopness/devopness/pull/1536) [`147c541`](https://github.com/devopness/devopness/commit/147c5411bfd29c0324584ad41ee60f07f5c74c76) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Added resource summary in organization get and list methods

## 2.161.1

### Patch Changes

- [#1532](https://github.com/devopness/devopness/pull/1532) [`43e8ef1`](https://github.com/devopness/devopness/commit/43e8ef1ac3dea78f4afa7276f56a019916602dc7) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Expose organization service in Devopness API

## 2.161.0

### Minor Changes

- [#1530](https://github.com/devopness/devopness/pull/1530) [`09b7be4`](https://github.com/devopness/devopness/commit/09b7be4d81b96da798c77f722771c7b9c41434d2) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Add Support for Organizations

  Include methods to:

  - Create Organization
  - List Organizations
  - Get Organization
  - Update Organization
  - Get Organization Activity
  - Get Organization Environments
  - Get Organization Projects
  - Create Project to Organization

## 2.160.0

### Minor Changes

- [#1458](https://github.com/devopness/devopness/pull/1458) [`509d2fa`](https://github.com/devopness/devopness/commit/509d2fa226a680f5e7427014c944228d487b35ef) Thanks [@Diegiwg](https://github.com/Diegiwg)! - 🚨 Breaking Changes

  - Removed the direct _team_memberships_ relation from EnvironmentRelation and ArchivedEnvironmentRelation.

  🔄 Changes

  - Added the _resource_summary_ field to the EnvironmentRelation and ArchivedEnvironmentRelation.

  📌 Reason for Changes

  The _resource_summary_ field centralizes summary information about linked resources, replacing explicit relations with a standardized summary format.

  To retrieve a full list of team memberships, use the appropriate SDK method.

  If you need to determine the number of linked team memberships, use:

  ```ruby
    environment
      .resource_summary['team-membership']
        .summary
        .count
  ```

## 2.159.0

### Minor Changes

- [#1453](https://github.com/devopness/devopness/pull/1453) [`dc153a7`](https://github.com/devopness/devopness/commit/dc153a72bdd07d3f209f22ee11309c2b427784a6) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Added methods to delete and reject team invitations

  - `deleteTeamInvitation`: Allows to cancel a pending team invitation
  - `rejectTeamInvitation`: Allows to reject a pending team invitation

## 2.158.0

### Minor Changes

- [#1422](https://github.com/devopness/devopness/pull/1422) [`9386735`](https://github.com/devopness/devopness/commit/93867352ab65ff6e129ed13e5e372be6767019f8) Thanks [@Diegiwg](https://github.com/Diegiwg)!

  🚨 Breaking Changes

  - Removed: Direct resource relation fields from the Environment model:
    - applications
    - credentials
    - cron_jobs
    - daemons
    - network_rules
    - networks
    - servers
    - services
    - ssh_keys
    - ssl_certificates
    - virtual_hosts

  🔄 Changes

  - Added: resource_summary field to the Environment model.

  📌 Reason for Changes

  The resource_summary field centralizes summary information about linked resources, replacing explicit relations with a standardized summary format.

  This change enhances efficiency by reducing response payload size while still providing resource count details.

  Each entry in resource_summary includes:

  - resource_type: The singular identifier of the resource.
  - resource_type_plural: The plural form of the resource type.
  - resource_type_human_readable: A user-friendly singular name.
  - resource_type_plural_human_readable: A user-friendly plural name.
  - summary.count: The number of linked resources.

  To retrieve full resource lists, use the appropriate SDK methods instead of relying on the Environment model.

  If the goal is to determine the number of linked resources, use:

  ```ruby
    environment
      .resource_summary
      .{resource-type}
      .summary
      .count
  ```

- [#1422](https://github.com/devopness/devopness/pull/1422) [`9386735`](https://github.com/devopness/devopness/commit/93867352ab65ff6e129ed13e5e372be6767019f8) Thanks [@Diegiwg](https://github.com/Diegiwg)!

  🔄 Changes

  - Added: resource_summary field to the ProjectRelation model.

  📌 Reason for Changes

  The resource_summary field provides a structured summary of linked resources (environments, teams, and roles) within a project relation.

  This ensures efficient access to resource counts without exposing full lists.

  Each entry in resource_summary includes:

  - resource_type: The singular identifier of the resource.
  - resource_type_plural: The plural form of the resource type.
  - resource_type_human_readable: A user-friendly singular name.
  - resource_type_plural_human_readable: A user-friendly plural name.
  - summary.count: The number of linked resources.

  For resource counts, use:

  ```ruby
    projectRelation
      .resource_summary
      .{resource-type}
      .summary
      .count
  ```

- [#1422](https://github.com/devopness/devopness/pull/1422) [`9386735`](https://github.com/devopness/devopness/commit/93867352ab65ff6e129ed13e5e372be6767019f8) Thanks [@Diegiwg](https://github.com/Diegiwg)

  🚨 Breaking Changes

  - Removed: environments, teams, and roles fields from the Project model.

  🔄 Changes

  - Added: resource_summary field to the Project model.

  📌 Reason for Changes

  The resource_summary field centralizes summary information about linked resources (environments, teams, and roles) within a project.

  Each resource in resource_summary is an object containing:

  - resource_type: Identifies the resource type.
  - resource_type_plural: Identifies the resource type in plural form.
  - resource_type_human_readable: Identifies the resource type in human readable form.
  - resource_type_plural_human_readable: Identifies the resource type in plural form in human readable form.
  - summary.count: Represents the number of linked resources.

  To retrieve full lists of environments, teams, or roles, use the appropriate SDK methods instead of relying on the Project model.

  If the goal is to determine the number of linked resources, use:

  ```ruby
    project
      .resource_summary
      .{resource-type}
      .summary
      .count
  ```

## 2.157.0

### Minor Changes

- [#1348](https://github.com/devopness/devopness/pull/1348) [`ac040c7`](https://github.com/devopness/devopness/commit/ac040c71a8b8dda6ddc9f83fbedbdaa2249c1511) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Introduced the 'linked_resources' field in 'ServerEnvironmentCreate', allowing users to specify associated resources at the time of server creation

  This improvement provides better flexibility for defining resource dependencies when provisioning new servers.

## 2.156.0

### Minor Changes

- [#1325](https://github.com/devopness/devopness/pull/1325) [`8d936f0`](https://github.com/devopness/devopness/commit/8d936f028a36cfe3220a61d9c879902463272a02) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Add **programming_language_human_readable** and **framework_human_readable** to Application Models

## 2.155.0

### Minor Changes

- [#1298](https://github.com/devopness/devopness/pull/1298) [`6e2ccd8`](https://github.com/devopness/devopness/commit/6e2ccd8d093d3d7b5fafc8ca0cce4b3b5323008c) Thanks [@Diegiwg](https://github.com/Diegiwg)! - **Breaking Change:** Renamed `allow_custom_steps` property to `is_user_managed` in `PipelineSettings` interface.

  - The new property indicates whether the user has permission to see and manage the pipeline for the resource operation.

- [#1298](https://github.com/devopness/devopness/pull/1298) [`6e2ccd8`](https://github.com/devopness/devopness/commit/6e2ccd8d093d3d7b5fafc8ca0cce4b3b5323008c) Thanks [@Diegiwg](https://github.com/Diegiwg)! - **Breaking Change:** Removed the deprecated `is_auto_generated` property from both `Pipeline` and `PipelineRelation` interfaces as it's no longer used by the Devopness API.

## 2.154.1

### Patch Changes

- [#1292](https://github.com/devopness/devopness/pull/1292) [`fb453cf`](https://github.com/devopness/devopness/commit/fb453cfcb3b8a670c6a47bfbff6473bc818c0de9) Thanks [@souz4-my](https://github.com/souz4-my)! - **Add** `team_memberships` field to `EnvironmentRelation` and `ArquivedEnvironmentRelation` models

- [#1292](https://github.com/devopness/devopness/pull/1292) [`fb453cf`](https://github.com/devopness/devopness/commit/fb453cfcb3b8a670c6a47bfbff6473bc818c0de9) Thanks [@souz4-my](https://github.com/souz4-my)! - **Change** `credentials` field type in `Server` model to nullable

- [#1276](https://github.com/devopness/devopness/pull/1276) [`96a2010`](https://github.com/devopness/devopness/commit/96a2010f630d5bc037193d0962f3113d2ca1aa3e) Thanks [@Diegiwg](https://github.com/Diegiwg)! - **Remove** deprecated `environment_id` field from service operation models

## 2.154.0

### Minor Changes

- [#1256](https://github.com/devopness/devopness/pull/1256) [`60901a2`](https://github.com/devopness/devopness/commit/60901a29c4a7595afdc496405518f03d2580de0c) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Added the 'credential' field to the Networks listing

- [#1256](https://github.com/devopness/devopness/pull/1256) [`60901a2`](https://github.com/devopness/devopness/commit/60901a29c4a7595afdc496405518f03d2580de0c) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Added the 'last action' field to the Networks listing

- [#1256](https://github.com/devopness/devopness/pull/1256) [`60901a2`](https://github.com/devopness/devopness/commit/60901a29c4a7595afdc496405518f03d2580de0c) Thanks [@Diegiwg](https://github.com/Diegiwg), [@souz4-my](https://github.com/souz4-my), [@jfoliveira](https://github.com/jfoliveira)! - Rename the action 'Server Setup' to 'Server Configure' to ensure consistency with the messages displayed to the user during its execution

- [#1256](https://github.com/devopness/devopness/pull/1256) [`60901a2`](https://github.com/devopness/devopness/commit/60901a29c4a7595afdc496405518f03d2580de0c) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Add documentation about 'variable description' max length

## 2.153.0

### Minor Changes

- [#1182](https://github.com/devopness/devopness/pull/1182) [`81cf94d`](https://github.com/devopness/devopness/commit/81cf94d218c45f42feff1724938922df8f574af5) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Add support to Ubuntu 24.04 🎉

## 2.152.0

### Minor Changes

- [#1087](https://github.com/devopness/devopness/pull/1087) [`10f296c`](https://github.com/devopness/devopness/commit/10f296cb5334e40b4c41e28e0fbdeef1748eed75) Thanks [@souz4-my](https://github.com/souz4-my)! - - Added `description` field to `ActionStep` model, so users can understand what's the purpose of a custom pipeline step created by a team member

- [#1087](https://github.com/devopness/devopness/pull/1087) [`10f296c`](https://github.com/devopness/devopness/commit/10f296cb5334e40b4c41e28e0fbdeef1748eed75) Thanks [@Diegiwg](https://github.com/Diegiwg)! - - Add operation server:rotate-key

## 2.151.0

### Minor Changes

- [#1061](https://github.com/devopness/devopness/pull/1061) [`d917573`](https://github.com/devopness/devopness/commit/d917573f811c25f51356830e4808e0e4d9764ccf) Thanks [@Diegiwg](https://github.com/Diegiwg)! - **Add** Azure RM in `CloudProviderServices` highlighting support for Azure RM as a cloud service

- [#1061](https://github.com/devopness/devopness/pull/1061) [`d917573`](https://github.com/devopness/devopness/commit/d917573f811c25f51356830e4808e0e4d9764ccf) Thanks [@Diegiwg](https://github.com/Diegiwg)! - **Add** the `region_human_readable` field to `SubnetProvisionInput` providing users with more context about the selected region

- [#1063](https://github.com/devopness/devopness/pull/1063) [`e8d5df6`](https://github.com/devopness/devopness/commit/e8d5df641b684ceaf9232c5803f5181851d2a357) Thanks [@souz4-my](https://github.com/souz4-my)! - Enhancements to Pipeline Step creation and editing

  - The `Name` field is now optional (nullable) when creating/editing a Pipeline Step.
  - Added a `Description` field for creating/editing Pipeline Steps, also optional (nullable).

- [#1061](https://github.com/devopness/devopness/pull/1061) [`d917573`](https://github.com/devopness/devopness/commit/d917573f811c25f51356830e4808e0e4d9764ccf) Thanks [@Diegiwg](https://github.com/Diegiwg)! - **Create** Azure-specific models for `SubnetProvisionInput` highlighting support for Azure as a cloud provider

## 2.150.0

### Minor Changes

- [#1038](https://github.com/devopness/devopness/pull/1038) [`44f5126`](https://github.com/devopness/devopness/commit/44f5126ac03d52254d413e28cddfe03e4f9bd00a) Thanks [@souz4-my](https://github.com/souz4-my)! - **Add** the `is_auto_generated` field in Pipeline models to help users identify whether a pipeline was automatically generated by Devopness

- [#1038](https://github.com/devopness/devopness/pull/1038) [`44f5126`](https://github.com/devopness/devopness/commit/44f5126ac03d52254d413e28cddfe03e4f9bd00a) Thanks [@souz4-my](https://github.com/souz4-my)! - **Add** support for _OS Environment Variables (os-env-var)_ as a new target for application variables, expanding configuration options. This functionality is accessible via the _variable_targets_ field in the ApplicationOptions model.

- [#1038](https://github.com/devopness/devopness/pull/1038) [`44f5126`](https://github.com/devopness/devopness/commit/44f5126ac03d52254d413e28cddfe03e4f9bd00a) Thanks [@souz4-my](https://github.com/souz4-my)! - **Rename** AWS credential fields to align with AWS tool standards (e.g., CLI):

  - `access_key` → `access_key_id`
  - `secret` → `secret_access_key`

- [#1038](https://github.com/devopness/devopness/pull/1038) [`44f5126`](https://github.com/devopness/devopness/commit/44f5126ac03d52254d413e28cddfe03e4f9bd00a) Thanks [@Diegiwg](https://github.com/Diegiwg)! - **Add** the `region_human_readable` field to `NetworkProvisionInput` and `ServerProvisionInput`, providing users with more context about the selected region

- [#1038](https://github.com/devopness/devopness/pull/1038) [`44f5126`](https://github.com/devopness/devopness/commit/44f5126ac03d52254d413e28cddfe03e4f9bd00a) Thanks [@Diegiwg](https://github.com/Diegiwg)! - **Create** Azure-specific models for `NetworkProvisionInput` and `ServerProvisionInput`, highlighting support for Azure as a cloud provider

- [#1038](https://github.com/devopness/devopness/pull/1038) [`44f5126`](https://github.com/devopness/devopness/commit/44f5126ac03d52254d413e28cddfe03e4f9bd00a) Thanks [@Diegiwg](https://github.com/Diegiwg)! - **Update** Variables to return `value = null` instead of `value = *****` when `hidden = true`. `value` is now `nullable` field in `Variable` models. This change helps users avoid overriding hidden variables values with **\*** when updating

## 2.149.0

### Minor Changes

- [#1028](https://github.com/devopness/devopness/pull/1028) [`07e005a`](https://github.com/devopness/devopness/commit/07e005a0895219caa764af6ff9112cd533b2dc9f) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Remove **action_type** field from **HookPipelineCreate** and **HookUpdate** models

- [#1028](https://github.com/devopness/devopness/pull/1028) [`07e005a`](https://github.com/devopness/devopness/commit/07e005a0895219caa764af6ff9112cd533b2dc9f) Thanks [@souz4-my](https://github.com/souz4-my)! - Rename **auto_generated** field to **is_auto_generated** in models:

  - CronJob
  - CronJobRelation
  - Daemon
  - DaemonRelation
  - Hook
  - HookRelation
  - NetworkRule
  - NetworkRuleRelation
  - Service
  - ServiceRelation

- [#1028](https://github.com/devopness/devopness/pull/1028) [`07e005a`](https://github.com/devopness/devopness/commit/07e005a0895219caa764af6ff9112cd533b2dc9f) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Update operations in **ActionType** enum

- [#1028](https://github.com/devopness/devopness/pull/1028) [`07e005a`](https://github.com/devopness/devopness/commit/07e005a0895219caa764af6ff9112cd533b2dc9f) Thanks [@Diegiwg](https://github.com/Diegiwg)! - Update list of services available in SDK

## 2.148.0

### Minor Changes

- [#1016](https://github.com/devopness/devopness/pull/1016) [`1203b71`](https://github.com/devopness/devopness/commit/1203b71f0d5e8fc22251594d7f3f70174622838c) Thanks [@souz4-my](https://github.com/souz4-my)!
  - Add **target_human_readable** property to the _Variable_ model
  - Add **target_human_readable** property to the _VariableRelation_ model
