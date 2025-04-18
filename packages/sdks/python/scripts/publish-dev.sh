#!/usr/bin/env bash

# Script to publish the Devopness Python SDK to Test PyPI

set -e

if [[ -z "$POETRY_TEST_PYPI_TOKEN" ]]; then
  echo "🚨  POETRY_TEST_PYPI_TOKEN is not set. Please set it before publishing to Test PyPI."
  exit 1
fi

EXPECTED_VERSION=$(poetry version --short)
EXPECTED_ARTIFACT="dist/devopness-$EXPECTED_VERSION-py3-none-any.whl"
if [[ ! -f "$EXPECTED_ARTIFACT" ]]; then
  echo "🚨  Expected artifact $EXPECTED_ARTIFACT not found. Please build the SDK before publishing."
  exit 1
fi

echo "📦  Configuring Test PyPI..."
poetry config pypi-token.TestPiPy "$POETRY_TEST_PYPI_TOKEN"

echo "📦  Publishing Devopness SDK - Python to Test PyPI..."
set +e
PUBLISH_OUTPUT=$(poetry publish -r TestPiPy 2>&1)
PUBLISH_EXIT_CODE=$?
set -e

if [[ $PUBLISH_EXIT_CODE -ne 0 ]]; then
  if echo "$PUBLISH_OUTPUT" | grep -q "File already exists"; then
    echo "⚠️  Package already exists on Test PyPI. Skipping publish step."
    echo "ℹ️  If you want to publish again, you must bump the version."
  else
    echo "❌  An error occurred during publishing:"
    echo "$PUBLISH_OUTPUT"
    exit $PUBLISH_EXIT_CODE
  fi
else
  echo "✅  Successfully published to Test PyPI!"
fi
