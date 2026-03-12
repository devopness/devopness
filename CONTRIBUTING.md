# Contributing to Devopness

Thank you for considering contributing to Devopness! We appreciate your help and value all community contributions.

## Before getting started

Show your appreciation for Devopness 💜! It means a lot to our team:

- ⭐ Star this repository
- [Sign up](https://app.devopness.com/signup/) for a FREE Devopness account
- Join our community on [Discord](https://devopness.com/discord/): we're friendly and always happy to help :-)
- Follow us on social networks:
  - [LinkedIn](https://www.linkedin.com/company/devopness/)
  - [Twitter/X](https://twitter.com/devopness)
  - [YouTube](https://www.youtube.com/@devopness)
  - [TikTok](https://www.tiktok.com/@devopness)
  - [Instagram](https://www.instagram.com/devopness)

## Code of Conduct

Please make sure to read and observe our [Contributor Code of Conduct](./CODE_OF_CONDUCT.md).

## Contributing Guidelines

### Getting Started

**Fork & Setup Workflow:**

1. To become familiar with working with forks, please read and follow the [standard fork based workflow](https://gist.github.com/Chaser324/ce0505fbed06b947d962), which could be summarized with the following steps:
   - [Fork Devopness repository](https://github.com/devopness/devopness/fork)
   - Create a branch
   - When the changes in a branch are tested, open a pull request from your fork

**Ways to Contribute:**

1. [Report a bug 🐛 or submit new ideas 🆕 💡](https://github.com/devopness/devopness/issues/new/choose)
   - ❓ Ask questions and help other Devopness users with open [discussions](https://github.com/devopness/devopness/discussions)
1. Find a [Good First Issue](https://github.com/devopness/devopness/issues?q=is%3Aissue%20state%3Aopen%20label%3A%22good%20first%20issue%22)
   - **Good first issues** are a great way to start contributing to the project and get familiar with the codebase. Browse the list and choose an issue that interests you!

### Submitting a Pull Request

1. **Open a pull request:** Once you've implemented a new feature or fix, open a pull request for review
1. **Review your own PR first:** Take a moment to review your own changes:
   - Ensure all automated checks are passing
   - Verify code quality and adherence to best practices
   - Check that all files end with a final newline (this is important!)
   - Make sure you have properly [configured git](https://docs.github.com/en/get-started/git-basics/configuring-git-to-handle-line-endings) or your IDE (see IDE Configuration below) to automatically add final newlines
     - 💡 Tip: IDE configuration is easier than git configuration 🥭 🍒
1. **Ask for review:**
   - Ask for review in our [Discord channel #open-source-contributions](https://discord.com/channels/1354644459031232655/1366431403931336714)
   - Your pull request will be reviewed
   - Note: you might need to make changes on your pull request based on reviewers' feedback
1. **Merge:** Once approved, maintainers will merge your pull request into the main repository branch

#### IDE Configuration

To ensure [consistent code formatting](https://docs.github.com/en/get-started/git-basics/configuring-git-to-handle-line-endings) and avoid common issues, please configure your IDE with these settings:

**For VSCode, Cursor, Windsurf, and similar editors:**

Add these settings to your workspace or user settings (`settings.json`):

```json
{
  "files.insertFinalNewline": true,
  "files.trimFinalNewlines": true
}
```

This ensures:

- All files end with a final newline (prevents "No newline at end of file" warnings)
- Trailing newlines are trimmed (keeps files clean)

**Why this matters:** Consistent file endings make diffs cleaner, prevent merge conflicts, and follow POSIX standards. It's a small detail that makes a big difference in collaborative development!

### Pull request titles

**Pull request titles should**:

- be written in the active imperative form
- not end with a period (`.`)
- be read in natural language. As a simple rule, one can pretend the message in a pull request title starts with `"This change will ..."`
  - **Example**: for a pull request that has the title `fix broken links on user profile page`, it could be read as `This change will ... fix broken links on user profile page`

Here are some **bad examples** of pull request titles we're trying to avoid:

- `Fixes a bug`
- `Adds a feature`
- `Feature now does something`

### Pull request descriptions

**A good PR description is essential** - even for DRAFT pull requests! It helps reviewers understand your changes quickly and provides context for future reference.

**What to include:**

- **Clear summary:** What does this PR do? Why is it needed?
- **Visual evidence (when applicable):** For changes that affect UI, documentation, or visual elements, include BEFORE and AFTER screenshots or examples
  - This is especially important for design system changes, documentation updates, or any visual modifications
  - Show that images are rendering correctly, layouts work as expected, etc.
- **Testing notes:** How did you test this? What scenarios did you cover?
- **Related issues:** Link to any related issues or discussions

**Examples of great PR descriptions:**

- [docs: add help/documentation for servers #2213](https://github.com/devopness/devopness/pull/2213) - Comprehensive documentation with clear examples and screenshots.
- [feat(design-system): add borderBottomColor prop to customize Card header #1515](https://github.com/devopness/devopness/pull/1515) - Design system change with visual BEFORE/AFTER examples.
- [fix(design-system): runtime error rendering shieldLock icon #1556](https://github.com/devopness/devopness/pull/1556) - Bug fix with clear problem description, solution, and testing notes.
- [refactor(sdk-python): remove usage of subprocess in build script](https://github.com/devopness/devopness/pull/1955) - Refactor and security improvements with clear mentions of code changes.
- [ci: always run verification jobs](https://github.com/devopness/devopness/pull/2482) - CI improvements and dependencies upgrade in GitHub Actions workflows.

**Remember:** Even if your PR is a work in progress (DRAFT), a good description helps maintainers understand your direction and provide early feedback!

### Feature Work

**When to open an issue first:**

- For larger features or breaking changes, please open a [new issue](https://github.com/devopness/devopness/issues/new/choose) before investing a lot of your time, so we can discuss and plan the feature together.
- Please browse current issues to make sure your issue is unique, to lighten the triage burden on our maintainers.

**For smaller features:** Feel free to submit a PR directly, but please limit your pull requests to contain only one feature at a time. Separating feature work into individual pull requests helps speed up code review and reduces the barrier to merge.

## Releases

We publish package releases and changelogs using [GitHub Releases](https://github.com/devopness/devopness/releases) together with Changesets.

### Changesets

**TL;DR:** If your changes affect packages, you'll need to add a changeset file. This helps us generate changelogs and version packages correctly.

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

Need help? Have questions? Want to connect with other contributors? Join us on [Discord](https://devopness.com/discord/) or start a [GitHub discussion](https://github.com/devopness/devopness/discussions)!
