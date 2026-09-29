#!/usr/bin/env bash

# Run the unit test suite against the Devopness API - Python

set -euo pipefail

echo "📦  Syncing Devopness API - Python..."
# `--locked` fails if uv.lock and pyproject.toml have drifted, so CI cannot
# silently resolve a different dependency set from the one committed.
# `--inexact` keeps the generated models that `build-sdk-python` produced in the
# working tree; a strict sync would remove them, because they are not part of the
# sdist.
if ! UV_OUTPUT=$(uv sync --locked --inexact 2>&1); then
  echo "❌  An error occurred during sync:"
  echo "$UV_OUTPUT"
  exit 1
fi

echo "🧪  Running Unit Tests..."
uv run --no-sync python -m unittest discover -vv -b -s tests/unit
