"use strict";

/**
 * Create the pull request used by the API Docs sync workflow.
 *
 * This script is executed directly with `node` by
 * `.github/workflows/sync-api-spec.yml`. Keeping the PR title, branch name,
 * and body here makes the workflow easier to read and keeps the rules in one
 * place.
 *
 * Local usage:
 *   GITHUB_TOKEN=... GITHUB_REPOSITORY=owner/repo node .github/scripts/sync-api-spec-create-or-update-pr.js
 *
 * Required environment variables:
 *   GITHUB_TOKEN
 *   GITHUB_REPOSITORY
 */
const BRANCH_NAME = "feat/update-auto-generated-models";
const PR_BASE_BRANCH = "main";
const PR_BODY =
  "This PR is auto generated to update auto generated models and endpoints.";

/**
 * Build the PR title used by the API docs sync flow.
 *
 * @param {Date} [now=new Date()] - The timestamp to format.
 * @returns {string} The PR title in the legacy timestamped format.
 */
function buildPullRequestTitle(now = new Date()) {
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  const hours = String(now.getUTCHours()).padStart(2, "0");
  const minutes = String(now.getUTCMinutes()).padStart(2, "0");

  return `feat: ${year}-${month}-${day} ${hours}:${minutes} - Update auto generated models`;
}

/**
 * Parse `GITHUB_REPOSITORY` into owner and repo names.
 *
 * @returns {{ owner: string, repo: string }} The repository parts.
 * @throws {Error} If the repository variable is missing or malformed.
 */
function parseRepository() {
  const repository = process.env.GITHUB_REPOSITORY;

  if (!repository || !repository.includes("/")) {
    throw new Error("GITHUB_REPOSITORY must be set to owner/repo");
  }

  const [owner, repo] = repository.split("/", 2);
  return { owner, repo };
}

/**
 * Call the GitHub REST API with the configured token.
 *
 * @param {string} path - API path relative to `https://api.github.com`.
 * @param {RequestInit} [options={}] - Fetch options.
 * @returns {Promise<any>} The parsed JSON response, or `null` for 204.
 * @throws {Error} If the token is missing or the API returns an error.
 */
async function githubRequest(path, options = {}) {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error("GITHUB_TOKEN must be set");
  }

  const response = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `GitHub API request failed for ${path}: ${response.status} ${response.statusText}\n${body}`,
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

/**
 * Create the PR if it does not already exist.
 *
 * The workflow calls this after the generated spec changes are committed.
 *
 * @returns {Promise<void>}
 */
async function createOrUpdatePullRequest() {
  const { owner, repo } = parseRepository();
  const title = buildPullRequestTitle();

  const existingPulls = await githubRequest(
    `/repos/${owner}/${repo}/pulls?state=open&head=${encodeURIComponent(`${owner}:${BRANCH_NAME}`)}&base=${encodeURIComponent(PR_BASE_BRANCH)}`,
  );

  if (existingPulls.length > 0) {
    console.info(`PR already exists: #${existingPulls[0].number}`);
    return;
  }

  await githubRequest(`/repos/${owner}/${repo}/pulls`, {
    method: "POST",
    body: JSON.stringify({
      owner,
      repo,
      title,
      head: BRANCH_NAME,
      base: PR_BASE_BRANCH,
      body: PR_BODY,
    }),
  });
}

/**
 * Script entrypoint.
 *
 * @returns {Promise<void>}
 */
async function main() {
  try {
    await createOrUpdatePullRequest();
  } catch (error) {
    console.error(error instanceof Error ? error.stack || error.message : error);
    process.exit(1);
  }
}

main();
