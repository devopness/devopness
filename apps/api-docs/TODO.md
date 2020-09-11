# TODO
## No generator routes
- [ ] enable `action` tests: present in POST routes for: server, application, service, ssh key, cron jobs, daemons, network rules
- [ ] enable `variable` tests: application_variable x variable.
- [ ] enable `script` tests: application_script x script.
- [ ] enable `deployment` tests: application_deployment x deployment.
## Upcoming refactors
- [ ] enable `source_provider` and `social_account` tests: verify.
- [ ] enable `respository` tests: dependant on `source_provider`.
- [ ] enable `ssl_certificate` tests: skip until upcoming enviroment ID refactor.
- [ ] enable `deployment_step` tests: upcoming refactor in `getDeploymentStepLog`
## Static user account
- [ ] enable `ssh_key` tests: `addSshKeyToProject201` should use a generative RSA key if using static user fixture.
- [ ] drop manual requests and `DevopnessAPI.ts` module: find a way to deal with the dangling default application in new projects.
  - [ ] remove dependency on pre-configured user account with existing source provider
## source_provider mocking
- [ ] link source provider programatically through hooks.
- [ ] mock source code repository and related entities (owner, branch, ref, etc.).
## Email mock logic
- [ ] enable `users` tests: `activateUser204`, `sendUserPasswordResetLink200` and `resetUserPassword200` require email validation mocking logic.
## Improvements/research
- [ ] run 404 transactions: proof-of-concept running over clean-slate user accounts
## Dredd source hacks
- [ ] `hooks.log` with multiple log levels
- [ ] read CLI arguments, allow dredd `--list-only` to run without hooks.
