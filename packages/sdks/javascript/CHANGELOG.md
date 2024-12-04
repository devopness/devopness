# @devopness/sdk-js

## 2.150.0

### Minor Changes

- [#1038](https://github.com/devopness/devopness/pull/1038) [`44f5126`](https://github.com/devopness/devopness/commit/44f5126ac03d52254d413e28cddfe03e4f9bd00a) Thanks [@devopness-automations](https://github.com/devopness-automations)! - Add is_auto_generated field in Pipeline and PipelineRelation models

- [#1038](https://github.com/devopness/devopness/pull/1038) [`44f5126`](https://github.com/devopness/devopness/commit/44f5126ac03d52254d413e28cddfe03e4f9bd00a) Thanks [@devopness-automations](https://github.com/devopness-automations)! - Add variable_targets field in ApplicationOptions model

- [#1038](https://github.com/devopness/devopness/pull/1038) [`44f5126`](https://github.com/devopness/devopness/commit/44f5126ac03d52254d413e28cddfe03e4f9bd00a) Thanks [@devopness-automations](https://github.com/devopness-automations)! - Rename fields in CredentialAws model
  - access_key -> access_key_id
  - secret -> secret_access_key

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
