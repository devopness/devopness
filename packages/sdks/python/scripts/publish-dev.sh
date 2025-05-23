#!/usr/bin/env bash

# Script to publish the Devopness Python SDK to Test PyPI
# Usage: ./publish-to-test-pypi.sh [--dry-run]

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$SCRIPT_DIR/.."
PYPROJECT_FILE="$PROJECT_ROOT/pyproject.toml"
VERSION_FILE="$PROJECT_ROOT/package.json"
DRY_RUN=false

# Parse arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    *)
      echo -e "${RED}Error: Unknown option $1${NC}"
      exit 1
      ;;
  esac
done

# Function to print error and exit
error_exit() {
  echo -e "${RED}Error: $1${NC}" >&2
  exit 1
}

# Function to validate version format
validate_version() {
  local version=$1
  if ! [[ "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+(-[a-zA-Z0-9]+(\.[0-9]+)?)?$ ]]; then
    error_exit "Invalid version format: $version. Must follow semantic versioning."
  fi
}

# Function to update version in pyproject.toml
set_version_in_pyproject() {
  local version="$1"
  validate_version "$version"
  sed -i "s/^version = \".*\"/version = \"$version\"/" "$PYPROJECT_FILE"
}

# Check for required tools
check_requirements() {
  if ! command -v poetry &> /dev/null; then
    error_exit "poetry is not installed. Please install it first."
  fi
}

# Main publishing function
publish_package() {
  local version="$1"
  
  echo -e "${YELLOW}📦 Building Devopness SDK (version $version)...${NC}"
  poetry build --no-cache || error_exit "Build failed"

  # Verify artifacts
  local wheel_file="dist/devopness-${version}-py3-none-any.whl"
  local tar_file="dist/devopness-${version}.tar.gz"
  
  if [[ ! -f "$wheel_file" || ! -f "$tar_file" ]]; then
    error_exit "Expected artifacts not found: $wheel_file and $tar_file"
  fi

  if [[ "$DRY_RUN" == true ]]; then
    echo -e "${GREEN}✅ Dry run successful - would publish version $version to Test PyPI${NC}"
    return 0
  fi

  echo -e "${YELLOW}🔐 Configuring Test PyPI credentials...${NC}"
  poetry config pypi-token.TestPiPy "$POETRY_TEST_PYPI_TOKEN"

  echo -e "${YELLOW}🚀 Publishing Devopness SDK to Test PyPI...${NC}"
  set +e
  PUBLISH_OUTPUT=$(poetry publish -r TestPiPy 2>&1)
  PUBLISH_EXIT_CODE=$?
  set -e

  if [[ $PUBLISH_EXIT_CODE -ne 0 ]]; then
    if echo "$PUBLISH_OUTPUT" | grep -q "File already exists"; then
      echo -e "${YELLOW}⚠️ Package version already exists on Test PyPI. Skipping publish.${NC}"
      echo -e "${YELLOW}ℹ️ To publish again, bump the version in $VERSION_FILE.${NC}"
    else
      error_exit "Publishing failed:\n${PUBLISH_OUTPUT}"
    fi
  else
    echo -e "${GREEN}✅ Successfully published version $version to Test PyPI!${NC}"
  fi
}

# Main execution
main() {
  check_requirements

  # Ensure token is set for non-dry runs
  if [[ "$DRY_RUN" == false && -z "${POETRY_TEST_PYPI_TOKEN:-}" ]]; then
    error_exit "POETRY_TEST_PYPI_TOKEN is not set. Export it or use --dry-run"
  fi

  # Get versions
  ORIGINAL_VERSION=$(poetry version --short)
  TEST_VERSION=$(grep '"version"' "$VERSION_FILE" | cut -d '"' -f 4)

  [[ -z "$TEST_VERSION" ]] && error_exit "TestPyPI version not found in $VERSION_FILE"
  validate_version "$TEST_VERSION"

  # Restore original version on exit
  restore_version() {
    echo -e "${YELLOW}🧹 Restoring original version ($ORIGINAL_VERSION) in pyproject.toml...${NC}"
    set_version_in_pyproject "$ORIGINAL_VERSION"
  }
  trap restore_version EXIT

  # Update to test version
  echo -e "${YELLOW}🔧 Temporarily setting version to $TEST_VERSION in pyproject.toml...${NC}"
  set_version_in_pyproject "$TEST_VERSION"

  publish_package "$TEST_VERSION"
}

main "$@"