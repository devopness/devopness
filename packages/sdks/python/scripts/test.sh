#!/usr/bin/env bash

# Script to run the test suite against the Devopness SDK - Python

set -euo pipefail

echo "📦  Installing Devopness SDK - Python..."
set +e
  INSTALL_OUTPUT=$(poetry install 2>&1)
  INSTALL_EXIT_CODE=$?
set -e

if [[ $INSTALL_EXIT_CODE -ne 0 ]]; then
  echo "❌  An error occurred during installation:"
  echo "$INSTALL_OUTPUT"
  exit $INSTALL_EXIT_CODE
fi

echo "🧪  Running Unit Tests..."
python -m unittest discover -vv -b -s tests/unit
