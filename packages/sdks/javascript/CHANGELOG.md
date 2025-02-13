# @devopness/sdk-js

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
