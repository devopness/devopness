#!/usr/bin/env bash

# Script to perform post-build tasks for the Devopness Python SDK

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

SDK_ROOT_DIR="$SCRIPT_DIR/.."
GENERATED_API_DIR="$SDK_ROOT_DIR/devopness/api/generated/api"
GENERATED_MODELS_DIR="$SDK_ROOT_DIR/devopness/api/generated/models"

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

# TEMPORARY CLEANUP FOR INITIAL SDK DEVELOPMENT
#
# We're removing all generated files that are not user-related
# to keep the number of auto-generated files as low as possible
# during the development of SDK version 1.
# This helps validate the core structure and functionality
# of the SDK before exposing all endpoints.
echo "🧽  Removing non-user related service files..."
find "$GENERATED_API_DIR" -type f -name '*.py' \
  ! -iname 'user*.py' \
  ! -iname '__init__.py' \
  -exec rm -f {} +

find "$GENERATED_MODELS_DIR" -type f -name '*.py' \
  ! -iname 'user*.py' \
  ! -iname '__init__.py' \
  ! -iname 'credits.py' \
  ! -iname 'language.py' \
  ! -iname 'social_account_displayable_name.py' \
  ! -iname 'social_account_provider.py' \
  ! -iname 'social_account_relation.py' \
  ! -iname 'static_billing_info.py' \
  ! -iname 'subscription.py' \
  ! -iname 'subscription_balance.py' \
  ! -iname 'subscription_plan.py' \
  ! -iname 'triggered_actions.py' \
  ! -iname 'triggered_action_stats.py' \
  ! -iname 'triggered_action_summary.py' \
  -exec rm -f {} +

echo "✅  Devopness SDK - Python Build completed successfully!"
