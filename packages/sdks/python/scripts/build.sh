#!/usr/bin/env bash

# Script to build the Devopness Python SDK

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

SDK_ROOT_DIR="$SCRIPT_DIR/.."
GENERATED_API_DIR="$SDK_ROOT_DIR/devopness/api/generated/api"
GENERATED_MODELS_DIR="$SDK_ROOT_DIR/devopness/api/generated/models"

# Remove directories if they exist
[ -d "$GENERATED_API_DIR" ] && rm -rf "$GENERATED_API_DIR"
[ -d "$GENERATED_MODELS_DIR" ] && rm -rf "$GENERATED_MODELS_DIR"

# Run OpenAPI Generator
JAVA_OPTS="-Dlog.level=warn" openapi-generator-cli generate

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
