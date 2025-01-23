// usage `PR_DESCRIPTION_JSON=$(cat ./pr-validate-description-test-data.json | base64) node pr-validate-description.js`

let inputData = Buffer.from(process.env.PR_DESCRIPTION_JSON, "base64").toString(
  "utf8",
);
let prDescription = JSON.parse(inputData);

validateDescriptionOfChanges(prDescription.Description_of_changes);
validateResolvedIssuesSection(prDescription.GitHub_issues_resolved_by_this_PR);
validateQaSection(prDescription.Quality_Assurance);

function fail(fieldName, message) {
  console.log(`❌ ${fieldName}:
  > ${message}`);
  process.exitCode = 1;
}

function pass(fieldName, message) {
  console.log(`✅ ${fieldName}:
  > ${message}`);
}

function validateDescriptionOfChanges(descriptionOfChanges) {
  const descriptionText = descriptionOfChanges.bodies
    .filter((item) => item.type === "list")
    .map((item) => item.raw.trim())
    .join(" ");

  if (!descriptionText || descriptionText.length === 0) {
    fail(
      "Description of Changes",
      "Pull requests must include a short description of changes in the 'Description of changes' field. This field cannot be empty.",
    );
  } else {
    pass("Description of Changes", descriptionText);
  }
}

function validateResolvedIssuesSection(resolvedIssues) {
  const GITHUB_ISSUE_FORMAT = /#\d+/g;
  const issuesCheckList = resolvedIssues.bodies
    .filter((item) => item.type === "list")
    .at(0);
  const issueList = issuesCheckList?.raw.match(GITHUB_ISSUE_FORMAT) ?? [];

  if (
    issueList.length === 0 &&
    !issuesCheckList?.raw.toLowerCase().includes("n/a")
  ) {
    fail(
      "Missing Resolved Issues",
      `Pull requests must specify at least one resolved GitHub issue (e.g., #123) or explicitly state "N/A" if no issue applies, in field "${issuesCheckList.raw}"`,
    );
  } else {
    pass(
      "Issues resolved by this pull request",
      issueList.length > 0 ? issueList : "N/A",
    );
  }
}

function validateQaSection(qaSection) {
  const SUCCESS_CRITERIA_TITLE =
    "- Once the changes in this PR are merged and deployed, success criteria is:";

  let qaCheckList = qaSection.bodies.filter((item) => item.type === "list")[0];

  let successCriteria = qaCheckList.items[0];

  if (successCriteria.raw.trim() == SUCCESS_CRITERIA_TITLE) {
    fail(
      "Success criteria",
      `Pull requests must have a short description of success criteria, in field "${successCriteria.raw}"`,
    );
  } else {
    pass("Success criteria", successCriteria.raw);
  }
}
