#!/usr/bin/env node
/**
 * Test for pr-validate-description.js
 *
 * Reproduces CI failures, for instance when PR descriptions containing backticks,
 * parentheses, or other shell-special characters in the Quality Assurance
 * section caused the "Write JSON to Disk" workflow step to crash.
 *
 * Usage:
 *   node .github/scripts/pr-validate-description-test.js
 */

/* eslint-disable no-console */
const { execSync } = require("child_process");
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const SCRIPT = path.join(__dirname, "pr-validate-description.js");
const TMP_JSON = path.join(__dirname, "tmp-pr-description-data.json");

function runScript() {
  try {
    const output = execSync(`node "${SCRIPT}"`, { encoding: "utf8" });
    return { exitCode: 0, output };
  } catch (error) {
    return { exitCode: error.status ?? 1, output: error.stdout + error.stderr };
  }
}

function writeTestData(data) {
  fs.writeFileSync(TMP_JSON, JSON.stringify(data, null, 2), "utf8");
}

function cleanup() {
  if (fs.existsSync(TMP_JSON)) fs.unlinkSync(TMP_JSON);
}

// Reproduces sample PR description that fails in CI:
// success criteria text contains backticks (markdown code spans) and
// parentheses — the characters that broke the unquoted bash heredoc.
const PR_WITH_SPECIAL_CHARS_IN_SUCCESS_CRITERIA = {
  Description_of_changes: {
    bodies: [
      {
        type: "list",
        raw: "- [x] Some item using `backticks` and single 'quotes'\n- [x] Another checklist item",
        items: [
          {
            checked: true,
            raw: "Some configuration changes",
          },
          { checked: true, raw: "Another checklist item" },
        ],
      },
    ],
  },
  GitHub_issues_resolved_by_this_PR: {
    bodies: [
      {
        type: "list",
        raw: "- [x] N/A",
        items: [{ checked: true, raw: "N/A" }],
      },
    ],
  },
  Quality_Assurance: {
    bodies: [
      {
        type: "list",
        raw: "- Once the changes in this PR are merged and deployed, success criteria is: no errors, even when success criteria use `/paths/within/backticks`.",
        items: [
          {
            checked: false,
            raw: "Once the changes in this PR are merged and deployed, success criteria is: no errors, even when success criteria use `/paths/within/backticks`.",
          },
        ],
      },
    ],
  },
};

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (err) {
    console.log(`❌ ${name}: ${err.message}`);
    failed++;
  } finally {
    cleanup();
  }
}

console.log("");
console.log("pr-validate-description tests");
console.log("─".repeat(50));
console.log("");

test(
  "PR with backticks and parentheses in success criteria passes validation",
  () => {
    writeTestData(PR_WITH_SPECIAL_CHARS_IN_SUCCESS_CRITERIA);
    const { exitCode, output } = runScript();
    assert.strictEqual(
      exitCode,
      0,
      `Expected exit code 0 but got ${exitCode}.\nOutput:\n${output}`
    );
  }
);

console.log("");
console.log(`${passed + failed} test(s): ${passed} passed, ${failed} failed`);
console.log("");

if (failed > 0) process.exitCode = 1;
