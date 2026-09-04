"use strict";

/**
 * Create the pull request used by the API Docs sync workflow.
 *
 * This module is loaded by `.github/workflows/sync-api-spec.yml` through
 * `actions/github-script`. Keeping the PR title, branch name, and body here
 * makes the workflow easier to read and keeps the rules in one place.
 *
 * Local usage:
 *   This file is normally executed through GitHub Actions.
 *
 * @param {{ github: any, context: any, core: any }} params
 * @returns {Promise<void>}
 */
const BRANCH_NAME = "feat/update-auto-generated-models";
const PR_BASE_BRANCH = "main";
const PR_BODY =
  "This PR is auto generated to update auto generated models and endpoints.";

function buildPullRequestTitle(now = new Date()) {
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  const hours = String(now.getUTCHours()).padStart(2, "0");
  const minutes = String(now.getUTCMinutes()).padStart(2, "0");

  return `feat: ${year}-${month}-${day} ${hours}:${minutes} - Update auto generated models`;
}

async function createOrUpdatePullRequest({ github, context, core }) {
  const title = buildPullRequestTitle();

  const { data: existingPulls } = await github.rest.pulls.list({
    owner: context.repo.owner,
    repo: context.repo.repo,
    state: "open",
    head: `${context.repo.owner}:${BRANCH_NAME}`,
    base: PR_BASE_BRANCH,
  });

  if (existingPulls.length > 0) {
    core.info(`PR already exists: #${existingPulls[0].number}`);
    return;
  }

  await github.rest.pulls.create({
    owner: context.repo.owner,
    repo: context.repo.repo,
    title,
    head: BRANCH_NAME,
    base: PR_BASE_BRANCH,
    body: PR_BODY,
  });
}

module.exports = {
  buildPullRequestTitle,
  createOrUpdatePullRequest,
  BRANCH_NAME,
  PR_BASE_BRANCH,
  PR_BODY,
};
