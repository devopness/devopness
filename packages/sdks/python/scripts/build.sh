#!/usr/bin/env bash

# Script to build the Devopness Python SDK

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

SDK_ROOT_DIR="$SCRIPT_DIR/.."
GENERATED_API_DIR="$SDK_ROOT_DIR/devopness/api/generated/api"
GENERATED_MODELS_DIR="$SDK_ROOT_DIR/devopness/api/generated/models"

echo "🧹  Removing previous generated directories..."
[ -d "$GENERATED_API_DIR" ] && rm -rf "$GENERATED_API_DIR"
[ -d "$GENERATED_MODELS_DIR" ] && rm -rf "$GENERATED_MODELS_DIR"

echo "🚀  Running OpenAPI Generator..."
JAVA_OPTS="-Dlog.level=warn" openapi-generator-cli generate

echo "🔧  Adjusting import paths in generated services..."
for file in "$GENERATED_API_DIR"/*.py; do
  sed -i 's/from .models./from ..models./g' "$file"

  # Remove auto-generated imports
  sed -i '/from pydantic/d' "$file"
  sed -i '/from typing_extensions/d' "$file"
done

# TEMPORARY
echo "🧽  Removing non-user related service files (keeping *users* and __init__.py)..."
find "$GENERATED_API_DIR" -type f -name '*.py' ! \( -iname '*users*' -o -iname '__init__.py' \) -exec rm -f {} +

echo "✅  Devopness SDK - Python Build completed successfully!"
