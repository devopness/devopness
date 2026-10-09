## Description of changes
- [x] Add a release workflow cleanup step so generated changelog files are kept in a linted state before the release PR is created.

## GitHub issues resolved by this PR
N/A

## Quality Assurance
- Once the changes in this PR are merged and deployed, release PR generation will not leave `CHANGELOG.md` in a state that fails the repo lint checks.

## More info
Evidence from the failing PR branch:
- CI lint failure: https://github.com/devopness/devopness/actions/runs/37910719713/job/113754963732?pr=3712
  - `packages/ui/react` failed on `npm run lint`
  - error: `Formatting issues found` in `CHANGELOG.md`
  - suggestion: `vp check --fix`
- Release publish failure: https://github.com/devopness/devopness/actions/runs/37910719713/job/113754963732?pr=3712#step:6:12
  - `changesets/action` tried to publish `@devopness/ui-react@2.209.3`
  - publish failed because `npm run lint && npm test && npm run build` exited with code 1
