# TODO
## Automated tests
- [ ] drop manual requests and `DevopnessAPI.ts` module: find a way to deal with the dangling default application in new projects.
- [ ] remove dependency on pre-configured user account with existing source provider:
  - [ ] link source provider programatically through hooks.
  - [ ] mock source code repository and related entities (owner, branch, ref, etc.).
- [ ] `hooks.log` with multiple log levels
- [ ] read CLI arguments, allow dredd `--list-only` to run without hooks.
- [ ] enable `ssh_key` tests: `addSshKeyToProject201` should use a generative RSA key if using static user fixture.
- [ ] enable `ssl_certificate` tests: skip until upcoming refactor.
- [ ] enable `action` tests: no generator routes.
- [ ] enable `deployment` tests: no generator route.
- [ ] enable `deployment_step` tests: no generator route? no ID in DeploymentStep.
- [ ] enable `script` tests: no generator routes.
- [ ] enable `variable` tests: no generator route.
- [ ] enable `social_provider` and `social_account` tests: skip until upcoming refactor.
- [ ] enable `respository` tests: dependant on `source_provider`.
- [ ] enable `users` tests: `activateUser204`, `sendUserPasswordResetLink200` and `resetUserPassword200` require email validation mocking logic.
- [ ] run 404 transactions: proof-of-concept running over clean-slate user accounts
- [X] extract initial transaction graph and fixture-transaction graph from graph-building logic.
