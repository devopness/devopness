#!/usr/bin/env bash

# Script to perform post-build tasks for the Devopness Python SDK

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

SDK_ROOT_DIR="$SCRIPT_DIR/.."
GENERATED_DIR="$SDK_ROOT_DIR/devopness/api/generated"
GENERATED_API_DIR="$GENERATED_DIR/api"
GENERATED_MODELS_DIR="$GENERATED_DIR/models"

# Fix the permissions of the generated files
fix_permissions_and_ownership() {
  local dir="$1"
  [ -d "$dir" ] || return
  find "$dir" -type d -exec chmod 755 {} \;
  find "$dir" -type f -exec chmod 644 {} \;

  if [[ -n "$USER_ID" && -n "$GROUP_ID" ]]; then
    chown -R "$USER_ID:$GROUP_ID" "$dir"
  fi
}

fix_permissions_and_ownership "$GENERATED_API_DIR"
fix_permissions_and_ownership "$GENERATED_MODELS_DIR"

echo "🔧  Adjusting import paths in generated services..."
for file in "$GENERATED_API_DIR"/*.py; do
  sed -i 's/from .models./from ..models./g' "$file"

  # Remove unnecessary imports
  sed -i '/from pydantic/d' "$file"
  sed -i '/from typing_extensions/d' "$file"
done

echo "🔧  Adjusting import paths in generated models..."
for file in "$GENERATED_MODELS_DIR"/*.py; do
  sed -i 's/from .models./from ./g' "$file"
done

echo "🔧  Formatting generated files..."
ruff format "$GENERATED_API_DIR" "$GENERATED_MODELS_DIR"

echo "🧹  Removing OpenAPI Generator Cache..."
rm -rf "$GENERATED_DIR/.openapi-generator"

echo "🧹  Removing previous Build Artifacts..."
rm -rf "$SDK_ROOT_DIR/dist"

echo "📦  Exporting Devopness SDK - Python to a wheel..."
poetry build

echo "✅  Devopness SDK - Python Build completed successfully!"

bash scripts/temp.sh
