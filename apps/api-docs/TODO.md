# TODO
## Automated tests
- [ ] extract initial transaction graph and fixture-transaction graph from graph-building logic
- [ ] drop manual requests and `DevopnessAPI.ts` module: find a way to deal with the dangling default application in new projects
- [ ] remove dependency on pre-configured user account with existing source provider:
  - [ ] link source provider programatically through hooks
  - [ ] mock source code repository and related entities (owner, branch, ref, etc.)
- [ ] `hooks.log` with multiple log levels
- [ ] read CLI arguments, allow dredd `--list-only` to run without hooks
- [ ] enable `ssh_key` tests: `addSshKeyToProject201` uses a generative RSA key
- [ ] enable `action` tests
- [ ] enable `deployment` tests
- [ ] enable `deployment_step` tests
- [ ] enable `script` tests
