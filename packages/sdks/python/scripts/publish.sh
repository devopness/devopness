#!/usr/bin/env bash

# Script to publish the Devopness Python SDK to PyPI

set -Eeuo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR/.."
PYPROJECT_FILE="$PROJECT_ROOT/pyproject.toml"
VERSION_FILE="$PROJECT_ROOT/package.json"

BASE_VERSION="$(poetry version --short)"
PUBLISH_VERSION="$(grep '"version"' "$VERSION_FILE" | cut -d '"' -f 4)"

log() {
  local emoji="$1"
  local message="$2"
  echo "$emoji  $message"
}

fail() {
  local message="$1"
  log "🚨" "$message"
  exit 1
}

set_version_in_pyproject() {
  local version="$1"
  sed -i "s/^version = \".*\"/version = \"$version\"/" "$PYPROJECT_FILE"
}

restore_version() {
  log "🧹" "Restoring original version ($BASE_VERSION) in pyproject.toml..."
  set_version_in_pyproject "$BASE_VERSION"
}

trap restore_version EXIT

[[ -z "${POETRY_PYPI_TOKEN:-}" ]] && fail "Environment variable POETRY_PYPI_TOKEN is not set. Please export it before running this script."

[[ -z "$PUBLISH_VERSION" ]] && fail "Publish version not found in $VERSION_FILE."

log "🔧" "Temporarily setting version to $PUBLISH_VERSION in pyproject.toml..."
set_version_in_pyproject "$PUBLISH_VERSION"

log "📦" "Building Devopness SDK (version $PUBLISH_VERSION)..."
poetry build --no-cache

EXPECTED_ARTIFACT="dist/devopness-$PUBLISH_VERSION-py3-none-any.whl"
[[ ! -f "$EXPECTED_ARTIFACT" ]] && fail "Expected artifact not found: $EXPECTED_ARTIFACT"

log "🔐" "Configuring PyPI credentials..."
poetry config pypi-token.pypi "$POETRY_PYPI_TOKEN"

log "🚀" "Publishing Devopness SDK to PyPI..."
set +e
PUBLISH_OUTPUT=$(poetry publish 2>&1)
PUBLISH_EXIT_CODE=$?
set -e

if [[ $PUBLISH_EXIT_CODE -ne 0 ]]; then
  if echo "$PUBLISH_OUTPUT" | grep -q "File already exists"; then
    log "⚠️" "Package version already exists on PyPI. Skipping publish step."
    log "ℹ️" "To publish again, bump the version in $VERSION_FILE."
  else
    log "❌" "An error occurred during publishing:"
    echo "$PUBLISH_OUTPUT"
    exit 1
  fi
else
  log "✅" "Successfully published version $PUBLISH_VERSION to PyPI!"
  echo "🔗  https://pypi.org/project/devopness/$PUBLISH_VERSION/"
fi
