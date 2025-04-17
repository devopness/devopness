#!/usr/bin/env bash

# Script to publish the Devopness Python SDK to PyPI

set -e

if [[ -z "$POETRY_TEST_PYPI_TOKEN" ]]; then
  echo "🚨  POETRY_TEST_PYPI_TOKEN is not set. Please set it before publishing to Test PyPI."
  exit 1
fi

echo "📦  Configuring Test PyPI..."
poetry config pypi-token.TestPiPy "$POETRY_TEST_PYPI_TOKEN"

echo "📦  Building Devopness SDK - Python..."
poetry build

echo "📦  Publishing Devopness SDK - Python to Test PyPI..."
poetry publish -r TestPiPy
