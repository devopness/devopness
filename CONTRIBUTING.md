# Contributing to Devopness

Thank you for considering contributing to Devopness!

We appreciate the help!

All community contributions are helpful to our team and for the Devopness community!

## Before getting started

Show your appreciation for Devopness 💜! It means a lot to our team:

- ⭐ Star this repository
- [Sign up](https://app.devopness.com/signup/) for a FREE Devopness account
- Follow [Devopness page on LinkedIn](https://www.linkedin.com/company/devopness/)
- 📣 Share [our LinkedIn posts](https://www.linkedin.com/company/devopness/posts/) on social networks: Discord, LinkedIn, Slack, Twitter, ...

## Code of Conduct

Please make sure to read and observe our [Contributor Code of Conduct](./CODE_OF_CONDUCT.md).

## Contributing Guidelines

### Getting Started

1. [Fork the repository](https://github.com/devopness/devopness/fork) and start working on it
   - To become familiar working with forks, please read and follow the [standard fork based workflow](https://gist.github.com/Chaser324/ce0505fbed06b947d962), which could be summarized with the following steps:
      - Fork Devopness repository
      - Create a branch
      - When the changes in a branch are tested, open a pull request from your fork
2. [Report a bug 🐛 or submit new ideas 🆕 💡](https://github.com/devopness/devopness/issues/new/choose)
   - ❓ Ask questions and help other Devopness users with open [discussions](https://github.com/devopness/devopness/discussions)
3. Find a "[Good First Issue](https://github.com/devopness/devopness/labels/"good%20first%20issue")"
   - **Good first issues** are a great way to start contributing to the project and get familiar with the codebase. Here's how to find them:
     - Visit the "[Issues](https://github.com/devopness/devopness/issues)" tab on the main [repository](https://github.com/devopness/devopness)
     - Use the "Labels" filter and select "[Good First Issue](https://github.com/devopness/devopness/labels/"good%20first%20issue")" to see a list of beginner-friendly tasks
     - Choose an issue that interests you

### Submitting a Pull Request

1. Once you implemented a new feature or a fix for an issue, open a pull request for review
   - Please ensure all automated checks on your PR are passing, otherwise the PR will not be considered ready to be reviewed
1. **Code Review:** Your pull request will be reviewed
   - Note: you might need to make changes on your pull request based on reviewers' feedback
1. **Merge:** Once approved, maintainers will merge your pull request into the main repository branch

### Pull request titles

**Pull request titles should**:

- be written in the active imperative form
- not end with a period (`.`)
- be read in natural language. As a simple rule one can pretend the message in a pull request title starts with `"This change will ..."`
  - **Example**: for a pull request that has the title `fix broken links on user profile page`, it could be read as `This change will ... fix broken links on user profile page`

Here are some **bad examples** of pull requests titles we're trying to avoid:

- `Fixes a bug`
- `Adds a feature`
- `Feature now does something`

### Feature Work

For larger features, we would appreciate it if you open a [new issue](https://github.com/devopness/devopness/issues/new/choose) before investing a lot of your time trying to solve it, so we can discuss and plan the feature together.

Please also be sure to browse current issues to make sure your issue is unique, to lighten the triage burden on our maintainers.
Finally, please limit your pull requests to contain only one feature at a time. Separating feature work into individual pull requests helps speed up code review and reduces the barrier to merge.

## Releases

We publish package releases and changelogs using [GitHub Releases](https://github.com/devopness/devopness/releases) together with Changesets.

### Changesets

Changesets are small files that describe what changed and what kind of version bump is required (patch, minor, or major). They are used to generate changelogs and help our release tooling determine new package versions.

- Why: ensures consistent, readable changelogs and predictable versioning.
- Where: changeset files live under the repository root in the `.changeset/` directory.

Read the official Changesets documentation: [Changesets](https://github.com/changesets/changesets)

### Adding a changeset

Preferred (interactive): run the CLI from the repo root and follow the prompts:

```bash
npx @changesets/cli
```

This interactive command will ask which packages are affected, what type of bump is required, and for a short description. It will create a new file under `.changeset/` which must be included in your **Pull Request**.

Manual: you can also create a markdown file directly in `.changeset/`. See the docs for the exact file format and examples: [Adding a changeset](https://github.com/changesets/changesets/blob/main/docs/adding-a-changeset.md)

### Pull Request checklist for changes that affect packages

- **Include a changeset:** make sure the generated or manual changeset file is in your branch and PR.
- **Accurate bump type:** confirm the chosen bump (patch/minor/major) matches the user-visible change.
- **Run tests & linters:** ensure CI passes before requesting a merge.
- **Ask if unsure:** if you’re unsure what bump to choose, add a note in the PR or start a discussion so maintainers can advise.

If you need help creating a changeset or understanding bump types, start a discussion or mention maintainers on your pull request.

## Getting Help

If you want to talk with other folks in the Devopness community (including members of the Devopness team) please [start a discussion](https://github.com/devopness/devopness/discussions) and we will soon get in touch with you.
