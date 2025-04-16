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
openapi-generator-cli generate
