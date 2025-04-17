#!/usr/bin/env bash

# Script to publish the Devopness Python SDK to PyPI

set -e

echo "📦  Building Devopness SDK - Python..."
poetry build

echo "📦  Publishing Devopness SDK - Python to Test PyPI..."
poetry publish -r TestPiPy
