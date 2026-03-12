#!/usr/bin/env node
/**
 * Regression test for pr-validate-description.js
 *
 * Simulates exactly how the GitHub Actions "Write JSON to Disk" step
 * feeds data to the validation script:
 *
 *   cat > .github/scripts/tmp-pr-description-data.json <<'PR_JSON_EOF'
 *   ${{ steps.markdown.outputs.data }}
 *   PR_JSON_EOF
 *
 * The fixture file (pr-validate-description-test-fixture.json) holds the
 * real JSON payload from the failed CI run (PR #2756). It was captured from:
 *   https://github.com/devopness/devopness/actions/runs/22670293172/job/65712314795
 *
 * That run broke because pr-lint.yml used <<EOF (unquoted heredoc), so bash
 * interpreted backtick-wrapped markdown like `/docs` as command substitutions.
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
const FIXTURE = path.join(
  __dirname,
  "pr-validate-description-test-fixture.json"
);

function runScript() {
  try {
    const output = execSync(`node "${SCRIPT}"`, { encoding: "utf8" });
    return { exitCode: 0, output };
  } catch (error) {
    return { exitCode: error.status ?? 1, output: error.stdout + error.stderr };
  }
}

function cleanup() {
  if (fs.existsSync(TMP_JSON)) fs.unlinkSync(TMP_JSON);
}

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

// Reproduces the exact CI failure from PR #2756:
// The JSON payload (from kkurno/action-markdown-reader) contains backticks and
// parentheses in the Quality Assurance success criteria. This is written to disk
// exactly as the "Write JSON to Disk" CI step does — raw string, no serialization.
test(
  "Real CI payload with backticks and parentheses in success criteria passes validation",
  () => {
    // Simulate: cat > tmp-pr-description-data.json <<'PR_JSON_EOF'
    //           ${{ steps.markdown.outputs.data }}
    //           PR_JSON_EOF
    const rawJson = fs.readFileSync(FIXTURE, "utf8");
    fs.writeFileSync(TMP_JSON, rawJson, "utf8");

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
