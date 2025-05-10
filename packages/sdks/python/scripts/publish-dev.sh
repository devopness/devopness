#!/usr/bin/env bash

# Script to publish the Devopness Python SDK to Test PyPI

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR/.."
PYPROJECT_FILE="$PROJECT_ROOT/pyproject.toml"
VERSION_FILE="$PROJECT_ROOT/package.json"

# Function to update version in pyproject.toml
set_version_in_pyproject() {
  local version="$1"
  sed -i "s/^version = \".*\"/version = \"$version\"/" "$PYPROJECT_FILE"
}

# Ensure token is set
if [[ -z "${POETRY_TEST_PYPI_TOKEN:-}" ]]; then
  echo "🚨  Environment variable POETRY_TEST_PYPI_TOKEN is not set. Please export it before running this script."
  exit 1
fi

# Store original and test version
ORIGINAL_VERSION=$(poetry version --short)
TEST_VERSION=$(grep '"version"' "$VERSION_FILE" | cut -d '"' -f 4)

# Ensure test version was found
if [[ -z "$TEST_VERSION" ]]; then
  echo "🚨  TestPyPI version not found in .version file."
  exit 1
fi

# Restore original version on exit
restore_version() {
  echo "🧹  Restoring original version ($ORIGINAL_VERSION) in pyproject.toml..."
  set_version_in_pyproject "$ORIGINAL_VERSION"
}
trap restore_version EXIT

# Update to test version
echo "🔧  Temporarily setting version to $TEST_VERSION in pyproject.toml..."
set_version_in_pyproject "$TEST_VERSION"

# Build package
echo "📦  Building Devopness SDK (version $TEST_VERSION)..."
poetry build --no-cache

# Validate expected artifact
EXPECTED_ARTIFACT="dist/devopness-$TEST_VERSION-py3-none-any.whl"
if [[ ! -f "$EXPECTED_ARTIFACT" ]]; then
  echo "🚨  Expected artifact not found: $EXPECTED_ARTIFACT"
  exit 1
fi

# Configure PyPI token
echo "🔐  Configuring Test PyPI credentials..."
poetry config pypi-token.TestPiPy "$POETRY_TEST_PYPI_TOKEN"

# Publish package
echo "🚀  Publishing Devopness SDK to Test PyPI..."
set +e
PUBLISH_OUTPUT=$(poetry publish -r TestPiPy 2>&1)
PUBLISH_EXIT_CODE=$?
set -e

# Handle result
if [[ $PUBLISH_EXIT_CODE -ne 0 ]]; then
  if echo "$PUBLISH_OUTPUT" | grep -q "File already exists"; then
    echo "⚠️  Package version already exists on Test PyPI. Skipping publish step."
    echo "ℹ️  To publish again, you must bump the version in $VERSION_FILE."
  else
    echo "❌  An error occurred during publishing:"
    echo "$PUBLISH_OUTPUT"
  fi
else
  echo "✅  Successfully published version $TEST_VERSION to Test PyPI!"
fi
